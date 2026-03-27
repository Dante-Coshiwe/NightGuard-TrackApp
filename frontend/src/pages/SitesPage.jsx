import { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { Building2, Clock } from "lucide-react";
import { api } from "../services/api";

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchSites();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSites = async () => {
    try {
      const res = await api.get("/sites");
      setSites(res.data);
    } catch (err) {
      console.error("Failed to fetch sites:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <LoadingSpinner text="Loading sites..." />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="fade-in" style={{ background: "#000000", minHeight: "100vh", padding: "24px 32px" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <Building2 size={28} color="#dc2626" />
            Sites
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
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>All Sites</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#ff6b6b" }}>
                Error: {error}
              </div>
            ) : sites.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                No records to display.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SITE NAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>ORGANIZATION</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>ADDRESS</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>DEVICES</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>LAST ACTIVITY</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map((site, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === sites.length - 1 ? "none" : "1px solid #1f1f1f" }}>
                      <td style={{ padding: "12px 16px" }}>{site.site_name}</td>
                      <td style={{ padding: "12px 16px" }}>{site.organization}</td>
                      <td style={{ padding: "12px 16px" }}>{site.address}</td>
                      <td style={{ padding: "12px 16px" }}>{site.devices_count}</td>
                      <td style={{ padding: "12px 16px" }}>{site.last_activity}</td>
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