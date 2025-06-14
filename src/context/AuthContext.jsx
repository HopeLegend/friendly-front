// 1. Обновленный AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { api } from "../api/axios";

const AuthContext = createContext();
console.log("API URL:", api.defaults.baseURL);
export const AuthProvider = ({ children }) => {
  const [tokenData, setTokenData] = useState(null);
  const [userData, setUserData] = useState(null); // Новое состояние для данных пользователя
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // Состояние загрузки

  // Функция для загрузки данных пользователя
  const fetchUserData = async () => {
    try {
      const { data } = await api.get("/profile/get_information", {
         params: {t: Date.now()},
       });
      setUserData(data);
      return data;
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setTokenData(decoded);
            
            // Загружаем данные пользователя по ID из токена
            await fetchUserData(decoded.user_id);
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const register = async (credentials) => {
    try {
      const { data } = await api.post(`/auth/registration`, {email: credentials.email, password: credentials.password});
    } catch (error) {
      throw error;
    }
  };
  const login = async (credentials) => {
    try {
      const { data } = await api.post(`/auth/login`, credentials);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      const decoded = jwtDecode(data.access_token);
      setTokenData(decoded);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
      await fetchUserData(); // Загружаем данные после логина
    } catch (error) {
      throw error;
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firebaseRegistered");
    setToken(null);
    setTokenData(null);
    setUserData(null); // Очищаем данные при выходе
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ 
      tokenData, 
      userData,
      token, 
      loading,
      register,
      login, 
      logout,
      fetchUserData // Можно обновлять данные при необходимости
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);