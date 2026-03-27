import { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { FileText, Clock } from "lucide-react";
import { api } from "../services/api";

export default function DocketsPage() {
  const [dockets, setDockets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDockets();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDockets = async () => {
    try {
      const res = await api.get("/dockets/recent");
      setDockets(res.data);
    } catch (err) {
      console.error("Failed to fetch dockets:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <LoadingSpinner text="Loading dockets..." />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="fade-in" style={{ background: "#000000", minHeight: "100vh", padding: "24px 32px" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <FileText size={28} color="#dc2626" />
            Dockets
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
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Recent Dockets</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#ff6b6b" }}>
                Error: {error}
              </div>
            ) : dockets.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                No records to display.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SITE NAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>DATE</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>DOCKET NO.</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>INVESTIGATOR</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>CLIENT</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>DETAILS</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>INFO</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {dockets.map((d, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === dockets.length - 1 ? "none" : "1px solid #1f1f1f" }}>
                      <td style={{ padding: "12px 16px" }}>{d.site_name}</td>
                      <td style={{ padding: "12px 16px" }}>{d.date}</td>
                      <td style={{ padding: "12px 16px" }}>{d.docket_no}</td>
                      <td style={{ padding: "12px 16px" }}>{d.investigator}</td>
                      <td style={{ padding: "12px 16px" }}>{d.client}</td>
                      <td style={{ padding: "12px 16px" }}>{d.details}</td>
                      <td style={{ padding: "12px 16px" }}>{d.info}</td>
                      <td style={{ padding: "12px 16px" }}>{d.pdf}</td>
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