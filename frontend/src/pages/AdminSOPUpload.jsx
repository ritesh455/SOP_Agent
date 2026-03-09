import { useState } from "react";

export default function AdminSOPUpload() {
  const [files, setFiles] = useState(null);
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");

  const uploadSOP = async () => {
    if (!files || files.length === 0) return;

    setStatus("uploading");
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("partial");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">SOP Knowledge Base</h3>
      </div>

      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50 transition-all group relative">
        <input
          type="file"
          accept="application/pdf"
          multiple
          id="sop-file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={e => setFiles(e.target.files)}
        />
        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <p className="text-slate-600 font-semibold">
            {files ? `${files.length} PDFs ready for indexing` : "Drop SOP documents here"}
          </p>
          <p className="text-xs text-slate-400">PDF formats only. Max 2MB per file.</p>
        </div>
      </div>

      <button 
        onClick={uploadSOP} 
        disabled={!files || status === "uploading"}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:bg-slate-200"
      >
        {status === "uploading" ? "Syncing AI Knowledge..." : "Update Knowledge Base"}
      </button>

      {status === "success" && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-100 animate-pulse text-center">
          ✅ Knowledge base has been updated.
        </div>
      )}
    </div>
  );
}