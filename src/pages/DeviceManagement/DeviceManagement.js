import React, { useState, useEffect } from "react";
import { petsAPI, devicesAPI } from "../../utils/api";
import Navbar from "../../components/Navbar/Navbar";
import "./DeviceManagement.css";

const DeviceManagement = () => {
  const [pets, setPets] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPets();
    fetchDevices();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await petsAPI.getMyPets();
      setPets(res.data.pets || []);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setMessage("Lỗi khi tải danh sách pets");
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await devicesAPI.getMyDevices();
      setDevices(res.data.devices || []);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setMessage("Lỗi khi tải danh sách devices");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!deviceId || !selectedPet) {
      setMessage("Vui lòng nhập Device ID và chọn pet");
      return;
    }

    if (deviceId.length < 3) {
      setMessage("Device ID phải có ít nhất 3 ký tự");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await devicesAPI.register(deviceId, selectedPet);
      setMessage("success: ✅ Đăng ký device thành công!");
      setDeviceId("");
      setSelectedPet("");
      fetchDevices();
    } catch (error) {
      setMessage(
        "error: ❌ Lỗi đăng ký device: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const generateDeviceId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "ESP32_";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setDeviceId(result);
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="status-badge active">🟢 Đang hoạt động</span>
    ) : (
      <span className="status-badge inactive">🔴 Ngừng hoạt động</span>
    );
  };

  const getLastSeenText = (lastSeen) => {
    if (!lastSeen) return "Chưa có dữ liệu";
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now - lastSeenDate;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ trước`;
    return `${Math.floor(diffMins / 1440)} ngày trước`;
  };

  return (
    <>
      <Navbar />
      <div className="devicemanagement-container">
        <div className="devicemanagement-header">
          <h1>📱 Quản lý Devices</h1>
          <p>Đăng ký và quản lý thiết bị theo dõi cho pet của bạn</p>
        </div>

        {/* Register Device Form */}
        <div className="register-section">
          <div className="section-card">
            <h2>➕ Đăng ký Device Mới</h2>
            <form onSubmit={handleRegister} className="register-form">
              <div className="form-group">
                <label htmlFor="deviceId" className="form-label">
                  Device ID
                </label>
                <div className="input-with-button">
                  <input
                    type="text"
                    id="deviceId"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="form-input"
                    placeholder="Nhập Device ID hoặc tạo mới"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={generateDeviceId}
                    className="btn-generate"
                    disabled={loading}
                  >
                    🎲 Tạo ID
                  </button>
                </div>
                <small className="input-help">
                  Device ID từ ESP32 hoặc tạo ID mới
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="petSelect" className="form-label">
                  Chọn Pet
                </label>
                <select
                  id="petSelect"
                  value={selectedPet}
                  onChange={(e) => setSelectedPet(e.target.value)}
                  className="form-select"
                  required
                  disabled={loading}
                >
                  <option value="">-- Chọn pet --</option>
                  {pets.map((pet) => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name} ({pet.species})
                    </option>
                  ))}
                </select>
                {pets.length === 0 && (
                  <small className="input-help warning">
                    Chưa có pet nào. <a href="/add-pet">Thêm pet trước</a>
                  </small>
                )}
              </div>

              {message && (
                <div
                  className={`message ${
                    message.startsWith("success:") ? "success" : "error"
                  }`}
                >
                  {message.replace("success:", "").replace("error:", "")}
                </div>
              )}

              <button
                type="submit"
                className="btn-register"
                disabled={loading || pets.length === 0}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Đang đăng ký...
                  </>
                ) : (
                  "📝 Đăng ký Device"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Devices List */}
        <div className="devices-section">
          <div className="section-card">
            <div className="section-header">
              <h2>📋 Devices Đã Đăng Ký</h2>
              <span className="devices-count">{devices.length} device(s)</span>
            </div>

            {devices.length === 0 ? (
              <div className="no-devices">
                <div className="no-devices-icon">📱</div>
                <h3>Chưa có device nào</h3>
                <p>Đăng ký device đầu tiên để bắt đầu theo dõi pet</p>
              </div>
            ) : (
              <div className="devices-grid">
                {devices.map((device) => (
                  <div key={device._id} className="device-card">
                    <div className="device-header">
                      <h3 className="device-id">{device.deviceId}</h3>
                      {getStatusBadge(device.isActive)}
                    </div>

                    <div className="device-info">
                      <div className="info-item">
                        <span className="info-label">Pet:</span>
                        <span className="info-value">
                          {device.petId?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Loài:</span>
                        <span className="info-value species">
                          {device.petId?.species || "Unknown"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Cập nhật:</span>
                        <span className="info-value time">
                          {getLastSeenText(device.lastSeen)}
                        </span>
                      </div>
                    </div>

                    <div className="device-actions">
                      <span className="device-status">
                        {device.isActive
                          ? "Đang gửi dữ liệu"
                          : "Không hoạt động"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions-section">
          <div className="section-card">
            <h2>📖 Hướng Dẫn Sử Dụng</h2>
            <div className="instructions-content">
              <div className="instruction-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Tạo Device ID</h4>
                  <p>
                    Nhấn nút "Tạo ID" để tạo ID ngẫu nhiên hoặc nhập ID từ ESP32
                    của bạn
                  </p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Chọn Pet</h4>
                  <p>
                    Chọn pet mà device sẽ theo dõi từ danh sách pets của bạn
                  </p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Đăng ký Device</h4>
                  <p>Nhấn "Đăng ký Device" để hoàn tất quá trình đăng ký</p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Cấu hình ESP32</h4>
                  <p>Sử dụng Device ID đã đăng ký trong code ESP32 của bạn</p>
                </div>
              </div>
            </div>

            <div className="code-example">
              <h4>Code ESP32 mẫu:</h4>
              <pre className="code-block">
                <code>
                  {`String deviceId = "${deviceId || "ESP32_ABC123XYZ"}";
String apiUrl = "https://pettracking2.onrender.com";

void setup() {
  // Khởi tạo kết nối WiFi
  // Gửi dữ liệu đến server
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceManagement;
