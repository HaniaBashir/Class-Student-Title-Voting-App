import { Navigate, Route, Routes } from "react-router-dom";
import AdminGuard from "./components/AdminGuard";
import AdminShell from "./components/AdminShell";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminExportPage from "./pages/AdminExportPage";
import AdminLogin from "./pages/AdminLogin";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import AdminTitlesPage from "./pages/AdminTitlesPage";
import AdminUtilitiesPage from "./pages/AdminUtilitiesPage";
import LandingPage from "./pages/LandingPage";
import SuccessPage from "./pages/SuccessPage";
import VotingPage from "./pages/VotingPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/vote" element={<VotingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<AdminGuard />}>
          <Route element={<AdminShell />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/titles" element={<AdminTitlesPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/export" element={<AdminExportPage />} />
            <Route path="/admin/utilities" element={<AdminUtilitiesPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
