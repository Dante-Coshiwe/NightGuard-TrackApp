import { supabase } from "../config/database.js";

export const nfcController = {
  async logScan(req, res) {
    try {
      const userId = req.user.id;
      const siteId = req.user.site_id;
      const { tag_uid, patrol_id } = req.body;

      if (!tag_uid) return res.status(400).json({ error: "tag_uid is required" });

      // Find checkpoint by tag UID
      const { data: checkpoint, error: cpError } = await supabase
        .from("patrol_checkpoints")
        .select("*")
        .eq("tag_uid", tag_uid)
        .eq("site_id", siteId)
        .single();

      if (cpError || !checkpoint) {
        return res.status(404).json({ error: "Tag not registered to any checkpoint" });
      }

      // Get active shift
      const { data: shift } = await supabase
        .from("shifts")
        .select("id")
        .eq("site_id", siteId)
        .eq("guard_id", userId)
        .eq("status", "active")
        .single();

      // Log the scan
      const { data: scan, error: scanError } = await supabase
        .from("nfc_scans")
        .insert({
          site_id: siteId,
          guard_id: userId,
          shift_id: shift?.id || null,
          patrol_id: patrol_id || null,
          checkpoint_id: checkpoint.id,
          checkpoint_name: checkpoint.checkpoint_name,
          tag_uid,
          scanned_at: new Date(),
        })
        .select()
        .single();

      if (scanError) throw scanError;

      // Update checkpoint status
      if (patrol_id) {
        await supabase
          .from("patrol_checkpoints")
          .update({ status: "completed", scanned_at: new Date(), scanned_by: userId })
          .eq("id", checkpoint.id)
          .eq("patrol_id", patrol_id);
      }

      res.status(201).json({
        success: true,
        checkpoint_name: checkpoint.checkpoint_name,
        scanned_at: scan.scanned_at,
        scan,
      });
    } catch (error) {
      console.error("NFC scan error:", error);
      res.status(500).json({ error: error.message });
    }
  },

  async registerTag(req, res) {
    try {
      const siteId = req.user.site_id;
      const { tag_uid, checkpoint_name, latitude, longitude, checkpoint_order } = req.body;

      if (!tag_uid || !checkpoint_name) {
        return res.status(400).json({ error: "tag_uid and checkpoint_name are required" });
      }

      // Upsert checkpoint with tag UID
      const { data, error } = await supabase
        .from("patrol_checkpoints")
        .upsert({
          site_id: siteId,
          tag_uid,
          checkpoint_name,
          latitude: latitude || null,
          longitude: longitude || null,
          checkpoint_order: checkpoint_order || 0,
          status: "pending",
        }, { onConflict: "tag_uid" })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getCheckpoints(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data, error } = await supabase
        .from("patrol_checkpoints")
        .select("*")
        .eq("site_id", siteId)
        .order("checkpoint_order");
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getScans(req, res) {
    try {
      const siteId = req.user.site_id;
      const userId = req.user.id;
      const { data, error } = await supabase
        .from("nfc_scans")
        .select("*")
        .eq("site_id", siteId)
        .eq("guard_id", userId)
        .order("scanned_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
