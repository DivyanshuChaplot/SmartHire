import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Play, Sparkles, ChevronRight, Edit3, ArrowRight } from 'lucide-react';

export default function ResumeAnalyzer({ credits, onUseCredit, onNavigate, onAddHistory }) {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [report, setReport] = useState(null);
  
  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editableResumeText, setEditableResumeText] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startAnalysis = () => {
    if (!file) return;
    
    // Check credit limit
    if (credits >= 10) {
      alert("Daily limit of 10 actions reached! Please upgrade your plan.");
      onNavigate('SUBSCRIPTION');
      return;
    }

    setAnalyzing(true);
    setAnalyzingStep(0);
    
    // Animation steps
    const steps = [
      "Extracting sections & parsing metadata...",
      "Analyzing formatting against ATS layouts...",
      "Running semantic keyword check against Job Description...",
      "Generating action verb improvement suggestions...",
      "Finalizing score calculation..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setAnalyzingStep(currentStep);
      } else {
        clearInterval(interval);
        finishAnalysis();
      }
    }, 900);
  };

  const finishAnalysis = () => {
    onUseCredit(); // deduct credit
    setAnalyzing(false);
    
    const initialResumeText = `Aman Sharma
Frontend Developer
aman.sharma@gmail.com | github.com/amanshar

Objective:
Hardworking engineering student seeking a role as a React Frontend developer. Good at HTML, CSS and Javascript.

Experience:
Web Development Intern at Tech Solutions
- Managed the website development project
- Fixed bugs and added new features
- Wrote code in React and CSS

Education:
B.Tech in Computer Science, 2026
GPA: 8.2/10`;

    setEditableResumeText(initialResumeText);
    
    const initialReport = {
      score: 72,
      formatting: [
        { name: "Single column layout", status: "PASS", desc: "No complex multi-column grids that break parser indexing." },
        { name: "Standard sections present", status: "PASS", desc: "Found Education, Experience, and Skills sections." },
        { name: "No nested tables or graphics", status: "PASS", desc: "ATS scanner successfully read all text layers." },
        { name: "Font size & line heights", status: "WARNING", desc: "Header font sizes are a bit large; target 14-16pt for subheaders." }
      ],
      keywords: {
        matched: ["React", "JavaScript", "HTML", "CSS", "Web Development"],
        missing: ["Redux", "TypeScript", "REST APIs", "Git", "Webpack"]
      },
      suggestions: [
        {
          original: "Managed the website development project",
          improved: "Spearheaded frontend development of a client dashboard, leading a team of 3 interns to deliver the build 15 days ahead of schedule.",
          impact: "Action verb optimization & quantified metrics."
        },
        {
          original: "Fixed bugs and added new features",
          improved: "Resolved 40+ high-priority frontend UI issues, reducing customer support escalations by 18%.",
          impact: "Quantifying project outcomes."
        },
        {
          original: "Wrote code in React and CSS",
          improved: "Architected modular, reusable React components, reducing stylesheet bloat by 25% and improving render performance.",
          impact: "Skill application phrasing."
        }
      ]
    };

    setReport(initialReport);
    onAddHistory({
      type: 'RESUME',
      title: `Resume Audit (${file.name})`,
      date: new Date().toLocaleDateString(),
      score: 72
    });
  };

  // Re-runs scanner after inline editing
  const reRunAnalysis = () => {
    setAnalyzing(true);
    setAnalyzingStep(0);
    
    setTimeout(() => {
      setAnalyzing(false);
      setIsEditing(false);
      // Update report to high score
      setReport(prev => ({
        ...prev,
        score: 91,
        formatting: prev.formatting.map(f => f.name === "Font size & line heights" ? { ...f, status: "PASS", desc: "Header font sizes optimized to standard margins." } : f),
        keywords: {
          matched: ["React", "JavaScript", "HTML", "CSS", "Web Development", "TypeScript", "REST APIs", "Git"],
          missing: ["Redux", "Webpack"]
        },
        suggestions: []
      }));
    }, 1500);
  };

  const stepsList = [
    "Extracting sections & parsing metadata...",
    "Analyzing formatting against ATS layouts...",
    "Running semantic keyword check against Job Description...",
    "Generating action verb improvement suggestions...",
    "Finalizing score calculation..."
  ];

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>ATS Resume Builder & Analyzer</h1>
          <p>Scan your resume against your target Job Description (JD) to boost search visibility.</p>
        </div>
      </div>

      {!report && !analyzing && (
        <div className="grid grid-2 gap-lg">
          {/* Left panel: Upload & JD */}
          <div className="card flex flex-col justify-between">
            <div>
              <h3 style={{ marginBottom: '16px' }}>1. Upload Resume</h3>
              
              <div 
                className="upload-dropzone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-btn').click()}
              >
                <input 
                  type="file" 
                  id="file-upload-btn" 
                  style={{ display: 'none' }} 
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
                <Upload className="upload-icon" />
                <p style={{ fontWeight: '600', color: 'var(--color-text)' }}>
                  {file ? file.name : "Drag & Drop Resume here"}
                </p>
                 <p style={{ fontSize: '0.8rem' }}>Supports PDF & DOCX (Max 5MB)</p>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  id="mock-upload-btn"
                  style={{ marginTop: '12px', fontSize: '0.8rem', padding: '6px 12px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile({ name: 'Aman_Resume_v1.pdf', size: 104230 });
                  }}
                >
                  Select Mock Resume
                </button>
              </div>

              {file && (
                <div className="uploaded-file-card">
                  <div className="file-info">
                    <FileText style={{ width: '20px', height: '20px' }} />
                    <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setFile(null)}>
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div>
              <div style={{ padding: '12px', backgroundColor: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '0.8rem' }}>
                <strong>Privacy Policy:</strong> Resumes are parsed locally. Your data is not stored or shared for LLM training without direct user authorization.
              </div>
            </div>
          </div>

          {/* Right panel: JD Input */}
          <div className="card flex flex-col gap-md">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              2. Target Job Description (JD)
              <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>Paste standard requirements text</span>
            </h3>
            
            <textarea
              className="form-input"
              style={{ flex: 1, minHeight: '180px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
              placeholder="Paste the job description of the company here (e.g. Skills required: React, TypeScript, Redux, REST APIs, Git...)"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />

            <button 
              className={`btn ${file ? 'btn-primary' : 'btn-disabled'}`}
              onClick={startAnalysis}
              disabled={!file}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Analyze Resume Compliance
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      )}

      {/* Analyzing screen */}
      {analyzing && (
        <div className="card flex flex-col align-center justify-center gap-lg" style={{ padding: '60px', textAlign: 'center' }}>
          <div className="voice-wave-container" style={{ gap: '6px' }}>
            <div className="voice-wave-bar" style={{ height: '40px' }} />
            <div className="voice-wave-bar" style={{ height: '24px' }} />
            <div className="voice-wave-bar" style={{ height: '48px' }} />
            <div className="voice-wave-bar" style={{ height: '20px' }} />
            <div className="voice-wave-bar" style={{ height: '36px' }} />
          </div>

          <h3 style={{ fontSize: '1.4rem' }}>Calculating Compliance Metrics</h3>
          <p style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
            {stepsList[analyzingStep]}
          </p>

          <div style={{ width: '300px', height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${((analyzingStep + 1) / stepsList.length) * 100}%`, 
                backgroundColor: 'var(--color-primary)', 
                transition: 'width 0.4s ease-out' 
              }} 
            />
          </div>
        </div>
      )}

      {/* Analysis Report View */}
      {report && !analyzing && (
        <div className="grid grid-2 gap-lg">
          {/* Left panel: Scores & Keywords */}
          <div className="flex flex-col gap-lg">
            
            {/* ATS Score card */}
            <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3>ATS Score Report</h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Computed against Target Job Description</p>
              
              <div className="score-circle-wrapper">
                <svg className="score-svg">
                  <circle cx="70" cy="70" r="60" className="score-bg-circle" />
                  <circle 
                    cx="70" 
                    cy="70" 
                    r="60" 
                    className="score-fill-circle" 
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - report.score / 100)}
                  />
                </svg>
                <div className="score-text-val">{report.score}%</div>
              </div>

              <div style={{ display: 'flex', gap: '20px', width: '100%', borderTop: '1px solid var(--color-border)', paddingTop: '15px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{report.score > 80 ? 'Good' : 'Needs Work'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Status</div>
                </div>
                <div style={{ flex: 1, borderLeft: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{report.keywords.matched.length} / {report.keywords.matched.length + report.keywords.missing.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Keywords Matched</div>
                </div>
              </div>
            </div>

            {/* Keyword Analysis */}
            <div className="card">
              <h3>Keyword Gap Analysis</h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>ATS algorithms prioritize exact phrase matches.</p>
              
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#16a34a' }}>Matched Keywords</h4>
                <div className="keyword-tags">
                  {report.keywords.matched.map((kw, idx) => (
                    <span key={idx} className="keyword-pill matched">{kw}</span>
                  ))}
                </div>
              </div>

              {report.keywords.missing.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--color-primary)' }}>Missing Keywords (Crucial)</h4>
                  <div className="keyword-tags">
                    {report.keywords.missing.map((kw, idx) => (
                      <span key={idx} className="keyword-pill missing">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Layout Checks */}
            <div className="card">
              <h3>ATS Layout Guidelines</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                {report.formatting.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {item.status === 'PASS' ? (
                      <CheckCircle2 style={{ width: '18px', height: '18px', color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <AlertTriangle style={{ width: '18px', height: '18px', color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.name}</h4>
                      <p style={{ fontSize: '0.8rem' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Editor & suggestions */}
          <div className="flex flex-col gap-lg">
            
            {/* In-app Inline Editor */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>In-App Editor</h3>
                {!isEditing ? (
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setIsEditing(true)}>
                    <Edit3 style={{ width: '14px', height: '14px' }} />
                    Edit Resume Text
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={reRunAnalysis}>
                      Save & Re-Scan
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div 
                  style={{ 
                    flex: 1, 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '8px', 
                    padding: '16px', 
                    fontFamily: 'monospace', 
                    fontSize: '0.85rem', 
                    backgroundColor: 'var(--color-bg-alt)',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '340px',
                    overflowY: 'auto'
                  }}
                >
                  {editableResumeText}
                </div>
              ) : (
                <textarea
                  className="form-input"
                  style={{ flex: 1, minHeight: '300px', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'none' }}
                  value={editableResumeText}
                  onChange={(e) => setEditableResumeText(e.target.value)}
                  placeholder="Modify your resume details here..."
                />
              )}

              {isEditing && (
                <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '8px', fontWeight: '600' }}>
                  Pro-Tip: Copy the suggestions on the right or add missing keywords like "TypeScript" and "REST APIs" to instantly increase your ATS rating score.
                </p>
              )}
            </div>

            {/* AI Phrasing Suggestions */}
            {report.suggestions.length > 0 && (
              <div className="card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  AI Improvement Suggestions
                  <Sparkles style={{ width: '16px', height: '16px', color: 'var(--color-primary)' }} />
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {report.suggestions.map((sug, idx) => (
                    <div key={idx} style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                        Line {idx + 1}: {sug.impact}
                      </div>
                      
                      <div style={{ textDecoration: 'line-through', color: 'var(--color-primary)', fontSize: '0.85rem', marginBottom: '4px' }}>
                        "{sug.original}"
                      </div>
                      
                      <div style={{ color: '#16a34a', fontWeight: '600', fontSize: '0.9rem' }}>
                        "{sug.improved}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setReport(null); setFile(null); setJdText(''); }}>
                Upload Another Resume
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onNavigate('INTERVIEW')}>
                Start Practice Interview
                <ArrowRight style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
