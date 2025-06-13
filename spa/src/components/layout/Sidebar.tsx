
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart4,
  Database,
  FileText,
  Home,
  Layers,
  Brain,
  Settings,
  Users,
  GitMerge,
  Shield,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu(openSubmenu === path ? null : path);
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/decisioning", label: "Decisioning", icon: <Brain size={20} /> },
    { path: "/reports", label: "Reports", icon: <BarChart4 size={20} /> },
    { 
      path: "/query-builder",
      label: "Query Builder", 
      icon: <Layers size={20} />,
      subItems: [
        { path: "/query-builder/sql", label: "SQL" },
        { path: "/query-builder/python", label: "Python" },
      ]
    },
    { path: "/automation", label: "Automation", icon: <GitMerge size={20} /> },
    { path: "/data-sources", label: "Data Sources", icon: <Database size={20} /> },
    { path: "/documents", label: "Documents", icon: <FileText size={20} /> },
    { path: "/users", label: "Users", icon: <Users size={20} /> },
    { path: "/roles", label: "Roles & Permissions", icon: <Shield size={20} /> },
    { path: "/settings", label: "Settings", icon: <Settings size={20} /> },
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
            <span className="text-insight">Insight</span>One
          </h1>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <span className="text-insight text-xl font-bold">I1</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <React.Fragment key={item.path}>
              <li>
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
              {!collapsed && item.subItems && isPathActive(item.path) && (
                <li className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                        location.pathname === subItem.path
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground opacity-80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
