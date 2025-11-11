import React, { useState, useEffect } from "react";
import { getActivityConfig } from "../../utils/helpers";
import "./DashboardStats.css";

const DashboardStats = ({ petData, selectedPet }) => {
  const [stats, setStats] = useState({
    batteryLevel: 0,
    lastUpdate: null,
    activityType: "unknown",
  });

  useEffect(() => {
    if (petData && petData.length > 0) {
      const latestData = petData[0];
      setStats({
        batteryLevel: latestData?.batteryLevel || 0,
        lastUpdate: latestData?.timestamp,
        activityType: latestData?.activityType || "unknown",
      });
    }
  }, [petData]);

  const StatCard = ({ title, value, unit, icon, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">
          {value} {unit && <span className="stat-unit">{unit}</span>}
        </p>
      </div>
    </div>
  );

  const ActivityBadge = ({ activityType }) => {
    const config = getActivityConfig(activityType);

    return (
      <div className={`activity-badge ${config.color}`}>
        <span className="activity-icon">{config.icon}</span>
        <span className="activity-label">{config.label}</span>
      </div>
    );
  };

  return (
    <div className="dashboard-stats">
      <div className="stats-grid">
        {/* Pin */}
        <StatCard
          title="Mức pin"
          value={stats.batteryLevel}
          unit="%"
          icon="🔋"
          color="battery"
        />

        {/* Trạng thái hoạt động */}
        <div className="stat-card activity">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-title">Trạng thái</h3>
            <div className="stat-activity">
              <ActivityBadge activityType={stats.activityType} />
            </div>
          </div>
        </div>

        {/* Cập nhật cuối */}
        <StatCard
          title="Cập nhật cuối"
          value={
            stats.lastUpdate
              ? new Date(stats.lastUpdate).toLocaleTimeString()
              : "N/A"
          }
          unit=""
          icon="🕐"
          color="time"
        />

        {/* Tốc độ */}
        <StatCard
          title="Tốc độ"
          value={petData?.[0]?.speed || 0}
          unit="m/s"
          icon="💨"
          color="speed"
        />
      </div>
    </div>
  );
};

export default DashboardStats;
