import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService, applicationService, interviewService, announcementService, userService, aiService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import ApplicationTimeline from '../../components/student/ApplicationTimeline';
import { Briefcase, CheckCircle2, Calendar, Award, Sparkles, ArrowRight, Clock, Video, Upload, User as UserIcon, FileText, Check, ChevronRight } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Today');

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
      await userService.uploadAvatar(formData);
      setUploadSuccess('Profile picture updated successfully!');
      await userService.updateProfile({});
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to upload image.');
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
      await userService.uploadResume(formData);
      setUploadSuccess('Resume document uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to upload resume document.');
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-600 font-medium">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const upcomingInterviews = interviews.filter(i => new Date(i.scheduled_at) >= new Date());
  const activeApp = applications.length > 0 ? applications[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900 max-w-[1600px] mx-auto">
      
      {/* 1. Header Row (Edu.ai Style: Good morning, Name) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-transparent pb-2">
        <div className="flex items-center space-x-4">
          <div className="relative group shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center overflow-hidden shadow-sm">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={28} className="text-white" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 p-1 bg-zinc-900 text-white hover:bg-black rounded-lg cursor-pointer shadow-md transition">
              <Upload size={11} />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Good morning, {user?.full_name ? user.full_name.split(' ')[0] : 'Student'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              You've saved 3h 42m this week. Two placement rounds are ready for today.
            </p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center space-x-2.5">
          <label className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shadow-xs">
            <span>{uploadingResume ? 'Uploading...' : user?.resume_url ? 'Update Resume PDF' : 'Upload Resume PDF'}</span>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
          </label>
          
          <Link
            to="/student/internships"
            className="bg-zinc-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs"
          >
            <span>+ New Opportunity</span>
          </Link>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <Check size={14} className="text-emerald-600" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* 2. Main Grid Layout (Top 4 Stat Cards + Right Indigo AI Suggestion Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Stat Cards & Upcoming Table */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Placement Match"
              value="98.6%"
              isHighlighted={true}
              trend="41% vs last week"
            />
            <StatCard
              title="Applications Sent"
              value={stats?.total_applications || 12}
              subtext="4 this week"
              trend="On track for term"
            />
            <StatCard
              title="Shortlisted Rounds"
              value={stats?.shortlisted_count || 28}
              subtext="+8 this week"
            />
            <StatCard
              title="Avg Feedback Time"
              value="2.1 days"
              subtext="↓ 34% faster"
            />
          </div>

          {/* Upcoming Lessons / Internships List Container (Edu.ai Style) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upcoming Opportunities & Rounds</h3>
                <p className="text-xs text-slate-400">Scheduled tests, interviews and applications</p>
              </div>

              {/* Time Filter Pills */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {['Today', 'This week', 'Term'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-3 py-1 rounded-lg transition ${
                      timeFilter === filter
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List Rows */}
            <div className="space-y-3">
              {upcomingInterviews.length > 0 ? (
                upcomingInterviews.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/80 transition text-xs">
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-slate-900 min-w-[50px]">09:00</span>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.round_name}</h4>
                        <p className="text-[11px] text-slate-400">{item.application?.internship?.title || 'Technical Round'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="hidden sm:inline text-[11px] text-slate-500 font-medium">50 min</span>
                      <span className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full text-[11px]">Ready</span>
                      <button className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/80 transition text-xs">
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-slate-900 min-w-[50px]">09:00</span>
                      <div>
                        <h4 className="font-bold text-slate-900">Software Engineering Internship</h4>
                        <p className="text-[11px] text-slate-400">Acme Corp · Full Stack</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="hidden sm:inline text-[11px] text-slate-500 font-medium">50 min</span>
                      <span className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full text-[11px]">Ready</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/80 transition text-xs">
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-slate-900 min-w-[50px]">11:30</span>
                      <div>
                        <h4 className="font-bold text-slate-900">AI & Machine Learning Track</h4>
                        <p className="text-[11px] text-slate-400">DeepMind Lab · PyTorch</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="hidden sm:inline text-[11px] text-slate-500 font-medium">50 min</span>
                      <span className="bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full text-[11px]">Draft</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Week at a glance */}
            <div className="pt-3 space-y-3">
              <span className="text-xs font-semibold text-slate-700 block">Week at a glance</span>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-zinc-900 text-white space-y-1">
                  <span className="text-[10px] text-slate-400 block font-medium">Mon 21</span>
                  <span className="text-xl font-bold block">4</span>
                  <span className="text-[10px] text-slate-400 block">rounds</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-medium">Tue 22</span>
                  <span className="text-xl font-bold block text-slate-900">3</span>
                  <span className="text-[10px] text-slate-400 block">rounds</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-medium">Wed 23</span>
                  <span className="text-xl font-bold block text-slate-900">2</span>
                  <span className="text-[10px] text-slate-400 block">rounds</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-medium">Thu 24</span>
                  <span className="text-xl font-bold block text-slate-900">4</span>
                  <span className="text-[10px] text-slate-400 block">rounds</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-medium">Fri 25</span>
                  <span className="text-xl font-bold block text-slate-900">3</span>
                  <span className="text-[10px] text-slate-400 block">rounds</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right 4 Cols: Edu.ai Electric Indigo AI Suggestion Sidebar Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Electric Indigo AI Suggestion Card */}
          <div className="bg-indigo-600 rounded-3xl p-6 text-white space-y-5 relative overflow-hidden shadow-md">
            
            <div className="flex items-center justify-between">
              <span className="bg-[#bef264] text-zinc-900 font-semibold text-xs px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Suggestion
              </span>
              <button className="text-xs text-indigo-200 underline font-medium">Why this?</button>
            </div>

            <div>
              <h3 className="text-xl font-bold leading-tight">
                2 opportunities match your skill stack perfectly
              </h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between text-xs hover:bg-white/20 transition cursor-pointer">
                <div>
                  <h4 className="font-semibold text-white">Frontend React Developer</h4>
                  <p className="text-[11px] text-indigo-200">React · Tailwind · Redux</p>
                </div>
                <ArrowRight className="w-4 h-4 text-lime-300" />
              </div>

              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between text-xs hover:bg-white/20 transition cursor-pointer">
                <div>
                  <h4 className="font-semibold text-white">Fullstack FastAPI Engineer</h4>
                  <p className="text-[11px] text-indigo-200">Python · PostgreSQL</p>
                </div>
                <ArrowRight className="w-4 h-4 text-lime-300" />
              </div>
            </div>

            <Link
              to="/student/ai-hub"
              className="w-full bg-[#bef264] hover:bg-[#a3e635] text-zinc-900 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-xs"
            >
              <span>Review AI Suggestions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

          {/* Feedback Queue / Progress Card (Edu.ai Style) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">Feedback Queue</h4>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">36 waiting</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Resume ATS Optimization</span>
                  <span className="font-bold text-slate-900">8 / 24</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 w-1/3 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Mock Interview Technical Quiz</span>
                  <span className="font-bold text-slate-900">24 / 30</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-4/5 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Department Verification</span>
                  <span className="font-bold text-emerald-600">29 / 29</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Oldest submission: <strong>3 days</strong> (CS Track)</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
