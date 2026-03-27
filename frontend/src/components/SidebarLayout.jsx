import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Menu, X, LogOut, User } from "lucide-react";

export default function SidebarLayout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Patrols", path: "/admin/patrols" },
    { label: "Vehicles", path: "/admin/vehicles" },
    { label: "Pedestrians", path: "/admin/pedestrians" },
    { label: "Incidents", path: "/admin/incidents" },
    { label: "Dockets", path: "/admin/dockets" },
    { label: "Deliveries", path: "/admin/deliveries" },
    { label: "Wheel Clamps", path: "/admin/wheelclamps" },
    { label: "OB Entries", path: "/admin/obentries" },
    { label: "Guards", path: "/admin/guards" },
    { label: "Sites", path: "/admin/sites" },
    { label: "Devices", path: "/admin/devices" },
    { label: "Settings", path: "/admin/settings" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000000" }}>
      <div style={{
        width: sidebarOpen ? 280 : 70,
        background: "#0a0a0a",
        borderRight: "1px solid #1f1f1f",
        transition: "width 0.3s ease",
        height: "100vh",
        overflowY: "auto",
        position: "fixed",
        zIndex: 100
      }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #1f1f1f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {sidebarOpen && <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>NightGuard</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav style={{ padding: "20px 12px" }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  marginBottom: 8,
                  background: isActive ? "#1a1a1a" : "transparent",
                  border: "none",
                  borderRadius: 8,
                  textAlign: "left",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  transition: "background 0.2s"
                }}
              >
                {sidebarOpen ? item.label : "•"}
              </button>
            );
          })}
        </nav>
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          borderTop: "1px solid #1f1f1f",
          background: "#0a0a0a"
        }}>
          {sidebarOpen ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  background: "#1a1a1a",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#dc2626"
                }}>
                  <User size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.full_name || "User"}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{user?.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "#dc2626",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <button
              onClick={logout}
              style={{
                width: "100%",
                padding: "8px",
                background: "#dc2626",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                cursor: "pointer"
              }}
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
      <div style={{ marginLeft: sidebarOpen ? 280 : 70, flex: 1, minHeight: "100vh", background: "#000000" }}>
        {children}
      </div>
    </div>
  );
}