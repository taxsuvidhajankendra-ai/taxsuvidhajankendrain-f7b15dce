import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LogOut, Download, RefreshCw, FileText, Users, LayoutDashboard,
  MessageCircle, Eye, TrendingUp, Calendar, Shield, IndianRupee,
  Clock, CheckCircle2, AlertCircle, BarChart3
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import logo from "@/assets/logo-full.jpg";
import shiva from "@/assets/shiva.jpg";
import leaders from "@/assets/leaders-budget.webp";

type Submission = Tables<"submissions">;

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");
  const navigate = useNavigate();

  useEffect(() => { checkAdminAndLoad(); }, []);

  const checkAdminAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/admin"); return; }

    const { data: roleData } = await supabase
      .from("user_roles").select("role").eq("user_id", user.id);

    const roles = (roleData || []).map((r) => r.role);
    const hasAccess = roles.some((r) => ["admin", "owner"].includes(r));

    if (!hasAccess) {
      await supabase.auth.signOut();
      toast.error("Access denied. केवल मालिक ही प्रवेश कर सकते हैं।");
      navigate("/admin");
      return;
    }
    loadSubmissions();
  };

  const loadSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load submissions"); console.error(error); }
    else setSubmissions(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("सफलतापूर्वक लॉगआउट हो गया");
    navigate("/admin");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("submissions").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Status update failed"); return; }
    toast.success(`Status: ${newStatus}`);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const exportCSV = () => {
    if (!submissions.length) return;
    const headers = ["Date", "Full Name", "Mobile", "Email", "City", "Service", "Status", "Description", "Documents"];
    const rows = submissions.map(s => [
      new Date(s.created_at).toLocaleString("en-IN"),
      s.full_name, s.mobile_number, s.email, s.city, s.service, s.status,
      s.description || "", (s.document_paths || []).join("; "),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const viewDocument = async (path: string) => {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 3600);
    if (error || !data?.signedUrl) { toast.error("Could not access document"); return; }
    window.open(data.signedUrl, "_blank");
  };

  const downloadDocument = async (path: string) => {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 3600);
    if (error || !data?.signedUrl) { toast.error("Could not download document"); return; }
    const a = document.createElement("a");
    a.href = data.signedUrl;
    a.download = path.split("/").pop() || "document";
    a.click();
  };

  const totalDocs = submissions.reduce((acc, s) => acc + (s.document_paths?.length || 0), 0);
  const counts = {
    All: submissions.length,
    New: submissions.filter(s => s.status === "New").length,
    "In Progress": submissions.filter(s => s.status === "In Progress").length,
    Completed: submissions.filter(s => s.status === "Completed").length,
  };

  const filtered = activeTab === "All" ? submissions : submissions.filter(s => s.status === activeTab);

  const todayCount = submissions.filter(s => {
    const d = new Date(s.created_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #111827 100%)" }}>
      {/* Tricolor top bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)" }} />
      
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-0.5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600">
                <img src={logo} alt="Tax Suvidha Jan Kendra" className="h-9 w-9 rounded-md object-contain bg-black" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  मालिक डैशबोर्ड
                </h1>
                <p className="text-[10px] text-white/40">Tax Suvidha Jan Kendra</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadSubmissions} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors" title="Refresh">
                <RefreshCw className="h-4 w-4 text-white/50" />
              </button>
              <Link to="/admin/talk-with-customer" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium text-xs hover:bg-amber-500/20 transition-colors">
                <MessageCircle className="h-3.5 w-3.5" /> CRM
              </Link>
              <button onClick={exportCSV} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-xs font-medium text-white/60 hover:bg-white/5 transition-colors">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-xs hover:bg-red-500/20 transition-colors">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome Banner with Leaders */}
        <div className="relative rounded-2xl overflow-hidden border border-white/5">
          <img src={leaders} alt="" className="w-full h-40 sm:h-48 object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent flex items-center px-6">
            <div>
              <p className="text-amber-400 text-xs font-semibold mb-1">🙏 जय हिन्द</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white">स्वागत है, मालिक</h2>
              <p className="text-white/40 text-sm mt-1">Tax Suvidha Jan Kendra — आपका व्यापार, आपका नियंत्रण</p>
            </div>
          </div>
          <div className="absolute bottom-3 right-4 hidden sm:block">
            <img src={shiva} alt="" className="h-20 w-20 rounded-xl object-cover border-2 border-amber-500/30 opacity-60" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "कुल ग्राहक", value: counts.All, icon: Users, color: "from-blue-500 to-blue-600" },
            { label: "नए", value: counts.New, icon: AlertCircle, color: "from-cyan-500 to-cyan-600" },
            { label: "प्रगति में", value: counts["In Progress"], icon: Clock, color: "from-amber-500 to-amber-600" },
            { label: "पूर्ण", value: counts.Completed, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
            { label: "आज के", value: todayCount, icon: Calendar, color: "from-purple-500 to-purple-600" },
            { label: "दस्तावेज़", value: totalDocs, icon: FileText, color: "from-rose-500 to-rose-600" },
          ].map(stat => (
            <div key={stat.label} className="bg-white/[0.03] backdrop-blur rounded-2xl border border-white/5 p-4 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Mobile nav */}
        <div className="flex sm:hidden gap-2">
          <Link to="/admin/talk-with-customer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium text-sm">
            <MessageCircle className="h-4 w-4" /> CRM
          </Link>
          <button onClick={exportCSV} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/60">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/5">
          {(["All", "New", "In Progress", "Completed"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-white/30">
            <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin opacity-50" />
            <p>लोड हो रहा है...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>कोई डेटा नहीं</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white/[0.02] rounded-2xl border border-white/5 backdrop-blur">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 font-semibold text-white/40 text-xs uppercase tracking-wider">तारीख</th>
                  <th className="text-left px-4 py-3 font-semibold text-white/40 text-xs uppercase tracking-wider">नाम</th>
                  <th className="text-left px-4 py-3 font-semibold text-white/40 text-xs uppercase tracking-wider">मोबाइल</th>
                  <th className="text-left px-4 py-3 font-semibold text-white/40 text-xs uppercase tracking-wider hidden md:table-cell">ईमेल</th>
                  <th className="text-left px-4 py-3 font-semibold text-white/40 text-xs uppercase tracking-wider hidden lg:table-cell">शहर</th>
                  <th className="text-left px-4 py-3 font-semibold text-white/40 text-xs uppercase tracking-wider">सेवा</th>
                  <th className="text-left px-4 py-3 font-semibold text-white/40 text-xs uppercase tracking-wider">स्थिति</th>
                  <th className="text-left px-4 py-3 font-semibold text-white/40 text-xs uppercase tracking-wider">कार्य</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-white/40 whitespace-nowrap text-xs">{new Date(s.created_at).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3 font-medium text-white">{s.full_name}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${s.mobile_number}`} className="text-amber-400 hover:underline">{s.mobile_number}</a>
                    </td>
                    <td className="px-4 py-3 text-white/40 hidden md:table-cell">{s.email}</td>
                    <td className="px-4 py-3 text-white/40 hidden lg:table-cell">{s.city}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">{s.service}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={s.status}
                        onChange={(e) => updateStatus(s.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer bg-transparent ${
                          s.status === "New" ? "text-cyan-400 border-cyan-500/30" :
                          s.status === "In Progress" ? "text-amber-400 border-amber-500/30" :
                          "text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {(s.document_paths || []).length > 0 && (
                          <>
                            <button onClick={() => viewDocument(s.document_paths![0])} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="View">
                              <Eye className="h-3.5 w-3.5 text-white/40" />
                            </button>
                            <button onClick={() => downloadDocument(s.document_paths![0])} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Download">
                              <Download className="h-3.5 w-3.5 text-white/40" />
                            </button>
                          </>
                        )}
                        <a href={`https://wa.me/91${s.mobile_number.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="WhatsApp">
                          <MessageCircle className="h-3.5 w-3.5 text-green-400" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4 text-white/10 text-[10px]">
          © 2026 Tax Suvidha Jan Kendra — मालिक पैनल
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
