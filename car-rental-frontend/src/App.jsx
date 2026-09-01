import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CarsPage from "./pages/CarsPage";
import CarDetailPage from "./pages/CarDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-mist">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
  path="/admin"
  element={
    <ProtectedAdminRoute>
      <AdminPage />
    </ProtectedAdminRoute>
  }
/>
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-2xl px-5 py-24 text-center">
                <h1 className="font-display text-3xl text-ink">404</h1>
                <p className="mt-2 text-steel">Kjo faqe nuk ekziston.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="border-t border-mist-dim bg-ink py-10 text-mist/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 text-center text-sm">
          <span className="font-display text-lg text-mist">Auto Lana</span>
          <p>Qera makinash, e thjeshtë. © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
