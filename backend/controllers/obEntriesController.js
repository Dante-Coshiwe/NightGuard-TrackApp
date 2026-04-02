import { supabase } from "../config/database.js";

export const obEntriesController = {
  async create(req, res) {
  try {
    const userId = req.user.id;
    const siteId = req.user.site_id;
    const { nature_of_occurrence } = req.body;
    
    // Auto-generate serial number: OB-YYYYMMDD-timestamp
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const serial_number = `OB-${dateStr}-${Date.now()}`;

    const { data: shift } = await supabase.from("shifts").select("id").eq("site_id", siteId).eq("status", "active").single();
    const { data, error } = await supabase.from("ob_entries").insert({
      site_id: siteId,
      shift_id: shift?.id || null,
      guard_id: userId,
      captured_by: userId,
      serial_number,
      nature_of_occurrence,
      captured_timestamp: new Date()
    }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
};