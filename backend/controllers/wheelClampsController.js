import { supabase } from "../config/database.js";

export const wheelClampsController = {
  async getRecentClamps(req, res) {
    try {
      const { data: clamps, error } = await supabase
        .from("wheel_clamps")
        .select(`
          *,
          sites (site_name)
        `)
        .order("clamped_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedClamps = clamps?.map(c => ({
        id: c.id,
        site_name: c.sites?.site_name || "Unknown",
        clamped_at: c.clamped_at,
        removed_at: c.removed_at,
        unit: c.unit,
        offender_name: c.offender_name,
        registration: c.vehicle_registration,
        offender_type: c.offender_type,
        status: c.status
      })) || [];

      res.json(formattedClamps);
    } catch (error) {
      console.error("Error getting wheel clamps:", error);
      res.status(500).json({ error: error.message });
    }
  }
};