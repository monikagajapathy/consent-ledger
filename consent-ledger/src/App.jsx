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
  const [taskToDelegate, setTaskToDelegate] = useState(null);
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
    const finalReason = (reason && reason.trim()) ? reason.trim() : "Declined by assignee";
    const timeStr = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    setTasks(prev => prev.map(t => t.task_id === taskId ? {
      ...t,
      status: 'DECLINED',
      rejection_reason: finalReason,
      declined_at: timeStr
    } : t));

    setDecisionModalTask(prev => prev && prev.task_id === taskId ? {
      ...prev,
      status: 'DECLINED',
      rejection_reason: finalReason,
      declined_at: timeStr
    } : prev);

    setTaskToDecline(null);
    showToast("Task declined. Reason recorded in ledger.", "info");

    try {
      fetch(`${API_BASE_URL}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, action: 'DECLINE', reason: finalReason }),
      }).catch(e => console.warn(e));
    } catch (err) {
      console.warn("Sync failed, stored locally.");
    }
  };

  // 2b. Delegate / Re-assign Task to Another Employee
  const handleDelegateTask = (taskId, newAssignee, newDeadline, delegationNote) => {
    const timeStr = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    const targetTask = tasks.find(t => t.task_id === taskId);
    const prevAssignee = targetTask ? targetTask.assignee : "Previous Assignee";

    setTasks(prev => prev.map(t => {
      if (t.task_id === taskId) {
        return {
          ...t,
          assignee: newAssignee.name,
          assignee_email: newAssignee.email,
          deadline: newDeadline || t.deadline || "Next Release",
          status: 'PENDING_OWNER_SIGNATURE',
          delegated_from: prevAssignee,
          delegation_note: delegationNote || `Reassigned from ${prevAssignee} to ${newAssignee.name}`,
          delegated_at: timeStr,
          rejection_reason: null
        };
      }
      return t;
    }));

    setDecisionModalTask(prev => prev && prev.task_id === taskId ? {
      ...prev,
      assignee: newAssignee.name,
      assignee_email: newAssignee.email,
      deadline: newDeadline || prev.deadline || "Next Release",
      status: 'PENDING_OWNER_SIGNATURE',
      delegated_from: prevAssignee,
      delegation_note: delegationNote || `Reassigned from ${prevAssignee} to ${newAssignee.name}`,
      delegated_at: timeStr,
      rejection_reason: null
    } : prev);

    setTaskToDelegate(null);
    showToast(`Deliverable delegated & re-assigned to ${newAssignee.name} (${newAssignee.email})!`, "success");
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

  // Unified Organizer Notifications (Accept, Deny with reason, Delegate, Evidence Upload)
  const organizerNotifications = tasks.reduce((acc, t) => {
    if (t.status === 'PENDING_ORGANIZER_VERIFICATION') {
      acc.push({
        id: `notif-verify-${t.task_id}`,
        type: 'VERIFY',
        badge: 'Evidence Review Needed',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        title: t.title,
        assignee: t.assignee,
        detail: `${t.assignee} uploaded proof "${t.completion_file?.name || 'evidence document'}"`,
        time: t.completed_at || 'Recent',
        task: t
      });
    } else if (t.status === 'DECLINED') {
      acc.push({
        id: `notif-decline-${t.task_id}`,
        type: 'DECLINED',
        badge: 'Denied by Employee',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        title: t.title,
        assignee: t.assignee,
        detail: `${t.assignee} denied deliverable. Reason: "${t.rejection_reason || 'No reason specified'}"`,
        time: t.declined_at || 'Recent',
        task: t
      });
    } else if (t.status === 'ACCEPTED') {
      acc.push({
        id: `notif-accept-${t.task_id}`,
        type: 'ACCEPTED',
        badge: 'Task Accepted',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        title: t.title,
        assignee: t.assignee,
        detail: `${t.assignee} accepted commitment (In Progress)`,
        time: t.accepted_at || 'Recent',
        task: t
      });
    }
    if (t.delegated_from) {
      acc.push({
        id: `notif-delegate-${t.task_id}`,
        type: 'DELEGATED',
        badge: 'Task Delegated',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        title: t.title,
        assignee: t.assignee,
        detail: `Reassigned from ${t.delegated_from} to ${t.assignee}`,
        time: t.delegated_at || 'Recent',
        task: t
      });
    }
    return acc;
  }, []);

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

      {/* CLICKABLE TASK DECISION BOX MODAL (ACCEPT / DENY / UPLOAD / VIEW / DELEGATE) */}
      {decisionModalTask && (
        <TaskDecisionModal
          task={tasks.find(t => t.task_id === decisionModalTask.task_id) || decisionModalTask}
          onAccept={(taskId) => handleAcceptTask(taskId)}
          onDecline={(task) => setTaskToDecline(task)}
          onDelegate={(task) => setTaskToDelegate(task)}
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

      {/* Decline Task Modal (MANDATORY REASON & DELEGATION OPTION) */}
      {taskToDecline && (
        <DeclineTaskModal
          task={taskToDecline}
          onConfirm={(reason) => handleConfirmDecline(taskToDecline.task_id, reason)}
          onDelegate={() => {
            const task = taskToDecline;
            setTaskToDecline(null);
            setTaskToDelegate(task);
          }}
          onCancel={() => setTaskToDecline(null)}
        />
      )}

      {/* Delegate / Re-assign Deliverable Modal */}
      {taskToDelegate && (
        <DelegateTaskModal
          task={taskToDelegate}
          registeredAssignees={registeredAssignees}
          onConfirm={(newAssignee, newDeadline, note) => handleDelegateTask(taskToDelegate.task_id, newAssignee, newDeadline, note)}
          onCancel={() => setTaskToDelegate(null)}
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
            
            {/* Live Employee Response & Activity Notification Bell for Organizer */}
            {currentUser.role === 'organizer' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-xl border transition ${
                    organizerNotifications.length > 0
                      ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300 hover:bg-indigo-500/30'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Employee Activity & Ledger Notifications"
                >
                  {organizerNotifications.length > 0 ? (
                    <BellRing className="w-4 h-4 text-amber-300 animate-bounce-short" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                  {organizerNotifications.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                      {organizerNotifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Popup */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-88 bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-indigo-600" />
                        Employee Ledger Alerts ({organizerNotifications.length})
                      </span>
                      <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {organizerNotifications.length === 0 ? (
                      <p className="text-slate-400 text-xs text-center py-4">No recent employee responses or ledger alerts.</p>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {organizerNotifications.map(notif => (
                          <div key={notif.id} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${notif.badgeClass}`}>
                                {notif.badge}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                            </div>
                            <div className="font-bold text-slate-900 truncate">{notif.title}</div>
                            <p className="text-[11px] text-slate-600 leading-snug">{notif.detail}</p>
                            
                            {notif.type === 'VERIFY' && (
                              <div className="pt-1 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNotificationsOpen(false);
                                    setTaskToVerify(notif.task);
                                  }}
                                  className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition"
                                >
                                  Review & Verify
                                </button>
                              </div>
                            )}
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
            onDelegateTask={(task) => setTaskToDelegate(task)}
            showToast={showToast}
          />
        ) : (
          /* EmployeeWorkspace (Exclusive Accept/Deny and Evidence Upload - Delegation Restricted to Organizer) */
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
function TaskDecisionModal({ task, onAccept, onDecline, onDelegate, onUploadProof, onViewProof, onClose }) {
  if (!task) return null;
  const statusUpper = (task.status || '').toUpperCase();
  const isPending = !task.status || 
    statusUpper === 'PENDING_OWNER_SIGNATURE' || 
    statusUpper === 'PENDING_SIGNATURE' || 
    statusUpper === 'PENDING' || 
    statusUpper === 'ASSIGNED' || 
    statusUpper === 'UNCONFIRMED' || 
    statusUpper === 'DRAFT';
  const isAccepted = statusUpper === 'ACCEPTED';
  const isAwaitingVerification = statusUpper === 'PENDING_ORGANIZER_VERIFICATION';
  const isChangesRequested = statusUpper === 'CHANGES_REQUESTED';
  const isVerified = statusUpper === 'VERIFIED';
  const isDeclined = statusUpper === 'DECLINED';

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

        {/* ===== ACTION BUTTONS — RIGHT HERE, IMMEDIATELY VISIBLE ===== */}
        {isPending && (
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
              ⚡ Your Decision Required
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTaskToDecline(task);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-white hover:bg-rose-50 border-2 border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-700 font-bold transition shadow-xs flex flex-col items-center gap-1.5 group"
              >
                <div className="p-2 bg-rose-50 group-hover:bg-rose-100 rounded-xl text-rose-600">
                  <XCircle className="w-6 h-6" />
                </div>
                <span className="font-extrabold text-sm">Deny</span>
                <span className="text-[10px] font-normal text-slate-400 group-hover:text-rose-500">Provide mandatory reason</span>
              </button>
              <button
                type="button"
                onClick={() => { onAccept(task.task_id); }}
                className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-lg flex flex-col items-center gap-1.5"
              >
                <div className="p-2 bg-emerald-500/30 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="font-extrabold text-sm">Accept</span>
                <span className="text-[10px] font-normal text-emerald-100">Claim & Mark In Progress</span>
              </button>
            </div>
          </div>
        )}

        {(isAccepted || isChangesRequested) && (
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Your Next Action</div>
            <div className="flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => { onClose(); onDecline(task); }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-300 hover:border-rose-300 text-xs font-semibold transition"
              >
                Deny / Return Task
              </button>
              <button
                type="button"
                onClick={() => { onClose(); onUploadProof(task); }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                <FileUp className="w-4 h-4" />
                <span>Upload Evidence Document</span>
              </button>
            </div>
          </div>
        )}

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

        {/* DECISION ACTION BOX SECTION — Secondary Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3">
          {isDeclined && (
            <button
              type="button"
              onClick={() => { onAccept(task.task_id); }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Reconsider & Accept</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs ml-auto"
          >
            Close
          </button>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-100 flex flex-col justify-center items-center p-6 relative font-sans w-full overflow-hidden">
      
      {/* Decorative Ambient Accents */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-indigo-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Floating Dark Diagonal Squares Layer (Background & Outer Orbit) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        {/* Top-Left Large Dark Diagonal Square */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-700/70 rounded-3xl backdrop-blur-xl shadow-2xl shadow-indigo-950/30 animate-float-slow flex items-center justify-center">
          <div className="w-56 h-56 border border-slate-700/60 rounded-2xl bg-slate-900/60 shadow-inner flex items-center justify-center">
            <div className="w-32 h-32 border border-indigo-500/40 rounded-xl bg-indigo-950/40" />
          </div>
        </div>

        {/* Bottom-Right Large Dark Diagonal Square */}
        <div className="absolute -bottom-28 -right-28 w-88 h-88 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-slate-700/70 rounded-3xl backdrop-blur-xl shadow-2xl shadow-emerald-950/30 animate-float-reverse flex items-center justify-center">
          <div className="w-60 h-60 border border-slate-700/60 rounded-2xl bg-slate-900/60 shadow-inner flex items-center justify-center">
            <div className="w-36 h-36 border border-emerald-500/40 rounded-xl bg-emerald-950/40" />
          </div>
        </div>

        {/* Top-Right Medium Dark Diagonal Square */}
        <div className="absolute top-14 right-14 w-44 h-44 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/40 rounded-2xl backdrop-blur-md shadow-xl animate-float-drift flex items-center justify-center">
          <div className="w-24 h-24 border border-indigo-400/30 rounded-lg bg-indigo-900/30" />
        </div>

        {/* Bottom-Left Medium Dark Diagonal Square */}
        <div className="absolute bottom-16 left-14 w-48 h-48 bg-gradient-to-bl from-slate-900 via-teal-950 to-slate-950 border border-teal-500/40 rounded-2xl backdrop-blur-md shadow-xl animate-float-reverse flex items-center justify-center">
          <div className="w-28 h-28 border border-teal-400/30 rounded-lg bg-teal-900/30" />
        </div>

        {/* Mid-Left Floating Accent Dark Square */}
        <div className="absolute top-1/3 left-6 w-16 h-16 bg-slate-900/90 border border-indigo-500/50 rounded-xl backdrop-blur-sm animate-pulse-slow shadow-lg flex items-center justify-center">
          <div className="w-8 h-8 border border-indigo-400/50 rounded-sm bg-indigo-950/70" />
        </div>

        {/* Mid-Right Floating Accent Dark Square */}
        <div className="absolute bottom-1/3 right-8 w-20 h-20 bg-slate-900/90 border border-emerald-500/50 rounded-xl backdrop-blur-sm animate-float-fast shadow-lg flex items-center justify-center">
          <div className="w-10 h-10 border border-emerald-400/50 rounded-md bg-emerald-950/70" />
        </div>

        {/* Micro Floating Dark Diagonal Squares */}
        <div className="absolute top-24 left-1/3 w-10 h-10 bg-slate-900/80 border border-slate-700 rounded-md animate-float-reverse shadow-md" />
        <div className="absolute bottom-24 right-1/3 w-12 h-12 bg-slate-900/80 border border-slate-700 rounded-md animate-float-slow shadow-md" />
        <div className="absolute top-1/2 left-20 w-8 h-8 bg-indigo-950/90 border border-indigo-400/60 rounded-sm animate-pulse-slow shadow-sm" />
        <div className="absolute top-1/2 right-20 w-9 h-9 bg-slate-900/90 border border-emerald-400/60 rounded-sm animate-float-slow shadow-sm" />
      </div>

      {/* Login Container Wrapper with Near-Box Dark Diagonal Squares */}
      <div className="relative w-full max-w-lg z-10">
        
        {/* Dark Diagonal Squares Floating Near The Login Box */}
        {/* Top-Right Corner Orbiting Dark Square */}
        <div className="absolute -top-7 -right-7 w-20 h-20 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border border-indigo-400/50 rounded-2xl shadow-xl backdrop-blur-md animate-orbit-box pointer-events-none flex items-center justify-center z-20">
          <div className="w-10 h-10 border border-indigo-300/40 rounded-lg bg-indigo-900/40" />
        </div>

        {/* Top-Left Corner Floating Dark Square */}
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-600/60 rounded-xl shadow-lg backdrop-blur-md animate-float-slow pointer-events-none flex items-center justify-center z-20">
          <div className="w-8 h-8 border border-slate-500/40 rounded-sm bg-slate-800/60" />
        </div>

        {/* Bottom-Right Corner Orbiting Dark Square */}
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border border-emerald-400/50 rounded-2xl shadow-xl backdrop-blur-md animate-orbit-box-delayed pointer-events-none flex items-center justify-center z-20">
          <div className="w-12 h-12 border border-emerald-300/40 rounded-lg bg-emerald-900/40" />
        </div>

        {/* Bottom-Left Corner Floating Dark Square */}
        <div className="absolute -bottom-6 -left-6 w-18 h-18 bg-gradient-to-br from-slate-950 to-indigo-950 border border-indigo-500/50 rounded-xl shadow-lg backdrop-blur-md animate-float-reverse pointer-events-none flex items-center justify-center z-20">
          <div className="w-9 h-9 border border-indigo-400/40 rounded-md bg-indigo-900/50" />
        </div>

        {/* Left Side Near-Box Micro Dark Square */}
        <div className="absolute top-1/2 -left-10 -translate-y-1/2 w-12 h-12 bg-slate-900/95 border border-indigo-400/60 rounded-lg shadow-md animate-float-drift pointer-events-none hidden sm:flex items-center justify-center z-20">
          <div className="w-6 h-6 border border-indigo-300/40 rounded-xs bg-indigo-950/80" />
        </div>

        {/* Right Side Near-Box Micro Dark Square */}
        <div className="absolute top-1/2 -right-10 -translate-y-1/2 w-14 h-14 bg-slate-900/95 border border-emerald-400/60 rounded-xl shadow-md animate-orbit-box pointer-events-none hidden sm:flex items-center justify-center z-20">
          <div className="w-7 h-7 border border-emerald-300/40 rounded-sm bg-emerald-950/80" />
        </div>

        {/* Main Login Card */}
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-8 sm:p-10 relative">
          
          {/* Brand Header with Dark Tilted Square Accent Motif */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center mb-3.5">
              {/* Dark tilted background square behind logo icon */}
              <div className="absolute w-14 h-14 bg-slate-900 border border-slate-700 rounded-xl rotate-45 shadow-md animate-pulse-slow" />
              <div className="relative p-3.5 bg-white border border-indigo-100 rounded-2xl shadow-sm z-10">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
              </div>
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
  onDelegateTask,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('deliverables'); // 'deliverables' | 'delegation' | 'employees'
  const [delegationFilter, setDelegationFilter] = useState('ALL');
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
    <main className="w-full px-6 lg:px-8 py-6 space-y-6">
      
      {/* ORGANIZER TABBED NAVIGATION HEADER */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('deliverables')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 border ${
              activeTab === 'deliverables'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Files & Extracted Deliverables</span>
            <span className="ml-1 bg-indigo-500/30 text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
              {tasks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('delegation')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 border ${
              activeTab === 'delegation'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-300" />
            <span>Task Delegation & Re-assignment Console</span>
            {tasks.filter(t => t.status === 'DECLINED').length > 0 ? (
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold animate-pulse-subtle">
                {tasks.filter(t => t.status === 'DECLINED').length} Declined Needs Action
              </span>
            ) : (
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-mono">
                Organizer Authority
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 border ${
              activeTab === 'employees'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team & Employee Credentials</span>
            <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {registeredAssignees.length}
            </span>
          </button>
        </div>

        <div className="text-[11px] font-mono font-semibold text-slate-500 pr-2 hidden sm:block">
          Project Lead Workspace • Exclusive Delegation Rights
        </div>
      </div>

      {/* TAB 1: FILES & EXTRACTED DELIVERABLES VIEW */}
      {activeTab === 'deliverables' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          
          {/* Column 1: Upload & Saved Files Management (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Organizer Pending Verification Alert Box */}
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

            {/* Saved Files List */}
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

          {/* Column 2: Active File & AI Commitments Ledger (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
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
                    className="w-full h-28 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 leading-relaxed focus:outline-none"
                  />
                </div>

                {/* Extracted Commitment Deliverables */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Extracted Deliverables ({visibleTasks.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('delegation')}
                      className="text-indigo-600 hover:underline font-bold text-xs flex items-center gap-1"
                    >
                      <span>Open Delegation Console</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
                              {t.status === 'VERIFIED' && (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
                                </span>
                              )}
                              {t.status === 'PENDING_ORGANIZER_VERIFICATION' && (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase animate-pulse-subtle">
                                  <Stamp className="w-3.5 h-3.5 text-amber-700" /> Needs Verification
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

                              {/* Organizer Delegate Button */}
                              <button
                                type="button"
                                onClick={() => onDelegateTask(t)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                                title="Delegate / Re-assign Deliverable to another employee"
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>Delegate</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onDeleteTask(t.task_id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                                title="Delete Commitment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
                            <div>Owner: <strong className="text-indigo-700">{t.assignee}</strong> ({t.assignee_email})</div>
                            <div>Target: <span className="text-slate-700 font-semibold">{t.deadline || 'Next Sprint'}</span></div>
                          </div>

                          <blockquote className="bg-white border-l-2 border-indigo-500 p-2.5 rounded text-[11px] text-slate-700 font-mono shadow-2xs">
                            "{t.evidence}"
                          </blockquote>

                          {t.status === 'DECLINED' && t.rejection_reason && (
                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-[11px] text-rose-900 space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                <span>Declined by Assignee with Reason:</span>
                              </div>
                              <p className="italic pl-5">"{t.rejection_reason}"</p>
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
        </div>
      )}

      {/* TAB 2: ORGANIZER EXCLUSIVE TASK DELEGATION & RE-ASSIGNMENT CONSOLE */}
      {activeTab === 'delegation' && (
        <div className="space-y-6 w-full">
          
          {/* Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Organizer Privilege
                </span>
                <span className="text-xs text-slate-300 font-mono">• Centralized Task Allocation</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Task Delegation & Re-assignment Console</h2>
              <p className="text-xs text-indigo-200/80 max-w-2xl">
                Only Organizers have authority to delegate or re-assign deliverables. Inspect employee declination reasons, re-assign workloads, and track complete delegation audit history.
              </p>
            </div>

            {/* Summary Badges */}
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl px-4 py-2.5 text-center">
                <div className="text-xl font-extrabold text-white">{tasks.length}</div>
                <div className="text-[10px] text-slate-300 uppercase font-bold">Total Tasks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-rose-500/40 rounded-2xl px-4 py-2.5 text-center">
                <div className="text-xl font-extrabold text-rose-400">
                  {tasks.filter(t => t.status === 'DECLINED').length}
                </div>
                <div className="text-[10px] text-rose-200 uppercase font-bold">Declined</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-indigo-400/40 rounded-2xl px-4 py-2.5 text-center">
                <div className="text-xl font-extrabold text-indigo-300">
                  {tasks.filter(t => t.delegated_from).length}
                </div>
                <div className="text-[10px] text-indigo-200 uppercase font-bold">Delegated</div>
              </div>
            </div>
          </div>

          {/* Delegation Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 font-bold">
              <button
                onClick={() => setDelegationFilter('ALL')}
                className={`px-3.5 py-2 rounded-xl transition ${
                  delegationFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Tasks ({tasks.length})
              </button>
              <button
                onClick={() => setDelegationFilter('DECLINED')}
                className={`px-3.5 py-2 rounded-xl transition ${
                  delegationFilter === 'DECLINED' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                🚨 Declined Needs Re-assignment ({tasks.filter(t => t.status === 'DECLINED').length})
              </button>
              <button
                onClick={() => setDelegationFilter('DELEGATED')}
                className={`px-3.5 py-2 rounded-xl transition ${
                  delegationFilter === 'DELEGATED' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                🔄 Re-assigned History ({tasks.filter(t => t.delegated_from).length})
              </button>
              <button
                onClick={() => setDelegationFilter('PENDING')}
                className={`px-3.5 py-2 rounded-xl transition ${
                  delegationFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Pending Accept ({tasks.filter(t => !t.status || t.status.includes('PENDING')).length})
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Showing filtered tasks for Organizer action
            </div>
          </div>

          {/* Delegation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks
              .filter(t => {
                if (delegationFilter === 'DECLINED') return t.status === 'DECLINED';
                if (delegationFilter === 'DELEGATED') return Boolean(t.delegated_from);
                if (delegationFilter === 'PENDING') return !t.status || t.status.includes('PENDING');
                return true;
              })
              .map(t => (
                <div key={t.task_id} className={`bg-white border-2 rounded-2xl p-5 text-xs shadow-xs space-y-3 flex flex-col justify-between ${
                  t.status === 'DECLINED' ? 'border-rose-300 bg-rose-50/10' : t.delegated_from ? 'border-indigo-300 bg-indigo-50/10' : 'border-slate-200'
                }`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold text-slate-400">ID: {t.task_id.substring(0, 10)}</span>
                      
                      {t.status === 'DECLINED' && (
                        <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          Declined
                        </span>
                      )}
                      {t.status === 'ACCEPTED' && (
                        <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          In Progress
                        </span>
                      )}
                      {t.status === 'VERIFIED' && (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          Verified
                        </span>
                      )}
                      {(!t.status || t.status.includes('PENDING')) && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          Pending
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{t.title}</h3>

                    <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      <div>Assignee: <strong className="text-indigo-700">{t.assignee}</strong></div>
                      <span>•</span>
                      <div>Target: <strong className="text-slate-800">{t.deadline || 'Next Release'}</strong></div>
                    </div>

                    <blockquote className="bg-slate-50 border-l-2 border-indigo-500 p-2 rounded text-[11px] text-slate-700 font-mono">
                      "{t.evidence}"
                    </blockquote>

                    {/* DECLINED REASON CALLOUT */}
                    {t.status === 'DECLINED' && t.rejection_reason && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-[11px] text-rose-900 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-rose-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>Employee Declination Reason:</span>
                        </div>
                        <p className="italic pl-4">"{t.rejection_reason}"</p>
                        {t.declined_at && (
                          <p className="text-[10px] text-rose-600 font-mono pl-4">Declined on {t.declined_at}</p>
                        )}
                      </div>
                    )}

                    {/* DELEGATION AUDIT TAG */}
                    {t.delegated_from && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 text-[11px] text-indigo-900 space-y-0.5">
                        <div className="font-bold flex items-center gap-1 text-indigo-800">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>Delegated from {t.delegated_from}</span>
                        </div>
                        <p className="text-[10px] text-indigo-700 font-mono">{t.delegation_note || `Reassigned to ${t.assignee}`}</p>
                      </div>
                    )}
                  </div>

                  {/* ORGANIZER DELEGATE / RE-ASSIGN BUTTON */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onDelegateTask(t)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Delegate / Re-assign Deliverable</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* TAB 3: TEAM DIRECTORY & EMPLOYEE CREDENTIALS VIEW */}
      {activeTab === 'employees' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 w-full">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" /> Employee Directory & Access Credentials
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage employee login credentials, secret passkeys, and account authority</p>
            </div>
            <button
              type="button"
              onClick={onOpenAddEmployee}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>
          </div>

          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search employees by name, email, or role title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      )}

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
  if (!task) return null;
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
    const finalReason = reason.trim() || "Declined by assignee";
    onConfirm(finalReason);
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
                <MessageSquare className="w-3.5 h-3.5 text-rose-600" /> Reason for Declining
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Optional (Defaults to "Declined by assignee")</span>
            </label>
            <textarea
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

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 font-bold">
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
// DELEGATE / RE-ASSIGN TASK MODAL
// ==========================================
function DelegateTaskModal({ task, registeredAssignees, onConfirm, onCancel }) {
  if (!task) return null;
  const [selectedAssignee, setSelectedAssignee] = useState(
    registeredAssignees.find(a => a.email.toLowerCase() !== (task.assignee_email || '').toLowerCase()) || registeredAssignees[0]
  );
  const [newDeadline, setNewDeadline] = useState(task.deadline || '2026-09-25');
  const [note, setNote] = useState(
    task.rejection_reason 
      ? `Reassigned because ${task.assignee} declined: "${task.rejection_reason}"`
      : `Delegated deliverable from ${task.assignee} to ${selectedAssignee?.name || 'new assignee'}.`
  );

  const handleDelegateSubmit = (e) => {
    e.preventDefault();
    if (!selectedAssignee) return alert("Please select a target team member to delegate to.");
    onConfirm(selectedAssignee, newDeadline, note.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-7 shadow-2xl animate-in fade-in zoom-in-95 space-y-5">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4 text-indigo-600">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <UserCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Delegate / Re-assign Deliverable</h3>
            <p className="text-xs text-slate-500">Hand over task ownership & transfer deliverable accountability</p>
          </div>
        </div>

        {/* Deliverable Info Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Task Title</span>
              <div className="font-extrabold text-slate-900 text-sm">{task.title}</div>
            </div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Current Owner: {task.assignee}
            </span>
          </div>

          {task.rejection_reason && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-[11px] text-rose-900">
              <strong className="text-rose-800 block mb-0.5">Decline Reason Provided:</strong>
              <p className="italic">"{task.rejection_reason}"</p>
            </div>
          )}

          <blockquote className="bg-white border-l-2 border-slate-300 p-2.5 rounded text-[11px] text-slate-600 italic font-mono">
            "{task.evidence}"
          </blockquote>
        </div>

        <form onSubmit={handleDelegateSubmit} className="space-y-4 text-xs">
          
          {/* Delegate Target Employee Selection */}
          <div>
            <label className="block font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" /> Select New Owner / Delegate To *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {registeredAssignees.map(emp => {
                const isCurrent = emp.email.toLowerCase() === (task.assignee_email || '').toLowerCase();
                const isSelected = selectedAssignee && selectedAssignee.email.toLowerCase() === emp.email.toLowerCase();
                return (
                  <button
                    key={emp.email}
                    type="button"
                    onClick={() => {
                      setSelectedAssignee(emp);
                      setNote(`Delegated deliverable from ${task.assignee} to ${emp.name}.`);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200 text-indigo-950 font-bold'
                        : isCurrent
                        ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800 font-medium'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{emp.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{emp.roleTitle || 'Team Member'}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* New Target Deadline */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" /> Updated Completion Deadline
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                placeholder="e.g. 2026-09-25 or Next Sprint"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-medium text-xs focus:outline-none focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => setNewDeadline("2026-09-25")}
                className="px-2.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded-xl border border-indigo-200 shrink-0"
              >
                +7 Days
              </button>
            </div>
          </div>

          {/* Delegation Handover Note */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" /> Handover Note & Instructions
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add instructions or context for the new assignee..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 resize-none font-medium"
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Confirm Delegation to {selectedAssignee?.name || 'Assignee'}</span>
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
    { name: "dynamodb_schema_v2.sql", size: "4.2 KB", note: "Created partition keys & indices." },
    { name: "light_dashboard_v1.fig", size: "12.8 MB", note: "Light theme layouts & component specs." },
    { name: "soc2_ssl_audit_report.pdf", size: "1.4 MB", note: "Passed penetration tests." }
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + " KB");
    }
  };

  const loadSampleFile = (sample) => {
    setFileName(sample.name);
    setFileSize(sample.size);
    setNote(sample.note);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileName.trim()) {
      return alert("Please select or specify a completion evidence document.");
    }
    onComplete({
      name: fileName.trim(),
      size: fileSize || "3.5 KB",
      note: note.trim() || "Work completed and verified.",
      fileUrl: urlLink.trim() || "#"
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4 text-indigo-600">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
            <FileUp className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Completion Evidence</h3>
            <p className="text-xs text-slate-500">Provide proof artifacts for Organizer verification sign-off</p>
          </div>
        </div>

        {/* Deliverable Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Deliverable Title</div>
          <div className="font-bold text-slate-900 text-sm">{task.title}</div>
          <div className="text-slate-500 text-[11px]">
            Target Deadline: <strong className="text-slate-800">{task.deadline || "Next Release"}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* File Drag Drop Dropzone */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              id="evidence-file-input"
            />
            <label
              htmlFor="evidence-file-input"
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files?.[0]) {
                  setFileName(e.dataTransfer.files[0].name);
                  setFileSize((e.dataTransfer.files[0].size / 1024).toFixed(1) + " KB");
                }
              }}
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition ${
                isDragOver ? 'border-indigo-500 bg-indigo-50/70' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-indigo-400'
              }`}
            >
              <Paperclip className="w-8 h-8 text-indigo-500 mb-2" />
              {fileName ? (
                <div className="text-center">
                  <p className="font-bold text-slate-900">{fileName}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{fileSize} • Ready for Submission</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-bold text-slate-700">Click to Select or Drag & Drop File</p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports SQL, PDF, Code, Zip, Images, Documents</p>
                </div>
              )}
            </label>
          </div>

          {/* Quick Preset Artifact Buttons */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Quick Sample Evidence Attachments
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_FILES.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => loadSampleFile(sample)}
                  className="text-[11px] bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 hover:border-indigo-300 rounded-lg px-2.5 py-1 text-left transition"
                >
                  + {sample.name}
                </button>
              ))}
            </div>
          </div>

          {/* Optional URL Link */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Pull Request / Live Figma / Repo Link <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://github.com/company/repo/pull/104"
              value={urlLink}
              onChange={(e) => setUrlLink(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono text-xs"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Completion Notes / Release Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe what was done or key findings..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white resize-none"
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <FileUp className="w-4 h-4" />
              <span>Submit for Verification</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ==========================================
// VIEW PROOF DOCUMENT DETAILS MODAL
// ==========================================
function ViewProofModal({ task, onClose, showToast }) {
  const file = task.completion_file || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <FileCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Completion Evidence Document</h3>
              <p className="text-xs text-slate-500 font-mono">Ledger Record ID: {task.task_id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Document Name</span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Verified Attachment
            </span>
          </div>
          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-600" />
            <span>{file.name || 'deliverable_artifact.pdf'}</span>
          </div>
          <div className="text-slate-500 font-mono text-[11px] flex gap-4">
            <span>Size: <strong>{file.size || '3.5 KB'}</strong></span>
            <span>Uploaded: <strong>{file.uploaded_at || 'Recent'}</strong></span>
          </div>
        </div>

        {/* Notes */}
        {file.note && (
          <div className="space-y-1 text-xs">
            <span className="font-bold text-slate-700 block">Completion Notes:</span>
            <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 italic leading-relaxed">
              "{file.note}"
            </p>
          </div>
        )}

        {/* Verification Status */}
        {task.status === 'VERIFIED' && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-950 flex items-center gap-2.5">
            <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">Digitally Verified by {task.verified_by || 'Lead Organizer'}</div>
              <div className="text-[10px] opacity-80 font-mono">Timestamp: {task.verified_at || 'Recent'}</div>
            </div>
          </div>
        )}

        {/* Close Button */}
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
  );
}

// ==========================================
// DELETE FILE CONFIRMATION MODAL (ORGANIZER)
// ==========================================
function DeleteFileModal({ file, onConfirm, onCancel, tasksCount }) {
  const [deleteTasks, setDeleteTasks] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
        
        <div className="flex items-center gap-3 text-rose-600">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <Trash2 className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Delete Saved Transcript File?</h3>
            <p className="text-xs text-slate-500">Organizer administrative deletion</p>
          </div>
        </div>

        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Target: {file.title || file.fileName}</span>
          </div>
          <p className="text-[11px] text-rose-800">
            This action will remove the transcript document from the saved files directory.
          </p>
        </div>

        {tasksCount > 0 && (
          <label className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={deleteTasks}
              onChange={(e) => setDeleteTasks(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span>Also delete all <strong>{tasksCount} linked commitments</strong> extracted from this file</span>
          </label>
        )}

        <div className="flex justify-end gap-3 pt-2 font-bold text-xs">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(deleteTasks)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
          >
            Confirm Permanent Delete
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// DELETE EMPLOYEE MODAL (ORGANIZER)
// ==========================================
function DeleteEmployeeModal({ employee, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
        
        <div className="flex items-center gap-3 text-rose-600">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Revoke Credentials?</h3>
            <p className="text-xs text-slate-500">Remove employee login access</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to revoke login access for <strong>{employee.name}</strong> ({employee.email})? They will no longer be able to sign into the portal.
        </p>

        <div className="flex justify-end gap-3 pt-2 font-bold text-xs">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
          >
            Revoke Access
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// EMPLOYEE WORKSPACE COMPONENT
// ==========================================
function EmployeeWorkspace({ currentUser, tasks, onTaskClick, onAcceptTask, onDeclineTask, onDelegateTask, onUploadProof, onViewProof, showToast }) {
  const [filter, setFilter] = useState('ALL');
  const [viewScope, setViewScope] = useState('MY_DELIVERABLES'); // 'MY_DELIVERABLES' or 'ALL_TEAM'

  // Match user tasks by email, email prefix, or first/last name
  const userEmail = (currentUser.email || '').toLowerCase().trim();
  const userName = (currentUser.name || '').toLowerCase().trim();
  const userPrefix = userEmail.split('@')[0];

  const matchedTasks = tasks.filter(t => {
    const tEmail = (t.assignee_email || '').toLowerCase().trim();
    const tName = (t.assignee || '').toLowerCase().trim();
    const tPrefix = tEmail.split('@')[0];

    const emailMatch = Boolean(userEmail && tEmail && (
      userEmail === tEmail || 
      userPrefix === tPrefix || 
      userEmail.includes(tPrefix) || 
      tEmail.includes(userPrefix)
    ));

    const nameMatch = Boolean(userName && tName && (
      userName === tName || 
      userName.includes(tName) || 
      tName.includes(userName)
    ));

    return emailMatch || nameMatch;
  });

  // Use matchedTasks for MY_DELIVERABLES unless empty (fallback to all tasks) or viewScope is ALL_TEAM
  const activeTaskSet = (viewScope === 'ALL_TEAM' || matchedTasks.length === 0) ? tasks : matchedTasks;

  const helperIsPending = (status) => {
    if (!status) return true;
    const s = String(status).toUpperCase();
    return s === 'PENDING_OWNER_SIGNATURE' || s === 'PENDING_SIGNATURE' || s === 'PENDING' || s === 'ASSIGNED' || s === 'UNCONFIRMED' || s === 'DRAFT';
  };

  const filteredTasks = activeTaskSet.filter(t => {
    const s = (t.status || '').toUpperCase();
    if (filter === 'PENDING') return helperIsPending(t.status);
    if (filter === 'ACCEPTED') return s === 'ACCEPTED';
    if (filter === 'REVIEW') return s === 'PENDING_ORGANIZER_VERIFICATION' || s === 'CHANGES_REQUESTED';
    if (filter === 'VERIFIED') return s === 'VERIFIED';
    if (filter === 'DECLINED') return s === 'DECLINED';
    return true;
  });

  const pendingCount = activeTaskSet.filter(t => helperIsPending(t.status)).length;
  const acceptedCount = activeTaskSet.filter(t => (t.status || '').toUpperCase() === 'ACCEPTED').length;
  const verifiedCount = activeTaskSet.filter(t => (t.status || '').toUpperCase() === 'VERIFIED').length;
  const declinedCount = activeTaskSet.filter(t => (t.status || '').toUpperCase() === 'DECLINED').length;

  return (
    <main className="w-full px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase">
              Employee Portal
            </span>
            <span className="text-xs text-slate-300 font-mono">• Interactive Deliverables Sign-off</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Welcome, {currentUser.name || currentUser.email}!</h2>
          <p className="text-xs text-indigo-200/80 max-w-xl">
            Click on any commitment card below to open the Decision Box. Accept or deny commitments, provide mandatory rejection reasons, and upload completion evidence.
          </p>

          {/* View Scope Switcher: My Deliverables vs All Team Deliverables */}
          <div className="pt-2 flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setViewScope('MY_DELIVERABLES')}
              className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                viewScope === 'MY_DELIVERABLES'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                  : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/20'
              }`}
            >
              My Deliverables ({matchedTasks.length})
            </button>
            <button
              type="button"
              onClick={() => setViewScope('ALL_TEAM')}
              className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                viewScope === 'ALL_TEAM'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                  : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/20'
              }`}
            >
              All Transcript Commitments ({tasks.length})
            </button>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl px-4 py-2.5 text-center">
            <div className="text-xl font-extrabold text-amber-300">{pendingCount}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">Pending</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl px-4 py-2.5 text-center">
            <div className="text-xl font-extrabold text-blue-300">{acceptedCount}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">In Progress</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl px-4 py-2.5 text-center">
            <div className="text-xl font-extrabold text-emerald-300">{verifiedCount}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">Verified</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Instructional Note */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All View ({activeTaskSet.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filter === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Pending Decision ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('ACCEPTED')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filter === 'ACCEPTED' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-800 hover:bg-blue-100'
            }`}
          >
            In Progress ({acceptedCount})
          </button>
          <button
            onClick={() => setFilter('VERIFIED')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filter === 'VERIFIED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Verified ({verifiedCount})
          </button>
          <button
            onClick={() => setFilter('DECLINED')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filter === 'DECLINED' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Declined ({declinedCount})
          </button>
        </div>

        <div className="text-xs text-indigo-700 font-medium flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl">
          <MousePointerClick className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Click any card to open <strong>Decision Box</strong></span>
        </div>
      </div>

      {/* CLICKABLE TASK CARDS GRID */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-xs shadow-xs space-y-2">
          <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No deliverables found for this view filter</h3>
          <p className="text-slate-500">Switch filter tabs above or click "All Transcript Commitments".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((t) => (
            <EmployeeTaskCard 
              key={t.task_id}
              task={t}
              onCardClick={() => onTaskClick(t)}
              onAccept={() => onAcceptTask(t.task_id)}
              onDecline={() => onDeclineTask(t)}
              onUploadProof={() => onUploadProof(t)}
              onViewProof={() => onViewProof(t)}
            />
          ))}
        </div>
      )}

    </main>
  );
}

// ==========================================
// EMPLOYEE CLICKABLE TASK CARD
// ==========================================
function EmployeeTaskCard({ task, onCardClick, onAccept, onDecline, onDelegate, onUploadProof, onViewProof }) {
  const statusUpper = (task.status || '').toUpperCase();
  const isPending = !task.status || 
    statusUpper === 'PENDING_OWNER_SIGNATURE' || 
    statusUpper === 'PENDING_SIGNATURE' || 
    statusUpper === 'PENDING' || 
    statusUpper === 'ASSIGNED' || 
    statusUpper === 'UNCONFIRMED' || 
    statusUpper === 'DRAFT';
  const isAccepted = statusUpper === 'ACCEPTED';
  const isAwaitingVerification = statusUpper === 'PENDING_ORGANIZER_VERIFICATION';
  const isChangesRequested = statusUpper === 'CHANGES_REQUESTED';
  const isVerified = statusUpper === 'VERIFIED';
  const isDeclined = statusUpper === 'DECLINED';

  return (
    <div 
      onClick={onCardClick}
      className={`group bg-white border-2 rounded-2xl p-5 text-xs shadow-xs hover:shadow-xl transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
        isPending 
          ? 'border-amber-300/80 hover:border-amber-400 bg-amber-50/10' 
          : isAccepted 
          ? 'border-blue-300/80 hover:border-blue-400' 
          : isVerified 
          ? 'border-emerald-300/80 hover:border-emerald-400 bg-emerald-50/10' 
          : isAwaitingVerification
          ? 'border-purple-300/80 hover:border-purple-400 bg-purple-50/10'
          : isChangesRequested
          ? 'border-orange-300/80 hover:border-orange-400 bg-orange-50/10'
          : 'border-rose-200 hover:border-rose-300 bg-rose-50/10'
      }`}
    >
      
      {/* Top Header & Status Badge */}
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            ID: {task.task_id.substring(0, 10)}
          </span>

          {/* Status Badge */}
          {isVerified && (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <BadgeCheck className="w-3 h-3 text-emerald-600" /> Verified
            </span>
          )}
          {isAwaitingVerification && (
            <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 animate-pulse-subtle">
              <Stamp className="w-3 h-3 text-purple-700" /> Under Review
            </span>
          )}
          {isChangesRequested && (
            <span className="bg-orange-100 text-orange-900 border border-orange-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-orange-600" /> Revision Needed
            </span>
          )}
          {isAccepted && (
            <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <PlayCircle className="w-3 h-3 text-blue-600" /> In Progress
            </span>
          )}
          {isDeclined && (
            <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-600" /> Declined
            </span>
          )}
          {isPending && (
            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" /> Action Needed
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition">
          {task.title}
        </h3>

        <div className="text-[11px] text-slate-500 font-medium">
          Deadline: <strong className="text-slate-800">{task.deadline || "Next Release"}</strong>
        </div>
      </div>

      {/* Quote Evidence */}
      <blockquote className="bg-slate-50 border-l-2 border-indigo-500 p-2.5 rounded text-[11px] text-slate-700 font-mono shadow-2xs">
        "{task.evidence}"
      </blockquote>

      {/* Decline Reason Callout */}
      {isDeclined && task.rejection_reason && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-[11px] text-rose-900 space-y-0.5">
          <div className="font-bold flex items-center gap-1 text-rose-800">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Reason:
          </div>
          <p className="italic pl-4">"{task.rejection_reason}"</p>
        </div>
      )}

      {/* Completion Artifact Pill */}
      {task.completion_file && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold truncate text-slate-800">{task.completion_file.name}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewProof();
            }}
            className="text-[10px] font-bold text-indigo-600 hover:underline shrink-0"
          >
            View Doc
          </button>
        </div>
      )}

      {/* Card Action Buttons — Large & Prominent for Pending Tasks */}
      <div onClick={(e) => e.stopPropagation()} className="space-y-2">

        {/* PENDING: Full-width Accept / Deny button row */}
        {isPending && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onDecline}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-200 hover:border-rose-400 text-xs font-extrabold transition shadow-xs"
            >
              <XCircle className="w-4 h-4" />
              Deny
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accept
            </button>
          </div>
        )}

        {/* ACCEPTED or CHANGES REQUESTED: Full-width Upload Evidence button */}
        {(isAccepted || isChangesRequested) && (
          <button
            type="button"
            onClick={onUploadProof}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition shadow-md"
          >
            <FileUp className="w-4 h-4" />
            Upload Evidence Document
          </button>
        )}

        {/* Delegate / Re-assign button ONLY for tasks after decision (DECLINED, ACCEPTED, CHANGES_REQUESTED) */}
        {onDelegate && !isPending && !isVerified && (
          <button
            type="button"
            onClick={onDelegate}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 text-[11px] font-bold transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Delegate / Re-assign Deliverable</span>
          </button>
        )}

        {/* Secondary link — open full Decision Box modal */}
        <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onCardClick}
            className="text-slate-400 hover:text-indigo-600 font-semibold flex items-center gap-1 text-[11px] hover:underline"
          >
            <MousePointerClick className="w-3 h-3 text-indigo-400" />
            <span>Open full Decision Box</span>
          </button>
          {isVerified && (
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" /> Verified
            </span>
          )}
        </div>
      </div>

    </div>
  );
}