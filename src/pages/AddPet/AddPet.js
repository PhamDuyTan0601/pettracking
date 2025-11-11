import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { petsAPI } from "../../utils/api";
import Navbar from "../../components/Navbar/Navbar";
import "./AddPet.css";

const AddPet = () => {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Vui lòng nhập tên pet");
      return;
    }

    if (!formData.species.trim()) {
      setError("Vui lòng nhập loài pet");
      return;
    }

    if (!formData.breed.trim()) {
      setError("Vui lòng nhập giống pet");
      return;
    }

    if (!formData.age || formData.age < 0 || formData.age > 50) {
      setError("Tuổi phải từ 0 đến 50");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await petsAPI.addPet({
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: parseInt(formData.age),
      });

      alert("✅ Thêm pet thành công!");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Lỗi khi thêm pet. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const speciesOptions = [
    "Chó",
    "Mèo",
    "Chim",
    "Thỏ",
    "Hamster",
    "Chuột",
    "Rùa",
    "Cá",
    "Bò sát",
    "Khác",
  ];

  return (
    <>
      <Navbar />
      <div className="addpet-container">
        <div className="addpet-card">
          <div className="addpet-header">
            <h1>➕ Thêm Pet Mới</h1>
            <p>Thêm thông tin pet của bạn để bắt đầu theo dõi</p>
          </div>

          <form onSubmit={handleSubmit} className="addpet-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Tên Pet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Nhập tên pet"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="species" className="form-label">
                  Loài *
                </label>
                <select
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  className="form-select"
                  required
                  disabled={loading}
                >
                  <option value="">Chọn loài</option>
                  {speciesOptions.map((species) => (
                    <option key={species} value={species}>
                      {species}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="breed" className="form-label">
                  Giống *
                </label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ví dụ: Poodle, Bengal, ..."
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="age" className="form-label">
                  Tuổi (năm) *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  max="50"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn-cancel"
                disabled={loading}
              >
                Hủy
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Đang thêm...
                  </>
                ) : (
                  "Thêm Pet"
                )}
              </button>
            </div>
          </form>

          <div className="addpet-tips">
            <h3>💡 Mẹo nhỏ:</h3>
            <ul>
              <li>Đặt tên dễ nhớ cho pet của bạn</li>
              <li>Chọn đúng loài và giống để theo dõi chính xác</li>
              <li>Sau khi thêm pet, hãy đăng ký device để bắt đầu theo dõi</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPet;
