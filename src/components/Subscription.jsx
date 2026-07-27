import React, { useState } from 'react';
import { Check, CheckCircle2, ShieldCheck, CreditCard, RefreshCw, X } from 'lucide-react';

export default function Subscription({ user, isSubscribed, onSubscribeSuccess }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStep, setPaymentStep] = useState('FORM'); // FORM, PROCESSING, SUCCESS
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const plans = [
    {
      name: "Free Trial Plan",
      price: "₹0",
      period: "forever",
      desc: "Perfect for exploring platform capabilities.",
      features: [
        "10 Daily Limit credits",
        "Basic ATS score calculation",
        "Standard Text-chat mock interview",
        "Resume layout check details"
      ],
      disabledFeatures: [
        "Unlimited scans",
        "Speech Voice evaluations",
        "Custom JD questions generator",
        "PDF reports export options"
      ],
      actionText: "Current Plan",
      isCurrent: !isSubscribed,
      popular: false
    },
    {
      name: "SmartHire Pro Plan",
      price: "₹299",
      period: "month",
      desc: "For serious campus placement candidates.",
      features: [
        "UNLIMITED Resume audits",
        "UNLIMITED Mock interview sessions",
        "Speech Voice evaluations & wave",
        "Custom JD keywords matching",
        "Complete PDF reviews exports",
        "Priority AI processing queues"
      ],
      disabledFeatures: [],
      actionText: "Upgrade to Pro",
      isCurrent: isSubscribed,
      popular: true
    },
    {
      name: "Institute Cohort License",
      price: "₹1,499",
      period: "month",
      desc: "For college training & placement cells.",
      features: [
        "Bulk student cohort tracking",
        "Admin placement dashboards",
        "CSV reports export filters",
        "Custom company interview mocks",
        "White-label branding details",
        "Dedicated placement mentors"
      ],
      disabledFeatures: [],
      actionText: "Contact Sales",
      isCurrent: false,
      popular: false
    }
  ];

  const handleCheckoutInit = (plan) => {
    if (plan.price === '₹0') return;
    if (plan.name === 'Institute Cohort License') {
      alert("Custom college license inquiry sent! Our team will contact you within 2 hours.");
      return;
    }
    setSelectedPlan(plan);
    setPaymentStep('FORM');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setError('');
    setShowCheckout(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv) {
      setError('Please fill in all credit card details.');
      return;
    }
    
    // Simple validation
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }

    setError('');
    setPaymentStep('PROCESSING');

    // Simulate gateway response
    setTimeout(() => {
      setPaymentStep('SUCCESS');
      setTimeout(() => {
        onSubscribeSuccess();
        setShowCheckout(false);
      }, 2000);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Subscription Plans</h1>
          <p>Unlock unlimited access to tools designed to help you secure placement drives.</p>
        </div>
      </div>

      {isSubscribed && (
        <div className="card animate-fade-in" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', color: '#16a34a' }}>
          <CheckCircle2 style={{ width: '28px', height: '28px' }} />
          <div>
            <h3 style={{ color: '#16a34a', fontSize: '1.1rem', marginBottom: '2px' }}>SmartHire Pro Activated</h3>
            <p style={{ color: '#16a34a', fontSize: '0.85rem' }}>Your account now has unlimited access to resume analyses, mock interviews, and speech ratings.</p>
          </div>
        </div>
      )}

      {/* Pricing Grid */}
      <div className="pricing-grid">
        {plans.map((plan, idx) => (
          <div 
            key={idx} 
            className={`card pricing-card ${plan.popular ? 'popular animate-pulse-slow' : ''}`}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              border: plan.popular ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
            }}
          >
            {plan.popular && <span className="popular-badge">RECOMMENDED</span>}
            
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{plan.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>{plan.desc}</p>
              
              <div className="price-text">
                {plan.price}
                <span className="price-period">/{plan.period}</span>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '20px 0' }} />

              <ul className="feature-list">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className="feature-item checked">
                    <Check style={{ width: '16px', height: '16px', color: 'var(--color-primary)', strokeWidth: '3' }} />
                    <span>{feat}</span>
                  </li>
                ))}
                
                {plan.disabledFeatures.map((feat, fidx) => (
                  <li key={fidx} className="feature-item disabled">
                    <Check style={{ width: '16px', height: '16px', color: 'var(--color-border)' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              className={`btn ${plan.isCurrent ? 'btn-secondary' : 'btn-primary'}`}
              style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
              onClick={() => handleCheckoutInit(plan)}
              disabled={plan.isCurrent}
            >
              {plan.isCurrent ? 'Active Plan' : plan.actionText}
            </button>
          </div>
        ))}
      </div>

      {/* Checkout Dialog */}
      {showCheckout && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '440px', borderTop: '4px solid var(--color-primary)' }}>
            <button className="modal-close" onClick={() => setShowCheckout(false)}>
              <X />
            </button>

            {paymentStep === 'FORM' && (
              <form onSubmit={handlePaymentSubmit} className="animate-fade-in" style={{ textAlign: 'left' }}>
                <h3 style={{ marginBottom: '8px' }}>Secure Payment Sandbox</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  Complete subscription purchase for <strong style={{ color: 'var(--color-primary)' }}>{selectedPlan?.name}</strong>.
                </p>

                <div className="form-group">
                  <label className="form-label">Credit Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="xxxx xxxx xxxx xxxx"
                    maxLength="19"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, '');
                        if (val.length > 2) {
                          val = val.substring(0, 2) + '/' + val.substring(2, 4);
                        }
                        setExpiry(val);
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">CVV Code</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="xxx"
                      maxLength="3"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                </div>

                {error && <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}

                <div style={{ padding: '12px', backgroundColor: 'var(--color-bg-alt)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px', fontSize: '0.75rem', border: '1px solid var(--color-border)' }}>
                  <ShieldCheck style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>Sandbox checkout simulation. Entering random mock values will succeed.</span>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Pay {selectedPlan?.price} & Subscribe
                </button>
              </form>
            )}

            {paymentStep === 'PROCESSING' && (
              <div className="flex flex-col align-center justify-center gap-md animate-fade-in" style={{ padding: '40px 0' }}>
                <RefreshCw className="animate-fade-in" style={{ width: '48px', height: '48px', color: 'var(--color-primary)', animation: 'spin 1.5s linear infinite' }} />
                <h3>Connecting payment terminal</h3>
                <p>Verifying secure token authorization credentials...</p>
              </div>
            )}

            {paymentStep === 'SUCCESS' && (
              <div className="flex flex-col align-center justify-center gap-md animate-fade-in" style={{ padding: '40px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 style={{ width: '36px', height: '36px' }} />
                </div>
                <h3>Payment Approved!</h3>
                <p>Upgraded to Premium Pro Plan successfully.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes pulseSlow {
          0%, 100% { border-color: var(--color-primary); }
          50% { border-color: var(--color-primary-hover); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s infinite;
        }
      `}</style>

    </div>
  );
}
