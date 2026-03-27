import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import GeneralAdminDashboard from "./pages/GeneralAdminDashboard";
import LocationAdminDashboard from "./pages/LocationAdminDashboard";
import GuardDashboard from "./pages/GuardDashboard";
import PatrolsPage from "./pages/PatrolsPage";
import VehiclesPage from "./pages/VehiclesPage";
import PedestriansPage from "./pages/PedestriansPage";
import IncidentsPage from "./pages/IncidentsPage";
import DocketsPage from "./pages/DocketsPage";
import DeliveriesPage from "./pages/DeliveriesPage";
import WheelClampsPage from "./pages/WheelClampsPage";
import OBEntriesPage from "./pages/OBEntriesPage";
import GuardsPage from "./pages/GuardsPage";
import SitesPage from "./pages/SitesPage";
import DevicesPage from "./pages/DevicesPage";
import SettingsPage from "./pages/SettingsPage";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff"
    }}>
      Loading...
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <GeneralAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/patrols" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PatrolsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/vehicles" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <VehiclesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/pedestrians" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PedestriansPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/incidents" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <IncidentsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/dockets" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DocketsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/deliveries" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DeliveriesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/wheelclamps" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <WheelClampsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/obentries" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OBEntriesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/guards" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <GuardsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/sites" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SitesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/devices" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DevicesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/location/*" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LocationAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/guard/*" element={
            <ProtectedRoute allowedRoles={["guard", "marshal"]}>
              <GuardDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;