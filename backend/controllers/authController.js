import { supabase } from "../config/database.js";

export const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return res.status(401).json({ error: error.message });

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      res.json({
        token: data.session.access_token,
        user: { ...data.user, ...profile }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async register(req, res) {
    try {
      const { email, password, full_name, user_type, organization_id, site_id } = req.body;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name }
        }
      });

      if (error) return res.status(400).json({ error: error.message });

      await supabase
        .from("profiles")
        .update({
          full_name,
          user_type: user_type || "guard",
          organization_id,
          site_id
        })
        .eq("id", data.user.id);

      res.json({ message: "User created successfully", user: data.user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getMe(req, res) {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async logout(req, res) {
    try {
      await supabase.auth.signOut();
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
