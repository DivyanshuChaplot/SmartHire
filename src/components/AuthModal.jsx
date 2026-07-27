import React, { useState, useEffect } from 'react';
import { Phone, ArrowRight, ShieldCheck, RefreshCw, Mail } from 'lucide-react';
import { auth, isFirebaseConfigured } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AuthModal({ onLoginSuccess }) {
  const [step, setStep] = useState('SELECT_METHOD'); // SELECT_METHOD, PHONE_INPUT, EMAIL_INPUT, OTP_INPUT
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']); // Firebase OTP is 6 digits
  const [timer, setTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // OTP Timer countdown
  useEffect(() => {
    let interval;
    if (step === 'OTP_INPUT' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendActive(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!inputValue) {
      setError('Please enter a valid mobile number.');
      return;
    }
    
    const cleanedPhone = inputValue.replace(/\D/g, '');
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');
    
    if (!isFirebaseConfigured) {
      // Mock local OTP trigger
      setTimeout(() => {
        setLoading(false);
        setStep('OTP_INPUT');
        setTimer(60);
        setIsResendActive(false);
        setOtpValues(['', '', '', '', '', '']);
        console.warn("DEMO MODE: OTP sent. Use code '123456' to login.");
      }, 800);
      return;
    }

    try {
      const formattedPhone = `+91${cleanedPhone}`;

      // Initialize invisible reCAPTCHA verifier if not already present
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try again.');
          }
        });
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep('OTP_INPUT');
      setTimer(60);
      setIsResendActive(false);
      setOtpValues(['', '', '', '', '', '']);
    } catch (err) {
      console.error("Phone Auth Error:", err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!inputValue || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    if (!isFirebaseConfigured) {
      // Mock local Email login trigger
      setTimeout(() => {
        setLoading(false);
        const name = inputValue.split('@')[0];
        const mockUser = {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          emailOrPhone: inputValue,
          avatarChar: inputValue[0].toUpperCase(),
        };
        if (onLoginSuccess) onLoginSuccess(mockUser);
      }, 800);
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, inputValue, password);
      } else {
        await signInWithEmailAndPassword(auth, inputValue, password);
      }
    } catch (err) {
      console.error("Email Auth Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please verify your credentials or click Sign Up below.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = '';
        setOtpValues(newOtpValues);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOtp = otpValues.join('');
    if (enteredOtp.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    if (!isFirebaseConfigured) {
      setTimeout(() => {
        setLoading(false);
        if (enteredOtp === '123456') {
          const mockUser = {
            name: `User ${inputValue.slice(-4)}`,
            emailOrPhone: `+91 ${inputValue}`,
            avatarChar: inputValue[0] || 'U',
          };
          if (onLoginSuccess) onLoginSuccess(mockUser);
        } else {
          setError('Incorrect OTP. Use "123456" for demo login.');
        }
      }, 800);
      return;
    }

    try {
      if (confirmationResult) {
        await confirmationResult.confirm(enteredOtp);
        // Authentication state observer in App.jsx will automatically handle local login flow.
      } else {
        setError('Verification session expired. Please send OTP again.');
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError('Incorrect OTP or session expired. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(60);
    setIsResendActive(false);
    setOtpValues(['', '', '', '', '', '']);
    setError('');
    const firstInput = document.getElementById('otp-0');
    if (firstInput) firstInput.focus();

    if (!isFirebaseConfigured) {
      console.warn("DEMO MODE: OTP resent. Use code '123456' to login.");
      return;
    }

    try {
      const cleanedPhone = inputValue.replace(/\D/g, '');
      const formattedPhone = `+91${cleanedPhone}`;
      if (window.recaptchaVerifier) {
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
        setConfirmationResult(confirmation);
      }
    } catch (err) {
      console.error("OTP Resend Error:", err);
      setError(err.message || 'Failed to resend OTP.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col align-center justify-center gap-md" style={{ padding: '40px 0' }}>
          <RefreshCw className="animate-fade-in" style={{ width: '48px', height: '48px', color: 'var(--color-primary)', animation: 'spin 1.5s linear infinite' }} />
          <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>Securing your session...</p>
        </div>
      );
    }

    switch (step) {
      case 'SELECT_METHOD':
        return (
          <div className="auth-button-group animate-fade-in">
            <button className="btn btn-secondary" onClick={() => { setStep('PHONE_INPUT'); setInputValue(''); setError(''); }}>
              <Phone style={{ width: '18px', height: '18px' }} />
              Continue with Mobile OTP
            </button>

            <button className="btn btn-secondary" style={{ marginTop: '8px' }} onClick={() => { setStep('EMAIL_INPUT'); setInputValue(''); setPassword(''); setError(''); setIsSignUp(false); }}>
              <Mail style={{ width: '18px', height: '18px' }} />
              Continue with Email ID
            </button>
            
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              <ShieldCheck style={{ width: '16px', height: '16px', color: 'var(--color-primary)' }} />
              100% Secure & Placement Compliant
            </div>
          </div>
        );

      case 'PHONE_INPUT':
        return (
          <form onSubmit={handleSendOTP} className="animate-fade-in">
            <div className="form-group">
              <label className="form-label">Enter Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: '600', color: 'var(--color-text-muted)' }}>+91</span>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Enter 10-digit number"
                  value={inputValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setInputValue(val);
                    setError('');
                  }}
                  style={{ paddingLeft: '54px' }}
                  autoFocus
                />
              </div>
            </div>
            {error && <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'left' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Send Verification OTP
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
            <button type="button" className="btn btn-secondary" style={{ width: '100%', marginTop: '12px' }} onClick={() => setStep('SELECT_METHOD')}>
              Back
            </button>
          </form>
        );

      case 'EMAIL_INPUT':
        return (
          <form onSubmit={handleEmailAuth} className="animate-fade-in">
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '16px' }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="example@gmail.com"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setError(''); }}
                autoFocus
                required
              />
            </div>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '16px' }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password (min 6 characters)"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>
            {error && <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'left' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {isSignUp ? 'Sign Up & Get Started' : 'Sign In'}
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>

            <div style={{ marginTop: '16px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'center', gap: '4px' }}>
              <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
              <button 
                type="button" 
                className="resend-btn" 
                style={{ textDecoration: 'none', padding: 0, margin: 0 }} 
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>

            <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setStep('SELECT_METHOD')}>
              Back
            </button>
          </form>
        );

      case 'OTP_INPUT':
        return (
          <form onSubmit={handleVerifyOTP} className="animate-fade-in">
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              We have sent a verification code to
            </p>
            <p style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-text)' }}>
              +91 {inputValue}
            </p>
            
            <div className="otp-box-wrapper">
              {otpValues.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength="1"
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  autoComplete="off"
                  style={{ width: '40px', height: '48px', fontSize: '1.25rem' }}
                />
              ))}
            </div>

            {error && <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Verify & Get Started
              <ShieldCheck style={{ width: '18px', height: '18px' }} />
            </button>

            <div className="otp-timer">
              {isResendActive ? (
                <span>Didn't receive OTP? <button type="button" className="resend-btn" onClick={handleResend}>Resend Code</button></span>
              ) : (
                <span>Resend OTP code in <strong style={{ color: 'var(--color-primary)' }}>{timer}s</strong></span>
              )}
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Tip: For testing, configure a mock number in the Firebase Console and enter its corresponding code.
            </div>
            
            <button type="button" className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => {
              setStep('PHONE_INPUT');
              setOtpValues(['', '', '', '', '', '']);
            }}>
              Change Details
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card" style={{ maxWidth: '420px', borderTop: '4px solid var(--color-primary)' }}>
        <div className="auth-logo">
          <div className="logo-icon" style={{ margin: '0 auto 12px' }}>S</div>
          <h2 className="logo-text" style={{ fontSize: '1.6rem', textAlign: 'center' }}>
            SmartHire<span className="logo-dot">.</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>AI Placement Readiness Portal</p>
        </div>
        
        <h3 className="auth-title">
          {step === 'OTP_INPUT' ? 'Enter Security Pin' : 'Access Your Workspace'}
        </h3>
        <p className="auth-subtitle">
          {step === 'OTP_INPUT' ? 'Enter the 6-digit code to authorize login.' : 'Please sign in to access mock interviews, resume analyzer and dashboard tracking.'}
        </p>

        {renderContent()}
      </div>
      
      {/* Invisible reCAPTCHA target element required by Firebase Auth Phone Auth */}
      <div id="recaptcha-container"></div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

