import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoadingScreen from "@/components/LoadingScreen";

import useAuth from "@/hooks/useAuth";
import PrivateRoute from "@/components/PrivateRoute";
import Layout from "@/components/Layout";

const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const Details = lazy(() => import("@/pages/Details"));

const Router = () => {
  const { user } = useAuth();

  const isAuthenticated = !!Object.keys(user).length;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />

          <Route path="/details" element={<Details />} />
          <Route path="/details/:id" element={<Details />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Router;
