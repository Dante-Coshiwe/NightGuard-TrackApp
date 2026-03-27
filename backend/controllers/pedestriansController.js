import { supabase } from "../config/database.js";

export const pedestriansController = {
  async getRecentPedestrians(req, res) {
    try {
      const { data: pedestrians, error } = await supabase
        .from("pedestrians")
        .select(`
          *,
          sites (site_name)
        `)
        .order("entered_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedPedestrians = pedestrians?.map(p => ({
        ...p,
        site_name: p.sites?.site_name || "Unknown"
      })) || [];

      res.json(formattedPedestrians);
    } catch (error) {
      console.error("Error getting pedestrians:", error);
      res.status(500).json({ error: error.message });
    }
  }
};