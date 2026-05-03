import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Activity, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <nav className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col gap-4">
      <h1 className="text-xl font-black mb-8 text-blue-500 tracking-tighter">
        SIGNALFLOW
      </h1>

      <Link
        to="/"
        className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition font-medium"
      >
        <LayoutDashboard size={20} /> Dashboard
      </Link>

      <Link
        to="/history"
        className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition font-medium"
      >
        <Activity size={20} /> History
      </Link>

      <Link
        to="/settings"
        className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition font-medium"
      >
        <Settings size={20} /> Settings
      </Link>
    </nav>
  );
};

export default Sidebar;
