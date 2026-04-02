import { supabase } from "../config/database.js";

export const pedestriansController = {
  async getRecentPedestrians(req, res) {
  try {
    const siteId = req.user.site_id;
    console.log('Fetching pedestrians for site_id:', siteId);
    console.log('User:', req.user.id, req.user.email);

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