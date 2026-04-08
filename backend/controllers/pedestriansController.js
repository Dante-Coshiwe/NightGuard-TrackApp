import { supabase } from "../config/database.js";
export const pedestriansController = {
  async getRecentPedestrians(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data, error } = await supabase.from("pedestrians").select("*, sites (site_name)").eq("site_id", siteId).order("entry_time", { ascending: false }).limit(50);
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async createEntry(req, res) {
    try {
      const userId = req.user.id;
      const siteId = req.user.site_id;
      const { full_name, id_number, contact_number, visiting_unit, host_name, purpose_of_visit } = req.body;
      const { data: shift } = await supabase.from("shifts").select("id").eq("site_id", siteId).eq("status", "active").single();
      const { data, error } = await supabase.from("pedestrians").insert({ site_id: siteId, shift_id: shift?.id || null, guard_id: userId, full_name, id_number, contact_number, visiting_unit, host_name, purpose_of_visit, entry_time: new Date() }).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getReport(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data, error } = await supabase.from("pedestrians").select("*").eq("site_id", siteId).order("entry_time", { ascending: true });
      if (error) throw error;
      const hourMap = new Map();
      data.forEach(p => {
        const hour = new Date(p.entry_time).toISOString().slice(0, 13);
        if (!hourMap.has(hour)) hourMap.set(hour, { hour, entered: 0, exited: 0, inside: 0 });
        hourMap.get(hour).entered++;
        if (!p.exit_time) hourMap.get(hour).inside++;
        else hourMap.get(hour).exited++;
      });
      const hourly = Array.from(hourMap.values()).map(h => ({ ...h, hour: h.hour + ":00:00Z" }));
      const never_left = data.filter(p => !p.exit_time).map(p => ({ id: p.id, full_name: p.full_name, contact_number: p.contact_number, visiting_unit: p.visiting_unit, entry_time: p.entry_time }));
      res.json({ hourly, never_left, total: data.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
