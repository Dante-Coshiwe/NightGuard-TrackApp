import { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { Package, Clock } from "lucide-react";
import { api } from "../services/api";

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDeliveries();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get("/deliveries/recent");
      setDeliveries(res.data);
    } catch (err) {
      console.error("Failed to fetch deliveries:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <LoadingSpinner text="Loading deliveries..." />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="fade-in" style={{ background: "#000000", minHeight: "100vh", padding: "24px 32px" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <Package size={28} color="#dc2626" />
            Deliveries
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
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Recent Deliveries</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#ff6b6b" }}>
                Error: {error}
              </div>
            ) : deliveries.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                No records to display.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SITE NAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>DATE/TIME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>NAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>CONTACT NO.</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>UNIT</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>ISSUER</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>EXCHANGE</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>PICTURE</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SIGNATURE</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((d, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === deliveries.length - 1 ? "none" : "1px solid #1f1f1f" }}>
                      <td style={{ padding: "12px 16px" }}>{d.site_name}</td>
                      <td style={{ padding: "12px 16px" }}>{d.date_time}</td>
                      <td style={{ padding: "12px 16px" }}>{d.recipient_name}</td>
                      <td style={{ padding: "12px 16px" }}>{d.recipient_contact}</td>
                      <td style={{ padding: "12px 16px" }}>{d.unit}</td>
                      <td style={{ padding: "12px 16px" }}>{d.issuer_name}</td>
                      <td style={{ padding: "12px 16px" }}>{d.exchange_details}</td>
                      <td style={{ padding: "12px 16px" }}>{d.picture_url ? "Yes" : "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{d.signature_url ? "Yes" : "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{d.pdf_url ? "PDF" : "-"}</td>
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