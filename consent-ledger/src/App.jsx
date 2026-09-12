import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  LogOut, 
  Upload, 
  UserCheck, 
  Plus, 
  Key, 
  Mail, 
  Trash2, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  Sparkles, 
  FileCode, 
  ArrowRight, 
  ChevronRight, 
  Calendar, 
  HardDrive, 
  X, 
  Check, 
  RefreshCw,
  FolderOpen,
  Briefcase,
  UserPlus,
  Edit3,
  Copy,
  ExternalLink,
  Shield,
  Search,
  CheckCheck,
  Building,
  Paperclip,
  Download,
  AlertTriangle,
  FileCheck,
  PlayCircle,
  FileUp,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
  Stamp,
  BadgeCheck,
  FastForward,
  Bell,
  BellRing,
  MousePointerClick
} from 'lucide-react';

const API_BASE_URL = "https://2uf2qjak1i.execute-api.us-east-1.amazonaws.com";

// Initial default meetings/transcripts
const INITIAL_MEETINGS = [
  {
    id: "mtg-1",
    title: "Sprint Architecture & DynamoDB Sync",
    fileName: "Sprint_Architecture_Sync.txt",
    date: "2026-09-13",
    size: "1.8 KB",
    status: "Analyzed",
    transcript: "Rahul: I will set up the API endpoints and DynamoDB schema by Friday afternoon at 4 PM.\nPriya: I will design the frontend light theme dashboard with responsive layouts by Thursday.\nRahul: I will also write the authentication middleware and session token validation.\nOrganizer: Please make sure all consent logs are immutable."
  },
  {
    id: "mtg-2",
    title: "Client Security & Privacy Audit",
    fileName: "Security_Compliance_Review.md",
    date: "2026-09-12",
    size: "2.4 KB",
    status: "Draft",
    transcript: "Alex: I commit to completing the penetration testing and SSL certificate pinning by Monday.\nPriya: I will update the GDPR privacy consent popups and deletion audit trail before next sprint release.\nOrganizer: We need the verified audit logs ready for stakeholder review."
  }
];

// Initial default tasks showcasing full verification workflow
const INITIAL_TASKS = [
  {
    task_id: "task-101",
    meeting_id: "mtg-1",
    title: "Set up API endpoints and DynamoDB schema",
    assignee: "Rahul",
    assignee_email: "rahul@consentledger.com",
    deadline: "2026-09-18",
    evidence: "Rahul: I will set up the API endpoints and DynamoDB schema by Friday afternoon at 4 PM.",
    status: "PENDING_ORGANIZER_VERIFICATION",
    accepted_at: "2026-09-13 10:15 AM",
    completed_at: "2026-09-13 01:20 PM",
    completion_file: {
      name: "dynamodb_schema_v2.sql",
      size: "4.2 KB",
      note: "Created DynamoDB schema with partition hash keys, secondary indexes, and audit TTL fields.",
      uploaded_at: "2026-09-13 01:20 PM",
      fileUrl: "#"
    }
  },
  {
    task_id: "task-102",
    meeting_id: "mtg-1",
    title: "Design frontend light theme dashboard",
    assignee: "Priya",
    assignee_email: "priya@consentledger.com",
    deadline: "2026-09-17",
    evidence: "Priya: I will design the frontend light theme dashboard with responsive layouts by Thursday.",
    status: "ACCEPTED",
    accepted_at: "2026-09-13 11:05 AM"
  },
  {
    task_id: "task-103",
    meeting_id: "mtg-1",
    title: "Write authentication middleware and session token validation",
    assignee: "Rahul",
    assignee_email: "rahul@consentledger.com",
    deadline: "2026-09-19",
    evidence: "Rahul: I will also write the authentication middleware and session token validation.",
    status: "PENDING_OWNER_SIGNATURE"
  },
  {
    task_id: "task-104",
    meeting_id: "mtg-2",
    title: "Complete penetration testing and SSL certificate pinning",
    assignee: "Alex",
    assignee_email: "alex@consentledger.com",
    deadline: "2026-09-16",
    evidence: "Alex: I commit to completing the penetration testing and SSL certificate pinning by Monday.",
    status: "VERIFIED",
    accepted_at: "2026-09-12 09:30 AM",
    completed_at: "2026-09-12 04:45 PM",
    verified_at: "2026-09-12 05:15 PM",
    verified_by: "Lead Organizer",
    completion_file: {
      name: "soc2_ssl_audit_report.pdf",
      size: "1.4 MB",
      note: "Passed all penetration tests and pinned SHA-256 SSL root certs.",
      uploaded_at: "2026-09-12 04:45 PM",
      fileUrl: "#"
    }
  }
];

