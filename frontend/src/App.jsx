import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Layout/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx"; // Make sure this is .jsx
function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 p-10">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route
              path="/settings"
              element={
                <div className="p-6 text-2xl">Settings coming soon...</div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
