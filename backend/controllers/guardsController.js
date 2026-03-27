import { supabase } from "../config/database.js";

export const guardsController = {
  async getGuardsOnDuty(req, res) {
    try {
      // Get active shifts with guard and site details
      const { data: shifts, error } = await supabase
        .from("shifts")
        .select(`
          id,
          started_at,
          shift_name,
          status,
          site_id,
          sites (site_name),
          guard_id,
          profiles:guard_id (full_name)
        `)
        .eq("status", "active")
        .order("started_at", { ascending: false });
      if (error) throw error;

      const guardsOnDuty = shifts.map(shift => {
        const fullName = shift.profiles?.full_name || "";
        const [firstName, ...rest] = fullName.split(" ");
        const surname = rest.join(" ");
        return {
          sitename: shift.sites?.site_name || "Unknown",
          firstname: firstName,
          surname: surname,
          shift_start: shift.started_at,
          duration: shift.started_at
            ? `${Math.floor((Date.now() - new Date(shift.started_at)) / (1000 * 60 * 60))}hrs`
            : "0hrs"
        };
      });

      // Get all sites
      const { data: sites } = await supabase
        .from("sites")
        .select("id, site_name, devices(device_id)")
        .eq("is_active", true);

      const activeSiteIds = new Set(shifts.map(s => s.site_id));
      const sitesWithNoGuards = (sites || [])
        .filter(site => !activeSiteIds.has(site.id))
        .map(site => ({
          sitename: site.site_name,
          device_id: site.devices?.[0]?.device_id || "No device",
          recent_shifts: ""
        }));

      res.json({ guards_on_duty: guardsOnDuty, sites_with_no_guards: sitesWithNoGuards });
    } catch (error) {
      console.error("Error fetching guards:", error);
      res.status(500).json({ error: error.message });
    }
  }
};