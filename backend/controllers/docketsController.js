import { supabase } from "../config/database.js";

export const docketsController = {
  async getRecentDockets(req, res) {
    try {
      const { data: dockets, error } = await supabase
        .from("dockets")
        .select(`
          *,
          sites (site_name),
          incidents (incident_type)
        `)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;

      const formatted = dockets.map(d => ({
        site_name: d.sites?.site_name || "Unknown",
        date: new Date(d.created_at).toLocaleString(),
        docket_no: d.docket_number,
        investigator: d.investigator ? "Assigned" : "Unassigned",
        client: d.client_name || "",
        details: d.details || "",
        info: d.incidents?.incident_type || "",
        pdf: d.pdf_url ? "PDF" : ""
      }));

      res.json(formatted);
    } catch (error) {
      console.error("Error fetching dockets:", error);
      res.status(500).json({ error: error.message });
    }
  }
};