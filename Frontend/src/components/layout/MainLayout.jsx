import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Mobile Header purely for spacing (if Sidebar doesn't have an absolute persistent header) */}
        <header className="flex h-16 shrink-0 items-center bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60 px-4 shadow-sm md:hidden">
          <span className="ml-12 text-lg font-semibold text-emerald-600">
            Psykin
          </span>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
