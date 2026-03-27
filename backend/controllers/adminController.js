import { supabase } from "../config/database.js";

export const adminController = {
  async getGeneralDashboard(req, res) {
    try {
      console.log("Fetching dashboard data...");

      // Get all organizations
      const { data: organizations, error: orgError } = await supabase
        .from("organizations")
        .select("*");
      if (orgError) throw orgError;
      console.log("Organizations count:", organizations?.length);

      // Get all sites with organization and device info
      const { data: sites, error: sitesError } = await supabase
        .from("sites")
        .select(`
          *,
          organizations:organization_id (org_name),
          devices (
            id,
            latest_sync_update,
            is_active
          )
        `);
      if (sitesError) throw sitesError;
      console.log("Sites count:", sites?.length);

      // Get active shifts count
      const { count: activeShifts, error: shiftsError } = await supabase
        .from("shifts")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      if (shiftsError) console.warn(shiftsError);

      // Get total devices count
      const { count: totalDevices, error: devicesError } = await supabase
        .from("devices")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      if (devicesError) console.warn(devicesError);

      // Get counts for other stats
      const today = new Date().toISOString().split('T')[0];
      const { count: vehiclesEntered } = await supabase
        .from("vehicles")
        .select("*", { count: "exact", head: true })
        .gte("entered_at", today);
      const { count: pedestriansEntered } = await supabase
        .from("pedestrians")
        .select("*", { count: "exact", head: true })
        .gte("entered_at", today);
      const { count: incidents } = await supabase
        .from("incidents")
        .select("*", { count: "exact", head: true })
        .gte("reported_at", today);
      const { count: obEntries } = await supabase
        .from("ob_entries")
        .select("*", { count: "exact", head: true })
        .gte("captured_timestamp", today);
      const { count: patrolsAcknowledged } = await supabase
        .from("patrols")
        .select("*", { count: "exact", head: true })
        .eq("status", "in_progress");

      // Organization summaries
      const orgSummaries = (organizations || []).map(org => {
        const orgSites = (sites || []).filter(s => s.organization_id === org.id);
        const orgDevices = orgSites.flatMap(s => s.devices || []);
        const devicesOnline = orgDevices.filter(d => {
          if (!d.latest_sync_update) return false;
          const minutesSinceSync = (Date.now() - new Date(d.latest_sync_update)) / 60000;
          return minutesSinceSync < 60;
        }).length;
        return {
          id: org.id,
          org_name: org.org_name,
          org_code: org.org_code,
          sites_count: orgSites.length,
          devices_count: orgDevices.length,
          devices_online: devicesOnline
        };
      });

      // Sites with no guards
      const { data: activeShiftsData } = await supabase
        .from("shifts")
        .select("site_id")
        .eq("status", "active");
      const activeSiteIds = (activeShiftsData || []).map(s => s.site_id);
      const sitesWithNoGuards = (sites || []).filter(s => !activeSiteIds.includes(s.id));

      const response = {
        summary: {
          total_organizations: organizations?.length || 0,
          total_sites: sites?.length || 0,
          total_devices: totalDevices || 0,
          active_shifts: activeShifts || 0,
          sites_with_no_guards: sitesWithNoGuards.length,
          guards_on_duty: activeShifts || 0,
          vehicles_entered: vehiclesEntered || 0,
          vehicles_exited: 0,
          pedestrians_entered: pedestriansEntered || 0,
          pedestrians_exited: 0,
          incidents_recorded: incidents || 0,
          ob_entries_recorded: obEntries || 0,
          patrols_acknowledged: patrolsAcknowledged || 0,
          patrols_not_acknowledged: 0,
          wheel_clamps: 0
        },
        organizations: orgSummaries,
        sites: sites || [],
        sites_with_no_guards: sitesWithNoGuards
      };

      console.log("Dashboard data fetched successfully");
      res.json(response);
    } catch (error) {
      console.error("Error getting dashboard:", error);
      res.status(500).json({ error: error.message });
    }
  }
};