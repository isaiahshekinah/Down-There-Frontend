import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";

import { API_BASE_URL } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const [setupCompleted, setSetupCompleted] = useState(false);
  const [setupLoading, setSetupLoading] = useState(true);
  const [setupError, setSetupError] = useState("");

  const refreshSetupStatus = useCallback(async (currentToken) => {
    const activeToken = currentToken || token;

    if (!activeToken) {
      setSetupCompleted(false);
      setSetupLoading(false);
      return;
    }

    try {
      setSetupLoading(true);
      setSetupError("");

      const response = await fetch(
        `${API_BASE_URL}/cycle/settings`,
        {
          headers: {
            Authorization: `Bearer ${activeToken}`
          }
        }
      );

      if (response.status === 404) {
        setSetupCompleted(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to check your cycle setup."
        );
      }

      const settings = data.settings || data;

      const savedCycleLength =
        settings.cycleLength ??
        settings.averageCycleLength ??
        settings.average_cycle_length;

      const savedPeriodLength =
        settings.periodLength ??
        settings.averagePeriodLength ??
        settings.average_period_length;

      setSetupCompleted(
        savedCycleLength != null &&
        savedPeriodLength != null
      );

    } catch (error) {
      setSetupError(error.message);
    } finally {
      setSetupLoading(false);
    }
  }, [token]);


  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setLoggedIn(true);
        refreshSetupStatus(savedToken);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, [refreshSetupStatus]);

  function saveSession(data) {
    setSetupLoading(true);
    setSetupCompleted(false);
    setSetupError("");

    setToken(data.token);
    setUser(data.user);
    setLoggedIn(true);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));


    refreshSetupStatus(data.token);
  }

  async function register(username, email, password) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Registration failed"
        };
      }

      saveSession(data);
      return { success: true };

    } catch {
      return {
        success: false,
        message: "Unable to connect to the server. Please try again."
      };
    }
  }

  async function login(email, password) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Login failed"
        };
      }

      saveSession(data);
      return { success: true };

    } catch {
      return {
        success: false,
        message: "Unable to connect to the server. Please try again."
      };
    }
  }

  function completeSetup() {
    setSetupCompleted(true);
    setSetupError("");
  }

  function logout() {
    setToken("");
    setUser(null);
    setLoggedIn(false);
    setSetupCompleted(false);
    setSetupError("");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        user,
        token,
        loading,
        setupCompleted,
        setupLoading,
        setupError,
        refreshSetupStatus: () => refreshSetupStatus(token),
        completeSetup,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}