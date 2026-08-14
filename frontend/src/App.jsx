import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './routes/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import StudentRegister from './pages/auth/StudentRegister';
import CompanyRegister from './pages/auth/CompanyRegister';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import InternshipSearch from './pages/student/InternshipSearch';
import ApplicationTracker from './pages/student/ApplicationTracker';
import AIHub from './pages/student/AIHub';
import InterviewCalendar from './pages/student/InterviewCalendar';
import StudentAnnouncements from './pages/student/Announcements';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import JobPostings from './pages/company/JobPostings';
import ApplicantPipeline from './pages/company/ApplicantPipeline';
import ScheduledInterviews from './pages/company/ScheduledInterviews';
import CompanyProfilePage from './pages/company/CompanyProfilePage';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import StudentMonitoring from './pages/officer/StudentMonitoring';
import CompanyVerification from './pages/officer/CompanyVerification';
import OfficerAnnouncements from './pages/officer/OfficerAnnouncements';
import DepartmentReports from './pages/officer/DepartmentReports';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CompanyApprovals from './pages/admin/CompanyApprovals';
import OfficerCreation from './pages/admin/OfficerCreation';
import SystemLogs from './pages/admin/SystemLogs';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16">
        {user && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}
        
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all duration-300 ${user ? 'lg:ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

const DefaultRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'STUDENT': return <Navigate to="/student/dashboard" replace />;
    case 'COMPANY': return <Navigate to="/company/dashboard" replace />;
    case 'OFFICER': return <Navigate to="/officer/dashboard" replace />;
    case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <AppLayout>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/company" element={<CompanyRegister />} />

        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/internships" element={<InternshipSearch />} />
          <Route path="/student/applications" element={<ApplicationTracker />} />
          <Route path="/student/ai-hub" element={<AIHub />} />
          <Route path="/student/calendar" element={<InterviewCalendar />} />
          <Route path="/student/announcements" element={<StudentAnnouncements />} />
        </Route>

        {/* Company Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/jobs" element={<JobPostings />} />
          <Route path="/company/applicants" element={<ApplicantPipeline />} />
          <Route path="/company/interviews" element={<ScheduledInterviews />} />
          <Route path="/company/profile" element={<CompanyProfilePage />} />
        </Route>

        {/* Officer Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']} />}>
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          <Route path="/officer/students" element={<StudentMonitoring />} />
          <Route path="/officer/companies" element={<CompanyVerification />} />
          <Route path="/officer/announcements" element={<OfficerAnnouncements />} />
          <Route path="/officer/reports" element={<DepartmentReports />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/approvals" element={<CompanyApprovals />} />
          <Route path="/admin/officers" element={<OfficerCreation />} />
          <Route path="/admin/system" element={<SystemLogs />} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
