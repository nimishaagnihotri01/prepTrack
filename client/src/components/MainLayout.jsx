import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AIAssistant from "./AIAssistant";

import {
  LayoutDashboard,
  BookOpen,
  User,
  Menu,
} from "lucide-react";

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // ⭐ NAV ITEMS
  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "My Learning",
      icon: BookOpen,
      path: "/learning",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#eef3f9] to-[#dde6f1]">

      {/* 🔥 ULTRA PREMIUM SIDEBAR */}
      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-[#0f2a44] to-[#1f4e79] text-white flex flex-col p-6 transition-all duration-300 shadow-2xl relative`}
      >
        {/* 🔝 TOP */}
        <div className="flex justify-between items-center mb-12">
          {!collapsed && (
            <h1 className="text-xl font-bold tracking-wide">
              PrepTrack
            </h1>
          )}

          <Menu
            className="cursor-pointer hover:scale-110 transition"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* ⭐ NAVIGATION */}
        <nav className="flex flex-col gap-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300
                ${
                  active
                    ? "bg-white/15 backdrop-blur-md shadow-lg"
                    : "opacity-70 hover:opacity-100 hover:bg-white/10"
                }`}
              >
                {/* ⭐ ACTIVE LEFT BAR */}
                {active && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r"></span>
                )}

                <Icon
                  size={20}
                  className={`transition ${
                    active
                      ? "scale-110 text-white"
                      : "group-hover:scale-110"
                  }`}
                />

                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        {/* 🤖 AI ASSISTANT — ALWAYS AT BOTTOM */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <AIAssistant collapsed={collapsed} />
        </div>

        {/* 🌌 GLOW EFFECT */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-400 opacity-20 blur-[120px] rounded-full"></div>
      </div>

      {/* 🧊 PAGE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
