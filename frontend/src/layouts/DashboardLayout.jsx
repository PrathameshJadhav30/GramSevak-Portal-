import { Menu, X, LogOut, LayoutDashboard, FileText, Bell, Users, Settings, CircleUserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../hooks/useAuth";
import LanguageToggle from "../components/LanguageToggle";

const commonLinks = [
  { label: "dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "services", to: "/services", icon: Settings },
  { label: "notices", to: "/notices", icon: Bell },
  { label: "committee", to: "/committee", icon: Users },
];

const adminOnly = [
  { label: "applications", to: "/applications", icon: FileText },
  { label: "complaints", to: "/complaints", icon: FileText },
];

const villagerOnly = [
  { label: "myApplications", to: "/my-applications", icon: FileText },
  { label: "complaints", to: "/complaints", icon: FileText },
  { label: "profile", to: "/profile", icon: CircleUserRound },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const links = useMemo(() => {
    if (user?.role === "admin") return [...commonLinks, ...adminOnly, { label: "profile", to: "/profile", icon: CircleUserRound }];
    return [...commonLinks, ...villagerOnly];
  }, [user?.role]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="cursor-pointer rounded-md p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-base font-semibold text-slate-800 sm:text-lg">{t("appName")}</h1>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={logout}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut size={16} /> {t("logout")}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <aside className={`${open ? "block" : "hidden"} w-full rounded-xl border border-slate-200 bg-white p-3 lg:block lg:w-64`}>
          <div className="mb-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            {user?.name}
            <div className="text-xs uppercase tracking-wide text-emerald-700">{user?.role}</div>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-emerald-700 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <Icon size={16} /> {t(link.label)}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
