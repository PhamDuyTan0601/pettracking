import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { petDataAPI } from "../../utils/api";
import Navbar from "../../components/Navbar/Navbar";
import "./PetDetail.css";

const PetDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await petDataAPI.getLatest(id);
        setData(res.data.data);
        setError("");
      } catch (err) {
        setError("Không thể tải dữ liệu pet");
        console.error("Error fetching pet data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getActivityIcon = (activityType) => {
    const icons = {
      resting: "🛌",
      walking: "🚶",
      running: "🏃",
      playing: "🎾",
    };
    return icons[activityType] || "❓";
  };

  const getBatteryIcon = (batteryLevel) => {
    if (batteryLevel >= 80) return "🔋";
    if (batteryLevel >= 50) return "🪫";
    if (batteryLevel >= 20) return "⚠️";
    return "🔴";
  };

  return (
    <>
      <Navbar />
      <div className="petdetail-container">
        <div className="petdetail-header">
          <Link to="/dashboard" className="btn-back">
            ← Quay lại Dashboard
          </Link>
          <h1>📊 Chi Tiết Pet</h1>
          <p>Thông tin chi tiết và dữ liệu theo dõi mới nhất</p>
        </div>

        {loading && (
          <div className="loading">
            <div className="loading-spinner-large"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {data ? (
          <div className="petdetail-content">
            <div className="data-grid">
              <div className="data-card location">
                <div className="data-icon">📍</div>
                <div className="data-content">
                  <h3>Vị trí</h3>
                  <p className="data-value">
                    {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
                  </p>
                  <p className="data-label">Tọa độ GPS</p>
                </div>
              </div>

              <div className="data-card activity">
                <div className="data-icon">
                  {getActivityIcon(data.activityType)}
                </div>
                <div className="data-content">
                  <h3>Hoạt động</h3>
                  <p className="data-value">
                    <span className={`activity-badge ${data.activityType}`}>
                      {data.activityType}
                    </span>
                  </p>
                  <p className="data-label">Trạng thái hiện tại</p>
                </div>
              </div>

              <div className="data-card battery">
                <div className="data-icon">
                  {getBatteryIcon(data.batteryLevel)}
                </div>
                <div className="data-content">
                  <h3>Pin</h3>
                  <p className="data-value">{data.batteryLevel}%</p>
                  <p className="data-label">Mức pin hiện tại</p>
                </div>
              </div>

              <div className="data-card speed">
                <div className="data-icon">💨</div>
                <div className="data-content">
                  <h3>Tốc độ</h3>
                  <p className="data-value">{data.speed} m/s</p>
                  <p className="data-label">Tốc độ di chuyển</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h2>📈 Thông Tin Chi Tiết</h2>
              <div className="detail-table">
                <div className="detail-row">
                  <span className="detail-label">Kinh độ:</span>
                  <span className="detail-value">{data.longitude}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Vĩ độ:</span>
                  <span className="detail-value">{data.latitude}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tốc độ:</span>
                  <span className="detail-value">{data.speed} mét/giây</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Hoạt động:</span>
                  <span className="detail-value">
                    <span className={`activity-tag ${data.activityType}`}>
                      {data.activityType}
                    </span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mức pin:</span>
                  <span className="detail-value">
                    <div className="battery-level">
                      <div
                        className="battery-fill"
                        style={{ width: `${data.batteryLevel}%` }}
                      ></div>
                      <span className="battery-text">{data.batteryLevel}%</span>
                    </div>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Cập nhật lúc:</span>
                  <span className="detail-value">
                    {new Date(data.timestamp).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="action-section">
              <Link to="/devices" className="btn-action primary">
                📱 Quản lý Devices
              </Link>
              <Link to="/dashboard" className="btn-action secondary">
                🏠 Về Dashboard
              </Link>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="no-data">
              <div className="no-data-icon">📭</div>
              <h3>Không có dữ liệu</h3>
              <p>Không tìm thấy dữ liệu cho pet này</p>
              <Link to="/dashboard" className="btn-back-dashboard">
                Quay lại Dashboard
              </Link>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default PetDetail;
