import { useEffect, useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import AdminSOPUpload from "../pages/AdminSOPUpload";
import AddEmployeeForm from "../components/AddEmployeeForm";

export default function AdminDashboard() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/history/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setHistory);
  }, [token]);

  // Filter history based on employee ID
  const filteredHistory = useMemo(() => {
    return history.filter(item =>
      item.employeeId
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <h1 className="text-2xl font-bold mb-10 text-blue-400">OpsMind</h1>
        <nav className="flex-1 space-y-2">
          <div className="bg-slate-800 p-3 rounded-lg text-white font-medium">
            Dashboard
          </div>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="mt-auto bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-3 rounded-lg transition-all"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header>
            <h2 className="text-3xl font-bold text-slate-900">
              Admin Control Panel
            </h2>
            <p className="text-slate-500 text-sm">
              Manage employees and knowledge base indexing.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <AddEmployeeForm />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <AdminSOPUpload />
            </div>
          </div>

          {/* Global Chat History */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h3 className="font-bold text-slate-800">
                Global Chat History
              </h3>

              {/* 🔍 Search Bar */}
              <input
                type="text"
                placeholder="Search by Employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-blue-600 uppercase">
                        Emp ID: {item.employeeId}
                      </span>
                      <span className="text-slate-400">
                        {new Date(item.askedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      Q: {item.question}
                    </p>
                    <p className="text-sm text-slate-600">
                      A: {item.answer}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No matching records found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
