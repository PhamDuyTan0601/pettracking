// Format date
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("vi-VN");
};

// Calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
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

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Get activity config
export const getActivityConfig = (activityType) => {
  const config = {
    resting: { color: "activity resting", icon: "🛌", label: "Nghỉ ngơi" },
    walking: { color: "activity walking", icon: "🚶", label: "Đang đi" },
    running: { color: "activity running", icon: "🏃", label: "Đang chạy" },
    playing: { color: "activity playing", icon: "🎾", label: "Đang chơi" },
  };
  return (
    config[activityType] || {
      color: "activity resting",
      icon: "❓",
      label: "Không xác định",
    }
  );
};

// Check if token exists and is valid
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  // Simple check - in production you might want to decode JWT and check expiry
  return true;
};
