import React, { useState, useEffect } from 'react';
import './App.css';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import MockInterview from './components/MockInterview';
import Subscription from './components/Subscription';
import { LayoutDashboard, FileText, Video, CreditCard, LogOut } from 'lucide-react';
import { auth, db, isFirebaseConfigured } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  
  // Daily action limit states
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Statistics and scores tracker
  const [stats, setStats] = useState({
    readinessScore: 78,
    resumeScore: 72,
    interviewsTaken: 2,
    avgScore: 82,
  });

  // Recent action log items
  const [history, setHistory] = useState([]);

  // Load state on mount if Firebase is not configured (Local Mock Mode)
  useEffect(() => {
    if (!isFirebaseConfigured) {
      const savedUser = localStorage.getItem('smarthire_user');
      const savedCredits = localStorage.getItem('smarthire_credits_used');
      const savedSub = localStorage.getItem('smarthire_subscribed');
      const savedHistory = localStorage.getItem('smarthire_history');
      const savedStats = localStorage.getItem('smarthire_stats');

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedCredits) setCreditsUsed(parseInt(savedCredits, 10));
      if (savedSub) setIsSubscribed(JSON.parse(savedSub));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedStats) setStats(JSON.parse(savedStats));
      setLoading(false);
    }
  }, []);

  // Listen to Firebase Auth state changes (when configured)
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in.
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUser({
              uid: firebaseUser.uid,
              name: data.name || 'User',
              emailOrPhone: data.emailOrPhone || '',
              avatarChar: data.avatarChar || 'U',
            });
            setCreditsUsed(data.creditsUsed ?? 0);
            setIsSubscribed(data.isSubscribed ?? false);
            setStats(data.stats ?? {
              readinessScore: 78,
              resumeScore: 72,
              interviewsTaken: 2,
              avgScore: 82,
            });
            setHistory(data.history ?? []);
          } else {
            // New user - create profile document
            const name = firebaseUser.displayName || 
              (firebaseUser.phoneNumber ? `User ${firebaseUser.phoneNumber.slice(-4)}` : firebaseUser.email?.split('@')[0]) || 
              'User';
            const emailOrPhone = firebaseUser.email || firebaseUser.phoneNumber || '';
            const avatarChar = (firebaseUser.displayName || firebaseUser.email || firebaseUser.phoneNumber || 'U')[0].toUpperCase();
            
            const newProfile = {
              uid: firebaseUser.uid,
              name,
              emailOrPhone,
              avatarChar,
              creditsUsed: 0,
              isSubscribed: false,
              stats: {
                readinessScore: 78,
                resumeScore: 72,
                interviewsTaken: 2,
                avgScore: 82,
              },
              history: [
                {
                  type: 'RESUME',
                  title: 'Resume Audit (Aman_Resume_v1.pdf)',
                  date: '27/07/2026',
                  score: 72,
                },
                {
                  type: 'INTERVIEW',
                  title: 'Mock: Technical Round (Software Engineer)',
                  date: '26/07/2026',
                  score: 82,
                },
              ],
              createdAt: new Date().toISOString()
            };
            
            await setDoc(userRef, newProfile);
            
            setUser({
              uid: firebaseUser.uid,
              name,
              emailOrPhone,
              avatarChar,
            });
            setCreditsUsed(0);
            setIsSubscribed(false);
            setStats(newProfile.stats);
            setHistory(newProfile.history);
          }
        } catch (err) {
          console.error("Error retrieving user profile from Firestore:", err);
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            emailOrPhone: firebaseUser.email || firebaseUser.phoneNumber || '',
            avatarChar: (firebaseUser.displayName || 'U')[0].toUpperCase(),
          });
        }
      } else {
        // User is signed out
        setUser(null);
        setCreditsUsed(0);
        setIsSubscribed(false);
        setStats({
          readinessScore: 78,
          resumeScore: 72,
          interviewsTaken: 2,
          avgScore: 82,
        });
        setHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await auth.signOut();
      } else {
        // Clear mock local session states
        setUser(null);
        setCreditsUsed(0);
        setIsSubscribed(false);
        setStats({
          readinessScore: 78,
          resumeScore: 72,
          interviewsTaken: 2,
          avgScore: 82,
        });
        setHistory([]);
        localStorage.removeItem('smarthire_user');
        localStorage.removeItem('smarthire_credits_used');
        localStorage.removeItem('smarthire_subscribed');
        localStorage.removeItem('smarthire_history');
        localStorage.removeItem('smarthire_stats');
      }
      setActiveTab('DASHBOARD');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleUseCredit = async () => {
    if (isSubscribed) return;
    const nextCredits = creditsUsed + 1;
    setCreditsUsed(nextCredits);
    if (user?.uid) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { creditsUsed: nextCredits });
      } catch (err) {
        console.error("Error updating credits in Firestore:", err);
      }
    }
  };

  const handleSubscribeSuccess = async () => {
    setIsSubscribed(true);
    if (user?.uid) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { isSubscribed: true });
      } catch (err) {
        console.error("Error updating subscription in Firestore:", err);
      }
    }
  };

  const handleAddHistory = async (item) => {
    const nextHistory = [item, ...history];
    setHistory(nextHistory);

    // Update stats based on action type
    const nextStats = { ...stats };
    if (item.type === 'RESUME') {
      nextStats.resumeScore = item.score;
    } else if (item.type === 'INTERVIEW') {
      nextStats.interviewsTaken += 1;
      nextStats.avgScore = Math.round((nextStats.avgScore * (nextStats.interviewsTaken - 1) + item.score) / nextStats.interviewsTaken);
    }
    
    // Recalculate readiness
    nextStats.readinessScore = Math.round((nextStats.resumeScore + nextStats.avgScore) / 2);
    setStats(nextStats);

    if (user?.uid) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          history: nextHistory,
          stats: nextStats
        });
      } catch (err) {
        console.error("Error updating history in Firestore:", err);
      }
    }
  };

  // Firebase initialization check logged for debugging
  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn("Firebase credentials not configured. SmartHire Gate is running in local Demo Mode.");
    }
  }, []);

  // If loading session state, display an aesthetic spinner
  if (loading) {
    return (
      <div 
        style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '16px', 
          backgroundColor: 'var(--color-bg)', 
          color: 'var(--color-text)' 
        }}
      >
        <div 
          style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid var(--color-border)', 
            borderTop: '4px solid var(--color-primary)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }} 
        />
        <p style={{ fontWeight: 600 }}>Loading SmartHire...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If user is not logged in, show the login overlay
  if (!user) {
    return (
      <AuthModal 
        onLoginSuccess={(userData) => {
          setUser(userData);
          localStorage.setItem('smarthire_user', JSON.stringify(userData));
        }} 
      />
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return (
          <Dashboard
            user={user}
            credits={creditsUsed}
            stats={stats}
            history={history}
            onNavigate={setActiveTab}
          />
        );
      case 'RESUME':
        return (
          <ResumeAnalyzer
            credits={creditsUsed}
            onUseCredit={handleUseCredit}
            onNavigate={setActiveTab}
            onAddHistory={handleAddHistory}
          />
        );
      case 'INTERVIEW':
        return (
          <MockInterview
            credits={creditsUsed}
            onUseCredit={handleUseCredit}
            onNavigate={setActiveTab}
            onAddHistory={handleAddHistory}
          />
        );
      case 'SUBSCRIPTION':
        return (
          <Subscription
            user={user}
            isSubscribed={isSubscribed}
            onSubscribeSuccess={handleSubscribeSuccess}
          />
        );
      default:
        return (
          <Dashboard
            user={user}
            credits={creditsUsed}
            stats={stats}
            history={history}
            onNavigate={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="app-sidebar">
        <div>
          {/* Logo Section */}
          <div className="sidebar-logo">
            <div className="logo-icon">S</div>
            <span className="logo-text">
              SmartHire<span className="logo-dot">.</span>
            </span>
          </div>

          {/* Menu Items */}
          <nav>
            <ul className="sidebar-menu">
              <li 
                className={`menu-item ${activeTab === 'DASHBOARD' ? 'active' : ''}`}
                onClick={() => setActiveTab('DASHBOARD')}
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </li>
              <li 
                className={`menu-item ${activeTab === 'RESUME' ? 'active' : ''}`}
                onClick={() => setActiveTab('RESUME')}
              >
                <FileText />
                <span>ATS Resume Audit</span>
              </li>
              <li 
                className={`menu-item ${activeTab === 'INTERVIEW' ? 'active' : ''}`}
                onClick={() => setActiveTab('INTERVIEW')}
              >
                <Video />
                <span>AI Mock Interview</span>
              </li>
              <li 
                className={`menu-item ${activeTab === 'SUBSCRIPTION' ? 'active' : ''}`}
                onClick={() => setActiveTab('SUBSCRIPTION')}
              >
                <CreditCard />
                <span>Plans & Subscription</span>
              </li>
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer with Credits Indicator & Profile */}
        <div className="sidebar-footer">
          
          {/* Daily Limit Badge */}
          {!isSubscribed ? (
            <div className="limit-badge" style={{ marginBottom: '16px' }}>
              <div className="limit-text">
                <span>Daily Limit credits</span>
                <span className="limit-value">{10 - creditsUsed}/10</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${((10 - creditsUsed) / 10) * 100}%`, 
                    backgroundColor: 'var(--color-primary)', 
                    borderRadius: '2px' 
                  }} 
                />
              </div>
            </div>
          ) : (
            <div className="limit-badge" style={{ marginBottom: '16px', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <div className="limit-text" style={{ color: '#16a34a', justifyContent: 'center', gap: '4px', fontWeight: 'bold' }}>
                <span>Pro Member (Unlimited)</span>
              </div>
            </div>
          )}

          {/* User profile card */}
          <div className="user-profile">
            <div className="user-avatar">{user.avatarChar}</div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.emailOrPhone}</span>
            </div>
            
            <button 
              onClick={handleLogout} 
              style={{ 
                marginLeft: 'auto', 
                background: 'none', 
                border: 'none', 
                color: 'var(--color-text-muted)', 
                cursor: 'pointer',
                padding: '4px'
              }}
              title="Logout"
            >
              <LogOut style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {!isFirebaseConfigured && (
            <div 
              style={{ 
                fontSize: '0.75rem', 
                color: 'var(--color-primary)', 
                textAlign: 'center', 
                marginTop: '8px', 
                fontWeight: 'bold',
                backgroundColor: 'var(--color-primary-light)',
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid var(--color-border-red)'
              }}
            >
              ⚠️ running in Demo Mode (Local)
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace Dashboard Content */}
      <main className="app-content">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;
