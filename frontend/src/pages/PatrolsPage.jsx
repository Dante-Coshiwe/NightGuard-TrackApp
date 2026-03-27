import { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { Shield, Clock } from "lucide-react";
import { api } from "../services/api";

export default function PatrolsPage() {
  const [patrols, setPatrols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchPatrols();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchPatrols = async () => {
    try {
      const res = await api.get("/patrols/summary");
      setPatrols(res.data);
    } catch (err) {
      console.error("Failed to fetch patrols:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <LoadingSpinner text="Loading patrol data..." />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="fade-in" style={{ background: "#000000", minHeight: "100vh", padding: "24px 32px" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <Shield size={28} color="#dc2626" />
            Patrols
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#666", display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} />
            Last refreshed: {currentTime.toLocaleTimeString()}
          </p>
        </div>

        <div style={{
          background: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: 12,
          overflow: "hidden"
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f1f1f" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Patrol summary per site</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#ff6b6b" }}>
                Error: {error}
              </div>
            ) : patrols.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                No patrol records to display.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>SITENAME</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>NO. PATROL(S)</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>SCANNED</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>MISSED</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>STEPS</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>SCANNED (%)</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>MISSED (%)</th>
                   </tr>
                </thead>
                <tbody>
                  {patrols.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === patrols.length - 1 ? "none" : "1px solid #1f1f1f" }}>
                      <td style={{ padding: "12px 16px" }}>{p.site_name}</td>
                      <td style={{ padding: "12px 16px" }}>{p.total_patrols}</td>
                      <td style={{ padding: "12px 16px", color: "#10b981" }}>{p.scanned}</td>
                      <td style={{ padding: "12px 16px", color: "#ef4444" }}>{p.missed}</td>
                      <td style={{ padding: "12px 16px" }}>{p.steps}</td>
                      <td style={{ padding: "12px 16px", color: "#10b981" }}>{p.scanned_percent}%</td>
                      <td style={{ padding: "12px 16px", color: "#ef4444" }}>{p.missed_percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}