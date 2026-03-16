import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LogOut, RefreshCw, Phone, MessageCircle, CheckCircle2,
  Users, Clock, FileText, Filter, Send, Download,
  CreditCard, ChevronLeft, BarChart3, Eye, Inbox,
  ArrowUpRight, UserCheck, AlertCircle, LayoutDashboard
} from "lucide-react";
import logo from "@/assets/logo.jpg";

interface Submission {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string;
  city: string;
  service: string;
  description: string | null;
  document_paths: string[] | null;
  booking_date: string | null;
  status: string;
  created_at: string;
  payment_link: string | null;
  assigned_to: string | null;
}

interface ChatMessage {
  id: string;
  submission_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  New: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: Inbox },
  "In Progress": { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: Clock },
  Completed: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: CheckCircle2 },
};

const TalkWithCustomer = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [paymentLinkInput, setPaymentLinkInput] = useState("");
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [userRole, setUserRole] = useState<string>("admin");
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => { checkAuthAndLoad(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!selectedSubmission) return;
    const channel = supabase
      .channel(`booking-messages-${selectedSubmission.id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "booking_messages",
        filter: `submission_id=eq.${selectedSubmission.id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedSubmission?.id]);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/admin"); return; }
    setUserId(user.id);
    setUserEmail(user.email || "");

    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", user.id);

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      toast.error("Access denied.");
      navigate("/admin");
      return;
    }

    const roleList = roles.map((r) => r.role);
    if (roleList.includes("owner")) setUserRole("owner");
    else if (roleList.includes("admin")) setUserRole("admin");
    else if (roleList.includes("worker")) setUserRole("worker");

    loadSubmissions();
  };

  const loadSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Failed to load bookings");
    else setSubmissions((data as Submission[]) || []);
    setLoading(false);
  };

  const loadMessages = async (submissionId: string) => {
    const { data } = await supabase
      .from("booking_messages").select("*")
      .eq("submission_id", submissionId).order("created_at", { ascending: true });
    setMessages((data as ChatMessage[]) || []);
  };

  const openWorkspace = (submission: Submission) => {
    setSelectedSubmission(submission);
    setPaymentLinkInput(submission.payment_link || "");
    setShowPaymentInput(false);
    loadMessages(submission.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSubmission) return;
    setSendingMsg(true);
    const { error } = await supabase.from("booking_messages").insert({
      submission_id: selectedSubmission.id,
      sender_id: userId,
      sender_name: userEmail.split("@")[0] || "Admin",
      message: newMessage.trim(),
    });
    if (error) toast.error("Failed to send message");
    else setNewMessage("");
    setSendingMsg(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("submissions").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success(`Status updated to ${newStatus}`);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
    if (selectedSubmission?.id === id) setSelectedSubmission((prev) => prev ? { ...prev, status: newStatus } : null);
  };

  const savePaymentLink = async () => {
    if (!selectedSubmission) return;
    const { error } = await supabase.from("submissions").update({ payment_link: paymentLinkInput.trim() || null }).eq("id", selectedSubmission.id);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Payment link saved");
    setSelectedSubmission((prev) => prev ? { ...prev, payment_link: paymentLinkInput.trim() || null } : null);
    setSubmissions((prev) => prev.map((s) => s.id === selectedSubmission.id ? { ...s, payment_link: paymentLinkInput.trim() || null } : s));
    setShowPaymentInput(false);
  };

  const sendPaymentViaWhatsApp = (phone: string, name: string, link: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const phoneWithCountry = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const message = encodeURIComponent(`Hello ${name}, your payment link from Tax Suvidha Jan Kendra:\n${link}\nPlease complete the payment. Thank you!`);
    window.open(`https://wa.me/${phoneWithCountry}?text=${message}`, "_blank");
  };

  const handleCall = (phone: string) => window.open(`tel:${phone}`, "_self");

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const phoneWithCountry = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const msg = encodeURIComponent(`Hello ${name}, this is Tax Suvidha Jan Kendra. Thank you for your booking. How can we assist you?`);
    window.open(`https://wa.me/${phoneWithCountry}?text=${msg}`, "_blank");
  };

  const getDocumentUrl = async (path: string) => {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 3600);
    if (error || !data?.signedUrl) {
      toast.error("Could not access document");
      return null;
    }
    return data.signedUrl;
  };

  const viewDocument = async (path: string) => {
    const url = await getDocumentUrl(path);
    if (url) window.open(url, "_blank");
  };

  const downloadDocument = async (path: string) => {
    const url = await getDocumentUrl(path);
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = path.split("/").pop() || "document";
      a.click();
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/admin"); };

  const filtered = statusFilter === "All" ? submissions : submissions.filter((s) => s.status === statusFilter);
  const totalDocs = submissions.reduce((acc, s) => acc + (s.document_paths?.length || 0), 0);
  const counts = {
    All: submissions.length,
    New: submissions.filter((s) => s.status === "New").length,
    "In Progress": submissions.filter((s) => s.status === "In Progress").length,
    Completed: submissions.filter((s) => s.status === "Completed").length,
  };

  // ==================== WORKSPACE VIEW ====================
  if (selectedSubmission) {
    const s = selectedSubmission;
    const statusCfg = STATUS_CONFIG[s.status] || { bg: "bg-muted", text: "text-foreground", icon: AlertCircle };
    const StatusIcon = statusCfg.icon;

    return (
      <div className="min-h-screen bg-muted/30">
        {/* Workspace Header */}
        <header className="bg-card border-b border-border px-4 md:px-6 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedSubmission(null)} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <img src={logo} alt="Tax Suvidha" className="h-8 w-8 rounded-lg object-contain hidden sm:block" />
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                <StatusIcon className="h-3.5 w-3.5" /> {s.status}
              </div>
              <button onClick={handleLogout} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-6 grid lg:grid-cols-[340px_1fr] gap-5">
          {/* Left Sidebar */}
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="bg-hero-gradient px-5 py-4">
                <h2 className="text-lg font-bold text-primary-foreground">{s.full_name}</h2>
                <p className="text-sm text-primary-foreground/70">{s.city}</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{s.mobile_number}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground truncate">{s.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BarChart3 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-xs font-semibold">{s.service}</span>
                </div>
                {s.booking_date && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground">{new Date(s.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                )}
                {s.description && (
                  <div className="mt-2 p-3 rounded-xl bg-muted/50 text-sm text-muted-foreground leading-relaxed">{s.description}</div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Communication</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleCall(s.mobile_number)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  <Phone className="h-4 w-4" /> Call
                </button>
                <button onClick={() => handleWhatsApp(s.mobile_number, s.full_name)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </button>
              </div>
            </div>

            {/* Status Control */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Work Status</h3>
              <div className="space-y-1.5">
                {(["New", "In Progress", "Completed"] as const).map((st) => {
                  const cfg = STATUS_CONFIG[st];
                  const Icon = cfg.icon;
                  const isActive = s.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => updateStatus(s.id, st)}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? `${cfg.bg} ${cfg.text} border ring-1 ring-current/20`
                          : "text-muted-foreground hover:bg-muted/60"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {st}
                      {isActive && <CheckCircle2 className="h-3.5 w-3.5 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" /> Payment
              </h3>
              {s.payment_link && !showPaymentInput ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                    <span className="break-all flex-1">{s.payment_link}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => sendPaymentViaWhatsApp(s.mobile_number, s.full_name, s.payment_link!)} className="py-2 rounded-xl bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                      Send via WA
                    </button>
                    <button onClick={() => setShowPaymentInput(true)} className="py-2 rounded-xl border border-input text-xs font-medium hover:bg-muted transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    value={paymentLinkInput}
                    onChange={(e) => setPaymentLinkInput(e.target.value)}
                    placeholder="Paste UPI or payment link..."
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <div className="flex gap-2">
                    <button onClick={savePaymentLink} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                      Save Link
                    </button>
                    {showPaymentInput && (
                      <button onClick={() => setShowPaymentInput(false)} className="px-4 py-2 rounded-xl border border-input text-xs hover:bg-muted transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Documents */}
            {s.document_paths && s.document_paths.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" /> Documents ({s.document_paths.length})
                </h3>
                <div className="space-y-1.5">
                  {s.document_paths.map((path, i) => {
                    const fileName = path.split("/").pop()?.split("_").slice(1).join("_") || path.split("/").pop() || path;
                    return (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 group hover:bg-muted/70 transition-colors">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-foreground truncate flex-1">{fileName}</span>
                        <button onClick={() => viewDocument(path)} className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-background transition-all" title="View">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => downloadDocument(path)} className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-background transition-all" title="Download">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Chat Panel */}
          <div className="bg-card rounded-2xl border border-border flex flex-col h-[calc(100vh-6rem)]">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-secondary" /> Team Chat
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Internal discussion about {s.full_name}'s booking</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs mt-1">Start the conversation about this booking</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === userId;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                        <p className={`text-[11px] font-semibold mb-1 ${isMe ? "opacity-70" : "text-secondary"}`}>{msg.sender_name}</p>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        <p className={`text-[10px] mt-1.5 ${isMe ? "opacity-50" : "text-muted-foreground"}`}>
                          {new Date(msg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={sendMessage}
                  disabled={sendingMsg || !newMessage.trim()}
                  className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN DASHBOARD VIEW ====================
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="h-1 bg-tricolor-bar w-full" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Tax Suvidha Jan Kendra" className="h-10 w-10 rounded-lg object-contain" />
              <div>
                <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-secondary" />
                  Talk With Customer
                </h1>
                <p className="text-xs text-muted-foreground">
                  Tax Suvidha Jan Kendra · <span className="font-medium capitalize text-secondary">{userRole}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadSubmissions} className="p-2.5 rounded-xl border border-input hover:bg-muted transition-colors" title="Refresh">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </button>
              <button onClick={() => navigate("/admin/dashboard")} className="px-4 py-2.5 rounded-xl border border-input text-sm font-medium hover:bg-muted transition-colors">
                Dashboard
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive font-medium text-sm hover:bg-destructive/20 transition-colors">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Owner Stats Dashboard */}
        {(userRole === "owner" || userRole === "admin") && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-primary/10"><Users className="h-4 w-4 text-primary" /></div>
                <span className="text-xs font-medium text-muted-foreground">Total Customers</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{counts.All}</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-blue-50"><Inbox className="h-4 w-4 text-blue-600" /></div>
                <span className="text-xs font-medium text-muted-foreground">New</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{counts.New}</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-amber-50"><Clock className="h-4 w-4 text-amber-600" /></div>
                <span className="text-xs font-medium text-muted-foreground">Active Work</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{counts["In Progress"]}</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-emerald-50"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
                <span className="text-xs font-medium text-muted-foreground">Completed</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{counts.Completed}</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-purple-50"><FileText className="h-4 w-4 text-purple-600" /></div>
                <span className="text-xs font-medium text-muted-foreground">Documents</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalDocs}</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["All", "New", "In Progress", "Completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {status === "All" && <Filter className="h-3.5 w-3.5" />}
              {status === "New" && <Inbox className="h-3.5 w-3.5" />}
              {status === "In Progress" && <Clock className="h-3.5 w-3.5" />}
              {status === "Completed" && <CheckCircle2 className="h-3.5 w-3.5" />}
              {status} <span className="ml-0.5 opacity-70">({counts[status]})</span>
            </button>
          ))}
        </div>

        {/* Customer Cards Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            <RefreshCw className="h-6 w-6 mx-auto mb-3 animate-spin opacity-40" />
            <p className="text-sm">Loading bookings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No bookings found</p>
            <p className="text-xs mt-1">Bookings will appear here when customers submit the form</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => {
              const cfg = STATUS_CONFIG[s.status] || { bg: "bg-muted", text: "text-foreground", icon: AlertCircle };
              const SIcon = cfg.icon;
              return (
                <div
                  key={s.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-card-hover hover:border-secondary/40 transition-all cursor-pointer group"
                  onClick={() => openWorkspace(s)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors truncate">{s.full_name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.city} · {new Date(s.created_at).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${cfg.bg} ${cfg.text}`}>
                        <SIcon className="h-3 w-3" /> {s.status}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{s.mobile_number}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">{s.service}</span>
                      </div>
                      {s.document_paths && s.document_paths.length > 0 && (
                        <div className="flex items-center gap-2.5 text-muted-foreground">
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          <span>{s.document_paths.length} document(s)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex border-t border-border" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleCall(s.mobile_number)} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-primary hover:bg-primary/5 transition-colors border-r border-border">
                      <Phone className="h-3.5 w-3.5" /> Call
                    </button>
                    <button onClick={() => handleWhatsApp(s.mobile_number, s.full_name)} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-accent hover:bg-accent/5 transition-colors border-r border-border">
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </button>
                    {s.status !== "Completed" ? (
                      <button onClick={() => updateStatus(s.id, s.status === "New" ? "In Progress" : "Completed")} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {s.status === "New" ? "Start" : "Done"}
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Done
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default TalkWithCustomer;
