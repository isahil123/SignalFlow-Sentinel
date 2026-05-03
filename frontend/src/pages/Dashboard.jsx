import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTargets } from "../store/targetSlice";
import AddTargetForm from "../components/Sniper/AddTargetForm";
import TargetCard from "../components/Sniper/TargetCard";

const Dashboard = () => {
  const dispatch = useDispatch();
  // These come from your targetSlice.js
  const { items, status } = useSelector((state) => state.targets);

  useEffect(() => {
    // If we haven't loaded data yet, go get it from the backend
    if (status === "idle") {
      dispatch(fetchTargets("user-123"));
    }
  }, [dispatch, status]);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white">Sniper Dashboard</h1>
        <p className="text-gray-400">
          Monitoring real-time stock availability via Redis.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <aside className="lg:col-span-1">
          <AddTargetForm />
        </aside>

        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Active Monitors</h2>
            <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full border border-blue-500/30">
              {items.length} Tracking
            </span>
          </div>

          {status === "loading" && (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {items.map((target) => (
              <TargetCard key={target._id || target.id} target={target} />
            ))}
            {items.length === 0 && status !== "loading" && (
              <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl">
                <p className="text-gray-500">
                  No active snipers. Add a URL to begin.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
