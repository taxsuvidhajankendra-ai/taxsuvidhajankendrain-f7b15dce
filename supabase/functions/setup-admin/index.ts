import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const admins = [
      { email: "infotaxsuvidhajankendra@gmail.com", role: "owner" as const },
      { email: "taxsuvdhajankendra@gmail.com", role: "admin" as const },
    ];

    const { password } = await req.json();
    if (!password) {
      return new Response(JSON.stringify({ error: "Password required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];

    for (const admin of admins) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u) => u.email === admin.email);

      let userId: string;

      if (existing) {
        // Update password
        await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
        });
        userId = existing.id;
        results.push({ email: admin.email, status: "updated" });
      } else {
        // Create user
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: admin.email,
          password,
          email_confirm: true,
        });
        if (error) throw error;
        userId = data.user.id;
        results.push({ email: admin.email, status: "created" });
      }

      // Upsert role
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .upsert(
          { user_id: userId, role: admin.role },
          { onConflict: "user_id,role" }
        );
      if (roleError) {
        // Try insert if upsert fails
        await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: userId, role: admin.role });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
