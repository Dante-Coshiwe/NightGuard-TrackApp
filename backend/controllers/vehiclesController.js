import { supabase } from "../config/database.js";
export const vehiclesController = {
  async getRecentVehicles(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data, error } = await supabase.from("vehicles").select("*, sites (site_name)").eq("site_id", siteId).order("entered_at", { ascending: false }).limit(50);
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
      const { license_plate, vehicle_type, vehicle_make, vehicle_color, driver_name, driver_contact, visiting_unit } = req.body;
      const { data: shift } = await supabase.from("shifts").select("id").eq("site_id", siteId).eq("status", "active").single();
      const { data, error } = await supabase.from("vehicles").insert({ site_id: siteId, shift_id: shift?.id || null, guard_id: userId, license_plate, vehicle_type, vehicle_make, vehicle_color, driver_name, driver_contact, visiting_unit, entered_at: new Date() }).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getReport(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data, error } = await supabase.from("vehicles").select("*").eq("site_id", siteId).order("entered_at", { ascending: true });
      if (error) throw error;
      const hourMap = new Map();
      data.forEach(v => {
        const hour = new Date(v.entered_at).toISOString().slice(0, 13);
        if (!hourMap.has(hour)) hourMap.set(hour, { hour, entered: 0, exited: 0, inside: 0 });
        hourMap.get(hour).entered++;
        if (!v.exited_at) hourMap.get(hour).inside++;
        else hourMap.get(hour).exited++;
      });
      const hourly = Array.from(hourMap.values()).map(h => ({ ...h, hour: h.hour + ":00:00Z" }));
      const never_left = data.filter(v => !v.exited_at).map(v => ({ id: v.id, license_plate: v.license_plate, driver_name: v.driver_name, vehicle_make: v.vehicle_make, vehicle_color: v.vehicle_color, visiting_unit: v.visiting_unit, entered_at: v.entered_at }));
      res.json({ hourly, never_left, total: data.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  ,
async markExit(req, res) {
  try {
    const { id } = req.params;
    const siteId = req.user.site_id;
    const { data, error } = await supabase
      .from("vehicles")
      .update({ exited_at: new Date() })
      .eq("id", id)
      .eq("site_id", siteId)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
};
