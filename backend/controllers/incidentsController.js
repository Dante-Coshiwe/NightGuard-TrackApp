import { supabase } from "../config/database.js";

export const incidentsController = {
  async getRecentIncidents(req, res) {
    try {
      const { data: incidents, error } = await supabase
        .from("incidents")
        .select(`
          *,
          sites (site_name)
        `)
        .order("reported_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedIncidents = incidents?.map(i => ({
        id: i.id,
        site_name: i.sites?.site_name || "Unknown",
        incident_type: i.incident_type,
        description: i.description,
        severity: i.severity,
        reported_at: i.reported_at,
        status: i.status
      })) || [];

      res.json(formattedIncidents);
    } catch (error) {
      console.error("Error getting incidents:", error);
      res.status(500).json({ error: error.message });
    }
  }
};