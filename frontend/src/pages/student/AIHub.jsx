import React, { useState } from 'react';
import { aiService } from '../../services/api';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const AIHub = () => {
  const [activeTab, setActiveTab] = useState('resume');

  // Resume State
  const [resumeText, setResumeText] = useState(
    "Alex Rivera\nSoftware Engineering Student with expertise in Python, FastAPI, React, JavaScript, SQL, and Git. Built full-stack applications with JWT authentication and responsive interfaces. Looking for Software Engineering Internship opportunities."
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
    <div className="space-y-6 animate-in fade-in text-slate-900 max-w-[1600px] mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-6 h-6 text-lime-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">InternX AI Career Hub</h1>
            <p className="text-xs text-slate-500">Intelligent career preparation & ATS resume scoring powered by Gemini AI</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 p-1.5 rounded-2xl bg-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'resume' ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📄 AI Resume Reviewer
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'interview' ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Interview Prep Generator
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'roadmap' ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗺️ Skill Roadmap
          </button>
        </div>
      </div>

      {/* Tab 1: AI Resume Reviewer */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Paste Resume Content & Target Role</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Position Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resume Plain Text</label>
              <textarea
                rows={10}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
              />
            </div>

            <button
              onClick={handleReviewResume}
              disabled={loadingResume}
              className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-semibold py-3 px-5 rounded-xl transition shadow-xs flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-lime-300" />
              <span>{loadingResume ? 'Analyzing Resume...' : 'Analyze Resume with Gemini AI'}</span>
            </button>
          </div>

          {/* Results Panel */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">AI Evaluation Scorecard</h3>
            
            {resumeResult ? (
              <div className="space-y-5 animate-in fade-in">
                <div className="p-5 rounded-2xl bg-indigo-600 text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs text-indigo-200 block font-medium">ATS Match Score</span>
                    <span className="text-3xl font-extrabold text-white">{resumeResult.match_score}%</span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-lime-300 text-base border border-white/20">
                    {resumeResult.match_score}/100
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-slate-900">Key Strengths</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {resumeResult.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-slate-900">Recommended Improvements</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {resumeResult.improvements?.map((imp, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {resumeResult.missing_keywords?.length > 0 && (
                  <div className="space-y-2 text-xs pt-2">
                    <h4 className="font-semibold text-slate-900">Missing Industry Keywords</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {resumeResult.missing_keywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-medium border border-slate-200">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-16 text-center text-slate-400 text-xs font-medium">
                Click 'Analyze Resume' to view ATS match score & detailed feedback.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Interview Question Generator */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Generate Role-Specific Technical & HR Questions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Role Title</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Tech Stack</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateInterview}
              disabled={loadingInterview}
              className="bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-lime-300" />
              <span>{loadingInterview ? 'Generating...' : 'Generate AI Interview Prep'}</span>
            </button>
          </div>

          {interviewResult && (
            <div className="space-y-4">
              {interviewResult.questions?.map((q, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                      {q.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Question #{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                    <span className="font-semibold text-slate-900 block text-[11px]">Suggested Answer Strategy:</span>
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
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Generate 3-Month Skill Acceleration Roadmap</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Competencies</label>
                <input
                  type="text"
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Placement Goal</label>
                <input
                  type="text"
                  value={roadmapRole}
                  onChange={(e) => setRoadmapRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              disabled={loadingRoadmap}
              className="bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-lime-300" />
              <span>{loadingRoadmap ? 'Building Plan...' : 'Build AI Skill Roadmap'}</span>
            </button>
          </div>

          {roadmapResult && (
            <div className="space-y-4">
              {roadmapResult.roadmap?.map((m, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{m.week_or_month}</h4>
                  </div>

                  <p className="text-xs text-indigo-600 font-semibold">{m.focus_topic}</p>

                  <div className="space-y-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-900 block text-[11px]">Action Items:</span>
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
