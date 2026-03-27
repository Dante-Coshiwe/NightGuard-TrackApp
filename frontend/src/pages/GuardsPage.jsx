import { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { Users, Clock } from "lucide-react";
import { api } from "../services/api";

export default function GuardsPage() {
  const [guardsData, setGuardsData] = useState({ guards_on_duty: [], sites_with_no_guards: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchGuards();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchGuards = async () => {
    try {
      const res = await api.get("/guards/on-duty");
      setGuardsData(res.data);
    } catch (err) {
      console.error("Failed to fetch guards:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <LoadingSpinner text="Loading guards data..." />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="fade-in" style={{ background: "#000000", minHeight: "100vh", padding: "24px 32px" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <Users size={28} color="#dc2626" />
            Guards
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#666", display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} />
            Last refreshed: {currentTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Guards on duty */}
        <div style={{
          background: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: 12,
          marginBottom: 32,
          overflow: "hidden"
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f1f1f" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Guards on duty</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#ff6b6b" }}>
                Error: {error}
              </div>
            ) : guardsData.guards_on_duty.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                No guards on duty.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SITENAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>FIRSTNAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SURNAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SHIFT START</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>DURATION</th>
                  </tr>
                </thead>
                <tbody>
                  {guardsData.guards_on_duty.map((g, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === guardsData.guards_on_duty.length - 1 ? "none" : "1px solid #1f1f1f" }}>
                      <td style={{ padding: "12px 16px" }}>{g.sitename || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{g.firstname || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{g.surname || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {g.shift_start ? new Date(g.shift_start).toLocaleString() : "-"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>{g.duration || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sites with no guards */}
        <div style={{
          background: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: 12,
          overflow: "hidden"
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f1f1f" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Sites with no guards</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {guardsData.sites_with_no_guards.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                All sites have guards assigned.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SITENAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>DEVICE ID</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>RECENT SHIFTS</th>
                  </tr>
                </thead>
                <tbody>
                  {guardsData.sites_with_no_guards.map((s, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === guardsData.sites_with_no_guards.length - 1 ? "none" : "1px solid #1f1f1f" }}>
                      <td style={{ padding: "12px 16px" }}>{s.sitename || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{s.device_id || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{s.recent_shifts || "-"}</td>
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