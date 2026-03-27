import { supabase } from "../config/database.js";

export const locationController = {
  async getDashboard(req, res) {
    try {
      const user = req.user;
      if (!user.site_id) {
        return res.status(400).json({ error: "No site assigned to this user" });
      }

      // Get site details
      const { data: site, error: siteError } = await supabase
        .from("sites")
        .select("*")
        .eq("id", user.site_id)
        .single();
      if (siteError) throw siteError;

      // Get active shifts at this site
      const { count: guardsOnDuty } = await supabase
        .from("shifts")
        .select("*", { count: "exact", head: true })
        .eq("site_id", user.site_id)
        .eq("status", "active");

      // Get vehicles currently inside
      const { count: vehiclesInside } = await supabase
        .from("vehicles")
        .select("*", { count: "exact", head: true })
        .eq("site_id", user.site_id)
        .eq("status", "inside");

      // Get pedestrians currently inside
      const { count: pedestriansInside } = await supabase
        .from("pedestrians")
        .select("*", { count: "exact", head: true })
        .eq("site_id", user.site_id)
        .eq("status", "inside");

      // Get incidents today
      const today = new Date().toISOString().split('T')[0];
      const { count: incidentsToday } = await supabase
        .from("incidents")
        .select("*", { count: "exact", head: true })
        .eq("site_id", user.site_id)
        .gte("reported_at", today);

      // Get patrols completed today
      const { count: patrolsCompleted } = await supabase
        .from("patrols")
        .select("*", { count: "exact", head: true })
        .eq("site_id", user.site_id)
        .eq("status", "completed")
        .gte("created_at", today);

      // Get OB entries today
      const { count: obEntries } = await supabase
        .from("ob_entries")
        .select("*", { count: "exact", head: true })
        .eq("site_id", user.site_id)
        .gte("captured_timestamp", today);

      // Get deliveries today
      const { count: deliveries } = await supabase
        .from("deliveries")
        .select("*", { count: "exact", head: true })
        .eq("site_id", user.site_id)
        .gte("created_at", today);

      // Get devices online at this site
      const { data: devices } = await supabase
        .from("devices")
        .select("latest_sync_update")
        .eq("site_id", user.site_id)
        .eq("is_active", true);
      const devicesOnline = devices?.filter(d => {
        if (!d.latest_sync_update) return false;
        const minutesSinceSync = (Date.now() - new Date(d.latest_sync_update)) / 60000;
        return minutesSinceSync < 60;
      }).length || 0;

      res.json({
        site,
        summary: {
          guards_on_duty: guardsOnDuty || 0,
          vehicles_inside: vehiclesInside || 0,
          pedestrians_inside: pedestriansInside || 0,
          incidents_today: incidentsToday || 0,
          patrols_completed: patrolsCompleted || 0,
          ob_entries: obEntries || 0,
          deliveries: deliveries || 0,
          devices_online: devicesOnline
        }
      });
    } catch (error) {
      console.error("Error getting location dashboard:", error);
      res.status(500).json({ error: error.message });
    }
  }
};