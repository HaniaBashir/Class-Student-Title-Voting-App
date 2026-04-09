import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
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
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
