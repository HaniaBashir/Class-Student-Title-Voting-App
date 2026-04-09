import { LockKeyhole } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { adminPassword } from "../lib/supabase";

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminPassword) {
      setError("Set VITE_ADMIN_PASSWORD in your environment before using the admin dashboard.");
      return;
    }

    if (password !== adminPassword) {
      setError("Incorrect password. Please try again.");
      return;
    }

    sessionStorage.setItem("farewell_admin_ok", "true");
    navigate("/admin/dashboard");
  }

  return (
    <section className="mx-auto max-w-lg">
      <div className="section-shell p-8 sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Admin access</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This route is intentionally hidden for demo use. Enter the admin password from your
          environment variables to see live results.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-accent-500/10"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full">
            Open dashboard
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;
