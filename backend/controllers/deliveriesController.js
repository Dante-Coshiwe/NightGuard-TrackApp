import { supabase } from "../config/database.js";

export const deliveriesController = {
  async getRecentDeliveries(req, res) {
    try {
      const { data: deliveries, error } = await supabase
        .from("deliveries")
        .select(`
          *,
          sites (site_name)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedDeliveries = deliveries?.map(d => ({
        id: d.id,
        site_name: d.sites?.site_name || "Unknown",
        date_time: d.delivery_time || d.created_at,
        recipient_name: d.recipient_name,
        recipient_contact: d.recipient_contact,
        unit: d.unit,
        issuer_name: d.issuer_name,
        exchange_details: d.exchange_details
      })) || [];

      res.json(formattedDeliveries);
    } catch (error) {
      console.error("Error getting deliveries:", error);
      res.status(500).json({ error: error.message });
    }
  }
};