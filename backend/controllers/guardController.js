import { supabase } from "../config/database.js";

export const guardController = {
  async getPatrols(req, res) {
    try {
      const user = req.user;
      // Assume the guard has an active shift
      const { data: shift, error: shiftError } = await supabase
        .from("shifts")
        .select("id")
        .eq("guard_id", user.id)
        .eq("status", "active")
        .single();
      if (shiftError && shiftError.code !== 'PGRST116') throw shiftError;

      if (!shift) {
        return res.json([]); // no active shift
      }

      // Get patrols for this shift
      const { data: patrols, error: patrolsError } = await supabase
        .from("patrols")
        .select(`
          *,
          patrol_checkpoints (status)
        `)
        .eq("shift_id", shift.id)
        .order("actual_start", { ascending: false });
      if (patrolsError) throw patrolsError;

      const result = patrols.map(p => ({
        id: p.id,
        patrol_name: p.patrol_name,
        actual_start: p.actual_start,
        status: p.status,
        total_checkpoints: p.patrol_checkpoints?.length || 0,
        checkpoints_completed: p.patrol_checkpoints?.filter(cp => cp.status === "completed").length || 0
      }));

      res.json(result);
    } catch (error) {
      console.error("Error getting guard patrols:", error);
      res.status(500).json({ error: error.message });
    }
  }
};