
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Shield,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/users", label: "Users", icon: <Users size={20} /> },
    { path: "/roles", label: "Roles & Permissions", icon: <Shield size={20} /> },
  ];

  const isPathActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`bg-sidebar h-screen flex flex-col ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white">
            Echo App
          </h1>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <span className="text-xl font-bold text-white">EA</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2.5 transition-colors ${
                  isPathActive(item.path)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
