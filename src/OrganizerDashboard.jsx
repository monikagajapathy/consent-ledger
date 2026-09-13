import React, { useState } from 'react';
import { FileText, ArrowRight, ShieldCheck, CheckCircle, Clock, UserPlus } from 'lucide-react';

const API_BASE_URL = "https://2uf2qjak1i.execute-api.us-east-1.amazonaws.com";

export default function OrganizerDashboard() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  const handleExtract = async () => {
    if (!transcript.trim()) return alert("Please enter a meeting transcript.");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (data.tasks) setTasks(data.tasks);
    } catch (err) {
      alert("Extraction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssigneeChange = (taskId, newAssignee) => {
    setTasks(tasks.map(t => t.task_id === taskId ? { ...t, assignee: newAssignee } : t));
  };

  const handleReviewAndSend = async (taskId) => {
    const task = tasks.find(t => t.task_id === taskId);
    if (!task.assignee || task.assignee === "Unassigned") {
      return alert("Please assign a valid owner before dispatching.");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, assignee: task.assignee }),
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.task_id === taskId ? { ...t, status: 'PENDING_OWNER_SIGNATURE' } : t));
      }
    } catch (err) {
      alert("Dispatch failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Navigation Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-4 px-8 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
          <h1 className="text-lg font-semibold tracking-tight">The Consent Ledger</h1>
          <span className="bg-indigo-950 text-indigo-300 text-xs font-mono px-2 py-0.5 rounded border border-indigo-800">
            ORGANIZER WORKSPACE
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Panel */}
        <section className="lg:col-span-5 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Transcript Processing
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide raw transcript data. The AI engine will parse actionable commitments and map evidence quotes.
            </p>
          </div>
          
          <textarea
            className="w-full flex-grow min-h-[300px] p-3 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-600 focus:outline-none text-xs font-mono text-slate-800 bg-slate-50 leading-relaxed"
            placeholder="John: I will complete the deployment pipeline configuration by Friday at 4 PM..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />

          <button
            onClick={handleExtract}
            disabled={loading}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition disabled:opacity-50">
            {loading ? "Analyzing Transcript..." : "Run AI Extraction"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </section>

        {/* Audit & Management Panel */}
        <section className="lg:col-span-7 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Extracted Ledger Items</h2>
              <p className="text-xs text-slate-500">Review AI extractions, verify assignees, and dispatch for sign-off.</p>
            </div>
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              Total: {tasks.length}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded p-12 text-center text-slate-400">
              <p className="text-xs">No active extractions found. Input meeting text on the left panel to execute.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.task_id} className="border border-slate-200 rounded p-4 bg-slate-50/30">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900 text-sm">{task.title}</h3>
                    {task.status === 'PROPOSED' && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" /> Proposed
                      </span>
                    )}
                    {task.status === 'PENDING_OWNER_SIGNATURE' && (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" /> Awaiting Sign-off
                      </span>
                    )}
                    {task.status === 'CONFIRMED' && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" /> Verified & Signed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 mb-3 bg-white p-2.5 rounded border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">Assignee:</span>
                      {task.status === 'PROPOSED' ? (
                        <input
                          type="text"
                          className="border border-slate-300 px-1.5 py-0.5 rounded text-xs font-sans text-slate-900 focus:outline-none focus:border-indigo-600"
                          value={task.assignee}
                          onChange={(e) => handleAssigneeChange(task.task_id, e.target.value)}
                        />
                      ) : (
                        <span>{task.assignee}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Target Deadline:</span> {task.deadline || "Unspecified"}
                    </div>
                  </div>

                  <blockquote className="bg-slate-100 border-l-2 border-slate-400 p-2.5 rounded text-xs text-slate-700 font-mono mb-3">
                    "{task.evidence}"
                  </blockquote>

                  {task.status === 'PROPOSED' && (
                    <div className="flex justify-end pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleReviewAndSend(task.task_id)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded transition">
                        Confirm Assignment & Request Sign-off
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}