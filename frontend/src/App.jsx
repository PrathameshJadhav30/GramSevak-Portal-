import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ApplicationsPage = lazy(() => import("./pages/ApplicationsPage"));
const ComplaintsPage = lazy(() => import("./pages/ComplaintsPage"));
const NoticesPage = lazy(() => import("./pages/NoticesPage"));
const CommitteePage = lazy(() => import("./pages/CommitteePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function LandingRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function AppFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
      <Suspense fallback={<AppFallback />}>
        <Routes>
          <Route path="/" element={<LandingRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/committee" element={<CommitteePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/applications" element={<ApplicationsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={["villager"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/my-applications" element={<ApplicationsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={["admin", "villager"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/complaints" element={<ComplaintsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
