import { supabase } from "../config/database.js";

export const testController = {
  async testConnection(req, res) {
    try {
      // Test query to check connection
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .limit(1);
      
      if (error) throw error;
      
      res.json({ 
        status: "connected", 
        message: "Database connection successful",
        data: data 
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        status: "error", 
        message: error.message,
        hint: "Check your SUPABASE_URL and SUPABASE_SERVICE_KEY in .env"
      });
    }
  }
};