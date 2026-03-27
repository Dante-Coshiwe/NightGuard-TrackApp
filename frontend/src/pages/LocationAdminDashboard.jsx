import { useState, useEffect } from "react";
import { api } from "../services/api";
import SidebarLayout from "../components/SidebarLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { 
  Users, 
  Building2, 
  Shield, 
  AlertTriangle,
  Car,
  Footprints,
  FileText,
  Clock,
  Smartphone
} from "lucide-react";

function StatCard({ title, value, icon, color = "white" }) {
  const Icon = icon;
  return (
    <div style={{
      background: "#0a0a0a",
      border: "1px solid #1f1f1f",
      borderRadius: 12,
      padding: "20px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ color: "#666666", fontSize: 13, fontWeight: 500 }}>{title}</div>
        <Icon size={20} color={color === "red" ? "#dc2626" : "#ffffff"} />
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: color === "red" ? "#dc2626" : "#ffffff" }}>
        {value || 0}
      </div>
    </div>
  );
}

export default function LocationAdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Call a new endpoint that returns data for the user's site(s)
      const response = await api.get("/location/dashboard");
      setDashboardData(response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <LoadingSpinner fullScreen text="Loading location dashboard..." />
      </SidebarLayout>
    );
  }

  const stats = dashboardData?.summary || {};
  const site = dashboardData?.site;

  return (
    <SidebarLayout>
      <div style={{ 
        background: "#000000", 
        minHeight: "100vh",
        padding: "24px 32px"
      }}>
        {/* Header */}
        <div style={{ marginBottom: 32, borderBottom: "1px solid #1f1f1f", paddingBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff" }}>
            Location Dashboard
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#666", display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} />
            {site?.site_name || "Your Site"} | Last refreshed: {currentTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
          <StatCard title="Guards on Duty" value={stats.guards_on_duty} icon={Shield} />
          <StatCard title="Vehicles Inside" value={stats.vehicles_inside} icon={Car} />
          <StatCard title="Pedestrians Inside" value={stats.pedestrians_inside} icon={Footprints} />
          <StatCard title="Incidents Today" value={stats.incidents_today} icon={AlertTriangle} color="red" />
          <StatCard title="Patrols Completed" value={stats.patrols_completed} icon={FileText} />
          <StatCard title="OB Entries" value={stats.ob_entries} icon={FileText} />
          <StatCard title="Deliveries" value={stats.deliveries} icon={FileText} />
          <StatCard title="Devices Online" value={stats.devices_online} icon={Smartphone} />
        </div>

        {/* Recent Activity */}
        <div style={{
          background: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: 12,
          overflow: "hidden"
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f1f1f" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Recent Activity</h2>
          </div>
          <div style={{ padding: "20px", color: "#666", textAlign: "center" }}>
            Activity log coming soon...
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}