import { supabase } from "../config/database.js";

export const patrolsController = {
  async getPatrolSummary(req, res) {
    try {
      const { data: patrols, error } = await supabase
        .from("patrols")
        .select(`
          *,
          sites (site_name),
          patrol_checkpoints (status)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Group by site
      const siteMap = new Map();
      patrols?.forEach(patrol => {
        const siteName = patrol.sites?.site_name || "Unknown";
        if (!siteMap.has(siteName)) {
          siteMap.set(siteName, {
            site_name: siteName,
            total_patrols: 0,
            scanned: 0,
            missed: 0,
            steps: 0
          });
        }
        
        const siteData = siteMap.get(siteName);
        siteData.total_patrols++;
        
        const checkpoints = patrol.patrol_checkpoints || [];
        const scanned = checkpoints.filter(cp => cp.status === "completed").length;
        const missed = checkpoints.filter(cp => cp.status === "missed").length;
        
        siteData.scanned += scanned;
        siteData.missed += missed;
        siteData.steps += patrol.steps_taken || 0;
      });

      const result = Array.from(siteMap.values()).map(site => ({
        ...site,
        scanned_percent: site.total_patrols > 0 ? Math.round((site.scanned / (site.scanned + site.missed)) * 100) : 0,
        missed_percent: site.total_patrols > 0 ? Math.round((site.missed / (site.scanned + site.missed)) * 100) : 0
      }));

      res.json(result);
    } catch (error) {
      console.error("Error getting patrol summary:", error);
      res.status(500).json({ error: error.message });
    }
  }
};