
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import PeriodTracking from "./pages/PeriodTracking";
import Settings from "./pages/Settings";
import Setup from "./pages/Setup";

import LearnCycle from "./pages/LearnCycle";
import DoctorGuide from "./pages/DoctorGuide";
import HelpSupport from "./pages/HelpSupport";

import Register from "./pages/Register";
import Login from "./pages/Login";

import AuthGuard from "./components/AuthGuard";

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route element={<AuthGuard />}>
        <Route path="/setup" element={<Setup />} />

        <Route element={<DashboardLayout />}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/period-tracking" element={<PeriodTracking />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/learn-cycle" element={<LearnCycle />} />
          <Route path="/doctor-guide" element={<DoctorGuide />} />
          <Route path="/help-support" element={<HelpSupport />} />
        </Route>
      </Route>
    </Routes>
  );
}
