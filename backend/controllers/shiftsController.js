import { supabase } from "../config/database.js";

export const shiftsController = {
  async getActiveShift(req, res) {
    try {
      const siteId = req.user.site_id;

      const { data: shift, error } = await supabase
        .from("shifts")
        .select(`*, profiles (id, full_name)`)
        .eq("site_id", siteId)
        .eq("status", "active")
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (!shift) return res.json(null);

      res.json({
        id: shift.id,
        guard_id: shift.guard_id,
        guard_name: shift.profiles?.full_name || "Unknown",
        shift_name: shift.shift_name,
        started_at: shift.started_at,
        site_id: shift.site_id,
      });
    } catch (error) {
      console.error("Error getting active shift:", error);
      res.status(500).json({ error: error.message });
    }
  },

  async getGuardsList(req, res) {
    try {
      const siteId = req.user.site_id;

      const { data: guards, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("site_id", siteId)
        .eq("user_type", "guard")
        .eq("is_active", true)
        .order("full_name");

      if (error) throw error;
      res.json(guards || []);
    } catch (error) {
      console.error("Error getting guards list:", error);
      res.status(500).json({ error: error.message });
    }
  },

  async startShift(req, res) {
    try {
      const siteId = req.user.site_id;
      const { guard_id, shift_name } = req.body;

      // End any existing active shift for this site first
      await supabase
        .from("shifts")
        .update({ status: "completed", ended_at: new Date() })
        .eq("site_id", siteId)
        .eq("status", "active");

      const { data, error } = await supabase
        .from("shifts")
        .insert({
          site_id: siteId,
          guard_id,
          shift_name: shift_name || "Shift",
          started_at: new Date(),
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error("Error starting shift:", error);
      res.status(500).json({ error: error.message });
    }
  },

  async endShift(req, res) {
    try {
      const siteId = req.user.site_id;
      const { shift_id } = req.body;

      const { data, error } = await supabase
        .from("shifts")
        .update({ status: "completed", ended_at: new Date() })
        .eq("id", shift_id)
        .eq("site_id", siteId)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Error ending shift:", error);
      res.status(500).json({ error: error.message });
    }
  },
  async addGuard(req, res) {
  try {
    const siteId = req.user.site_id;
    const organizationId = req.user.organization_id;
    const { full_name, phone } = req.body;

    if (!full_name) return res.status(400).json({ error: "Full name is required" });

    // Create auth user with a default password they can change later
    const email = `guard_${Date.now()}@nightguard.local`;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: "NightGuard@2024",
      email_confirm: true,
    });

    if (authError) throw authError;

    // Create profile
    const { data, error } = await supabase.from("profiles").upsert({
      id: authData.user.id,
      full_name,
      phone: phone || null,
      user_type: "guard",
      site_id: siteId,
      organization_id: organizationId,
      is_active: true,
    }).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error adding guard:", error);
    res.status(500).json({ error: error.message });
  }
},
};