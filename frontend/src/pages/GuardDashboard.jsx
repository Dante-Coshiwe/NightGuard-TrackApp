import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import SidebarLayout from "../components/SidebarLayout";
import { Shield, Clock, CheckCircle, XCircle } from "lucide-react";

export default function GuardDashboard() {
  const { user } = useAuth();
  const [patrols, setPatrols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchPatrols();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchPatrols = async () => {
    try {
      const response = await api.get("/guard/patrols");
      setPatrols(response.data);
    } catch (err) {
      console.error("Failed to fetch patrols:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div style={{ padding: "24px 32px", color: "#fff" }}>Loading...</div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div style={{ background: "#000000", minHeight: "100vh", padding: "24px 32px" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <Shield size={28} color="#dc2626" />
            Guard Dashboard
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#666", display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} />
            Welcome, {user?.full_name} | {currentTime.toLocaleTimeString()}
          </p>
        </div>

        <div style={{
          background: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: 12,
          overflow: "hidden"
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f1f1f" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Your Patrols</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>Patrol Name</th>
                  <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>Start Time</th>
                  <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>Status</th>
                  <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>Checkpoints</th>
                 </tr>
              </thead>
              <tbody>
                {patrols.length > 0 ? patrols.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #1f1f1f" }}>
                    <td style={{ padding: "12px 16px" }}>{p.patrol_name}</td>
                    <td style={{ padding: "12px 16px" }}>{new Date(p.actual_start).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        background: p.status === "in_progress" ? "#0f2a1f" : "#2a1f0f",
                        color: p.status === "in_progress" ? "#10b981" : "#f59e0b",
                        padding: "4px 12px",
                        borderRadius: 20,
                        fontSize: 12
                      }}>
                        {p.status === "in_progress" ? "In Progress" : "Completed"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {p.checkpoints_completed}/{p.total_checkpoints}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "#666" }}>No patrols assigned</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}