import { supabase } from "../config/database.js";

export const obEntriesController = {
  async getRecentEntries(req, res) {
    try {
      const { data: entries, error } = await supabase
        .from("ob_entries")
        .select(`
          *,
          sites (site_name)
        `)
        .order("captured_timestamp", { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedEntries = entries?.map(e => ({
        id: e.id,
        site_name: e.sites?.site_name || "Unknown",
        serial_number: e.serial_number,
        nature_of_occurrence: e.nature_of_occurrence,
        captured_timestamp: e.captured_timestamp
      })) || [];

      res.json(formattedEntries);
    } catch (error) {
      console.error("Error getting OB entries:", error);
      res.status(500).json({ error: error.message });
    }
  }
};