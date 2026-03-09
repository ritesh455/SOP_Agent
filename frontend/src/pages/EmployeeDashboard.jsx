import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");
  const eventSourceRef = useRef(null);

  if (!token) return <Navigate to="/login" />;

  useEffect(() => {
    fetchHistory();
    return () => eventSourceRef.current?.close();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setHistory(data);
  };

  const askQuestion = () => {
    if (!question || loading) return;
    setAnswer("");
    setLoading(true);
    const url = `${import.meta.env.VITE_API_URL}/api/chat/stream?question=${encodeURIComponent(question)}&token=${token}`;
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (e) => setAnswer(prev => prev + e.data + " ");
    eventSource.addEventListener("end", () => {
      eventSource.close();
      setLoading(false);
      fetchHistory();
    });
    eventSource.onerror = () => { eventSource.close(); setLoading(false); };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 shadow-sm">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight text-xl">OpsMind AI</h1>
        <button 
          onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
          className="text-sm font-medium text-slate-600 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200"
        >
          Logout
        </button>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mb-8">
          <textarea
            rows="3"
            placeholder="Ask me anything from the SOPs..."
            className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-lg"
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />
          <button 
            onClick={askQuestion}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:bg-slate-300"
          >
            {loading ? "Analyzing SOPs..." : "Send Question"}
          </button>
        </div>

        {answer && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-2xl mb-8">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">AI Response</h4>
            <p className="text-slate-800 leading-relaxed">{answer}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your Recent Questions</h3>
          {history.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="font-bold text-slate-900 mb-2">{item.question}</p>
              <p className="text-slate-600 text-sm italic">{item.answer}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}