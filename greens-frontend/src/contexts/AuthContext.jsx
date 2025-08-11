import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const companyData = localStorage.getItem("company");

    if (token && (userData || companyData)) {
      try {
        let parsedData;
        if (userData) {
          parsedData = JSON.parse(userData);
          parsedData.user_type = parsedData.user_type || "client";
        } else if (companyData) {
          parsedData = JSON.parse(companyData);
          parsedData.user_type = "contractor";
        }
        setUser(parsedData);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error parsing user/company data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("company");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      const { user: userData, token, user_type } = response.data;

      localStorage.setItem("token", token);

      if (user_type === "contractor") {
        localStorage.setItem("company", JSON.stringify(userData));
        userData.user_type = "contractor";
      } else {
        localStorage.setItem("user", JSON.stringify(userData));
        userData.user_type = userData.user_type || "client";
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Dostosuj dane do struktury API
      const registrationData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        phone: userData.phone || null,
        city: userData.city || null,
        address: userData.address || null,
        user_type: userData.user_type || "client",
      };

      console.log("Sending registration data:", registrationData);

      const response = await api.post("/register", registrationData);
      const { user: newUser, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      newUser.user_type = "client";
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const registerCompany = async (companyData) => {
    try {
      // Dostosuj dane firmy do struktury API
      const registrationData = {
        company_name: companyData.company_name || companyData.name,
        email: companyData.email,
        password: companyData.password,
        password_confirmation: companyData.password_confirmation,
        phone: companyData.phone || null,
        city: companyData.city || null,
        address: companyData.address || null,
        company_description: companyData.company_description || null,
        website: companyData.website || null,
        user_type: "contractor",
      };

      console.log("Sending company registration data:", registrationData);

      const response = await api.post("/register-company", registrationData);
      const { company, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("company", JSON.stringify(company));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      company.user_type = "contractor";
      setUser(company);
      return company;
    } catch (error) {
      console.error("Company registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("company");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  const isAdmin = () => {
    return user?.is_admin === true || user?.is_admin === 1;
  };

  const isContractor = () => {
    return user?.user_type === "contractor";
  };

  const isClient = () => {
    return user?.user_type === "client" || (!user?.user_type && user?.id);
  };

  const value = {
    user,
    loading,
    login,
    register,
    registerCompany,
    logout,
    isAdmin,
    isContractor,
    isClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
