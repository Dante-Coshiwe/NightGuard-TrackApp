import React from 'react';

export default function LoadingSpinner({ fullScreen = false, text = "Loading..." }) {
  if (fullScreen) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "3px solid #1f1f1f",
          borderTopColor: "#dc2626",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <div style={{ color: "#666", fontSize: "14px" }}>{text}</div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
      gap: "12px"
    }}>
      <div style={{
        width: "32px",
        height: "32px",
        border: "2px solid #1f1f1f",
        borderTopColor: "#dc2626",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <div style={{ color: "#666", fontSize: "13px" }}>{text}</div>
    </div>
  );
}