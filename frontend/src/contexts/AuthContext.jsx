import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  user: {},
  error: "",
  loading: false,
  login: ({ email = "", password = "" }) => {}, // eslint-disable-line no-unused-vars
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const login = ({ email, password }) => {
    if (!email || !password) {
      setError("Email e Senha devem ser preenchidos.");

      return { success: false };
    }

    setLoading(true);

    try {
      if ("admin@email.com" !== email || "*Abc123" !== password) {
        throw new Error();
      }

      const userData = { name: "Admin", email };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch {
      setError("Email ou Senha incorretos.");
      setUser({});

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setLoading(true);

    try {
      localStorage.removeItem("user");
      setUser({});
      navigate("/login");
    } catch {
      setError("Erro ao fazer Logout");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const getSession = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));

      try {
        if (!Object.keys(userData).length) throw new Error();
        setUser(userData);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, [logout]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  return (
    <AuthContext.Provider value={{ user, error, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
