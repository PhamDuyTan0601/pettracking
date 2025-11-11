import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddPet from "./pages/AddPet/AddPet";
import PetDetail from "./pages/PetDetail/PetDetail";
import DeviceManagement from "./pages/DeviceManagement/DeviceManagement";
import ToastConfig from "./components/ToastConfig/ToastConfig";
import "./styles/globals.css";

// Error Boundary để bắt lỗi
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{ padding: "2rem", textAlign: "center", fontFamily: "Arial" }}
        >
          <h1>⚠️ Đã xảy ra lỗi</h1>
          <p>Vui lòng tải lại trang hoặc liên hệ hỗ trợ.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              background: "#2b6cb0",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-pet" element={<AddPet />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/devices" element={<DeviceManagement />} />
          {/* Fallback route */}
          <Route
            path="*"
            element={
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>404 - Trang không tồn tại</h1>
                <a href="/">Về trang chủ</a>
              </div>
            }
          />
        </Routes>
      </Router>
      <ToastConfig />
    </ErrorBoundary>
  );
}

export default App;
