import { supabase } from "../config/database.js";
export const patrolsController = {
  async getPatrolSummary(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data: patrols, error } = await supabase.from("patrols").select("*, sites (site_name), patrol_checkpoints (status)").eq("site_id", siteId).order("created_at", { ascending: false });
      if (error) throw error;
      const siteMap = new Map();
      patrols?.forEach(patrol => {
        const siteName = patrol.sites?.site_name || "Unknown";
        if (!siteMap.has(siteName)) siteMap.set(siteName, { site_name: siteName, total_patrols: 0, scanned: 0, missed: 0, steps: 0 });
        const s = siteMap.get(siteName);
        s.total_patrols++;
        const cp = patrol.patrol_checkpoints || [];
        s.scanned += cp.filter(c => c.status === "completed").length;
        s.missed += cp.filter(c => c.status === "missed").length;
        s.steps += patrol.steps_taken || 0;
      });
      res.json(Array.from(siteMap.values()).map(s => ({ ...s, scanned_percent: s.total_patrols > 0 ? Math.round((s.scanned / (s.scanned + s.missed || 1)) * 100) : 0, missed_percent: s.total_patrols > 0 ? Math.round((s.missed / (s.scanned + s.missed || 1)) * 100) : 0 })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getGuardPatrols(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data: shift } = await supabase.from("shifts").select("id").eq("site_id", siteId).eq("status", "active").single();
      if (!shift) return res.json([]);
      const { data: patrols, error } = await supabase.from("patrols").select("*, patrol_checkpoints (status)").eq("shift_id", shift.id).order("actual_start", { ascending: false });
      if (error) throw error;
      res.json(patrols.map(p => ({ id: p.id, patrol_name: p.patrol_name, actual_start: p.actual_start, status: p.status, total_checkpoints: p.patrol_checkpoints?.length || 0, checkpoints_completed: p.patrol_checkpoints?.filter(cp => cp.status === "completed").length || 0 })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
