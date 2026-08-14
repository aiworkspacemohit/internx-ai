import React, { useState } from 'react';
import { aiService } from '../../services/api';
import { Sparkles, FileText, CheckCircle2, AlertCircle, HelpCircle, MapPin, Target, RefreshCw } from 'lucide-react';

const AIHub = () => {
  const [activeTab, setActiveTab] = useState('resume');

  // Resume State
  const [resumeText, setResumeText] = useState(
    "Alex Rivera\nSoftware Engineering Student with expertise in Python, FastAPI, React, JavaScript, SQL, and Git. Built full-stack applications with JWT authentication and responsive Tailwind CSS interfaces. Looking for Software Engineering Internship opportunities."
  );
  const [targetRole, setTargetRole] = useState("Software Engineer Intern");
  const [resumeResult, setResumeResult] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

  // Interview Prep State
  const [roleTitle, setRoleTitle] = useState("Backend Engineer Intern");
  const [techStack, setTechStack] = useState("Python, FastAPI, PostgreSQL, Redis");
  const [interviewResult, setInterviewResult] = useState(null);
  const [loadingInterview, setLoadingInterview] = useState(false);

  // Career Roadmap State
  const [currentSkills, setCurrentSkills] = useState("Python, Basic HTML/CSS, Git");
  const [roadmapRole, setRoadmapRole] = useState("Full Stack Developer");
  const [roadmapResult, setRoadmapResult] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  const handleReviewResume = async () => {
    setLoadingResume(true);
    try {
      const res = await aiService.reviewResume({ resume_text: resumeText, target_role: targetRole });
      setResumeResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResume(false);
    }
  };

  const handleGenerateInterview = async () => {
    setLoadingInterview(true);
    try {
      const res = await aiService.generateInterviewPrep({ role_title: roleTitle, tech_stack: techStack });
      setInterviewResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInterview(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setLoadingRoadmap(true);
    try {
      const res = await aiService.generateCareerRoadmap({ current_skills: currentSkills, target_role: roadmapRole });
      setRoadmapResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">InternX AI Hub</h1>
            <p className="text-xs text-slate-400">Intelligent career preparation tools powered by Gemini AI</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mt-6 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'resume' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            📄 AI Resume Reviewer
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'interview' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Interview Question Generator
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'roadmap' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            🗺️ Career Milestone Roadmap
          </button>
        </div>
      </div>

      {/* Tab 1: AI Resume Reviewer */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
            <h3 className="text-base font-bold text-white">Paste Resume Text & Target Position</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Position Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Resume Content / Plain Text</label>
              <textarea
                rows={10}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>

            <button
              onClick={handleReviewResume}
              disabled={loadingResume}
              className="w-full gradient-bg-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingResume ? 'Analyzing Resume...' : 'Analyze Resume with Gemini AI'}</span>
            </button>
          </div>

          {/* Results Panel */}
          <div className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
            <h3 className="text-base font-bold text-white">AI Evaluation Scorecard</h3>
            
            {resumeResult ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">ATS Match Score</span>
                    <span className="text-3xl font-extrabold text-emerald-400">{resumeResult.match_score}%</span>
                  </div>
                  <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-white text-sm bg-emerald-950/40">
                    {resumeResult.match_score}/100
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Strengths</h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {resumeResult.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Recommended Improvements</h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {resumeResult.improvements?.map((imp, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {resumeResult.missing_keywords?.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-slate-400 uppercase tracking-wider">Missing Industry Keywords</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {resumeResult.missing_keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                Click 'Analyze Resume' to view ATS match score & detailed feedback.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Interview Question Generator */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
            <h3 className="text-base font-bold text-white">Generate Role-Specific Technical & HR Interview Questions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role Title</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Tech Stack</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateInterview}
              disabled={loadingInterview}
              className="gradient-bg-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingInterview ? 'Generating Questions...' : 'Generate AI Interview Prep'}</span>
            </button>
          </div>

          {interviewResult && (
            <div className="space-y-4">
              {interviewResult.questions?.map((q, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {q.category}
                    </span>
                    <span className="text-xs text-slate-500">Question #{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{q.question}</h4>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-emerald-400 block">Suggested Sample Answer Strategy:</span>
                    <p className="leading-relaxed">{q.sample_answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Career Milestone Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
            <h3 className="text-base font-bold text-white">Generate 3-Month Skill Acceleration Roadmap</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Competencies</label>
                <input
                  type="text"
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Placement Goal</label>
                <input
                  type="text"
                  value={roadmapRole}
                  onChange={(e) => setRoadmapRole(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              disabled={loadingRoadmap}
              className="gradient-bg-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingRoadmap ? 'Building Plan...' : 'Build AI Skill Roadmap'}</span>
            </button>
          </div>

          {roadmapResult && (
            <div className="space-y-4">
              {roadmapResult.roadmap?.map((m, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-700/80 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </div>
                    <h4 className="text-sm font-bold text-white">{m.week_or_month}</h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">{m.focus_topic}</p>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <span className="font-bold text-indigo-400 block">Action Items:</span>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      {m.action_items?.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AIHub;
