import { supabase } from "../config/database.js";

export const sitesController = {
  async getAllSites(req, res) {
    try {
      const { data: sites, error } = await supabase
        .from("sites")
        .select(`
          *,
          organizations (org_name),
          devices (id, latest_sync_update)
        `)
        .eq("is_active", true)
        .order("site_name");
      if (error) throw error;

      const formatted = sites.map(site => ({
        id: site.id,
        site_name: site.site_name,
        organization: site.organizations?.org_name || "N/A",
        address: site.address || "",
        devices_count: site.devices?.length || 0,
        last_activity: site.devices?.[0]?.latest_sync_update
          ? new Date(site.devices[0].latest_sync_update).toLocaleString()
          : "Never"
      }));

      res.json(formatted);
    } catch (error) {
      console.error("Error fetching sites:", error);
      res.status(500).json({ error: error.message });
    }
  }
};