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
        refresh_token: data.session.refresh_token, // ✅ added
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
  },

  async guardLogin(req, res) {
    try {
      const { guard_id, pin } = req.body;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", guard_id)
        .eq("user_type", "guard")
        .eq("is_active", true)
        .single();

      if (profileError || !profile) {
        return res.status(401).json({ error: "Guard not found" });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email || `guard_${guard_id}@nightguard.local`,
        password: pin,
      });

      if (error) return res.status(401).json({ error: "Invalid PIN" });

      // End previous shift
      await supabase.from("shifts")
        .update({ status: "completed", ended_at: new Date() })
        .eq("site_id", profile.site_id)
        .eq("status", "active");

      // Start new shift
      const { data: shift } = await supabase.from("shifts")
        .insert({
          site_id: profile.site_id,
          guard_id: profile.id,
          shift_name: "Guard Shift",
          started_at: new Date(),
          status: "active",
        })
        .select()
        .single();

      res.json({
        token: data.session.access_token,
        refresh_token: data.session.refresh_token, // added refresh token
        user: { ...data.user, ...profile },
        shift
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async guardLogout(req, res) {
  try {
    const userId = req.user.id;
    const siteId = req.user.site_id;

    // End active shift
    await supabase.from("shifts")
      .update({ status: "completed", ended_at: new Date() })
      .eq("guard_id", userId)
      .eq("site_id", siteId)
      .eq("status", "active");

    await supabase.auth.signOut();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
  async getGuardsBySite(req, res) {
  try {
    const { site_id } = req.params;
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("site_id", site_id)
      .eq("user_type", "guard")
      .eq("is_active", true)
      .order("full_name");
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
};
