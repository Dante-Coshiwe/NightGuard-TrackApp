import { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { CircleAlert, Clock } from "lucide-react";
import { api } from "../services/api";

export default function WheelClampsPage() {
  const [clamps, setClamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchClamps();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchClamps = async () => {
    try {
      const res = await api.get("/wheelclamps/recent");
      setClamps(res.data);
    } catch (err) {
      console.error("Failed to fetch wheel clamps:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <LoadingSpinner text="Loading wheel clamps..." />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="fade-in" style={{ background: "#000000", minHeight: "100vh", padding: "24px 32px" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <CircleAlert size={28} color="#dc2626" />
            Wheel Clamps
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
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Recent Wheel Clamps</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#ff6b6b" }}>
                Error: {error}
              </div>
            ) : clamps.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                No records to display.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SITE NAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>CLAMPED</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>REMOVED</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>UNIT</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>NAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>REGISTRATION</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>OFFENDER TYPE</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>PICTURE</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SIGNATURE</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {clamps.map((c, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === clamps.length - 1 ? "none" : "1px solid #1f1f1f" }}>
                      <td style={{ padding: "12px 16px" }}>{c.site_name || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {c.clamped_at ? new Date(c.clamped_at).toLocaleString() : "-"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {c.removed_at ? new Date(c.removed_at).toLocaleString() : "Not Removed"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>{c.unit || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{c.offender_name || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{c.registration || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{c.offender_type || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{c.picture_url ? "Yes" : "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{c.signature_url ? "Yes" : "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{c.pdf_url ? "PDF" : "-"}</td>
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