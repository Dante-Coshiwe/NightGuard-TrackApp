import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.user_type === "admin" && user.can_view_all_sites) {
        navigate("/admin");
      } else if (user.user_type === "admin") {
        navigate("/location");
      } else if (user.user_type === "guard") {
        navigate("/guard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#000000"
    }}>
      <div style={{
        background: "#0a0a0a",
        border: "1px solid #1f1f1f",
        borderRadius: 12,
        padding: 40,
        width: "100%",
        maxWidth: 400
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            background: "#dc2626",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 28
          }}>
            🛡️
          </div>
          <h1 style={{ color: "#fff", margin: 0, fontSize: 22, fontWeight: 600 }}>NightGuard Track</h1>
          <p style={{ color: "#666", margin: "8px 0 0", fontSize: 14 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "#999", fontSize: 13, display: "block", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#111",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                color: "#fff",
                fontSize: 14,
                outline: "none"
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: "#999", fontSize: 13, display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#111",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                color: "#fff",
                fontSize: 14,
                outline: "none"
              }}
            />
          </div>
          {error && (
            <div style={{
              background: "#2a1515",
              border: "1px solid #5a2020",
              borderRadius: 8,
              padding: "10px 12px",
              color: "#ff6b6b",
              fontSize: 13,
              marginBottom: 16
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px",
              background: loading ? "#dc2626" : "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}