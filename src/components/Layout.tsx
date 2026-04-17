import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-halo text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
              Class Voting Platform
            </p>
            <h1 className="mt-2 text-lg font-semibold text-slate-900">
              Reusable farewell titles manager
            </h1>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
