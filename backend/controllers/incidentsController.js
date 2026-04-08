import { supabase } from "../config/database.js";
export const incidentsController = {
  async getRecentIncidents(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data, error } = await supabase.from("incidents").select("*, sites (site_name)").eq("site_id", siteId).order("reported_at", { ascending: false }).limit(50);
      if (error) throw error;
      res.json(data?.map(i => ({ id: i.id, site_name: i.sites?.site_name || "Unknown", incident_type: i.incident_type, description: i.description, severity: i.severity, reported_at: i.reported_at, status: i.status })) || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async reportIncident(req, res) {
    try {
      const userId = req.user.id;
      const siteId = req.user.site_id;
      const { incident_type, description, severity, location } = req.body;
      const { data: shift } = await supabase.from("shifts").select("id").eq("site_id", siteId).eq("status", "active").single();
      const { data, error } = await supabase.from("incidents").insert({ site_id: siteId, shift_id: shift?.id || null, guard_id: userId, reported_by: userId, incident_type, description, severity: severity || "low", location: location || null }).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
