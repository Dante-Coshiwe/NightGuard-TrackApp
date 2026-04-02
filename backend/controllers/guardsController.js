import { supabase } from "../config/database.js";

export const guardsController = {
  async getGuardsOnDuty(req, res) {
    try {
      const user = req.user;

      // Get active shifts with guard profile and site info
      // scoped to the admin's organization via profiles
      const { data: shifts, error } = await supabase
        .from("shifts")
        .select(`
          id,
          shift_name,
          started_at,
          status,
          sites (
            id,
            site_name
          ),
          profiles (
            id,
            full_name,
            email,
            phone,
            user_type,
            organization_id
          )
        `)
        .eq("status", "active")
        .order("started_at", { ascending: false });

      if (error) throw error;

      // Filter to only guards belonging to the requesting admin's organization
      const { data: adminProfile, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      const filtered = shifts.filter(
        (s) => s.profiles?.organization_id === adminProfile.organization_id
      );

      const result = filtered.map((s) => ({
        shift_id: s.id,
        shift_name: s.shift_name,
        started_at: s.started_at,
        site: s.sites?.site_name || null,
        site_id: s.sites?.id || null,
        guard_id: s.profiles?.id || null,
        guard_name: s.profiles?.full_name || null,
        guard_email: s.profiles?.email || null,
        guard_phone: s.profiles?.phone || null,
      }));

      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Error getting guards on duty:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
};