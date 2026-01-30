import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, setupKey } = await req.json();

    // Simple setup key validation (you should change this in production)
    if (setupKey !== "INITIAL_ADMIN_SETUP_2024") {
      return new Response(
        JSON.stringify({ error: "Invalid setup key" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check if admin already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingUsers?.users?.some(u => u.email === email);

    if (adminExists) {
      // User exists, just ensure they have admin role
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
      const user = existingUser?.users?.find(u => u.email === email);
      
      if (user) {
        // Check if already has admin role
        const { data: existingRole } = await supabaseAdmin
          .from("user_roles")
          .select("*")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .single();

        if (!existingRole) {
          await supabaseAdmin
            .from("user_roles")
            .insert({ user_id: user.id, role: "admin" });
        }

        return new Response(
          JSON.stringify({ message: "Admin role ensured for existing user" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Create new user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUser.user.id, role: "admin" });

    if (roleError) {
      return new Response(
        JSON.stringify({ error: roleError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Admin user created successfully", userId: newUser.user.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
