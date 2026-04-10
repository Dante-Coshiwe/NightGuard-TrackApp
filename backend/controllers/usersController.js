import { supabase } from "../config/database.js";

export const usersController = {
  async getGuards(req, res) {
    try {
      const siteId = req.user.site_id;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, email, is_active, created_at")
        .eq("site_id", siteId)
        .eq("user_type", "guard")
        .order("full_name");
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async addGuard(req, res) {
    try {
      const siteId = req.user.site_id;
      const organizationId = req.user.organization_id;
      const { full_name, phone, pin } = req.body;
      if (!full_name) return res.status(400).json({ error: "Full name is required" });
      const timestamp = Date.now();
      const email = "guard_" + timestamp + "@nightguard.local";
      const password = pin || "1234";
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (authError) throw authError;
      const { data, error } = await supabase.from("profiles").upsert({
        id: authData.user.id,
        full_name,
        email,
        phone: phone || null,
        user_type: "guard",
        site_id: siteId,
        organization_id: organizationId,
        is_active: true,
      }).select().single();
      if (error) throw error;
      res.status(201).json({ ...data, pin: password });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updatePin(req, res) {
    try {
      const { id } = req.params;
      const { pin } = req.body;
      if (!pin) return res.status(400).json({ error: "PIN is required" });
      const { error } = await supabase.auth.admin.updateUserById(id, { password: pin });
      if (error) throw error;
      res.json({ message: "PIN updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async toggleActive(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      const { data, error } = await supabase.from("profiles")
        .update({ is_active })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
