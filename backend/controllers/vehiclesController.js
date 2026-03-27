import { supabase } from "../config/database.js";

export const vehiclesController = {
  async getRecentVehicles(req, res) {
    try {
      const { data: vehicles, error } = await supabase
        .from("vehicles")
        .select(`
          *,
          sites (site_name)
        `)
        .order("entered_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedVehicles = vehicles?.map(v => ({
        ...v,
        site_name: v.sites?.site_name || "Unknown"
      })) || [];

      res.json(formattedVehicles);
    } catch (error) {
      console.error("Error getting vehicles:", error);
      res.status(500).json({ error: error.message });
    }
  }
};