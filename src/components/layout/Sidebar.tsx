import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  List,
  UserPlus,
  UserCheck,
  MessageCircle,
  Activity,
  Wallet,
  BadgePercent,
  CreditCard,
  Settings,
  Building2,
  Users,
  Bell,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  children?: {
    title: string;
    icon: React.ElementType;
    path: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Manajemen Dokter",
    icon: UserRound,
    children: [
      { title: "List Dokter", icon: List, path: "/dokter" },
      { title: "Invite Dokter", icon: UserPlus, path: "/dokter/invite" },
      { title: "Request Join", icon: UserCheck, path: "/dokter/request" },
    ],
  },
  {
    title: "Konsultasi",
    icon: MessageCircle,
    children: [
      { title: "Monitoring", icon: Activity, path: "/konsultasi/monitoring" },
    ],
  },
  {
    title: "Keuangan",
    icon: Wallet,
    children: [
      {
        title: "Margin & Diskon",
        icon: BadgePercent,
        path: "/keuangan/margin",
      },
      { title: "Wallet", icon: CreditCard, path: "/keuangan/wallet" },
    ],
  },
  {
    title: "Pengaturan",
    icon: Settings,
    children: [
      { title: "Profile Faskes", icon: Building2, path: "/pengaturan/profile" },
      { title: "Manajemen User", icon: Users, path: "/pengaturan/users" },
    ],
  },
  {
    title: "Notifikasi",
    icon: Bell,
    path: "/notifikasi",
  },
];

const SidebarItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;
  const isChildActive =
    hasChildren &&
    item.children?.some((child) => location.pathname === child.path);
  const isActiveStandalone = item.path
    ? location.pathname === item.path
    : false;

  // Parent is active if it has children and one of them is active, or if it's a standalone active item
  const isParentActive = isChildActive || isActiveStandalone;

  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  const toggleDropdown = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const baseClasses =
    "flex items-center px-3 py-2.5 transition-all duration-200 cursor-pointer mb-1 rounded-full";
  const inactiveClasses = "text-text-muted hover:bg-surface-muted";
  const activeParentClasses = "bg-primary text-white font-medium";
  const activeChildClasses = "bg-primary-light text-primary font-medium";

  const renderContent = (active: boolean, isChild: boolean = false) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-3">
        <item.icon
          className={`w-4 h-4 shrink-0 ${active ? (isChild ? "text-primary" : "text-white") : "text-text-muted"}`}
        />
        <span className="text-sm">{item.title}</span>
      </div>
      {hasChildren &&
        (isOpen ? (
          <ChevronUp
            className={`w-3.5 h-3.5 ${active ? "text-white" : "text-text-muted"}`}
          />
        ) : (
          <ChevronDown
            className={`w-3.5 h-3.5 ${active ? "text-white" : "text-text-muted"}`}
          />
        ))}
    </div>
  );

  if (hasChildren) {
    return (
      <div>
        <div
          onClick={toggleDropdown}
          className={`${baseClasses} ${isChildActive ? activeParentClasses : isOpen ? "text-text bg-surface-muted" : inactiveClasses}`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <item.icon
                className={`w-4 h-4 shrink-0 ${isChildActive ? "text-white" : "text-text-muted"}`}
              />
              <span className="text-sm">{item.title}</span>
            </div>
            {isOpen ? (
              <ChevronUp
                className={`w-3.5 h-3.5 ${isChildActive ? "text-white" : "text-text-muted"}`}
              />
            ) : (
              <ChevronDown
                className={`w-3.5 h-3.5 ${isChildActive ? "text-white" : "text-text-muted"}`}
              />
            )}
          </div>
        </div>
        {isOpen && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  `${baseClasses} pl-8 ${isActive ? activeChildClasses : inactiveClasses}`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center space-x-3">
                    <child.icon
                      className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-text-muted"}`}
                    />
                    <span className="text-sm">{child.title}</span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path!}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeParentClasses : inactiveClasses}`
      }
    >
      {({ isActive }) => (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <item.icon
              className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-text-muted"}`}
            />
            <span className="text-sm">{item.title}</span>
          </div>
        </div>
      )}
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-56 h-screen fixed left-0 top-0 bg-surface dark:bg-dark-surface flex flex-col z-50">
      {/* Header */}
      <div className="p-6 flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        <span className="text-lg font-bold text-text tracking-tight uppercase">
          Nuju Sehat
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto pt-4 custom-scrollbar">
        {menuItems.map((item, index) => (
          <div
            key={item.title}
            className={
              index > 0 && !menuItems[index - 1].children ? "mt-1" : ""
            }
          >
            <SidebarItem item={item} />
            {item.children && index < menuItems.length - 1 && (
              <div className="mt-4" />
            )}
          </div>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 mt-auto border-t border-surface-border dark:border-dark-border">
        <div className="flex items-center p-2 space-x-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold">
            {user?.email?.[0].toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate">
              {user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
              {user?.role || "Faskes Admin"}
            </p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
