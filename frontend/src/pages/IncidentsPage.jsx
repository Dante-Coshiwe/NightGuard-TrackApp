import { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { AlertTriangle, Clock } from "lucide-react";
import { api } from "../services/api";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchIncidents();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await api.get("/incidents/recent");
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <LoadingSpinner text="Loading incidents..." />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="fade-in" style={{ background: "#000000", minHeight: "100vh", padding: "24px 32px" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <AlertTriangle size={28} color="#dc2626" />
            Incidents
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
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Recent Incidents</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#ff6b6b" }}>
                Error: {error}
              </div>
            ) : incidents.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                No records to display.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SITE NAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>TYPE</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>DESCRIPTION</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SEVERITY</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>REPORTED AT</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === incidents.length - 1 ? "none" : "1px solid #1f1f1f" }}>
                      <td style={{ padding: "12px 16px" }}>{inc.site_name}</td>
                      <td style={{ padding: "12px 16px" }}>{inc.incident_type}</td>
                      <td style={{ padding: "12px 16px" }}>{inc.description}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          background: inc.severity === "high" ? "#2a1f0f" : "#0f2a1f",
                          color: inc.severity === "high" ? "#f59e0b" : "#10b981",
                          padding: "2px 8px",
                          borderRadius: 12,
                          fontSize: 12
                        }}>
                          {inc.severity}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>{new Date(inc.reported_at).toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          background: inc.status === "open" ? "#2a1f0f" : "#0f2a1f",
                          color: inc.status === "open" ? "#f59e0b" : "#10b981"
                        }}>
                          {inc.status}
                        </span>
                      </td>
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