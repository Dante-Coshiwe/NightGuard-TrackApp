import { supabase } from "../config/database.js";

export const devicesController = {
  async getAllDevices(req, res) {
    try {
      const { data: devices, error } = await supabase
        .from("devices")
        .select(`
          *,
          sites (site_name),
          device_settings (lock_mode)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const formatted = devices.map(device => ({
        site_name: device.sites?.site_name || "Unknown",
        device_id: device.device_id,
        app_version: device.app_version,
        latest_sync_update: device.latest_sync_update
          ? new Date(device.latest_sync_update).toLocaleString()
          : "Never",
        license_expiry: device.license_expiry
          ? new Date(device.license_expiry).toLocaleDateString()
          : "N/A",
        lock_mode: device.device_settings?.lock_mode || "Unlocked",
        memory_available_percent: device.memory_available_percent,
        storage_available_mb: device.storage_available_percent
      }));

      res.json(formatted);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ error: error.message });
    }
  }
};