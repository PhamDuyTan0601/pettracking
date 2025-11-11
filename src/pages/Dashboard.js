import React, { useEffect, useState, useCallback } from "react";
import { getPetsByUser, getAllPetData, deletePet } from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import RealTimeMap from "../components/RealTimeMap";
import DashboardStats from "../components/DashboardStats";
import AlertSystem from "../components/AlertSystem";

function Dashboard() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petData, setPetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Sử dụng useCallback để memoize hàm fetchPets
  const fetchPets = useCallback(async () => {
    try {
      const res = await getPetsByUser();
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
  }, []); // Không có dependencies vì không sử dụng state/props bên ngoài

  const fetchPetData = async (petId) => {
    try {
      const res = await getAllPetData(petId);
      const data = res.data.data || [];
      setPetData(data);

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
  }, [fetchPets]); // Thêm fetchPets vào dependencies

  // ... phần còn lại giữ nguyên
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
      await deletePet(petId);
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
      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* ... phần JSX giữ nguyên */}
      </div>
    </>
  );
}

export default Dashboard;
