import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddPet from "./pages/AddPet/AddPet";
import PetDetail from "./pages/PetDetail/PetDetail";
import DeviceManagement from "./pages/DeviceManagement/DeviceManagement";
import ToastConfig from "./components/ToastConfig/ToastConfig";
import "./styles/globals.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-pet" element={<AddPet />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/devices" element={<DeviceManagement />} />
        </Routes>
      </BrowserRouter>
      <ToastConfig />
    </>
  );
}

export default App;