const INITIAL_ASSIGNEES = [
  { 
    id: "emp-1",
    name: "Rahul", 
    email: "rahul@consentledger.com", 
    password: "rahul-secure-pass",
    roleTitle: "Backend Lead"
  },
  { 
    id: "emp-2",
    name: "Priya", 
    email: "priya@consentledger.com", 
    password: "priya-secure-pass",
    roleTitle: "UI/UX Designer"
  },
  { 
    id: "emp-3",
    name: "Alex", 
    email: "alex@consentledger.com", 
    password: "alex-secure-pass",
    roleTitle: "Security Engineer"
  }
];

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('consent_ledger_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Saved Files / Meetings State
  const [meetings, setMeetings] = useState(() => {
    try {
      const saved = localStorage.getItem('consent_ledger_meetings');
      return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
    } catch {
      return INITIAL_MEETINGS;
    }
  });

  const [activeMeetingId, setActiveMeetingId] = useState(() => {
    try {
      const savedMeetings = localStorage.getItem('consent_ledger_meetings');
      const list = savedMeetings ? JSON.parse(savedMeetings) : INITIAL_MEETINGS;
      return list.length > 0 ? list[0].id : null;
    } catch {
      return INITIAL_MEETINGS[0]?.id || null;
    }
  });

  // Tasks State
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('consent_ledger_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Registered Assignees / Employee Credentials State
  const [registeredAssignees, setRegisteredAssignees] = useState(() => {
    try {
      const saved = localStorage.getItem('consent_ledger_assignees');
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNEES;
    } catch {
      return INITIAL_ASSIGNEES;
    }
  });

  // Modals & Active Action States
  const [fileToDelete, setFileToDelete] = useState(null);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  
  // Clickable Task Decision Box Modal State
  const [decisionModalTask, setDecisionModalTask] = useState(null);

  // Other Task Actions Modals
  const [taskToDecline, setTaskToDecline] = useState(null);
  const [taskToUpload, setTaskToUpload] = useState(null);
  const [taskToVerify, setTaskToVerify] = useState(null);
  const [viewingProofTask, setViewingProofTask] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  // LocalStorage Persistence
  useEffect(() => {
    try {
      localStorage.setItem('consent_ledger_meetings', JSON.stringify(meetings));
    } catch (e) {
      console.warn("Storage error saving meetings:", e);
    }
  }, [meetings]);

  useEffect(() => {
    try {
      localStorage.setItem('consent_ledger_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn("Storage error saving tasks:", e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('consent_ledger_assignees', JSON.stringify(registeredAssignees));
    } catch (e) {
      console.warn("Storage error saving assignees:", e);
    }
  }, [registeredAssignees]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Login Handler
  const handleLogin = (user) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setCurrentUser(user);
      localStorage.setItem('consent_ledger_user', JSON.stringify(user));
      setIsAuthenticating(false);
      showToast(`Signed in as ${user.name || user.email} (${user.role.toUpperCase()})`);
    }, 400);
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('consent_ledger_user');
    showToast("Signed out successfully.", "info");
  };

  // Fast switch to an employee directly from directory
  const handleSwitchToEmployee = (employee) => {
    const user = {
      email: employee.email,
      name: employee.name,
      role: 'employee'
    };
    handleLogin(user);
  };

  // ==========================================
  // SAVED FILE DELETION FEATURE (ORGANIZER ONLY)
  // ==========================================
  const triggerDeleteFileModal = (meeting) => {
    setFileToDelete(meeting);
  };

  const confirmDeleteFile = (deleteLinkedTasks = true) => {
    if (!fileToDelete) return;
    const targetId = fileToDelete.id;
    const targetTitle = fileToDelete.title || fileToDelete.fileName;

    const updatedMeetings = meetings.filter(m => m.id !== targetId);
    setMeetings(updatedMeetings);

    if (deleteLinkedTasks) {
      setTasks(currentTasks => currentTasks.filter(t => t.meeting_id !== targetId));
    }

    if (activeMeetingId === targetId) {
      setActiveMeetingId(updatedMeetings.length > 0 ? updatedMeetings[0].id : null);
    }

    setFileToDelete(null);
    showToast(`File "${targetTitle}" deleted successfully.`, "error");
  };

  // ==========================================
  // EMPLOYEE CREDENTIAL MANAGEMENT (ORGANIZER ONLY)
  // ==========================================
  const handleSaveEmployee = (empData) => {
    if (editingEmployee) {
      setRegisteredAssignees(prev => prev.map(emp => 
        emp.id === editingEmployee.id || emp.email.toLowerCase() === editingEmployee.email.toLowerCase()
          ? { ...emp, ...empData }
          : emp
      ));
      showToast(`Updated credentials for ${empData.name}.`, "success");
    } else {
      const newEmp = {
        id: `emp-${Date.now()}`,
        ...empData
      };
      setRegisteredAssignees(prev => [...prev, newEmp]);
      showToast(`Created login credentials for ${empData.name}.`, "success");
    }
    setEmployeeModalOpen(false);
    setEditingEmployee(null);
  };

  const handleRegeneratePassword = (employee) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newPass = `${employee.name.toLowerCase()}-pass-${randomSuffix}`;
    setRegisteredAssignees(prev => prev.map(emp => 
      emp.email === employee.email ? { ...emp, password: newPass } : emp
    ));
    showToast(`Generated new password for ${employee.name}: ${newPass}`, "info");
  };

  const confirmDeleteEmployee = () => {
    if (!employeeToDelete) return;
    setRegisteredAssignees(prev => prev.filter(emp => emp.email !== employeeToDelete.email));
    showToast(`Revoked credentials for ${employeeToDelete.name}.`, "error");
    setEmployeeToDelete(null);
  };

  // ==========================================
  // ORGANIZER TASK DELETION (ORGANIZER ONLY)
  // ==========================================
  const handleDeleteTaskByOrganizer = async (taskIdToDelete) => {
    setTasks(currentTasks => currentTasks.filter(t => t.task_id !== taskIdToDelete));
    showToast("Commitment deliverable deleted by Organizer.", "info");

    try {
      await fetch(`${API_BASE_URL}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskIdToDelete })
      });
    } catch (err) {
      console.warn("Backend sync failed, removed locally.");
    }
  };

  // ==========================================
  // EMPLOYEE TASK ACTIONS (ACCEPT, UPLOAD EVIDENCE, DENY)
  // ==========================================
  
  // 1. Accept Task (Status -> ACCEPTED / In Progress)
  const handleAcceptTask = (taskId) => {
    const timeStr = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    setTasks(prev => prev.map(t => t.task_id === taskId ? { 
      ...t, 
      status: 'ACCEPTED',
      accepted_at: timeStr,
      rejection_reason: null
    } : t));
    
    // Also update decisionModalTask if open
    setDecisionModalTask(prev => prev && prev.task_id === taskId ? {
      ...prev,
      status: 'ACCEPTED',
      accepted_at: timeStr,
      rejection_reason: null
    } : prev);

    showToast("Task accepted! Marked as In Progress.", "success");

    try {
      fetch(`${API_BASE_URL}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, action: 'CONFIRM' }),
      }).catch(e => console.warn(e));
    } catch (err) {
      console.warn("Sync failed, stored locally.");
    }
  };

  // 2. Deny / Decline Task with Mandatory Reason
  const handleConfirmDecline = (taskId, reason) => {
    const timeStr = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    setTasks(prev => prev.map(t => t.task_id === taskId ? {
      ...t,
      status: 'DECLINED',
      rejection_reason: reason,
      declined_at: timeStr
    } : t));

    setDecisionModalTask(prev => prev && prev.task_id === taskId ? {
      ...prev,
      status: 'DECLINED',
      rejection_reason: reason,
      declined_at: timeStr
    } : prev);

    setTaskToDecline(null);
    showToast("Task declined. Reason recorded in ledger.", "info");

    try {
      fetch(`${API_BASE_URL}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, action: 'DECLINE', reason }),
      }).catch(e => console.warn(e));
    } catch (err) {
      console.warn("Sync failed, stored locally.");
    }
  };

  // 3. Confirm Evidence Document Upload & Complete Task -> Switches status to PENDING_ORGANIZER_VERIFICATION
  const handleCompleteTaskWithFile = (taskId, fileDetails) => {
    const timeStr = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    
    const updatedFileObj = {
      name: fileDetails.name,
      size: fileDetails.size,
      note: fileDetails.note,
      uploaded_at: timeStr,
      fileUrl: fileDetails.fileUrl || '#'
    };

    setTasks(prev => prev.map(t => t.task_id === taskId ? {
      ...t,
      status: 'PENDING_ORGANIZER_VERIFICATION',
      completed_at: timeStr,
      verification_feedback: null,
      completion_file: updatedFileObj
    } : t));

    setDecisionModalTask(prev => prev && prev.task_id === taskId ? {
      ...prev,
      status: 'PENDING_ORGANIZER_VERIFICATION',
      completed_at: timeStr,
      verification_feedback: null,
      completion_file: updatedFileObj
    } : prev);

    setTaskToUpload(null);
    showToast(`Evidence "${fileDetails.name}" uploaded! Organizer has been notified for verification.`, "success");
  };

  // ==========================================
  // ORGANIZER VERIFICATION ACTIONS
  // ==========================================
  const handleVerifyDeliverable = (taskId, approval = true, feedback = '') => {
    const timeStr = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

    setTasks(prev => prev.map(t => {
      if (t.task_id === taskId) {
        if (approval) {
          return {
            ...t,
            status: 'VERIFIED',
            verified_at: timeStr,
            verified_by: currentUser.name || "Lead Organizer",
            verification_feedback: feedback || null
          };
        } else {
          return {
            ...t,
            status: 'CHANGES_REQUESTED',
            verification_feedback: feedback || "Please revise and upload updated deliverables."
          };
        }
      }
      return t;
    }));

    setTaskToVerify(null);
    if (approval) {
      showToast("Deliverable approved & digitally verified by Organizer!", "success");
    } else {
      showToast("Revision requested. Feedback sent back to assignee.", "info");
    }
  };

  // Pending verification count for notification badge
  const pendingVerificationList = tasks.filter(t => t.status === 'PENDING_ORGANIZER_VERIFICATION');

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <div className="relative mb-4">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <ShieldCheck className="w-6 h-6 text-indigo-600 absolute top-3 left-3 animate-pulse" />
        </div>
        <p className="text-sm font-bold text-slate-800 tracking-wide">Authenticating Identity...</p>
        <p className="text-xs text-slate-500 mt-1">Connecting to The Consent Ledger Network</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        registeredAssignees={registeredAssignees}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans w-full">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-bounce-short">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold ${
            toastMessage.type === 'error' 
              ? 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100' 
              : toastMessage.type === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100'
          }`}>
            {toastMessage.type === 'error' ? <Trash2 className="w-4 h-4 text-rose-600" /> :
             toastMessage.type === 'info' ? <AlertCircle className="w-4 h-4 text-blue-600" /> :
             <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span>{toastMessage.message}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CLICKABLE TASK DECISION BOX MODAL (ACCEPT / DENY / UPLOAD / VIEW) */}
      {decisionModalTask && (
        <TaskDecisionModal
          task={tasks.find(t => t.task_id === decisionModalTask.task_id) || decisionModalTask}
          onAccept={(taskId) => handleAcceptTask(taskId)}
          onDecline={(task) => setTaskToDecline(task)}
          onUploadProof={(task) => setTaskToUpload(task)}
          onViewProof={(task) => setViewingProofTask(task)}
          onClose={() => setDecisionModalTask(null)}
        />
      )}

      {/* Delete File Confirmation Modal (Organizer Only) */}
      {fileToDelete && (
        <DeleteFileModal 
          file={fileToDelete}
          onConfirm={confirmDeleteFile}
          onCancel={() => setFileToDelete(null)}
          tasksCount={tasks.filter(t => t.meeting_id === fileToDelete.id).length}
        />
      )}

      {/* Add / Edit Employee Credentials Modal (Organizer Only) */}
      {employeeModalOpen && (
        <EmployeeCredentialModal
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onClose={() => {
            setEmployeeModalOpen(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {/* Delete / Revoke Employee Modal (Organizer Only) */}
      {employeeToDelete && (
        <DeleteEmployeeModal
          employee={employeeToDelete}
          onConfirm={confirmDeleteEmployee}
          onCancel={() => setEmployeeToDelete(null)}
        />
      )}

      {/* Decline Task Modal (MANDATORY REASON) */}
      {taskToDecline && (
        <DeclineTaskModal
          task={taskToDecline}
          onConfirm={(reason) => handleConfirmDecline(taskToDecline.task_id, reason)}
          onCancel={() => setTaskToDecline(null)}
        />
      )}

      {/* Upload Document / Complete Task Modal */}
      {taskToUpload && (
        <UploadCompletionModal
          task={taskToUpload}
          onComplete={(fileDetails) => handleCompleteTaskWithFile(taskToUpload.task_id, fileDetails)}
          onCancel={() => setTaskToUpload(null)}
        />
      )}

      {/* Organizer Verification Review Modal (ORGANIZER ONLY) */}
      {taskToVerify && (
        <OrganizerVerificationModal
          task={taskToVerify}
          onVerify={(approval, feedback) => handleVerifyDeliverable(taskToVerify.task_id, approval, feedback)}
          onClose={() => setTaskToVerify(null)}
        />
      )}

      {/* View Proof Document Details Modal */}
      {viewingProofTask && (
        <ViewProofModal
          task={viewingProofTask}
          onClose={() => setViewingProofTask(null)}
          showToast={showToast}
        />
      )}

      {/* STYLED HEADER WITH RICH COLOR BACKGROUND & NOTIFICATIONS */}
      <header className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/60 sticky top-0 z-40 px-6 lg:px-8 py-3.5 shadow-lg w-full">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Brand & Workspace Title */}
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl shadow-inner backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-extrabold tracking-tight text-white drop-shadow-xs">
                  The Consent Ledger
                </h1>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase font-bold tracking-wider ${
                  currentUser.role === 'organizer' 
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                }`}>
                  {currentUser.role === 'organizer' ? 'Organizer Workspace' : 'Employee Portal'}
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">Enterprise AI Deliverables & Verified Mutual Accountability</p>
            </div>
          </div>

          {/* User Controls & Organizer Notification Center */}
          <div className="flex items-center gap-3.5 text-xs">
            
            {/* Live Verification Notification Bell for Organizer */}
            {currentUser.role === 'organizer' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-xl border transition ${
                    pendingVerificationList.length > 0
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 hover:bg-amber-500/30'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Deliverables Awaiting Verification"
                >
                  {pendingVerificationList.length > 0 ? (
                    <BellRing className="w-4 h-4 animate-bounce-short" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                  {pendingVerificationList.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                      {pendingVerificationList.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Popup */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Stamp className="w-3.5 h-3.5 text-indigo-600" />
                        Verification Alerts ({pendingVerificationList.length})
                      </span>
                      <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {pendingVerificationList.length === 0 ? (
                      <p className="text-slate-400 text-xs text-center py-4">All deliverables verified! No pending reviews.</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {pendingVerificationList.map(task => (
                          <div key={task.task_id} className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 text-xs space-y-1">
                            <div className="font-bold text-slate-900 truncate">{task.title}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              By {task.assignee} • {task.completion_file?.name}
                            </div>
                            <div className="pt-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setNotificationsOpen(false);
                                  setTaskToVerify(task);
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition"
                              >
                                Review & Verify
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile Info Pill */}
            <div className="flex items-center gap-3 bg-slate-900/90 border border-indigo-800/40 rounded-xl px-3.5 py-1.5 shadow-inner">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase shadow-md ${
                currentUser.role === 'organizer' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {currentUser.name ? currentUser.name.charAt(0) : currentUser.email.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-mono text-indigo-300 font-semibold tracking-wider">
                  {currentUser.role === 'organizer' ? 'Project Lead (Admin)' : 'Team Member'}
                </div>
                <div className="text-white font-bold">{currentUser.name || currentUser.email}</div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1.5 text-indigo-100 hover:text-rose-300 bg-slate-800/80 hover:bg-rose-950/40 px-3.5 py-2 rounded-xl border border-indigo-800/50 hover:border-rose-800/50 transition font-semibold shadow-xs"
              title="Sign out of Consent Ledger"
            >
              <LogOut className="w-4 h-4" /> 
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace based on Role - Full Width */}
      <div className="flex-grow w-full">
        {currentUser.role === 'organizer' ? (
          <OrganizerWorkspace 
            meetings={meetings} 
            setMeetings={setMeetings}
            tasks={tasks} 
            setTasks={setTasks}
            registeredAssignees={registeredAssignees} 
            setRegisteredAssignees={setRegisteredAssignees}
            activeMeetingId={activeMeetingId} 
            setActiveMeetingId={setActiveMeetingId}
            onDeleteTask={handleDeleteTaskByOrganizer}
            onDeleteFile={triggerDeleteFileModal}
            onSwitchEmployee={handleSwitchToEmployee}
            onOpenAddEmployee={() => {
              setEditingEmployee(null);
              setEmployeeModalOpen(true);
            }}
            onOpenEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setEmployeeModalOpen(true);
            }}
            onRegeneratePassword={handleRegeneratePassword}
            onDeleteEmployee={(emp) => setEmployeeToDelete(emp)}
            onOpenVerification={(task) => setTaskToVerify(task)}
            onViewProof={(task) => setViewingProofTask(task)}
            showToast={showToast}
          />
        ) : (
          /* EmployeeWorkspace with CLICKABLE TASKS that open the Decision Box */
          <EmployeeWorkspace 
            currentUser={currentUser} 
            tasks={tasks} 
            onTaskClick={(task) => setDecisionModalTask(task)}
            onAcceptTask={handleAcceptTask}
            onDeclineTask={(task) => setTaskToDecline(task)}
            onUploadProof={(task) => setTaskToUpload(task)}
            onViewProof={(task) => setViewingProofTask(task)}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
}

// ==========================================
// CLICKABLE TASK DECISION BOX MODAL
// ==========================================
function TaskDecisionModal({ task, onAccept, onDecline, onUploadProof, onViewProof, onClose }) {
  const isPending = task.status === 'PENDING_OWNER_SIGNATURE' || !task.status;
  const isAccepted = task.status === 'ACCEPTED';
  const isAwaitingVerification = task.status === 'PENDING_ORGANIZER_VERIFICATION';
  const isChangesRequested = task.status === 'CHANGES_REQUESTED';
  const isVerified = task.status === 'VERIFIED';
  const isDeclined = task.status === 'DECLINED';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-7 shadow-2xl animate-in fade-in zoom-in-95 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header & Close */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Task Decision Box</h3>
                
                {/* Status Badge */}
                {isVerified && (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Organizer Verified
                  </span>
                )}
                {isAwaitingVerification && (
                  <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Under Review
                  </span>
                )}
                {isChangesRequested && (
                  <span className="bg-orange-100 text-orange-900 border border-orange-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Revision Needed
                  </span>
                )}
                {isAccepted && (
                  <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    In Progress
                  </span>
                )}
                {isDeclined && (
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Declined
                  </span>
                )}
                {isPending && (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Pending Decision
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Review details and provide your binding sign-off</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Title & Details */}
        <div className="space-y-2 text-xs">
          <div className="text-sm font-extrabold text-slate-900 leading-snug">{task.title}</div>
          
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div>
              <span className="text-slate-400 font-medium">Assignee:</span>{' '}
              <strong className="text-indigo-700">{task.assignee}</strong> ({task.assignee_email})
            </div>
            <div>
              <span className="text-slate-400 font-medium">Target Deadline:</span>{' '}
              <strong className="text-slate-800">{task.deadline || "Next Release"}</strong>
            </div>
          </div>
        </div>

        {/* Verbatim Transcript Quote */}
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Verbatim Transcript Evidence Quote
          </span>
          <blockquote className="bg-indigo-50/50 border-l-4 border-indigo-500 p-3.5 rounded-xl text-xs text-slate-800 font-mono shadow-2xs leading-relaxed">
            "{task.evidence}"
          </blockquote>
        </div>

        {/* Attached Evidence Proof Display (If submitted or verified) */}
        {task.completion_file && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            isVerified ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-purple-50/70 border-purple-200 text-purple-950'
          }`}>
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-bold">{task.completion_file.name}</div>
                <div className="text-[10px] opacity-80 font-mono">
                  {task.completion_file.size} • Uploaded {task.completion_file.uploaded_at || 'Recent'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onViewProof(task);
              }}
              className="text-[11px] font-bold bg-white text-slate-800 border border-slate-300 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition shadow-2xs"
            >
              View Document
            </button>
          </div>
        )}

        {/* Decline Reason Callout (If declined) */}
        {isDeclined && task.rejection_reason && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Recorded Reason for Declining:</span>
            </div>
            <p className="italic pl-5">"{task.rejection_reason}"</p>
            {task.declined_at && (
              <p className="text-[10px] text-rose-600 font-mono pl-5">Declined on {task.declined_at}</p>
            )}
          </div>
        )}

        {/* DECISION ACTION BOX SECTION */}
        <div className="pt-2 border-t border-slate-100">
          
          {/* 1. If Pending: Clear Accept / Deny 2-Button Choice */}
          {isPending && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
                Select Your Response Decision
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Deny Button */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDecline(task);
                  }}
                  className="p-3.5 rounded-2xl bg-white hover:bg-rose-50 border-2 border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 text-xs font-bold transition shadow-xs flex flex-col items-center justify-center gap-1.5 group"
                >
                  <div className="p-2 bg-rose-50 group-hover:bg-rose-100 rounded-xl text-rose-600">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-sm">Deny Deliverable</span>
                  <span className="text-[10px] font-normal text-slate-400 group-hover:text-rose-600">Provide mandatory reason</span>
                </button>

                {/* Accept Button */}
                <button
                  type="button"
                  onClick={() => {
                    onAccept(task.task_id);
                  }}
                  className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md flex flex-col items-center justify-center gap-1.5 group"
                >
                  <div className="p-2 bg-emerald-500/30 rounded-xl text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-sm">Accept Deliverable</span>
                  <span className="text-[10px] font-normal text-emerald-100">Claim & Mark In Progress</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. If Accepted / In Progress: Option to Upload Evidence or Return */}
          {(isAccepted || isChangesRequested) && (
            <div className="space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDecline(task);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-300 hover:border-rose-300 text-xs font-semibold transition"
                >
                  Deny / Return Task
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onUploadProof(task);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <FileUp className="w-4 h-4" />
                  <span>Upload Evidence Document & Advance</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. If Declined: Option to Reconsider & Accept */}
          {isDeclined && (
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-slate-500">Blockers resolved?</span>
              <button
                type="button"
                onClick={() => {
                  onAccept(task.task_id);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Reconsider & Accept Task</span>
              </button>
            </div>
          )}

          {/* 4. If Under Review or Verified */}
          {(isAwaitingVerification || isVerified) && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// ==========================================
// LOGIN PAGE (LIGHT THEME + FULL SCREEN)
// ==========================================
function LoginPage({ onLogin, registeredAssignees }) {
  const [selectedRole, setSelectedRole] = useState('organizer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle Tab Switch
  const handleTabChange = (role) => {
    setSelectedRole(role);
    setError('');
    if (role === 'organizer') {
      setEmail('organizer@consentledger.com');
      setPassword('admin-secret-2026');
      setDisplayName('Lead Organizer');
    } else {
      const firstEmp = registeredAssignees[0] || { email: 'rahul@consentledger.com', password: 'rahul-secure-pass', name: 'Rahul' };
      setEmail(firstEmp.email);
      setPassword(firstEmp.password);
      setDisplayName(firstEmp.name);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your email address and password.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please provide a valid corporate email address.');
      return;
    }

    if (selectedRole === 'employee') {
      const found = registeredAssignees.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
      if (found && found.password && found.password !== password.trim()) {
        setError(`Incorrect password for ${email}. Check Organizer directory or reset.`);
        return;
      }
    }

    onLogin({
      email: email.trim().toLowerCase(),
      role: selectedRole,
      name: displayName.trim() || email.split('@')[0]
    });
  };

  const fillPreset = (role, presetEmail, presetPass, presetName) => {
    setSelectedRole(role);
    setEmail(presetEmail);
    setPassword(presetPass);
    setDisplayName(presetName);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-100 flex flex-col justify-center items-center p-6 relative font-sans w-full">
      
      {/* Decorative Light Background Accents */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 sm:p-10 z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-xs mb-3.5">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">The Consent Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">Enterprise Mutual Accountability & Deliverable Ledger</p>
        </div>

        {/* 2 Main User Role Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => handleTabChange('organizer')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-xs ${
              selectedRole === 'organizer'
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            1. Organizer
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('employee')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-xs ${
              selectedRole === 'employee'
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            2. Employee
          </button>
        </div>

        {/* Role Helper Banner */}
        <div className={`p-3.5 rounded-xl border text-xs mb-6 flex items-start gap-2.5 ${
          selectedRole === 'organizer'
            ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
            : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
        }`}>
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
          <div className="leading-relaxed">
            <strong className="block mb-0.5">
              {selectedRole === 'organizer' ? 'Organizer Authority Portal' : 'Employee Verification Portal'}
            </strong>
            {selectedRole === 'organizer'
              ? 'Upload meeting transcripts, manage saved files, manage employee credentials, and verify uploaded proof documents.'
              : 'Click any assigned task to open the Decision Box, accept or deny with reasons, and upload evidence documents.'}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl mb-5 flex items-center gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Corporate Email Address
            </label>
            <input
              type="email"
              required
              placeholder={selectedRole === 'organizer' ? "organizer@consentledger.com" : "employee@consentledger.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition text-xs font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition text-xs font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Display Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma / Priya Patel"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition flex items-center justify-center gap-2 mt-2 ${
              selectedRole === 'organizer'
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
            }`}
          >
            <span>Enter as {selectedRole === 'organizer' ? 'Organizer' : 'Employee'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Quick Demo Presets */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
              1-Click Quick Demo Presets
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => fillPreset('organizer', 'organizer@consentledger.com', 'admin-secret-2026', 'Lead Organizer')}
              className="px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition shadow-2xs"
            >
               Organizer (Admin)
            </button>
            {registeredAssignees.map((emp) => (
              <button
                key={emp.email}
                type="button"
                onClick={() => fillPreset('employee', emp.email, emp.password, emp.name)}
                className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition shadow-2xs"
              >
                 {emp.name} ({emp.roleTitle || 'Employee'})
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// ORGANIZER WORKSPACE (ORGANIZER DELETES + VERIFIES PROOFS)
// ==========================================
function OrganizerWorkspace({ 
  meetings, 
  setMeetings, 
  tasks, 
  setTasks, 
  registeredAssignees, 
  setRegisteredAssignees, 
  activeMeetingId, 
  setActiveMeetingId, 
  onDeleteTask, 
  onDeleteFile,
  onSwitchEmployee,
  onOpenAddEmployee,
  onOpenEditEmployee,
  onRegeneratePassword,
  onDeleteEmployee,
  onOpenVerification,
  onViewProof,
  showToast
}) {
  const [newTitle, setNewTitle] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newTranscript, setNewTranscript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  const activeMeeting = meetings.find(m => m.id === activeMeetingId) || meetings[0];

  // Count deliverables needing organizer verification across all meetings
  const pendingVerificationTasks = tasks.filter(t => t.status === 'PENDING_ORGANIZER_VERIFICATION');

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewFileName(file.name);
    if (!newTitle) {
      setNewTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewTranscript(event.target.result);
      showToast(`Loaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'info');
    };
    reader.readAsText(file);
  };

  // Create & Save Meeting Transcript
  const handleCreateMeeting = () => {
    if (!newTranscript.trim()) {
      return alert("Please upload or paste transcript content.");
    }
    const finalTitle = newTitle.trim() || `Session ${new Date().toLocaleDateString()}`;
    const finalFileName = newFileName.trim() || `${finalTitle.toLowerCase().replace(/\s+/g, '_')}.txt`;
    const sizeKb = (new Blob([newTranscript]).size / 1024).toFixed(1) + " KB";

    const newMtg = {
      id: `mtg-${Date.now()}`,
      title: finalTitle,
      fileName: finalFileName,
      date: new Date().toISOString().split('T')[0],
      size: sizeKb,
      status: "Draft",
      transcript: newTranscript
    };

    setMeetings([newMtg, ...meetings]);
    setActiveMeetingId(newMtg.id);
    setNewTitle('');
    setNewFileName('');
    setNewTranscript('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    showToast(`Saved new file "${finalTitle}" to ledger!`, 'success');
  };

  // Quick Preset Transcripts Loader
  const loadPresetTranscript = (type) => {
    if (type === 'dev') {
      setNewTitle("Mobile App Release Sprint Sync");
      setNewFileName("Sprint_Release_Sync.md");
      setNewTranscript("Rahul: I will complete the iOS push notification push payload handling by Thursday at 5 PM.\nPriya: I will review and finalize the onboarding illustration screens before Friday demo.\nAlex: I will configure the Redis caching layer for the user feed by Wednesday.");
    } else if (type === 'security') {
      setNewTitle("SOC2 & Data Encryption Audit");
      setNewFileName("SOC2_Compliance_Audit.txt");
      setNewTranscript("Alex: I commit to rotating all KMS master encryption keys by Friday.\nRahul: I will enable audit access logs on all DynamoDB tables by tomorrow.\nPriya: I will update the employee consent retention policy document.");
    }
  };

  // AI Extraction Handler
  const handleRunAiExtraction = async () => {
    if (!activeMeeting) return;
    setAnalyzing(true);

    try {
      const res = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: activeMeeting.transcript }),
      });

      const data = await res.json();
      if (data.tasks && data.tasks.length > 0) {
        const mapped = data.tasks.map((t, idx) => ({
          ...t,
          task_id: t.task_id || `task-${Date.now()}-${idx}`,
          meeting_id: activeMeeting.id,
          status: t.status || 'PENDING_OWNER_SIGNATURE'
        }));

        setTasks(prev => {
          const filtered = prev.filter(p => !mapped.some(m => m.task_id === p.task_id));
          return [...filtered, ...mapped];
        });

        setMeetings(prev => prev.map(m => m.id === activeMeeting.id ? { ...m, status: 'Analyzed' } : m));

        if (data.registered_assignees) {
          setRegisteredAssignees(prev => {
            const combined = [...prev, ...data.registered_assignees.map((a, i) => ({
              id: a.id || `emp-${Date.now()}-${i}`,
              name: a.name,
              email: a.email,
              password: a.password || `${a.name.toLowerCase()}-pass-2026`,
              roleTitle: a.roleTitle || "Team Member"
            }))];
            return combined.filter((item, index, self) => index === self.findIndex(t => t.email.toLowerCase() === item.email.toLowerCase()));
          });
        }

        showToast(`AI extracted ${mapped.length} commitment deliverables!`, 'success');
      } else {
        fallbackLocalExtraction(activeMeeting);
      }
    } catch (err) {
      console.warn("API extraction error, using intelligent fallback parser:", err);
      fallbackLocalExtraction(activeMeeting);
    } finally {
      setAnalyzing(false);
    }
  };

  // Local fallback parser
  const fallbackLocalExtraction = (meeting) => {
    const lines = meeting.transcript.split('\n');
    const extracted = [];
    const assigneesFound = [];

    lines.forEach((line, idx) => {
      const match = line.match(/^([^:]+):\s*(.*)/);
      if (match) {
        const speaker = match[1].trim();
        const commitment = match[2].trim();
        if (commitment.toLowerCase().includes('will') || commitment.toLowerCase().includes('commit') || commitment.toLowerCase().includes('design') || commitment.toLowerCase().includes('set up') || commitment.toLowerCase().includes('configure')) {
          const email = `${speaker.toLowerCase().replace(/\s+/g, '')}@consentledger.com`;
          extracted.push({
            task_id: `task-${Date.now()}-${idx}`,
            meeting_id: meeting.id,
            title: commitment.replace(/^I will\s*/i, '').replace(/^I commit to\s*/i, ''),
            assignee: speaker,
            assignee_email: email,
            deadline: "Next Sprint",
            evidence: line,
            status: "PENDING_OWNER_SIGNATURE"
          });

          assigneesFound.push({
            id: `emp-${Date.now()}-${idx}`,
            name: speaker,
            email: email,
            password: `${speaker.toLowerCase()}-pass-2026`,
            roleTitle: "Team Contributor"
          });
        }
      }
    });

    if (extracted.length > 0) {
      setTasks(prev => [...prev, ...extracted]);
      setMeetings(prev => prev.map(m => m.id === meeting.id ? { ...m, status: 'Analyzed' } : m));
      setRegisteredAssignees(prev => {
        const combined = [...prev, ...assigneesFound];
        return combined.filter((item, index, self) => index === self.findIndex(t => t.email.toLowerCase() === item.email.toLowerCase()));
      });
      showToast(`Parsed ${extracted.length} commitments from transcript.`, 'success');
    } else {
      showToast("No explicit commitment statements detected in transcript.", 'info');
    }
  };

  const visibleTasks = activeMeeting ? tasks.filter(t => t.meeting_id === activeMeeting.id) : tasks;

  const filteredEmployees = registeredAssignees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.roleTitle && emp.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="w-full px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Column 1: Upload & Saved Files Management (4 Cols) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Organizer Pending Verification Alert Box (If any deliverables uploaded) */}
        {pendingVerificationTasks.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs shadow-xs space-y-2.5 animate-pulse-subtle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Stamp className="w-4 h-4 text-amber-700" />
                <span>Verification Required ({pendingVerificationTasks.length})</span>
              </div>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Action Needed
              </span>
            </div>
            <p className="text-amber-800 text-[11px]">
              Team members uploaded evidence documents that require your official review and verification sign-off.
            </p>
            <div className="space-y-1.5 pt-1">
              {pendingVerificationTasks.map((pt) => (
                <div key={pt.task_id} className="bg-white/90 border border-amber-200 rounded-lg p-2 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="font-bold text-slate-900 truncate">{pt.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">By {pt.assignee} • {pt.completion_file?.name}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenVerification(pt)}
                    className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-md transition flex items-center gap-1 shadow-2xs"
                  >
                    <Stamp className="w-3 h-3" />
                    <span>Verify</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload & Add File Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-indigo-600" /> Upload Transcript File
            </h2>
            <div className="flex gap-1.5">
              <button 
                type="button" 
                onClick={() => loadPresetTranscript('dev')} 
                className="text-[10px] bg-slate-50 hover:bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg border border-slate-200 hover:border-indigo-200 font-semibold transition"
                title="Load Dev Sample"
              >
                + Dev Preset
              </button>
              <button 
                type="button" 
                onClick={() => loadPresetTranscript('security')} 
                className="text-[10px] bg-slate-50 hover:bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-slate-200 hover:border-emerald-200 font-semibold transition"
                title="Load Security Sample"
              >
                + Security Preset
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <input
              type="text"
              placeholder="Session / Document Title (e.g. Sprint Architecture Sync)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />

            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".txt,.md,.json,.csv,.log"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="flex items-center justify-center gap-2 w-full p-3 bg-slate-50 hover:bg-indigo-50/50 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl cursor-pointer text-slate-600 hover:text-indigo-700 transition text-xs font-medium"
              >
                <FolderOpen className="w-4 h-4 text-indigo-600" />
                <span>{newFileName ? `Loaded: ${newFileName}` : "Browse & Upload File (.txt, .md, .json)"}</span>
              </label>
            </div>

            <textarea
              placeholder="Or paste raw meeting transcript verbatim text here..."
              value={newTranscript}
              onChange={(e) => setNewTranscript(e.target.value)}
              className="w-full h-24 bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white resize-y"
            />

            <button
              onClick={handleCreateMeeting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save File to Ledger</span>
            </button>
          </div>
        </div>

        {/* Saved Files List with DELETION FEATURE (Organizer Authority) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-indigo-600" /> Saved Files ({meetings.length})
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Organizer Managed</span>
          </div>

          {meetings.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
              <HardDrive className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">No saved files found.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Upload a transcript above.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {meetings.map((m) => {
                const isSelected = activeMeeting?.id === m.id;
                const fileTaskCount = tasks.filter(t => t.meeting_id === m.id).length;

                return (
                  <div
                    key={m.id}
                    className={`group flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs text-indigo-950 font-medium'
                        : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveMeetingId(m.id)}
                      className="flex-grow text-left pr-2 flex items-start gap-2.5 overflow-hidden"
                    >
                      <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div className="truncate">
                        <div className="font-bold truncate text-slate-900">{m.title}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                          <span>{m.fileName || 'transcript.txt'}</span>
                          <span>•</span>
                          <span>{m.date}</span>
                          {fileTaskCount > 0 && (
                            <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-sans font-bold">
                              {fileTaskCount} deliverables
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Organizer Delete Saved File Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(m);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition shrink-0"
                      title="Delete Saved File from Ledger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Column 2: Active File & AI Commitments Ledger (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        {activeMeeting ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
            
            {/* Header for Active File */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" /> {activeMeeting.title}
                  </h3>
                  <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
                    {activeMeeting.status || 'Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  File: {activeMeeting.fileName} • {activeMeeting.date} • {activeMeeting.size || "1.5 KB"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunAiExtraction}
                  disabled={analyzing}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Run AI Extraction</span>
                    </>
                  )}
                </button>

                {/* Organizer Delete Active File Button */}
                <button
                  onClick={() => onDeleteFile(activeMeeting)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition"
                  title="Delete this file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Verbatim Transcript View */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Verbatim Transcript Text
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeMeeting.transcript.split(/\s+/).length} words
                </span>
              </div>
              <textarea
                readOnly
                value={activeMeeting.transcript}
                className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 leading-relaxed focus:outline-none"
              />
            </div>

            {/* Extracted Commitment Deliverables */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Extracted Deliverables ({visibleTasks.length})
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">Organizer Verification Console</span>
              </div>

              {visibleTasks.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                  <p className="font-semibold text-slate-600">No deliverables extracted yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click "Run AI Extraction" to automatically detect commitments.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {visibleTasks.map((t) => (
                    <div key={t.task_id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs shadow-2xs space-y-2.5">
                      <div className="flex justify-between items-start gap-3">
                        <div className="font-bold text-slate-900 text-sm">{t.title}</div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Verification Status Badges */}
                          {t.status === 'VERIFIED' && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> Organizer Verified
                            </span>
                          )}
                          {t.status === 'PENDING_ORGANIZER_VERIFICATION' && (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase animate-pulse-subtle">
                              <Stamp className="w-3.5 h-3.5 text-amber-700" /> Needs Verification
                            </span>
                          )}
                          {t.status === 'CHANGES_REQUESTED' && (
                            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-800 border border-orange-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                              <AlertTriangle className="w-3.5 h-3.5 text-orange-600" /> Revision Requested
                            </span>
                          )}
                          {t.status === 'ACCEPTED' && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                              <PlayCircle className="w-3.5 h-3.5 text-blue-600" /> In Progress
                            </span>
                          )}
                          {t.status === 'DECLINED' && (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" /> Declined
                            </span>
                          )}
                          {(t.status === 'PENDING_OWNER_SIGNATURE' || !t.status) && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                              <Clock className="w-3.5 h-3.5 text-slate-500" /> Pending Accept
                            </span>
                          )}

                          {/* Organizer Delete Deliverable Button */}
                          <button
                            type="button"
                            onClick={() => onDeleteTask(t.task_id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                            title="Delete Commitment (Organizer Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
                        <div>
                          <span className="text-slate-400 font-medium">Owner:</span>{' '}
                          <strong className="text-indigo-700">{t.assignee}</strong> ({t.assignee_email})
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Target:</span>{' '}
                          <span className="text-slate-700 font-semibold">{t.deadline || 'Next Sprint'}</span>
                        </div>
                      </div>

                      <blockquote className="bg-white border-l-2 border-indigo-500 p-2.5 rounded text-[11px] text-slate-700 font-mono shadow-2xs">
                        "{t.evidence}"
                      </blockquote>

                      {/* DECLINE REASON CALLOUT (If declined) */}
                      {t.status === 'DECLINED' && t.rejection_reason && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-[11px] text-rose-900 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-rose-800">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Declined by Assignee with Reason:</span>
                          </div>
                          <p className="italic pl-5">"{t.rejection_reason}"</p>
                          {t.declined_at && (
                            <p className="text-[10px] text-rose-600 font-mono pl-5">Declined on {t.declined_at}</p>
                          )}
                        </div>
                      )}

                      {/* UPLOADED PROOF & ORGANIZER VERIFICATION ACTION ROW */}
                      {t.completion_file && (
                        <div className={`p-3 rounded-xl border text-[11px] space-y-2 ${
                          t.status === 'VERIFIED'
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                            : t.status === 'PENDING_ORGANIZER_VERIFICATION'
                            ? 'bg-amber-50 border-amber-300 text-amber-950'
                            : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileCheck className={`w-4 h-4 shrink-0 ${t.status === 'VERIFIED' ? 'text-emerald-600' : 'text-amber-600'}`} />
                              <div className="truncate">
                                <span className="font-bold">{t.completion_file.name}</span>{' '}
                                <span className="font-mono text-[10px] opacity-75">({t.completion_file.size || 'Attached'})</span>
                                {t.completion_file.note && (
                                  <p className="text-[10px] truncate italic opacity-90 mt-0.5">Note: {t.completion_file.note}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => onViewProof(t)}
                                className="text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-2.5 py-1 rounded-lg transition"
                              >
                                View Doc
                              </button>

                              {/* Organizers can review & verify proof */}
                              {t.status === 'PENDING_ORGANIZER_VERIFICATION' && (
                                <button
                                  type="button"
                                  onClick={() => onOpenVerification(t)}
                                  className="text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg transition shadow-2xs flex items-center gap-1"
                                >
                                  <Stamp className="w-3 h-3" />
                                  <span>Review & Verify</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {t.status === 'VERIFIED' && t.verified_by && (
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-medium pt-1 border-t border-emerald-200">
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified by <strong>{t.verified_by}</strong> on {t.verified_at || 'Recent'}</span>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-400 text-xs shadow-xs">
            <HardDrive className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700 mb-1">No Saved Transcript Selected</h3>
            <p>Upload a file or choose one from the left panel.</p>
          </div>
        )}
      </div>

      {/* Column 3: ORGANIZER EMPLOYEE CREDENTIAL MANAGEMENT (3 Cols) */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          
          {/* Header & Add Employee Button */}
          <div className="flex justify-between items-center mb-3.5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" /> Employee Directory
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Manage logins & credentials</p>
            </div>
            <button
              type="button"
              onClick={onOpenAddEmployee}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-xl shadow-2xs transition flex items-center gap-1 text-[11px] font-bold px-2.5"
              title="Add New Employee Credentials"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-3.5">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          {/* Employee Credentials List */}
          {filteredEmployees.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
              <UserCheck className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
              <p>No employees found.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredEmployees.map((emp) => (
                <EmployeeCredentialCard 
                  key={emp.email}
                  employee={emp}
                  onEdit={() => onOpenEditEmployee(emp)}
                  onRegenerate={() => onRegeneratePassword(emp)}
                  onDelete={() => onDeleteEmployee(emp)}
                  onSwitch={() => onSwitchEmployee(emp)}
                  showToast={showToast}
                />
              ))}
            </div>
          )}

        </div>
      </div>

    </main>
  );
}

// ==========================================
// EMPLOYEE CREDENTIAL CARD COMPONENT
// ==========================================
function EmployeeCredentialCard({ employee, onEdit, onRegenerate, onDelete, onSwitch, showToast }) {
  const [showPass, setShowPass] = useState(false);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'info');
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs shadow-2xs space-y-2.5">
      {/* Top Info */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            {employee.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>{employee.name}</span>
              {employee.roleTitle && (
                <span className="text-[10px] font-normal bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded">
                  {employee.roleTitle}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-mono">
              <Mail className="w-3 h-3" /> {employee.email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
            title="Edit Employee Credentials"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete / Revoke Credentials"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Password Row */}
      <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-700">
          <Key className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold">{showPass ? employee.password : '••••••••••••'}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="p-1 text-slate-400 hover:text-slate-700"
            title={showPass ? "Hide Password" : "Show Password"}
          >
            {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => copyToClipboard(employee.password, "Password")}
            className="p-1 text-slate-400 hover:text-indigo-600"
            title="Copy Password"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            className="p-1 text-slate-400 hover:text-indigo-600"
            title="Regenerate New Secure Password"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="flex justify-between items-center pt-1">
        <button
          type="button"
          onClick={() => copyToClipboard(`Email: ${employee.email}\nPassword: ${employee.password}`, "Login Details")}
          className="text-[11px] text-slate-500 hover:text-indigo-600 font-semibold flex items-center gap-1"
        >
          <Copy className="w-3 h-3" /> Share Login
        </button>

        <button
          type="button"
          onClick={onSwitch}
          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition flex items-center gap-1"
        >
          <span>Log In As</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// ADD / EDIT EMPLOYEE MODAL
// ==========================================
function EmployeeCredentialModal({ employee, onSave, onClose }) {
  const [name, setName] = useState(employee?.name || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [password, setPassword] = useState(employee?.password || '');
  const [roleTitle, setRoleTitle] = useState(employee?.roleTitle || 'Team Contributor');
  const [showPass, setShowPass] = useState(false);

  const generateRandomPassword = () => {
    const base = name ? name.toLowerCase().replace(/\s+/g, '') : 'user';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setPassword(`${base}-pass-${rand}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      return alert("Please fill all required credential fields.");
    }
    onSave({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      roleTitle: roleTitle.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl">
              <Key className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {employee ? 'Edit Employee Credentials' : 'Add New Employee Credentials'}
              </h3>
              <p className="text-xs text-slate-500">Manage login credentials on The Consent Ledger</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Corporate Email Address</label>
            <input
              type="email"
              required
              placeholder="rahul@consentledger.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Job Role / Department</label>
            <input
              type="text"
              placeholder="e.g. Frontend Engineer / Security Lead"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700">Login Password</label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-Generate
              </button>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                placeholder="Enter password or auto-generate"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono pr-10 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition"
            >
              {employee ? 'Save Changes' : 'Create Credentials'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ==========================================
// ORGANIZER VERIFICATION MODAL (ORGANIZER REVIEWS PROOF)
// ==========================================
function OrganizerVerificationModal({ task, onVerify, onClose }) {
  const [feedback, setFeedback] = useState('');
  const file = task.completion_file || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4 text-amber-700">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Stamp className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Organizer Deliverable Verification</h3>
            <p className="text-xs text-slate-500">Review submitted evidence document and provide digital signature</p>
          </div>
        </div>

        {/* Task Details */}
        <div className="space-y-3.5 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Commitment Deliverable</div>
            <div className="font-bold text-slate-900 text-sm">{task.title}</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-0.5">
              <span>Submitted by:</span>
              <strong className="text-indigo-700">{task.assignee}</strong>
              <span>({task.assignee_email})</span>
            </div>
            <blockquote className="bg-white border-l-2 border-indigo-400 p-2 rounded text-[11px] text-slate-600 font-mono mt-1">
              "{task.evidence}"
            </blockquote>
          </div>

          {/* Attached Evidence Card */}
          <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">{file.name || 'completion_artifact.pdf'}</div>
                <div className="text-[10px] text-emerald-800 font-mono">
                  {file.size || '3.5 KB'} • Uploaded {file.uploaded_at || 'Recent'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
              Evidence Attached
            </span>
          </div>

          {file.note && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px]">
              <span className="font-bold text-slate-700 block mb-0.5">Assignee Completion Note:</span>
              <p className="text-slate-800 italic">{file.note}</p>
            </div>
          )}

          {/* Optional Review Feedback */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Organizer Review Feedback <span className="text-slate-400 font-normal">(Optional for approval / Required for revisions)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Verified endpoints and schema pass all criteria. Approved for sprint release."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-slate-100 font-bold">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-xs"
            >
              Cancel
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onVerify(false, feedback || "Changes requested on deliverable.")}
                className="px-4 py-2 rounded-xl bg-white hover:bg-orange-50 text-orange-800 border border-orange-300 transition text-xs flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                <span>Request Revision</span>
              </button>

              <button
                type="button"
                onClick={() => onVerify(true, feedback)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition text-xs flex items-center gap-1.5"
              >
                <BadgeCheck className="w-4 h-4" />
                <span>Approve & Verify</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// DECLINE TASK MODAL (MANDATORY PROPER REASON)
// ==========================================
function DeclineTaskModal({ task, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');

  const PRESET_REASONS = [
    "Out of current sprint bandwidth / timeline too tight",
    "Blocked by missing API credentials & database access",
    "Incorrect assignee – should be assigned to DevOps / Infrastructure",
    "Requirements scope ambiguous; requires re-estimation"
  ];

  const handleDeclineSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 5) {
      setValidationError("Please specify a proper, detailed reason for declining this commitment (minimum 5 characters).");
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4 text-rose-600">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <XCircle className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Deny / Decline Deliverable</h3>
            <p className="text-xs text-slate-500">Provide an explicit, recorded reason for the ledger</p>
          </div>
        </div>

        {/* Task Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-xs space-y-1.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>{task.title}</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Target Deadline: <strong className="text-slate-700">{task.deadline || "Next Release"}</strong>
          </div>
          <blockquote className="bg-white border-l-2 border-slate-300 p-2 rounded text-[11px] text-slate-600 italic font-mono mt-1">
            "{task.evidence}"
          </blockquote>
        </div>

        {validationError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl mb-3 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleDeclineSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-rose-600" /> Mandatory Reason for Declining *
              </span>
              <span className="text-[10px] text-rose-600 font-mono font-semibold">Required</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain why you cannot accept this deliverable (e.g. scope conflict, missing prerequisites, assigned by error)..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (validationError) setValidationError('');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-100 transition resize-none"
            />
          </div>

          {/* Quick Preset Reason Pills */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              1-Click Quick Reasons
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_REASONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setReason(preset);
                    if (validationError) setValidationError('');
                  }}
                  className="text-[11px] bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-800 border border-slate-200 hover:border-rose-300 rounded-lg px-2.5 py-1 text-left transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 font-bold">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm & Record Decline</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ==========================================
// UPLOAD COMPLETION EVIDENCE DOCUMENT MODAL
// ==========================================
function UploadCompletionModal({ task, onComplete, onCancel }) {
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [note, setNote] = useState('');
  const [urlLink, setUrlLink] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const SAMPLE_FILES = [
    { name: "dynamodb_schema_v2.sql", size: "4.2 KB", note: "Schema definition with secondary indexes" },
    { name: "auth_middleware_pr42.diff", size: "8.5 KB", note: "Validated session tokens and JWT signing" },
    { name: "security_audit_report.pdf", size: "1.2 MB", note: "Penetration test findings and remediations" },
    { name: "ui_component_tokens.json", size: "2.8 KB", note: "Exported light-theme color palette" }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + " KB");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + " KB");
    }
  };

  const handleSelectSample = (sample) => {
    setFileName(sample.name);
    setFileSize(sample.size);
    if (!note) setNote(sample.note);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFileName = fileName.trim() || "completion_evidence_document.pdf";
    const finalSize = fileSize || "2.5 KB";

    onComplete({
      name: finalFileName,
      size: finalSize,
      note: note.trim() || "Completed deliverable as committed.",
      fileUrl: urlLink.trim() || "#"
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4 text-emerald-600">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <FileUp className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Task Evidence Document</h3>
            <p className="text-xs text-slate-500">Provide verifiable documentation to submit for Organizer verification</p>
          </div>
        </div>

        {/* Task Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-xs space-y-1.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{task.title}</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Target Deadline: <strong className="text-slate-700">{task.deadline || "Next Release"}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Drag & Drop or Browse Box */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5 text-emerald-600" /> Attach Evidence Document File *
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="proof-file-input"
            />

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className={`p-5 rounded-xl border-2 border-dashed text-center cursor-pointer transition ${
                isDragOver 
                  ? 'border-emerald-500 bg-emerald-50/60' 
                  : fileName 
                  ? 'border-emerald-300 bg-emerald-50/40 text-slate-800' 
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 text-slate-600'
              }`}
            >
              <Upload className={`w-7 h-7 mx-auto mb-2 ${fileName ? 'text-emerald-600' : 'text-slate-400'}`} />
              {fileName ? (
                <div>
                  <div className="font-bold text-slate-900 flex items-center justify-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>{fileName}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-mono mt-0.5 block">{fileSize} • Click to replace file</span>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-slate-800">Click to browse or drag & drop evidence file</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Supports .pdf, .docx, .zip, .png, .sql, .md, .txt, .json</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Sample Files Selector */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Quick Sample Attachments
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_FILES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2 rounded-lg border text-left transition flex items-center gap-2 ${
                    fileName === sample.name
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <div className="truncate text-[11px]">{sample.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono">{sample.size}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Work Summary / Notes */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Completion Notes / Summary
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Implemented endpoints, passed unit test suites, ready for organizer verification..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition resize-none"
            />
          </div>

          {/* Deliverable URL (Optional) */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Deliverable Link / PR URL <span className="text-slate-400 font-normal">(Optional)</span></span>
            </label>
            <input
              type="text"
              placeholder="https://github.com/org/repo/pull/42"
              value={urlLink}
              onChange={(e) => setUrlLink(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono text-[11px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 font-bold">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Upload Evidence & Submit for Verification</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ==========================================
// VIEW PROOF MODAL (AUDIT CERTIFICATE)
// ==========================================
function ViewProofModal({ task, onClose, showToast }) {
  const file = task.completion_file || {};

  const handleDownloadMock = () => {
    showToast(`Downloading verified deliverable: ${file.name}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${task.status === 'VERIFIED' ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' : 'bg-amber-50 border border-amber-200 text-amber-600'}`}>
              {task.status === 'VERIFIED' ? <BadgeCheck className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {task.status === 'VERIFIED' ? 'Organizer Verified Deliverable' : 'Submitted Evidence Document'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">Immutable Consent Ledger Record</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Commitment Title</div>
            <div className="font-bold text-slate-900 text-sm">{task.title}</div>
            <div className="text-[11px] text-slate-600 mt-1">
              Completed by: <strong className="text-indigo-700">{task.assignee}</strong> ({task.assignee_email})
            </div>
          </div>

          {/* File Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-7 h-7 text-emerald-600" />
              <div>
                <div className="font-bold text-emerald-950 text-xs">{file.name || "completion_proof.pdf"}</div>
                <div className="text-[11px] text-emerald-700 font-mono">
                  {file.size || "3.2 KB"} • Uploaded {file.uploaded_at || task.completed_at || "Recent"}
                </div>
              </div>
            </div>
            <button
              onClick={handleDownloadMock}
              className="p-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs transition"
              title="Download Attached Document"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {file.note && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Completion Note / Summary
              </span>
              <p className="text-slate-800 text-[11px] leading-relaxed">{file.note}</p>
            </div>
          )}

          {task.verified_by && (
            <div className="bg-emerald-100/50 border border-emerald-300 rounded-xl p-3 flex items-center gap-2 text-emerald-900">
              <BadgeCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="font-bold text-[11px]">Officially Verified & Signed by {task.verified_by}</div>
                <div className="text-[10px] text-emerald-700 font-mono">{task.verified_at}</div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// DELETE FILE CONFIRMATION MODAL (ORGANIZER ONLY)
// ==========================================
function DeleteFileModal({ file, onConfirm, onCancel, tasksCount }) {
  const [deleteTasks, setDeleteTasks] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3.5 mb-4 text-rose-600">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <Trash2 className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Delete Saved File</h3>
            <p className="text-xs text-slate-500">Organizer administrative removal confirmation</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-xs">
          <div className="text-slate-900 font-bold mb-1 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            {file.title || file.fileName}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            File: {file.fileName || 'transcript.txt'} | Date: {file.date}
          </div>
          {tasksCount > 0 && (
            <div className="mt-2.5 text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-lg text-[11px]">
              ⚠️ This file has <strong>{tasksCount}</strong> extracted commitment deliverables linked to it.
            </div>
          )}
        </div>

        {tasksCount > 0 && (
          <label className="flex items-center gap-2.5 text-xs text-slate-700 mb-5 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={deleteTasks} 
              onChange={(e) => setDeleteTasks(e.target.checked)} 
              className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
            />
            <span>Also delete all {tasksCount} extracted deliverables associated with this file</span>
          </label>
        )}

        <div className="flex justify-end gap-3 text-xs font-bold">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(deleteTasks)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Yes, Delete File</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DELETE EMPLOYEE MODAL (ORGANIZER ONLY)
// ==========================================
function DeleteEmployeeModal({ employee, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3.5 mb-4 text-rose-600">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <UserCheck className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Revoke Employee Credentials</h3>
            <p className="text-xs text-slate-500">Remove employee from ledger directory</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Are you sure you want to revoke credentials for <strong className="text-slate-900">{employee.name}</strong> ({employee.email})? They will no longer be able to sign in with this password.
        </p>

        <div className="flex justify-end gap-3 text-xs font-bold">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Revoke Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// EMPLOYEE / ASSIGNEE WORKSPACE
// - CLICKABLE TASKS OPENING DECISION BOX
// - ACCEPT / DENY (WITH REASON)
// - UPLOAD EVIDENCE DOCUMENT
// - NO DELETE BUTTON FOR EMPLOYEES
// ==========================================
function EmployeeWorkspace({ 
  currentUser, 
  tasks, 
  onTaskClick,
  onAcceptTask, 
  onDeclineTask, 
  onUploadProof,
  onViewProof,
  showToast
}) {
  const [filterTab, setFilterTab] = useState('ALL');
  const [activeFocusedTaskId, setActiveFocusedTaskId] = useState(null);

  const myTasks = tasks.filter(t => 
    t.assignee?.toLowerCase() === currentUser.name?.toLowerCase() || 
    t.assignee_email?.toLowerCase() === currentUser.email?.toLowerCase() ||
    t.assignee?.toLowerCase() === currentUser.email.split('@')[0].toLowerCase()
  );

  // Status Counts
  const pendingCount = myTasks.filter(t => t.status === 'PENDING_OWNER_SIGNATURE' || !t.status).length;
  const inProgressCount = myTasks.filter(t => t.status === 'ACCEPTED' || t.status === 'CHANGES_REQUESTED').length;
  const awaitingVerificationCount = myTasks.filter(t => t.status === 'PENDING_ORGANIZER_VERIFICATION').length;
  const verifiedCount = myTasks.filter(t => t.status === 'VERIFIED').length;
  const declinedCount = myTasks.filter(t => t.status === 'DECLINED').length;

  // Active Next Task in sequence (pending or in progress)
  const activeFocusTask = myTasks.find(t => 
    t.task_id === activeFocusedTaskId
  ) || myTasks.find(t => 
    t.status === 'PENDING_OWNER_SIGNATURE' || !t.status || t.status === 'ACCEPTED' || t.status === 'CHANGES_REQUESTED'
  ) || myTasks[0];

  // Find next actionable task and switch focus
  const handleSwitchToNextTask = () => {
    const actionableTasks = myTasks.filter(t => 
      t.status === 'PENDING_OWNER_SIGNATURE' || !t.status || t.status === 'ACCEPTED' || t.status === 'CHANGES_REQUESTED'
    );
    if (actionableTasks.length > 1) {
      const currentIndex = actionableTasks.findIndex(t => t.task_id === activeFocusTask?.task_id);
      const nextIndex = (currentIndex + 1) % actionableTasks.length;
      const nextTask = actionableTasks[nextIndex];
      setActiveFocusedTaskId(nextTask.task_id);
      showToast(`Switched focus to: "${nextTask.title}"`, 'info');
    } else {
      showToast("No additional pending tasks in queue.", 'info');
    }
  };

  const filteredTasks = myTasks.filter(t => {
    if (filterTab === 'PENDING') return t.status === 'PENDING_OWNER_SIGNATURE' || !t.status;
    if (filterTab === 'IN_PROGRESS') return t.status === 'ACCEPTED' || t.status === 'CHANGES_REQUESTED';
    if (filterTab === 'AWAITING_VERIFICATION') return t.status === 'PENDING_ORGANIZER_VERIFICATION';
    if (filterTab === 'VERIFIED') return t.status === 'VERIFIED';
    if (filterTab === 'DECLINED') return t.status === 'DECLINED';
    return true;
  });

  return (
    <main className="w-full px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Greeting & Status Metrics (4 Cols) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-base shadow-xs">
              {currentUser.name ? currentUser.name.charAt(0) : currentUser.email.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {currentUser.name || currentUser.email}
              </h2>
              <p className="text-xs text-slate-500 font-mono">{currentUser.email}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
            Click on any task to open its <strong>Decision Box</strong> to accept or deny ownership, upload completion evidence documents, or review verification status.
          </p>
        </div>

        {/* Status Metrics Cards (Interactive Filter Chips) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Deliverables Workflow
            </h3>
            <button
              onClick={() => setFilterTab('ALL')}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition ${
                filterTab === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Show All ({myTasks.length})
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {/* 1. Pending */}
            <button
              onClick={() => setFilterTab('PENDING')}
              className={`p-3 rounded-xl border text-left transition ${
                filterTab === 'PENDING'
                  ? 'bg-amber-100/70 border-amber-400 ring-2 ring-amber-200'
                  : 'bg-amber-50/80 border-amber-200 hover:bg-amber-100/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Pending Accept
                </span>
                <span className="text-amber-700 font-mono text-base font-extrabold">{pendingCount}</span>
              </div>
              <p className="text-[10px] text-amber-700">Click to accept/deny</p>
            </button>

            {/* 2. In Progress / Accepted */}
            <button
              onClick={() => setFilterTab('IN_PROGRESS')}
              className={`p-3 rounded-xl border text-left transition ${
                filterTab === 'IN_PROGRESS'
                  ? 'bg-blue-100/70 border-blue-400 ring-2 ring-blue-200'
                  : 'bg-blue-50/80 border-blue-200 hover:bg-blue-100/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1">
                  <PlayCircle className="w-3.5 h-3.5" /> In Progress
                </span>
                <span className="text-blue-700 font-mono text-base font-extrabold">{inProgressCount}</span>
              </div>
              <p className="text-[10px] text-blue-700">Accepted & active</p>
            </button>

            {/* 3. Awaiting Organizer Verification */}
            <button
              onClick={() => setFilterTab('AWAITING_VERIFICATION')}
              className={`p-3 rounded-xl border text-left transition ${
                filterTab === 'AWAITING_VERIFICATION'
                  ? 'bg-purple-100/70 border-purple-400 ring-2 ring-purple-200'
                  : 'bg-purple-50/80 border-purple-200 hover:bg-purple-100/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-purple-800 flex items-center gap-1">
                  <Stamp className="w-3.5 h-3.5" /> Under Review
                </span>
                <span className="text-purple-700 font-mono text-base font-extrabold">{awaitingVerificationCount}</span>
              </div>
              <p className="text-[10px] text-purple-700">Evidence uploaded</p>
            </button>

            {/* 4. Verified & Certified */}
            <button
              onClick={() => setFilterTab('VERIFIED')}
              className={`p-3 rounded-xl border text-left transition ${
                filterTab === 'VERIFIED'
                  ? 'bg-emerald-100/70 border-emerald-400 ring-2 ring-emerald-200'
                  : 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verified
                </span>
                <span className="text-emerald-700 font-mono text-base font-extrabold">{verifiedCount}</span>
              </div>
              <p className="text-[10px] text-emerald-700">Signed by Organizer</p>
            </button>
          </div>

          {/* Declined Chip */}
          {declinedCount > 0 && (
            <button
              onClick={() => setFilterTab('DECLINED')}
              className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                filterTab === 'DECLINED'
                  ? 'bg-rose-100 border-rose-300 ring-2 ring-rose-200'
                  : 'bg-rose-50/80 border-rose-200 hover:bg-rose-100/50'
              }`}
            >
              <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Declined Deliverables ({declinedCount})
              </span>
              <span className="text-[10px] text-rose-600 font-semibold">View Reasons</span>
            </button>
          )}
        </div>

        {/* Deliverables Sequential Flow Guide */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-xs space-y-2.5">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <MousePointerClick className="w-4 h-4 text-emerald-600" /> Clickable Tasks Feature
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Every deliverable in the list is clickable. Clicking opens the <strong>Task Decision Box</strong> popup allowing you to accept or deny directly with 1-click.
          </p>
        </div>

      </div>

      {/* Right Column: Next Up Task Spotlight + Deliverables List (8 Cols) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Next Up / Active Focus Task Spotlight Card */}
        {activeFocusTask && (
          <div 
            onClick={() => onTaskClick(activeFocusTask)}
            className="bg-gradient-to-r from-indigo-50/80 via-white to-emerald-50/50 border-2 border-indigo-200 hover:border-indigo-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 relative group"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-900">
                  Current Task in Sequence
                </span>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleSwitchToNextTask}
                  className="text-[11px] font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Next Task in Queue</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 mb-1 group-hover:text-indigo-600 transition">
                  {activeFocusTask.title}
                </h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <MousePointerClick className="w-3 h-3" /> Click to open Decision Box
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Target Deadline: <strong className="text-slate-800">{activeFocusTask.deadline || "Next Release"}</strong>
              </p>
            </div>

            <blockquote className="bg-white border-l-3 border-indigo-500 p-3 rounded-xl text-xs text-slate-700 font-mono shadow-2xs">
              "{activeFocusTask.evidence}"
            </blockquote>

            {/* Actions for Active Focus Task */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                {activeFocusTask.status === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" /> Organizer Verified
                  </span>
                )}
                {activeFocusTask.status === 'PENDING_ORGANIZER_VERIFICATION' && (
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                    <Stamp className="w-4 h-4 text-purple-600" /> Awaiting Verification
                  </span>
                )}
                {activeFocusTask.status === 'ACCEPTED' && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                    <PlayCircle className="w-4 h-4 text-blue-600" /> In Progress
                  </span>
                )}
                {activeFocusTask.status === 'CHANGES_REQUESTED' && (
                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-900 border border-orange-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                    <AlertTriangle className="w-4 h-4 text-orange-600" /> Revisions Requested
                  </span>
                )}
                {(activeFocusTask.status === 'PENDING_OWNER_SIGNATURE' || !activeFocusTask.status) && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                    <Clock className="w-4 h-4 text-amber-600" /> Action Required (Accept / Deny)
                  </span>
                )}
              </div>

              {/* Action Buttons for Focus Task */}
              <div className="flex flex-wrap gap-2.5">
                {(activeFocusTask.status === 'PENDING_OWNER_SIGNATURE' || !activeFocusTask.status) && (
                  <>
                    <button
                      type="button"
                      onClick={() => onDeclineTask(activeFocusTask)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Deny with Reason</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onAcceptTask(activeFocusTask.task_id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Task</span>
                    </button>
                  </>
                )}

                {(activeFocusTask.status === 'ACCEPTED' || activeFocusTask.status === 'CHANGES_REQUESTED') && (
                  <button
                    type="button"
                    onClick={() => onUploadProof(activeFocusTask)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>Upload Evidence Document & Advance</span>
                  </button>
                )}

                {(activeFocusTask.status === 'PENDING_ORGANIZER_VERIFICATION' || activeFocusTask.status === 'VERIFIED') && (
                  <button
                    type="button"
                    onClick={() => onViewProof(activeFocusTask)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>View Evidence Document</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Deliverables List Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                All Assigned Deliverables ({filteredTasks.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any task card below to open the Decision Box (Accept / Deny)
              </p>
            </div>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
              Clickable Tasks
            </span>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
              <UserCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No deliverables matching this filter.</p>
              <p className="text-[11px] text-slate-400 mt-1">Switch filter tabs on the left or wait for new meeting extractions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((t) => {
                const isPending = t.status === 'PENDING_OWNER_SIGNATURE' || !t.status;
                const isAccepted = t.status === 'ACCEPTED';
                const isAwaitingVerification = t.status === 'PENDING_ORGANIZER_VERIFICATION';
                const isChangesRequested = t.status === 'CHANGES_REQUESTED';
                const isVerified = t.status === 'VERIFIED';
                const isDeclined = t.status === 'DECLINED';
                const isFocused = activeFocusTask?.task_id === t.task_id;

                return (
                  <div 
                    key={t.task_id} 
                    onClick={() => onTaskClick(t)}
                    className={`rounded-2xl p-5 text-xs shadow-2xs space-y-3.5 transition border cursor-pointer group ${
                      isFocused 
                        ? 'bg-indigo-50/40 border-indigo-300 hover:border-indigo-400 hover:shadow-md' 
                        : 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    
                    {/* Top Row: Title, Target & Badges (Clickable) */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition flex items-center gap-1.5">
                            <span>{t.title}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-indigo-600" />
                          </h4>
                          {isFocused && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.2 rounded-md">
                              Active Focus
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Target Deadline: <strong className="text-slate-800">{t.deadline || "Next Release"}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> Organizer Verified
                          </span>
                        )}
                        {isAwaitingVerification && (
                          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <Stamp className="w-3.5 h-3.5 text-purple-600" /> Under Review
                          </span>
                        )}
                        {isChangesRequested && (
                          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-900 border border-orange-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" /> Revision Needed
                          </span>
                        )}
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <PlayCircle className="w-3.5 h-3.5 text-blue-600" /> In Progress
                          </span>
                        )}
                        {isDeclined && (
                          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Declined
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Click to Decide
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Verbatim Quote */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Verbatim Transcript Evidence Quote
                      </span>
                      <blockquote className="bg-white border-l-3 border-emerald-500 p-3 rounded-lg text-[11px] text-slate-800 font-mono shadow-2xs">
                        "{t.evidence}"
                      </blockquote>
                    </div>

                    {/* ORGANIZER REVISION FEEDBACK (If changes requested) */}
                    {isChangesRequested && t.verification_feedback && (
                      <div className="bg-orange-50 border border-orange-300 rounded-xl p-3 text-[11px] text-orange-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-orange-800">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span>Organizer Revision Notes:</span>
                        </div>
                        <p className="italic pl-5">"{t.verification_feedback}"</p>
                      </div>
                    )}

                    {/* DECLINE REASON DISPLAY (If declined) */}
                    {isDeclined && t.rejection_reason && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-[11px] text-rose-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-rose-800">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Recorded Reason for Declining:</span>
                        </div>
                        <p className="italic pl-5">"{t.rejection_reason}"</p>
                        {t.declined_at && (
                          <p className="text-[10px] text-rose-600 font-mono pl-5">Recorded on {t.declined_at}</p>
                        )}
                      </div>
                    )}

                    {/* COMPLETED EVIDENCE DOCUMENT DISPLAY (If uploaded or verified) */}
                    {(isAwaitingVerification || isVerified) && t.completion_file && (
                      <div className={`rounded-xl p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                        isVerified
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-purple-50/70 border-purple-200 text-purple-950'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-600">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{t.completion_file.name}</span>
                              <span className="text-[10px] font-mono text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">
                                {t.completion_file.size || "Evidence Doc"}
                              </span>
                            </div>
                            <p className="text-[11px] opacity-90 mt-0.5">
                              {t.completion_file.note || "Evidence document attached"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onViewProof(t)}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold transition flex items-center gap-1 text-[11px]"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Evidence</span>
                          </button>

                          {!isVerified && (
                            <button
                              type="button"
                              onClick={() => onUploadProof(t)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1 text-[11px]"
                              title="Update document"
                            >
                              <FileUp className="w-3.5 h-3.5" />
                              <span>Update</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* WORKFLOW ACTION BUTTONS IN TASK CARD */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Click card to open full decision box</span>
                      </span>

                      <div className="flex gap-2">
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => onDeclineTask(t)}
                              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Deny</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onAcceptTask(t.task_id)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>
                          </>
                        )}

                        {(isAccepted || isChangesRequested) && (
                          <button
                            type="button"
                            onClick={() => onUploadProof(t)}
                            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                          >
                            <FileUp className="w-3.5 h-3.5" />
                            <span>Upload Evidence</span>
                          </button>
                        )}

                        {isDeclined && (
                          <button
                            type="button"
                            onClick={() => onAcceptTask(t.task_id)}
                            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Re-Accept</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
