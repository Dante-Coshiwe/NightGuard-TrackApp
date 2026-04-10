import { supabase } from "../config/database.js";

export const sitesController = {
  async getAllSites(req, res) {
    try {
      const { data: sites, error } = await supabase
        .from("sites")
        .select("*, organizations (org_name), devices (id, latest_sync_update)")
        .eq("is_active", true)
        .order("site_name");
      if (error) throw error;
      res.json(sites.map(site => ({
        id: site.id,
        site_name: site.site_name,
        organization: site.organizations?.org_name || "N/A",
        address: site.address || "",
        devices_count: site.devices?.length || 0,
        last_activity: site.devices?.[0]?.latest_sync_update ? new Date(site.devices[0].latest_sync_update).toLocaleString() : "Never"
      })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getMySite(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data: site, error } = await supabase
        .from("sites")
        .select("*, organizations (org_name, org_code), devices (id, device_name, device_description, device_id, app_version, os_version, battery_level, latest_sync_update)")
        .eq("id", siteId)
        .single();
      if (error) throw error;
      res.json(site);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateMySite(req, res) {
    try {
      const siteId = req.user.site_id;
      const { site_name, address, contact_person, contact_phone } = req.body;
      const { data, error } = await supabase
        .from("sites")
        .update({ site_name, address, contact_person, contact_phone, updated_at: new Date() })
        .eq("id", siteId)
        .select()
        .single();
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
