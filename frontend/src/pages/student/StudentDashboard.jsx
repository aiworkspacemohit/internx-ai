import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService, applicationService, interviewService, announcementService, userService, aiService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import ApplicationTimeline from '../../components/student/ApplicationTimeline';
import { Briefcase, CheckCircle2, Calendar, Award, Sparkles, ArrowRight, Clock, Megaphone, Video, Upload, User as UserIcon, FileText, Check } from 'lucide-react';

const StudentDashboard = () => {
  const { user, login } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes, interviewsRes, annRes, recRes] = await Promise.all([
          analyticsService.getStudentAnalytics(),
          applicationService.getStudentApps(),
          interviewService.getStudentInterviews(),
          announcementService.getAnnouncements(),
          aiService.getRecommendations()
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data);
        setInterviews(interviewsRes.data);
        setAnnouncements(annRes.data);
        setRecommendations(recRes.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    setUploadSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await userService.uploadAvatar(formData);
      setUploadSuccess('Profile picture updated via Cloudinary!');
      // Update local context
      const meRes = await userService.updateProfile({});
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to upload image to Cloudinary.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingResume(true);
    setUploadSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await userService.uploadResume(formData);
      setUploadSuccess('Resume document uploaded to Cloudinary successfully!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to upload resume document to Cloudinary.');
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const upcomingInterviews = interviews.filter(i => new Date(i.scheduled_at) >= new Date());
  const activeApp = applications.length > 0 ? applications[0] : null;

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            
            {/* Avatar with Cloudinary Upload */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600/30 border-2 border-indigo-500/50 flex items-center justify-center text-white overflow-hidden shadow-xl">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={36} className="text-indigo-300" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white cursor-pointer shadow-lg transition-all transform hover:scale-110">
                <Upload size={14} />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
              {uploadingAvatar && <span className="absolute inset-0 bg-slate-900/80 rounded-2xl flex items-center justify-center text-xs text-indigo-400 font-bold">Uploading...</span>}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Placement Portal • {user?.department || 'Student'}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Welcome back, {user?.full_name}!</h1>
              <p className="text-xs md:text-sm text-slate-400">
                Cloudinary Asset Storage & Gemini AI recommendations active.
              </p>

              {/* Upload Resume Shortcut */}
              <div className="pt-2 flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:border-indigo-500 cursor-pointer transition">
                  <FileText size={14} className="text-indigo-400" />
                  <span>{uploadingResume ? 'Uploading to Cloudinary...' : user?.resume_url ? 'Update Cloudinary Resume' : 'Upload Resume PDF'}</span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                </label>
                {user?.resume_url && (
                  <a href={user.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline font-medium">
                    View Uploaded Resume
                  </a>
                )}
              </div>
            </div>

          </div>

          <Link
            to="/student/ai-hub"
            className="gradient-bg-primary px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Gemini AI Review</span>
          </Link>
        </div>

        {uploadSuccess && (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Check size={14} />
            <span>{uploadSuccess}</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Submitted"
          value={stats?.total_applications || 0}
          icon={Briefcase}
          color="indigo"
          subtext="Submitted applications"
        />
        <StatCard
          title="Shortlisted"
          value={stats?.shortlisted_count || 0}
          icon={CheckCircle2}
          color="emerald"
          subtext={`${stats?.response_rate_percent || 0}% Response rate`}
        />
        <StatCard
          title="Interviews"
          value={stats?.interviews_count || 0}
          icon={Calendar}
          color="amber"
          subtext="Active technical rounds"
        />
        <StatCard
          title="Offers Received"
          value={stats?.offers_count || 0}
          icon={Award}
          color="blue"
          subtext="Official placement offers"
        />
      </div>

      {/* Main Grid: Application Timeline & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Application Tracker */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>Latest Application Progress</span>
            </h3>
            <Link to="/student/applications" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1">
              <span>View All ({applications.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeApp ? (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{activeApp.internship?.title}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{activeApp.internship?.company?.company_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Applied on {new Date(activeApp.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <ApplicationTimeline currentStatus={activeApp.status} />

              {activeApp.feedback && (
                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
                  <span className="font-bold">Recruiter Feedback: </span>{activeApp.feedback}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs space-y-3">
              <p>You haven't submitted any internship applications yet.</p>
              <Link to="/student/internships" className="inline-block gradient-bg-primary px-4 py-2 rounded-xl text-xs font-semibold">
                Explore Opportunities
              </Link>
            </div>
          )}
        </div>

        {/* Right 1 Col: Upcoming Interviews */}
        <div className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Upcoming Interviews</span>
          </h3>

          <div className="space-y-3">
            {upcomingInterviews.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center">No scheduled interviews pending.</p>
            ) : (
              upcomingInterviews.map((interview) => (
                <div key={interview.id} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <span>{interview.round_name}</span>
                    <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">{interview.status}</span>
                  </div>
                  <p className="text-slate-300 font-semibold">{interview.application?.internship?.title}</p>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{new Date(interview.scheduled_at).toLocaleString()} ({interview.duration_minutes} mins)</span>
                  </div>
                  {interview.meeting_link && (
                    <a
                      href={interview.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:underline pt-1 font-semibold"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meeting Room</span>
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Gemini AI Recommended Opportunities */}
      {recommendations.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Gemini AI Matched Opportunities</span>
            </h3>
            <Link to="/student/internships" className="text-xs text-indigo-400 hover:underline font-semibold">
              Browse All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-indigo-500/50 transition">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    {item.match_score}% Gemini Match
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{item.stipend}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-indigo-400 font-medium">{item.company_name}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.match_reason}</p>
                <Link to="/student/internships" className="inline-block pt-1 text-xs text-indigo-400 font-bold hover:underline">
                  Apply Now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
