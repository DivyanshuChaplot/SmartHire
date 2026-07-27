import React from 'react';
import { Sparkles, FileText, Video, Play, Award, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export default function Dashboard({ 
  user, 
  credits, 
  stats, 
  onNavigate, 
  history 
}) {
  
  // Custom SVG Chart Data
  const chartData = [
    { day: 'Mon', score: 62 },
    { day: 'Tue', score: 68 },
    { day: 'Wed', score: 71 },
    { day: 'Thu', score: 78 },
    { day: 'Fri', score: stats.avgScore || 82 }
  ];

  // Map coordinates for SVG chart line
  const width = 500;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const points = chartData.map((d, idx) => {
    const x = paddingLeft + (idx * (width - paddingLeft - paddingRight) / (chartData.length - 1));
    // Score mapped from 0-100 to height
    const y = height - paddingBottom - (d.score * (height - paddingTop - paddingBottom) / 100);
    return { x, y, score: d.score, label: d.day };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Closed path for fill gradient
  const fillD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : '';

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Welcome back, {user?.name || 'Candidate'}!</h1>
          <p>Here's a breakdown of your college campus placement readiness score.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('SUBSCRIPTION')}>
            Upgrade Account
          </button>
        </div>
      </div>

      {/* Credit Status & Metrics */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon-wrapper">
            <Award />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.readinessScore || 78}/100</div>
            <div className="stat-label">Readiness Score</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper">
            <FileText />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.resumeScore || 72}%</div>
            <div className="stat-label">Latest Resume Score</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper">
            <CheckCircle2 />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.interviewsTaken || 0}</div>
            <div className="stat-label">Mock Interviews Taken</div>
          </div>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="dashboard-grid">
        <div className="flex flex-col gap-lg">
          
          {/* Quick Actions */}
          <div className="card section-card">
            <h2 className="section-title">
              Quick Actions 
              <Sparkles style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
            </h2>
            <div className="action-cards">
              <div className="card action-card" onClick={() => onNavigate('RESUME')}>
                <div className="action-card-icon">
                  <FileText />
                </div>
                <h3>ATS Resume Builder & Score</h3>
                <p>Upload your resume, get scanned on custom job descriptions, and view keyword gap suggestions.</p>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', padding: '8px 16px' }}>
                  Analyze Resume
                </button>
              </div>

              <div className="card action-card" onClick={() => onNavigate('INTERVIEW')}>
                <div className="action-card-icon">
                  <Video />
                </div>
                <h3>AI Mock Interview</h3>
                <p>Simulate voice & text technical or HR interviews tailored to specific engineering branches and profiles.</p>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', padding: '8px 16px' }}>
                  Start Practice
                </button>
              </div>
            </div>
          </div>

          {/* Performance Tracking Chart */}
          <div className="card section-card">
            <h2 className="section-title">
              Placement Score Trend
              <TrendingUp style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
            </h2>
            
            <div className="chart-container">
              <svg className="svg-chart" viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
                <defs>
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} className="chart-grid-line" />
                <line x1={paddingLeft} y1={(height - paddingBottom - paddingTop)/2 + paddingTop} x2={width - paddingRight} y2={(height - paddingBottom - paddingTop)/2 + paddingTop} className="chart-grid-line" />
                <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} className="chart-grid-line" />

                {/* Y-Axis Labels */}
                <text x={paddingLeft - 10} y={paddingTop + 4} textAnchor="end" className="chart-text">100</text>
                <text x={paddingLeft - 10} y={(height - paddingBottom - paddingTop)/2 + paddingTop + 4} textAnchor="end" className="chart-text">50</text>
                <text x={paddingLeft - 10} y={height - paddingBottom + 4} textAnchor="end" className="chart-text">0</text>

                {/* Area Fill */}
                {points.length > 0 && <path d={fillD} className="chart-area" />}

                {/* Draw Line */}
                {points.length > 0 && <path d={pathD} className="chart-line" />}

                {/* Draw Dots & Labels */}
                {points.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="5" className="chart-dot" />
                    <text x={p.x} y={p.y - 10} textAnchor="middle" className="chart-text" style={{ fontWeight: '600', fill: 'var(--color-text)' }}>
                      {p.score}%
                    </text>
                    <text x={p.x} y={height - paddingBottom + 18} textAnchor="middle" className="chart-text">
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Roadmap & Recent Activity */}
        <div className="flex flex-col gap-lg">
          
          {/* Daily Limit Tracker */}
          <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Daily Resource Limits</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Your account reset is scheduled every 24 hours.</p>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                <span>Usage Limit ({credits}/10 actions)</span>
                <span style={{ color: 'var(--color-primary)' }}>{10 - credits} left</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${(credits / 10) * 100}%`, 
                    backgroundColor: 'var(--color-primary)', 
                    borderRadius: '4px',
                    transition: 'width 0.4s ease-out'
                  }} 
                />
              </div>
            </div>
            
            {credits >= 10 ? (
              <div style={{ padding: '8px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                Daily limit reached! Please subscribe to unlock unlimited usage.
              </div>
            ) : null}
          </div>

          {/* Placement Roadmap */}
          <div className="card section-card">
            <h2 className="section-title">
              Action Roadmap
              <CheckCircle2 style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1.1rem' }}>01</div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '2px' }}>Fix Resume Grammar & Keywords</h4>
                  <p style={{ fontSize: '0.8rem' }}>Tailor skills matching the target Job Description to score above 80% ATS threshold.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1.1rem' }}>02</div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '2px' }}>Prepare Technical Mock Round</h4>
                  <p style={{ fontSize: '0.8rem' }}>Take the AI Mock Interview in Software Engineering mode to boost performance rating.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ color: 'var(--color-text-muted)', fontWeight: '700', fontSize: '1.1rem' }}>03</div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '2px', color: 'var(--color-text-muted)' }}>Attempt HR & STAR Behavioral</h4>
                  <p style={{ fontSize: '0.8rem' }}>Practice communication, speed-of-thought, and pacing check in Voice mode.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent History */}
          <div className="card section-card">
            <h2 className="section-title">
              Recent History
              <HelpCircle style={{ width: '18px', height: '18px', color: 'var(--color-text-muted)' }} />
            </h2>
            {history && history.length > 0 ? (
              <div className="activity-list">
                {history.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="activity-item">
                    <div className="activity-icon">
                      {item.type === 'RESUME' ? <FileText /> : <Video />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-name">{item.title}</div>
                      <div className="activity-time">{item.date}</div>
                    </div>
                    <div className="activity-score">{item.score}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px 0' }}>
                No actions taken today.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
