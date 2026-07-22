import {
  Bell,
  Bot,
  BriefcaseBusiness,
  ClipboardCheck,
  FileWarning,
  Gauge,
  GitBranch,
  GraduationCap,
  Handshake,
  Menu,
  Moon,
  Network,
  PlugZap,
  Settings,
  ShieldCheck,
  SunMedium,
  UsersRound,
  X
} from "lucide-react";
import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useState } from "react";
import type { NotificationItem } from "../api/client";

export type ViewKey =
  | "Command"
  | "Live Ops"
  | "Onboarding"
  | "Board"
  | "SOC Ops"
  | "Integrations"
  | "Support"
  | "Settings"
  | "Tabletop"
  | "Scenarios"
  | "Threat AI"
  | "Training"
  | "Standards"
  | "Reports"
  | "Admin";

const navItems: Array<{ label: ViewKey; icon: typeof Gauge }> = [
  { label: "Command", icon: Gauge },
  { label: "Live Ops", icon: BriefcaseBusiness },
  { label: "Onboarding", icon: ClipboardCheck },
  { label: "Board", icon: ShieldCheck },
  { label: "SOC Ops", icon: Network },
  { label: "Integrations", icon: PlugZap },
  { label: "Support", icon: Handshake },
  { label: "Settings", icon: Settings },
  { label: "Tabletop", icon: UsersRound },
  { label: "Scenarios", icon: GitBranch },
  { label: "Threat AI", icon: Bot },
  { label: "Training", icon: GraduationCap },
  { label: "Standards", icon: ShieldCheck },
  { label: "Reports", icon: FileWarning },
  { label: "Admin", icon: Settings }
];

interface ShellProps extends PropsWithChildren {
  activeView: ViewKey;
  onViewChange: (view: ViewKey) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
}

export function Shell({ children, activeView, onViewChange, notifications, onMarkNotificationRead }: ShellProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light" ? saved : "light";
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const activeDescription = useMemo(() => {
    const descriptions: Record<ViewKey, string> = {
      Command: "Live simulation command center",
      "Live Ops": "Enterprise launch and production operations",
      Onboarding: "Customer launch wizard",
      Board: "Executive board portal",
      "SOC Ops": "Security operations response view",
      Integrations: "Connection configuration center",
      Support: "Customer success and support center",
      Settings: "Organization and platform settings",
      Tabletop: "Executive tabletop exercise room",
      Scenarios: "Scenario builder and playbooks",
      "Threat AI": "Adaptive AI facilitator controls",
      Training: "Cybersecurity training and yearly growth",
      Standards: "Framework mapping and coverage",
      Reports: "After-action intelligence",
      Admin: "User control and platform settings"
    };
    return descriptions[activeView];
  }, [activeView]);

  function switchView(view: ViewKey) {
    onViewChange(view);
    setMobileSidebarOpen(false);
    if (view === "Admin") {
      window.history.replaceState(null, "", "/admin");
    } else {
      window.history.replaceState(null, "", "/");
    }
  }

  return (
    <div className="min-h-screen bg-cloud text-ink dark:bg-[#101418] dark:text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-20 border-r border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:flex lg:flex-col lg:items-center lg:py-5">
        <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white dark:bg-white dark:text-ink" title="Platform">
          <Network size={22} />
        </div>
        <nav className="flex flex-1 flex-col gap-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={
                activeView === item.label
                  ? "group flex h-11 w-11 items-center justify-center rounded-lg bg-signal text-white transition"
                  : "group flex h-11 w-11 items-center justify-center rounded-lg text-ink/60 transition hover:bg-signal/10 hover:text-signal dark:text-white/60"
              }
              title={item.label}
              onClick={() => switchView(item.label)}
            >
              <item.icon size={20} />
            </button>
          ))}
        </nav>
      </aside>
      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-black/45"
            aria-label="Close navigation overlay"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-80 max-w-[86vw] flex-col border-r border-black/10 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-[#101418]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white dark:bg-white dark:text-ink">
                  <Network size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Resilience</p>
                  <p className="text-xs text-ink/55 dark:text-white/55">Mobile workspace menu</p>
                </div>
              </div>
              <button className="icon-button" title="Close sidebar" onClick={() => setMobileSidebarOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className={activeView === item.label ? "mobile-nav-item-active" : "mobile-nav-item"}
                  onClick={() => switchView(item.label)}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
      <main className="lg:pl-20">
        <header className="sticky top-0 z-20 border-b border-black/10 bg-cloud/85 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#101418]/85 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-signal">Sovereign Health Network</p>
              <h1 className="text-xl font-semibold sm:text-2xl">{activeView} Workspace</h1>
              <p className="text-xs text-ink/55 dark:text-white/55">{activeDescription}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="icon-button md:hidden" title="Open sidebar" onClick={() => setMobileSidebarOpen(true)}>
                <Menu size={18} />
              </button>
              <div className="hidden gap-1 rounded-lg border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-white/5 md:flex">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className={activeView === item.label ? "tab-button-active" : "tab-button"}
                    onClick={() => switchView(item.label)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button className="icon-button" title="Toggle theme" onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}>
                {theme === "dark" ? <Moon size={18} /> : <SunMedium size={18} />}
              </button>
              <button className="icon-button relative" title="Notifications" onClick={() => setNotificationsOpen((open) => !open)}>
                <Bell size={18} />
                {notifications.some((notification) => !notification.read) ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-ember" /> : null}
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-white/5 md:hidden">
            <span className="font-semibold">{activeView}</span>
            <button className="inline-flex items-center gap-2 text-signal" onClick={() => setMobileSidebarOpen(true)}>
              <Menu size={15} />
              Open sidebar
            </button>
          </div>
          {notificationsOpen ? (
            <div className="absolute right-4 top-[76px] z-30 w-[min(360px,calc(100vw-2rem))] rounded-lg border border-black/10 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#161b20]">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Notifications</p>
                <button className="text-xs text-signal" onClick={() => setNotificationsOpen(false)}>
                  Close
                </button>
              </div>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div key={notification.title} className="rounded-lg border border-black/10 bg-cloud p-3 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold">{notification.title}</p>
                      {!notification.read ? (
                        <button className="text-xs text-signal" onClick={() => onMarkNotificationRead(notification.id)}>
                          Mark read
                        </button>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{notification.detail}</p>
                    <p className="mt-2 text-[11px] font-semibold uppercase text-ember">{notification.severity}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </header>
        {children}
      </main>
    </div>
  );
}
