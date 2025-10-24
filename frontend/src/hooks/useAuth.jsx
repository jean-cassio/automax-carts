import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";

const useAuth = () => {
  const { user, error, loading, login, logout } = useContext(AuthContext);

  return {
    user,
    error,
    loading,
    login,
    logout,
  };
};

export default useAuth;
