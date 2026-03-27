import { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { Smartphone, Clock } from "lucide-react";
import { api } from "../services/api";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDevices();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await api.get("/devices");
      setDevices(res.data);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <LoadingSpinner text="Loading devices..." />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="fade-in" style={{ background: "#000000", minHeight: "100vh", padding: "24px 32px" }}>
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            <Smartphone size={28} color="#dc2626" />
            Devices
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
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Device List</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            {error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#ff6b6b" }}>
                Error: {error}
              </div>
            ) : devices.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                No records to display.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: "#999" }}>SITE NAME</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>DEVICE ID</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>APP VERSION</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>LATEST SYNC UPDATE</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>LICENSE EXPIRY</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>LOCK MODE</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>MEMORY AVAILABLE(%)</th>
                    <th style={{ padding: "12px 16px", color: "#999" }}>STORAGE AVAILABLE(MB)</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === devices.length - 1 ? "none" : "1px solid #1f1f1f" }}>
                      <td style={{ padding: "12px 16px" }}>{device.site_name}</td>
                      <td style={{ padding: "12px 16px" }}>{device.device_id}</td>
                      <td style={{ padding: "12px 16px" }}>{device.app_version}</td>
                      <td style={{ padding: "12px 16px" }}>{device.latest_sync_update}</td>
                      <td style={{ padding: "12px 16px" }}>{device.license_expiry}</td>
                      <td style={{ padding: "12px 16px" }}>{device.lock_mode}</td>
                      <td style={{ padding: "12px 16px" }}>{device.memory_available_percent}</td>
                      <td style={{ padding: "12px 16px" }}>{device.storage_available_mb}</td>
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