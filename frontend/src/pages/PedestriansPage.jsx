import { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { Footprints, Clock, Search } from "lucide-react";
import { api } from "../services/api";

export default function PedestriansPage() {
  const [pedestrians, setPedestrians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchPedestrians();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchPedestrians = async () => {
    try {
      const res = await api.get("/pedestrians/recent");
      setPedestrians(res.data);
    } catch (err) {
      console.error("Failed to fetch pedestrians:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = pedestrians.filter(p =>
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id_number?.includes(searchTerm)
  );

  if (loading) {
    return (
      <SidebarLayout>
        <LoadingSpinner text="Loading pedestrian data..." />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="fade-in" style={{ background: "#000000", minHeight: "100vh", padding: "24px 32px" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <Footprints size={28} color="#dc2626" />
            Pedestrians
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#666", display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} />
            Last refreshed: {currentTime.toLocaleTimeString()}
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ position: "relative", maxWidth: 400 }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#666" }} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 38px",
                background: "#0a0a0a",
                border: "1px solid #1f1f1f",
                borderRadius: 8,
                color: "#fff",
                fontSize: 14
              }}
            />
          </div>
        </div>

        <div style={{
          background: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: 12,
          overflow: "hidden"
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f1f1f" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Recently entered and exited pedestrians</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#ff6b6b" }}>
                Error: {error}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                No pedestrian records to display.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 12 }}>SITE NAME</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 12 }}>NAME</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 12 }}>ID NO.</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 12 }}>CONTACT NO.</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 12 }}>TYPE</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 12 }}>VISITING UNIT</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 12 }}>ENTERED</th>
                    <th style={{ padding: "12px 16px", color: "#999", fontSize: 12 }}>EXITED</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === filtered.length - 1 ? "none" : "1px solid #1f1f1f" }}>
                      <td style={{ padding: "12px 16px" }}>{p.site_name || "-"}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.full_name || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{p.id_number || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{p.contact_number || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{p.pedestrian_type || "-"}</td>
                      <td style={{ padding: "12px 16px" }}>{p.visiting_unit || "-"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#10b981" }}>
                        {p.entered_at ? new Date(p.entered_at).toLocaleString() : "-"}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: p.exited_at ? "#10b981" : "#ef4444" }}>
                        {p.exited_at ? new Date(p.exited_at).toLocaleString() : "Not Exited"}
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