import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export default function AlertSystem({ petData, selectedPet }) {
  const [alerts, setAlerts] = useState([]);

  // Sử dụng useCallback để memoize hàm checkAlerts
  const checkAlerts = useCallback(
    (latestData) => {
      const newAlerts = [];

      // Kiểm tra pin yếu
      if (latestData.batteryLevel < 20) {
        newAlerts.push({
          type: "battery",
          message: `Pin thấp: ${latestData.batteryLevel}%`,
          level: "warning",
        });
      }

      // Kiểm tra ra khỏi vùng an toàn (demo)
      const safeZoneCenter = [10.8231, 106.6297]; // Tọa độ trung tâm
      const distance = calculateDistance(
        safeZoneCenter[0],
        safeZoneCenter[1],
        latestData.latitude,
        latestData.longitude
      );

      if (distance > 0.5) {
        // 500m
        newAlerts.push({
          type: "location",
          message: "Pet ra khỏi vùng an toàn!",
          level: "danger",
        });
      }

      // Hiển thị alert mới
      newAlerts.forEach((alert) => {
        if (
          !alerts.find(
            (a) => a.type === alert.type && a.message === alert.message
          )
        ) {
          toast[alert.level === "danger" ? "error" : "warning"](alert.message);
          setAlerts((prev) => [...prev, { ...alert, id: Date.now() }]);
        }
      });
    },
    [alerts]
  ); // Thêm alerts vào dependencies

  useEffect(() => {
    if (petData && petData.length > 0) {
      checkAlerts(petData[0]);
    }
  }, [petData, checkAlerts]); // Thêm checkAlerts vào dependencies

  // ... phần còn lại giữ nguyên
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🚨 Thông báo</h2>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">✅</div>
          <p>Không có cảnh báo nào</p>
          <p className="text-sm">Mọi thứ đều ổn định</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.level === "danger"
                  ? "bg-red-50 border-red-500"
                  : "bg-yellow-50 border-yellow-500"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{alert.message}</p>
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
