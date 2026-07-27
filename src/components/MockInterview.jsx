import React, { useState, useEffect, useRef } from 'react';
import { Play, Mic, MessageSquare, Send, Award, Video, VideoOff, CheckCircle2, User, ChevronRight, BarChart3, AlertCircle } from 'lucide-react';

export default function MockInterview({ credits, onUseCredit, onNavigate, onAddHistory }) {
  // Config state
  const [inProgress, setInProgress] = useState(false);
  const [role, setRole] = useState('Software Engineer');
  const [roundType, setRoundType] = useState('Technical Round');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  // Active interview state
  const [questionIdx, setQuestionIdx] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState('');
  const [report, setReport] = useState(null);

  const chatEndRef = useRef(null);

  const roles = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'Business Analyst',
    'Graduate Engineer Trainee'
  ];

  const roundTypes = [
    'Technical Round',
    'HR & Behavioral Round',
    'CS Fundamentals & Aptitude'
  ];

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Questions database
  const questionsDB = {
    'Software Engineer': {
      'Technical Round': [
        {
          question: "Welcome to your Software Engineering technical review. Let's start with your profile. Can you summarize your primary tech stack and details of a complex project you built?",
          ideal: "Introduce yourself clearly, specify your tech stack (e.g., React, Node.js, Python, PostgreSQL), outline the core functionality of a major project, and explain your specific role and contributions in its design and implementation.",
          feedback: "Great summary of tech stack. Next time, try to add specific metrics like user base or load speed of the project."
        },
        {
          question: "Interesting. Regarding your project architecture: how did you handle state management or API payload delivery to optimize render times and load speed?",
          ideal: "Explain your choice of state management (e.g., Redux, Context API, Zustand). Discuss optimization techniques such as virtualization, debouncing/throttling, code-splitting/lazy-loading, pagination, and caching.",
          feedback: "Good explanation of state tools. You could also mention specific performance savings (e.g., 30% reduction in initial load time)."
        },
        {
          question: "Perfect. Now let's test coding fundamentals. Can you explain the difference between processes and threads, and how synchronous vs asynchronous operations behave?",
          ideal: "A process is an independent execution unit with its own memory space, whereas a thread is a subset that runs inside a process sharing its memory. Synchronous operations block execution until complete, while asynchronous operations allow other tasks to run in parallel without blocking.",
          feedback: "Excellent distinction between process and thread memory spaces. Clear explanation of blocking vs non-blocking behavior."
        },
        {
          question: "Suppose you have a critical production database query that is running extremely slow. Walk me through your structural steps to profile and debug this performance bottleneck.",
          ideal: "Step 1: Check query execution plan using EXPLAIN/ANALYZE. Step 2: Ensure proper indexing on columns in WHERE/JOIN clauses. Step 3: Check database connection pooling, CPU, and memory limits. Step 4: Optimize queries by avoiding SELECT * or N+1 query patterns. Step 5: Implement caching (e.g., Redis).",
          feedback: "Very structured debugging flow. Mentioning specific commands like EXPLAIN shows deep hands-on expertise."
        },
        {
          question: "Excellent details. Lastly, why do you want to join our engineering team, and what is your approach to reviewing code changes or handling merge conflicts?",
          ideal: "Align your interest with the company's tech stack and vision. For code reviews, highlight safety, readability, test coverage, and constructive feedback. For merge conflicts, explain local checkout, rebasing, and collaborating with the code author if needed.",
          feedback: "Strong cultural fit answer. Approach to merge conflicts is collaborative and technically sound."
        }
      ],
      'HR & Behavioral Round': [
        {
          question: "Hello! I am Nivi from Talent Acquisition. Let's start with a brief overview of your background and achievements.",
          ideal: "Briefly mention your degree, major achievements, active roles in campus placements/hackathons, and highlight key software engineering internships or projects.",
          feedback: "Nice, confident introduction. Keep it concise and focus on your top 2 achievements."
        },
        {
          question: "Tell me about a time when you had a major disagreement with a team member or manager on a project requirement. How did you resolve it?",
          ideal: "Use the STAR method. Describe the task, explain the conflict objectively without blame, detail how you scheduled a discussion to review technical tradeoffs, and show how you reached a mutual consensus.",
          feedback: "Demonstrated good maturity. You successfully focused on objective data rather than emotions."
        },
        {
          question: "Describe a situation where you had a tight project deadline, but the requirements changed midway. How did you manage your tasks?",
          ideal: "Explain how you assessed the impact of the change, prioritized critical features, communicated clearly with stakeholders about tradeoffs, and managed team tasks using agile methods to meet the deadline.",
          feedback: "Excellent demonstration of adaptability under changing requirements."
        },
        {
          question: "What is your greatest technical or personal failure, and what valuable lessons did you learn from it?",
          ideal: "Share a genuine setback (e.g., a bug in production, missed optimization), take ownership, explain what you did to fix it, and discuss the permanent processes/learning you adopted as a result.",
          feedback: "Great vulnerability and focus on positive learning outcomes."
        },
        {
          question: "Where do you see yourself in 3 years, and why do you think you are the right fit for this specific campus placement role?",
          ideal: "Express desire to grow into a senior engineer or domain expert, show long-term commitment, and link your skillset directly with the team's product goals.",
          feedback: "Ambitious and aligned with our company's growth trajectory."
        }
      ]
    },
    'Data Scientist': {
      'Technical Round': [
        {
          question: "Welcome. Let's discuss your experience. Walk me through a machine learning project you built, explaining the problem statement and dataset.",
          ideal: "Explain the business problem, the type of data, feature engineering steps, choice of model (e.g. XGBoost, Random Forest), evaluation metrics used, and the real-world impact of the model.",
          feedback: "Structured explanation of the project lifecycle. Good job highlighting the business value."
        },
        {
          question: "In your project, how did you handle data preprocessing, missing values, and high feature cardinality?",
          ideal: "Describe imputation methods (mean/median, KNN, etc.), handling outliers, and encoding high-cardinality features (e.g., target encoding, binary encoding, or embeddings).",
          feedback: "Good coverage of imputation. Good understanding of feature encoding techniques."
        },
        {
          question: "Can you explain the bias-variance tradeoff in machine learning, and how you prevent overfitting in decision trees?",
          ideal: "Bias is error from erroneous assumptions (underfitting); variance is error from sensitivity to small fluctuations (overfitting). Prevent decision tree overfitting via pruning, setting max_depth, min_samples_split, or using ensemble methods.",
          feedback: "Clear definitions. Mentioning tree pruning and hyperparameters is spot on."
        },
        {
          question: "How do you evaluate classifier performance? When would you prioritize Precision/Recall over F1-Score or ROC-AUC metrics?",
          ideal: "Precision is prioritized when false positives are highly costly (e.g., spam detection). Recall is prioritized when false negatives are critical (e.g., medical diagnosis). F1-Score balances both for imbalanced datasets.",
          feedback: "Solid understanding of metric tradeoffs. Good examples of when to prioritize which metric."
        },
        {
          question: "Finally, suppose your training model performs excellently in development but drops drastically in production. What would you investigate?",
          ideal: "Investigate: 1) Data drift/concept drift (change in production data distribution). 2) Target leakage during training. 3) Discrepancy in preprocessing pipelines between training and serving.",
          feedback: "Identified data drift and target leakage correctly. Excellent troubleshooting mindset."
        }
      ],
      'HR & Behavioral Round': [
        {
          question: "Hello! Welcome to the interview. Tell me about your background and what motivated you to specialize in Data Science.",
          ideal: "Explain your academic background, your curiosity about finding patterns in data, and how statistics or machine learning projects drove your interest.",
          feedback: "Enthusiastic and clear. Showing genuine passion for statistical reasoning is very positive."
        },
        {
          question: "Describe a time you had to explain complex predictive model insights to a non-technical stakeholder. How did you structure your communication?",
          ideal: "Focus on business outcomes and intuitive analogies instead of raw formulas or hyperparameters. Use clear charts and focus on how the model helps solve their specific problems.",
          feedback: "Strong user-empathy and translation of technical metrics into business metrics."
        },
        {
          question: "How do you prioritize multiple analytical requests with tight deadlines?",
          ideal: "Assess the business impact and complexity of each request, communicate early with requestors to manage expectations, and use a structured prioritization matrix (like Eisenhower Matrix).",
          feedback: "Good organizational approach. Keeps communication open and realistic."
        },
        {
          question: "Tell me about a project failure where the model accuracy didn't meet the target goals. How did you pivot?",
          ideal: "Share a project where accuracy fell short. Explain how you did error analysis, collected more features, tried simpler baselines, and aligned expectations with stakeholders regarding limitations.",
          feedback: "Demonstrated resilience. Pivoting to error analysis is the correct engineering approach."
        },
        {
          question: "What are your expectation details for this role, and why are you interested in our organization?",
          ideal: "Express desire to work on real-world datasets with impact. Align your interest with our business domain (e.g., hiring, fintech, etc.) and learning opportunities.",
          feedback: "Well aligned with company goals and team environment."
        }
      ]
    }
  };

  // Fallback questions if role/round doesn't have exact list
  const getFallbackQuestions = () => {
    return [
      {
        question: "Welcome! Could you please introduce yourself and mention your key strengths?",
        ideal: "Introduce your academic background, core technical stack, major achievements, and mention 2-3 key professional strengths supported by quick examples.",
        feedback: "Polite and complete introduction. Try to link strengths directly to job requirements."
      },
      {
        question: "Can you describe a challenging project you have worked on recently, detailing your responsibilities?",
        ideal: "Explain the project objective, your exact role, technical hurdles faced (e.g., bug, performance issue, scaling), how you solved it, and what you delivered.",
        feedback: "Good explanation of responsibilities. Next time, try to add specific metrics like user base or speedups."
      },
      {
        question: "How do you handle working in a multidisciplinary team when opinions conflict?",
        ideal: "Focus on active listening, understanding alternative perspectives, presenting data-driven reasoning, and aligning on a shared objective to move forward constructively.",
        feedback: "Shows good teamwork and conflict-resolution skills."
      },
      {
        question: "Explain a scenario where you made a mistake under pressure. How did you handle the aftermath?",
        ideal: "Acknowledge the mistake honestly, outline the immediate actions you took to mitigate the damage, communicate it to the team, and share the lessons learned.",
        feedback: "Honest and accountable. Taking ownership is a highly valued trait."
      },
      {
        question: "Why are you interested in this placement role and what makes you stand out?",
        ideal: "Connect your specific skills, experience, and projects directly with the job requirements. Express genuine enthusiasm for the company's culture and products.",
        feedback: "Clear alignment with the company goals. Good demonstration of unique value add."
      }
    ];
  };

  const getQuestions = () => {
    return questionsDB[role]?.[roundType] || getFallbackQuestions();
  };

  const startInterview = () => {
    if (credits >= 10) {
      alert("Daily limit of 10 actions reached! Please upgrade your plan.");
      onNavigate('SUBSCRIPTION');
      return;
    }

    setInProgress(true);
    setQuestionIdx(0);
    setReport(null);
    
    const activeQuestions = getQuestions();
    
    // Setup initial greeting message
    setMessages([
      {
        sender: 'AI',
        text: activeQuestions[0].question,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Simulates microphone recording
  const handleMicrophoneRecord = () => {
    if (isRecording) return;
    setIsRecording(true);
    
    // Select dynamic response scripts matching current question to feel realistic
    const responseScripts = {
      'Software Engineer': {
        'Technical Round': [
          "I specialize in React, Node.js, and MongoDB. In my latest project, I built an ATS tracking dashboard. I implemented client-side state hooks, rendering optimizations, and reduced load speeds by 20% by lazy loading images.",
          "I used React Context API and custom state handlers. To optimize API payloads, I implemented data pagination, debounced query search inputs, and cached response payloads in local session registers.",
          "A process is an execution unit with its own memory space, whereas a thread is a subset that shares the process resources. Asynchronous calls execute non-blockingly, allowing other threads to run synchronously without freezing.",
          "First, I would examine query profiles using EXPLAIN, verify index coverage on query filter keys, check table execution logs for lock wait times, and write structural subquery optimizations.",
          "I want to work at your company because of your focus on scalable frontend frameworks. I handle code reviews by ensuring modular component guidelines and resolving merge conflicts using Git checkouts."
        ],
        'HR & Behavioral Round': [
          "I am a Computer Science final year student. I have built 3 full-stack React projects, maintained a 9.1 GPA, and served as the Technical Lead in our college placement committee.",
          "On my team project, a peer wanted to use standard CSS while I preferred Tailwind. I scheduled a call, compared performance loading times and styling modularity, and we agreed on Tailwind to speed up development.",
          "When our database schema changed midway, I paused current frontend sprints, remapped database model interfaces, collaborated with backend leads, and completed the build on schedule.",
          "In my second year, a web project failed deployment due to environment mismatch. I learned to use containerized files, Docker configs, and continuous integration setups to prevent deployment drift.",
          "In 3 years, I plan to transition into a Senior Frontend developer role. I believe my technical problem-solving skills match your company's product trajectory."
        ]
      }
    };

    const activeScripts = responseScripts[role]?.[roundType] || [
      "I am highly motivated, have worked extensively on React frameworks, and have collaborated on several agile placement projects.",
      "I built a placement matching portal using React, implementing custom state filters, search queries, and modular UI templates.",
      "I schedule team discussions, analyze technical tradeoffs objectively, and make sure that we align on final project outcomes.",
      "I missed a project submission deadline because of server issues. I took responsibility, resolved the issue, and set up automatic alerts.",
      "Your company offers the ideal space for growth. My experience matches the job specification perfectly."
    ];

    const targetScript = activeScripts[questionIdx] || activeScripts[0];

    // Typing simulation
    let charIdx = 0;
    setRecordingText('');
    const typingInterval = setInterval(() => {
      if (charIdx < targetScript.length) {
        setRecordingText((prev) => prev + targetScript[charIdx]);
        charIdx += 4; // Faster typing simulation
      } else {
        clearInterval(typingInterval);
        setIsRecording(false);
        setUserInput(targetScript);
      }
    }, 50);
  };

  const handleSendResponse = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const currentQuestions = getQuestions();
    const userMsg = {
      sender: 'User',
      text: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setRecordingText('');

    const nextIdx = questionIdx + 1;
    
    // Simulate AI thinking and follow-up
    setTimeout(() => {
      if (nextIdx < currentQuestions.length) {
        setQuestionIdx(nextIdx);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'AI',
            text: currentQuestions[nextIdx].question,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        finishInterview();
      }
    }, 1200);
  };

  const finishInterview = () => {
    onUseCredit(); // Consume credit
    setInProgress(false);

    // Pre-calculate mock evaluation scores
    const overallScore = 84;
    const activeQuestions = getQuestions();
    const feedbackReport = {
      score: overallScore,
      breakdown: {
        content: 86,
        communication: 82,
        structure: 85
      },
      strengths: [
        "Strong structural formatting of technical projects.",
        "Demonstrated solid conceptual depth in computer science fundamentals.",
        "Pacing and tone clarity simulated top-tier communication levels."
      ],
      weaknesses: [
        "Avoid using filler concepts in architectural performance reviews.",
        "Quantify project metrics in behavioral questions (e.g. mention percentages or numbers)."
      ],
      transcript: messages.map((m, idx) => {
        if (m.sender === 'User') {
          const qIdx = Math.floor((idx - 1) / 2);
          const qObj = activeQuestions[qIdx];
          return {
            question: qObj?.question || messages[idx - 1]?.text || "Introduction",
            answer: m.text,
            ideal: qObj?.ideal || `An ideal response would detail key design metrics, follow the STAR method for behavioral items, and use active verbs.`,
            feedback: qObj?.feedback || "Overall good. Include more quantitative metrics on system performance to demonstrate architectural impacts."
          };
        }
        return null;
      }).filter(t => t !== null)
    };

    setReport(feedbackReport);
    onAddHistory({
      type: 'INTERVIEW',
      title: `Mock: ${roundType} (${role})`,
      date: new Date().toLocaleDateString(),
      score: overallScore
    });
  };

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>AI Mock Interview Simulator</h1>
          <p>Practice live interviews in a realistic, non-stressful testing environment.</p>
        </div>
      </div>

      {/* Setup screen */}
      {!inProgress && !report && (
        <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
            <div className="action-card-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Video />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Configure Practice Session</h3>
              <p style={{ fontSize: '0.85rem' }}>Customize your questions matching target campus roles.</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Target Role Profile</label>
            <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Interview Type</label>
            <select className="form-input" value={roundType} onChange={(e) => setRoundType(e.target.value)}>
              {roundTypes.map((rt, idx) => (
                <option key={idx} value={rt}>{rt}</option>
              ))}
            </select>
          </div>

          {/* Mode switch (text vs voice) */}
          <div style={{ display: 'flex', gap: '20px', margin: '24px 0' }}>
            <div 
              style={{ 
                flex: 1, 
                border: `1px solid ${!isVoiceMode ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: !isVoiceMode ? 'var(--color-primary-light)' : 'var(--color-bg)',
                borderRadius: '8px', 
                padding: '16px', 
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'var(--transition)'
              }}
              onClick={() => setIsVoiceMode(false)}
            >
              <MessageSquare style={{ color: !isVoiceMode ? 'var(--color-primary)' : 'var(--color-text-muted)', margin: '0 auto 8px' }} />
              <h4 style={{ fontSize: '0.9rem', color: !isVoiceMode ? 'var(--color-primary)' : 'var(--color-text)' }}>Chat Mode</h4>
              <p style={{ fontSize: '0.75rem' }}>Type out detailed text responses</p>
            </div>

            <div 
              style={{ 
                flex: 1, 
                border: `1px solid ${isVoiceMode ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: isVoiceMode ? 'var(--color-primary-light)' : 'var(--color-bg)',
                borderRadius: '8px', 
                padding: '16px', 
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'var(--transition)'
              }}
              onClick={() => setIsVoiceMode(true)}
            >
              <Mic style={{ color: isVoiceMode ? 'var(--color-primary)' : 'var(--color-text-muted)', margin: '0 auto 8px' }} />
              <h4 style={{ fontSize: '0.9rem', color: isVoiceMode ? 'var(--color-primary)' : 'var(--color-text)' }}>Voice Mode</h4>
              <p style={{ fontSize: '0.75rem' }}>Speak answers (speech transcription)</p>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={startInterview}>
            Start Mock Interview (Consumes 1 credit)
          </button>
        </div>
      )}

      {/* Active Interview Interface */}
      {inProgress && (
        <div className="grid grid-3 gap-lg">
          {/* Left panel: Interviewer profile & voice indicator */}
          <div className="card flex flex-col align-center justify-between" style={{ height: 'fit-content' }}>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-primary-light)', 
                  color: 'var(--color-primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '2rem',
                  margin: '0 auto 16px',
                  fontWeight: 'bold',
                  border: '2px solid var(--color-border-red)'
                }}
              >
                N
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Nivi</h3>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-primary)', fontWeight: '700' }}>
                AI Placement Evaluator
              </p>
              
              <div style={{ margin: '24px 0', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                  <span>Interview Progress</span>
                  <span>{questionIdx + 1} / 5 Questions</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${((questionIdx + 1) / 5) * 100}%`, 
                      backgroundColor: 'var(--color-primary)',
                      transition: 'width 0.3s ease-out'
                    }} 
                  />
                </div>
              </div>
            </div>

            {/* Voice visualizer */}
            {isVoiceMode && (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <div className="voice-wave-container">
                  <div className="voice-wave-bar" style={{ animationPlayState: isRecording ? 'running' : 'paused' }} />
                  <div className="voice-wave-bar" style={{ animationPlayState: isRecording ? 'running' : 'paused' }} />
                  <div className="voice-wave-bar" style={{ animationPlayState: isRecording ? 'running' : 'paused' }} />
                  <div className="voice-wave-bar" style={{ animationPlayState: isRecording ? 'running' : 'paused' }} />
                  <div className="voice-wave-bar" style={{ animationPlayState: isRecording ? 'running' : 'paused' }} />
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                  {isRecording ? 'Listening...' : 'Press Speak to Record Answer'}
                </p>
              </div>
            )}
            
            <div style={{ width: '100%', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '16px' }}>
              <button className="btn btn-danger" style={{ width: '100%', padding: '8px' }} onClick={() => { if(confirm("End interview? Progress will be lost.")) { setInProgress(false); } }}>
                Cancel Session
              </button>
            </div>
          </div>

          {/* Right chat panel (takes 2 columns) */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="interview-chat-container">
              <div className="chat-messages">
                {messages.map((m, idx) => (
                  <div key={idx} className={`chat-bubble ${m.sender === 'AI' ? 'ai' : 'user'}`}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', opacity: 0.8 }}>
                      {m.sender === 'AI' ? 'Nivi' : 'You'}
                    </p>
                    <p style={{ color: m.sender === 'AI' ? 'var(--color-text)' : 'white' }}>{m.text}</p>
                    <span style={{ display: 'block', fontSize: '0.7rem', textAlign: 'right', marginTop: '6px', opacity: 0.7 }}>
                      {m.timestamp}
                    </span>
                  </div>
                ))}
                
                {isRecording && (
                  <div className="chat-bubble user" style={{ opacity: 0.85 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>Transcribing Speech...</p>
                    <p>{recordingText || '...'}</p>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Inputs */}
              <form onSubmit={handleSendResponse} className="chat-input-bar">
                {isVoiceMode ? (
                  <button 
                    type="button" 
                    className={`btn ${isRecording ? 'pulse-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, border: isRecording ? '1px solid var(--color-primary)' : '1px solid var(--color-border)' }}
                    onClick={handleMicrophoneRecord}
                    disabled={isRecording}
                  >
                    <Mic style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
                    {isRecording ? 'Recording Speech...' : 'Click to Speak Response'}
                  </button>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type your response here..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={isRecording}
                    autoFocus
                  />
                )}
                
                {!isVoiceMode && (
                  <button type="submit" className="btn btn-primary" disabled={!userInput.trim() || isRecording}>
                    <Send style={{ width: '16px', height: '16px' }} />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Post-Interview Evaluation Report */}
      {report && !inProgress && (
        <div className="grid grid-3 gap-lg">
          {/* Score card & details (1 column) */}
          <div className="flex flex-col gap-lg">
            
            {/* Score circle */}
            <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ marginBottom: '16px' }}>Evaluation Score</h3>
              
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

              {/* Score Breakdown lists */}
              <div style={{ width: '100%', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                    <span>Technical Content</span>
                    <span>{report.breakdown.content}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${report.breakdown.content}%`, backgroundColor: 'var(--color-primary)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                    <span>Communication Pacing</span>
                    <span>{report.breakdown.communication}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${report.breakdown.communication}%`, backgroundColor: 'var(--color-primary)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                    <span>Structure (STAR Method)</span>
                    <span>{report.breakdown.structure}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${report.breakdown.structure}%`, backgroundColor: 'var(--color-primary)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="card">
              <h3>Strengths</h3>
              <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', margin: '12px 0 20px', color: 'var(--color-text)' }}>
                {report.strengths.map((str, idx) => (
                  <li key={idx} style={{ color: 'var(--color-text)' }}>
                    <strong style={{ color: '#16a34a' }}>✓</strong> {str}
                  </li>
                ))}
              </ul>

              <h3 style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>Areas for Growth</h3>
              <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', color: 'var(--color-text)' }}>
                {report.weaknesses.map((wk, idx) => (
                  <li key={idx}>
                    <strong style={{ color: 'var(--color-primary)' }}>!</strong> {wk}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transcript question details (2 columns) */}
          <div style={{ gridColumn: 'span 2' }} className="flex flex-col gap-lg">
            
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                Question-by-Question Review
                <BarChart3 style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {report.transcript.map((item, idx) => (
                  <div key={idx} style={{ borderBottom: idx < report.transcript.length - 1 ? '1px solid var(--color-border)' : 'none', paddingBottom: '20px' }}>
                    <div style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                      Q{idx + 1}: {item.question}
                    </div>
                    
                    <div style={{ backgroundColor: 'var(--color-bg-alt)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', borderLeft: '3px solid var(--color-text-muted)', marginBottom: '12px' }}>
                      <strong style={{ color: 'var(--color-text)' }}>Your Answer:</strong> "{item.answer}"
                    </div>

                    <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', borderLeft: '3px solid #16a34a', marginBottom: '12px', color: '#16a34a' }}>
                      <strong style={{ color: '#16a34a' }}>Ideal Answer Guidance:</strong> {item.ideal}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', paddingLeft: '8px' }}>
                      <strong>Feedback:</strong> {item.feedback}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setReport(null)}>
                Take Another Interview
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onNavigate('DASHBOARD')}>
                Back to Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
