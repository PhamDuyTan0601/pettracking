import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { calculateDistance } from "../../utils/helpers";
import "./AlertSystem.css";

const AlertSystem = ({ petData, selectedPet }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (petData && petData.length > 0) {
      checkAlerts(petData[0]);
    }
  }, [petData]);

  const checkAlerts = (latestData) => {
    if (!latestData) return;

    const newAlerts = [];

    // Kiểm tra pin yếu
    if (latestData.batteryLevel < 20) {
      const alertExists = alerts.some(
        (alert) =>
          alert.type === "battery" && alert.message.includes("Pin thấp")
      );

      if (!alertExists) {
        newAlerts.push({
          type: "battery",
          message: `Pin thấp: ${latestData.batteryLevel}%`,
          level: "warning",
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Kiểm tra ra khỏi vùng an toàn
    if (latestData.latitude && latestData.longitude) {
      const safeZoneCenter = [10.8231, 106.6297];
      const distance = calculateDistance(
        safeZoneCenter[0],
        safeZoneCenter[1],
        latestData.latitude,
        latestData.longitude
      );

      if (distance > 0.5) {
        const alertExists = alerts.some(
          (alert) =>
            alert.type === "location" &&
            alert.message.includes("ra khỏi vùng an toàn")
        );

        if (!alertExists) {
          newAlerts.push({
            type: "location",
            message: "Pet ra khỏi vùng an toàn!",
            level: "danger",
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    // Hiển thị alert mới
    newAlerts.forEach((alert) => {
      toast[alert.level === "danger" ? "error" : "warning"](alert.message);
      setAlerts((prev) => [...prev, { ...alert, id: Date.now() }]);
    });
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="alert-system">
      <div className="alert-header">
        <h3>🚨 Thông báo</h3>
        {alerts.length > 0 && (
          <button onClick={clearAllAlerts} className="btn-clear-all">
            Xóa tất cả
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="no-alerts">
          <div className="no-alerts-icon">✅</div>
          <p>Không có cảnh báo nào</p>
          <span>Mọi thứ đều ổn định</span>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.level}`}>
              <div className="alert-content">
                <div className="alert-message">{alert.message}</div>
                <div className="alert-time">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                className="btn-remove-alert"
                title="Xóa cảnh báo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertSystem;
