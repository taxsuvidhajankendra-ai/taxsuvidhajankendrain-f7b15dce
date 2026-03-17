import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Shield } from "lucide-react";
import logo from "@/assets/logo-full.jpg";
import shiva from "@/assets/shiva.jpg";

const ADMIN_EMAIL = "infotaxsuvidhajankendra@gmail.com";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });
      if (error) {
        toast.error("गलत पासवर्ड। कृपया पुनः प्रयास करें।");
        return;
      }

      // Check owner role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      if (roleError) throw roleError;

      const roles = (roleData || []).map((r) => r.role);
      const hasAccess = roles.some((r) => ["admin", "owner"].includes(r));

      if (!hasAccess) {
        await supabase.auth.signOut();
        toast.error("Access denied. केवल मालिक ही प्रवेश कर सकते हैं।");
        return;
      }

      toast.success("🙏 स्वागत है, मालिक!");
      navigate("/admin/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-15">
        <img src={shiva} alt="" className="w-full h-full object-cover" />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo Card */}
        <div className="text-center mb-6">
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-2xl shadow-orange-500/20">
            <img src={logo} alt="Tax Suvidha Jan Kendra" className="h-20 w-20 rounded-xl object-contain bg-black" />
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
              <Shield className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">मालिक पैनल</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-sm text-white/50 mt-1">Tax Suvidha Jan Kendra</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">पासवर्ड दर्ज करें</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "प्रवेश हो रहा है..." : "🔐 प्रवेश करें"}
            </button>
          </form>

          <p className="text-center text-[10px] text-white/20 mt-6">
            केवल अधिकृत व्यक्ति ही प्रवेश करें
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
