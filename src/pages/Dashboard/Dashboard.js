import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { petsAPI, petDataAPI } from "../../utils/api";
import Navbar from "../../components/Navbar/Navbar";
import RealTimeMap from "../../components/RealTimeMap/RealTimeMap";
import DashboardStats from "../../components/DashboardStats/DashboardStats";
import AlertSystem from "../../components/AlertSystem/AlertSystem";
import "./Dashboard.css";

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petData, setPetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchPets = useCallback(async () => {
    try {
      const res = await petsAPI.getMyPets();
      const petsData = res.data.pets || [];
      setPets(petsData);

      if (petsData.length > 0) {
        setSelectedPet(petsData[0]);
        await fetchPetData(petsData[0]._id);
      }
    } catch (err) {
      console.error("Error loading pets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPetData = async (petId) => {
    try {
      const res = await petDataAPI.getAll(petId);
      const data = res.data.data || [];
      setPetData(data);

      // Sample data for demo if no real data
      if (data.length === 0) {
        const sampleData = [
          {
            latitude: 10.8231,
            longitude: 106.6297,
            activityType: "walking",
            batteryLevel: 85,
            speed: 1.2,
            timestamp: new Date().toISOString(),
          },
        ];
        setPetData(sampleData);
      }
    } catch (err) {
      console.error("Error fetching pet data:", err);
      // Fallback sample data
      const sampleData = [
        {
          latitude: 10.8231,
          longitude: 106.6297,
          activityType: "walking",
          batteryLevel: 85,
          speed: 1.2,
          timestamp: new Date().toISOString(),
        },
      ];
      setPetData(sampleData);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handlePetSelect = async (pet) => {
    setSelectedPet(pet);
    await fetchPetData(pet._id);
  };

  const handleDeletePet = async (petId, petName) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa pet "${petName}"? Hành động này không thể hoàn tác.`
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await petsAPI.deletePet(petId);
      const updatedPets = pets.filter((pet) => pet._id !== petId);
      setPets(updatedPets);

      if (selectedPet && selectedPet._id === petId) {
        if (updatedPets.length > 0) {
          setSelectedPet(updatedPets[0]);
          await fetchPetData(updatedPets[0]._id);
        } else {
          setSelectedPet(null);
          setPetData([]);
        }
      }

      alert(`✅ Đã xóa pet "${petName}" thành công!`);
    } catch (error) {
      console.error("Error deleting pet:", error);
      let errorMessage = "Lỗi không xác định";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Không tìm thấy pet để xóa.";
        } else if (error.response.status === 403) {
          errorMessage = "Bạn không có quyền xóa pet này.";
        } else {
          errorMessage =
            error.response.data?.message ||
            `Lỗi server: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server.";
      } else {
        errorMessage = error.message;
      }

      alert(`❌ Lỗi khi xóa pet: ${errorMessage}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>🐾 Dashboard Theo Dõi Pet</h1>
          <Link to="/add-pet" className="btn-add-pet">
            + Thêm Pet Mới
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner-large"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="no-pets">
            <div className="no-pets-icon">🐕</div>
            <h3>Chưa có pet nào</h3>
            <p>Thêm pet đầu tiên của bạn để bắt đầu theo dõi!</p>
            <Link to="/add-pet" className="btn-add-first-pet">
              Thêm Pet Đầu Tiên
            </Link>
          </div>
        ) : (
          <>
            {/* Pet Selector */}
            <div className="pet-selector">
              <label htmlFor="pet-select">Chọn Pet để theo dõi:</label>
              <select
                id="pet-select"
                value={selectedPet?._id || ""}
                onChange={(e) => {
                  const pet = pets.find((p) => p._id === e.target.value);
                  if (pet) handlePetSelect(pet);
                }}
                className="form-select"
              >
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} - {pet.species}
                  </option>
                ))}
              </select>
            </div>

            {selectedPet && (
              <>
                {/* Stats Cards */}
                <DashboardStats petData={petData} selectedPet={selectedPet} />

                {/* Map and Alerts Grid */}
                <div className="dashboard-grid">
                  <div className="map-section">
                    <div className="section-header">
                      <h2>🗺️ Bản Đồ Theo Dõi Thời Gian Thực</h2>
                      <Link
                        to={`/pet/${selectedPet._id}`}
                        className="btn-view-details"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                    <RealTimeMap petData={petData} selectedPet={selectedPet} />
                  </div>

                  <div className="alerts-section">
                    <AlertSystem petData={petData} selectedPet={selectedPet} />
                  </div>
                </div>

                {/* Pet List */}
                <div className="pet-list-section">
                  <div className="section-header">
                    <h2>📋 Danh Sách Pets Của Bạn</h2>
                    <small>Tổng số: {pets.length} pet(s)</small>
                  </div>
                  <div className="pets-grid">
                    {pets.map((pet) => (
                      <div
                        key={pet._id}
                        className={`pet-card ${
                          selectedPet?._id === pet._id ? "active" : ""
                        }`}
                      >
                        <div
                          className="pet-info"
                          onClick={() => handlePetSelect(pet)}
                        >
                          <h4>{pet.name}</h4>
                          <p>
                            {pet.species} • {pet.breed}
                          </p>
                          <p>{pet.age} tuổi</p>
                          <div className="pet-status">
                            <span className="status-dot"></span>
                            <span>Đang hoạt động</span>
                          </div>
                        </div>
                        <div className="pet-actions">
                          <button
                            onClick={() => handleDeletePet(pet._id, pet.name)}
                            disabled={deleting}
                            className="btn-delete"
                            title="Xóa pet"
                          >
                            {deleting ? "⏳" : "🗑️"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
