import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, Clock, FileCheck } from 'lucide-react';

const API_BASE_URL = "https://2uf2qjak1i.execute-api.us-east-1.amazonaws.com";

export default function AssigneeDashboard() {
  // Sample data simulating assigned tasks waiting for sign-off
  const [assignedTasks, setAssignedTasks] = useState([
    {
      task_id: "task-101",
      title: "Configure Database Backup Automation",
      assignee: "Alex Mercer",
      deadline: "2026-09-18",
      evidence: "Alex: I will set up the automated database backups by next Wednesday.",
      status: "PENDING_OWNER_SIGNATURE"
    }
  ]);

  const handleSign = async (taskId, action) => {
    try {
      const res = await fetch(`${API_BASE_URL}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, action }),
      });
      if (res.ok) {
        const newStatus = action === 'CONFIRM' ? 'CONFIRMED' : 'DECLINED';
        setAssignedTasks(assignedTasks.map(t => t.task_id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch (err) {
      alert("Signing action failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Navigation Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-4 px-8 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h1 className="text-lg font-semibold tracking-tight">The Consent Ledger</h1>
          <span className="bg-emerald-950 text-emerald-300 text-xs font-mono px-2 py-0.5 rounded border border-emerald-800">
            ASSIGNEE PORTAL
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" /> Action Items Requiring Verification
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Review commitments assigned to you. Inspect the verbatim transcript evidence before providing digital sign-off.
            </p>
          </div>

          <div className="space-y-4">
            {assignedTasks.map((task) => (
              <div key={task.task_id} className="border border-slate-200 rounded p-5 bg-white shadow-xs">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{task.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Assigned to: <strong className="text-slate-700">{task.assignee}</strong></p>
                  </div>
                  {task.status === 'PENDING_OWNER_SIGNATURE' && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2.5 py-1 rounded">
                      <Clock className="w-3 h-3" /> Pending Sign-off
                    </span>
                  )}
                  {task.status === 'CONFIRMED' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-1 rounded">
                      <CheckCircle className="w-3 h-3" /> Signed & Confirmed
                    </span>
                  )}
                  {task.status === 'DECLINED' && (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-xs font-medium px-2.5 py-1 rounded">
                      <XCircle className="w-3 h-3" /> Declined
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 mb-3">
                  <span className="font-medium">Target Deadline:</span> {task.deadline}
                </div>

                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Transcript Evidence Quote
                  </span>
                  <blockquote className="bg-amber-50/60 border-l-2 border-amber-400 p-3 rounded text-xs text-amber-950 font-mono">
                    "{task.evidence}"
                  </blockquote>
                </div>

                {task.status === 'PENDING_OWNER_SIGNATURE' && (
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleSign(task.task_id, 'DECLINE')}
                      className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded transition">
                      Reject Assignment
                    </button>
                    <button
                      onClick={() => handleSign(task.task_id, 'CONFIRM')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-1.5 rounded transition flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Sign & Accept Ownership
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}