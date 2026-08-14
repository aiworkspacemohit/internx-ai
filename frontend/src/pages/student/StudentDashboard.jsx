import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService, applicationService, interviewService, announcementService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import ApplicationTimeline from '../../components/student/ApplicationTimeline';
import { Briefcase, CheckCircle2, Calendar, Award, Sparkles, ArrowRight, Clock, Megaphone, Video } from 'lucide-react';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes, interviewsRes, annRes] = await Promise.all([
          analyticsService.getStudentAnalytics(),
          applicationService.getStudentApps(),
          interviewService.getStudentInterviews(),
          announcementService.getAnnouncements()
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data);
        setInterviews(interviewsRes.data);
        setAnnouncements(annRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Placement Lifecycle Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Student Dashboard</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Track your internship applications, interview schedules, and AI preparation tools in real-time.
            </p>
          </div>
          <Link
            to="/student/ai-hub"
            className="gradient-bg-primary px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Resume Review</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Submitted"
          value={stats?.total_applications || 0}
          icon={Briefcase}
          color="indigo"
          subtext="Submitted internship applications"
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
                Explore Available Opportunities
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

      {/* Recent Announcements */}
      <div className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Megaphone className="w-5 h-5 text-rose-400" />
          <span>Placement Cell Announcements</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.slice(0, 2).map((a) => (
            <div key={a.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300'}`}>
                  {a.priority}
                </span>
                <span className="text-[10px] text-slate-500">{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{a.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{a.content}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;
