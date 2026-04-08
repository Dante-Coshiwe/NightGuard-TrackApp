import { supabase } from "../config/database.js";
export const obEntriesController = {
  async getRecentEntries(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data, error } = await supabase.from("ob_entries").select("*, sites (site_name)").eq("site_id", siteId).order("captured_timestamp", { ascending: false }).limit(50);
      if (error) throw error;
      res.json(data?.map(e => ({ id: e.id, site_name: e.sites?.site_name || "Unknown", serial_number: e.serial_number, nature_of_occurrence: e.nature_of_occurrence, captured_timestamp: e.captured_timestamp })) || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async create(req, res) {
    try {
      const userId = req.user.id;
      const siteId = req.user.site_id;
      const { serial_number, nature_of_occurrence } = req.body;
      const { data: shift } = await supabase.from("shifts").select("id").eq("site_id", siteId).eq("status", "active").single();
      const { data, error } = await supabase.from("ob_entries").insert({ site_id: siteId, shift_id: shift?.id || null, guard_id: userId, captured_by: userId, serial_number, nature_of_occurrence, captured_timestamp: new Date() }).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
