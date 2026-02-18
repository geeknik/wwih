'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { evil, chaos } from '@/lib/chaos';
import { telemetry } from '@/lib/telemetry';

// Random deceptive navigation labels
const navLabels = ['Home', 'About', 'Contact', 'FAQ', 'Store', 'Blog', 'Services'];
const confusingTitles = [
  'Welcome (But Not Really)',
  'You Found Us (Congratulations?)',
  'This Is The Thing',
  'Not The Page You Wanted',
  'Click Carefully',
  'At Your Own Risk',
  'Still Loading...',
  'Why Are You Here?'
];

const optionLabels = [
  'Option Alpha', 'Option Beta', 'Option Gamma', 'Option Delta', 'Option Epsilon',
  'Option Zeta', 'Option Eta', 'Option Theta', 'Option Iota', 'Option Kappa',
  'Option Lambda', 'Option Mu', 'Option Nu', 'Option Xi', 'Option Omicron',
  'Option Pi', 'Option Rho', 'Option Sigma', 'Option Tau', 'Option Upsilon',
  'Option Phi', 'Option Chi', 'Option Psi', 'Option Omega', 'Option One',
  'Option Two', 'Option Three', 'Option Four', 'Option Five', 'Option Six'
];

// Pre-generate confetti pieces outside render
function generateConfettiPieces() {
  const colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ff6600'];
  const pieces = [];
  for (let i = 0; i < 100; i++) {
    pieces.push({
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 0.5
    });
  }
  return pieces;
}

// Cookie banner component - moved outside main component
function CookieBanner({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div className={`cookie-banner cookie-banner-${position}`}>
      <h4>🍪 Cookies (But Not The Edible Kind)</h4>
      <p>We use cookies to track your regret levels. By staying, you consent to being monitored. Or do not. We do not care.</p>
      <div>
        <button 
          className="cookie-btn cookie-accept"
          onClick={() => telemetry.trackEvent('page-view', 'cookie-accepted')}
        >
          Accept (Mistake)
        </button>
        <button className="cookie-btn cookie-decline">
          Decline (Invisible)
        </button>
      </div>
    </div>
  );
}

export default function WWIH() {
  // Initialize state with memoized initial values
  const initialRequiredFields = useMemo(() => evil.getRandomRequiredFields(['name', 'email', 'message']), []);
  const initialNavItems = useMemo(() => chaos.shuffle([...navLabels]), []);
  const initialHeroTitle = useMemo(() => chaos.pick(confusingTitles), []);
  const confettiPieces = useMemo(() => generateConfettiPieces(), []);
  
  const [showModal, setShowModal] = useState(true);
  const [modalClosePosition, setModalClosePosition] = useState({ x: 20, y: 20 });
  const [currentPage, setCurrentPage] = useState('home');
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardProgress, setWizardProgress] = useState(10);
  const [showHelp, setShowHelp] = useState(false);
  const [helpMessages, setHelpMessages] = useState<{type: 'bot' | 'user', text: string}[]>([
    { type: 'bot', text: 'Hello! How can I not help you today?' }
  ]);
  const [helpInput, setHelpInput] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState<{name?: string; email?: string; message?: string}>({});
  const [requiredFields] = useState<string[]>(initialRequiredFields);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [navItems] = useState<string[]>(initialNavItems);
  const [heroTitle] = useState(initialHeroTitle);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyAnswer, setSurveyAnswer] = useState<string | null>(null);
  
  const helpInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize chaos on mount - only for side effects
  useEffect(() => {
    // Track page view
    telemetry.trackPageView('home');
    
    // Navigation event listener
    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.page) {
        setCurrentPage(customEvent.detail.page);
        telemetry.trackPageView(customEvent.detail.page);
      }
    };
    window.addEventListener('wwih:navigate', handleNavigate);
    
    return () => {
      window.removeEventListener('wwih:navigate', handleNavigate);
    };
  }, []);

  // Moving modal close button
  useEffect(() => {
    if (showModal) {
      const interval = setInterval(() => {
        setModalClosePosition(evil.getButtonOffset());
      }, 500);
      return () => clearInterval(interval);
    }
  }, [showModal]);

  // Handle mouse enter on close button - move it away
  const handleCloseMouseEnter = useCallback(() => {
    setModalClosePosition(evil.getButtonOffset());
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    telemetry.trackEvent('page-view', 'after-modal');
  }, []);

  // Navigation with misdirection
  const handleNavClick = useCallback((label: string) => {
    // 30% chance to misdirect
    if (chaos.chance(30)) {
      const misdirected = evil.getMisdirection(label);
      setCurrentPage(misdirected.toLowerCase());
      telemetry.trackEvent('loop', `Misdirected from ${label} to ${misdirected}`);
    } else {
      setCurrentPage(label.toLowerCase());
    }
    telemetry.trackPageView(currentPage);
  }, [currentPage]);

  // Wizard navigation
  const nextWizardStep = useCallback(() => {
    if (wizardStep === 0) {
      // Step 1: Select option (30 choices)
      if (selectedOption === null) {
        return; // No selection
      }
    }
    
    if (wizardStep < 6) {
      setWizardStep(wizardStep + 1);
    } else {
      // Complete wizard - show confetti
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setCurrentPage('success');
        telemetry.trackEvent('page-view', 'wizard-complete');
      }, 3000);
    }
  }, [wizardStep, selectedOption]);

  const handlePrevWizardStep = useCallback(() => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    }
  }, [wizardStep]);

  // Form submission
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    telemetry.trackEvent('form-fail', 'Form submission attempted');
    
    const errors: typeof formErrors = {};
    
    // Random validation
    if (requiredFields.includes('name') && (!formData.name || formData.name.length < 3)) {
      errors.name = evil.getRandomError();
    }
    if (requiredFields.includes('email') && (!formData.email || !formData.email.includes('@'))) {
      errors.email = evil.getRandomError();
    }
    if (requiredFields.includes('message') && (!formData.message || formData.message.length < 10)) {
      errors.message = evil.getRandomError();
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Wipe 50% of fields
      if (evil.shouldWipeField()) {
        setFormData({ ...formData, name: '', email: '' });
      }
      telemetry.trackEvent('form-fail', 'Validation failed');
    } else {
      // Success... or is it?
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setCurrentPage('success');
      }, 2000);
    }
  }, [requiredFields, formData]);

  // Help widget
  const sendHelpMessage = useCallback(() => {
    if (!helpInput.trim()) return;
    
    const userMsg = helpInput;
    setHelpMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setHelpInput('');
    telemetry.trackEvent('help-click', userMsg);
    
    // Fake response delay
    setTimeout(() => {
      const responses = [
        'Have you tried understanding better?',
        'Skill issue.',
        'Please hold.',
        'Your question is invalid.',
        'This is obvious.',
        'Try again (but differently).',
        'I cannot help you. But keep trying!',
        'Error: Help not found.',
        'Have you considered giving up?',
        'Processing... (just kidding)',
        'That is not the right question.',
        'Interesting. Invalid, but interesting.',
        'No.',
        'Try clicking less.',
        'Maybe the answer is within you.'
      ];
      
      setHelpMessages(prev => [...prev, { 
        type: 'bot', 
        text: chaos.pick(responses) 
      }]);
    }, chaos.range(500, 2000));
  }, [helpInput]);

  // Survey submission
  const handleSurveySubmit = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      alert(`Thank you for your feedback: "${surveyAnswer}" - We will ignore it.`);
    }, 1500);
  }, [surveyAnswer]);

  // Render confetti
  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    return (
      <div className="confetti-explosion">
        {confettiPieces.map((piece, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${piece.left}%`,
              background: piece.color,
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Render page content
  const renderPage = () => {
    switch (currentPage) {
      case 'about':
      case 'contact':
      case 'faq':
      case 'store':
      case 'blog':
      case 'services':
        return (
          <div className="section-hostile">
            <h2 className="section-title">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h2>
            <p style={{ color: '#00ffff', fontSize: '20px', textAlign: 'center' }}>
              This is the {currentPage} page. Or is it? 
              <br /><br />
              <em style={{ color: '#ff0000' }}>The navigation lied to you. This is actually a {chaos.pick(['store', 'blog', 'FAQ', 'contact', 'services'])} page pretending to be {currentPage}.</em>
            </p>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button 
                className="btn-hostile"
                onClick={() => setCurrentPage('home')}
              >
                Go Back (Where?)
              </button>
            </div>
          </div>
        );
      
      case 'wizard':
        return (
          <div className="wizard-container">
            <h2 style={{ color: '#00ff00', textAlign: 'center', marginBottom: '20px' }}>
              Wizard of Regret
            </h2>
            
            <div className="wizard-progress">
              <div 
                className="wizard-progress-bar" 
                style={{ width: `${wizardProgress}%` }}
              />
            </div>
            
            {/* Step 1: Option selection */}
            <div className={`wizard-step ${wizardStep === 0 ? 'active' : ''}`}>
              <h3 style={{ color: '#ffff00', marginBottom: '20px' }}>Step 1: Choose Something (Anything?)</h3>
              <p style={{ color: '#00ffff', marginBottom: '20px' }}>Select the option that best represents your feelings right now:</p>
              <div className="option-grid">
                {optionLabels.map((label, i) => (
                  <div 
                    key={i}
                    className={`option-item ${selectedOption === i ? 'selected' : ''}`}
                    onClick={() => setSelectedOption(i)}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Step 2: Name */}
            <div className={`wizard-step ${wizardStep === 1 ? 'active' : ''}`}>
              <h3 style={{ color: '#ffff00', marginBottom: '20px' }}>Step 2: Personal Information</h3>
              <div className="form-group">
                <label className="form-label">Your Name (For Our Records)</label>
                <input type="text" className="form-input" placeholder="Type your name..." />
              </div>
              <p style={{ color: '#ff0000', fontSize: '14px' }}>* Just kidding, this is optional. Or is it?</p>
            </div>
            
            {/* Step 3: More questions */}
            <div className={`wizard-step ${wizardStep === 2 ? 'active' : ''}`}>
              <h3 style={{ color: '#ffff00', marginBottom: '20px' }}>Step 3: How Do You Feel?</h3>
              <div className="form-group">
                <label className="form-label">On a scale of 1 to &quot;Why?&quot;, how would you rate this experience?</label>
                <input type="text" className="form-input" placeholder="Enter a number or emotion..." />
              </div>
            </div>
            
            {/* Step 4: Preferences */}
            <div className={`wizard-step ${wizardStep === 3 ? 'active' : ''}`}>
              <h3 style={{ color: '#ffff00', marginBottom: '20px' }}>Step 4: Preferences</h3>
              <p style={{ color: '#00ffff', marginBottom: '20px' }}>Check all that apply:</p>
              {['I enjoy pain', 'I regret this', 'I want to leave', 'This is fine', 'Why am I here?'].map((opt, i) => (
                <div key={i} style={{ margin: '10px 0' }}>
                  <input type="checkbox" id={`check${i}`} />
                  <label htmlFor={`check${i}`} style={{ color: '#ff00ff', marginLeft: '10px' }}>{opt}</label>
                </div>
              ))}
            </div>
            
            {/* Step 5: More selection */}
            <div className={`wizard-step ${wizardStep === 4 ? 'active' : ''}`}>
              <h3 style={{ color: '#ffff00', marginBottom: '20px' }}>Step 5: Select All That Contain &quot;Emotional Pain&quot;</h3>
              <div className="option-grid" style={{ maxHeight: '300px' }}>
                {['😢', '😞', '😔', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😥', '😰', '😱', '😭', '💔'].map((emoji, i) => (
                  <div key={i} className="option-item">{emoji}</div>
                ))}
              </div>
            </div>
            
            {/* Step 6: Confirm */}
            <div className={`wizard-step ${wizardStep === 5 ? 'active' : ''}`}>
              <h3 style={{ color: '#ffff00', marginBottom: '20px' }}>Step 6: Confirmation</h3>
              <p style={{ color: '#00ffff', marginBottom: '20px' }}>Are you sure you want to proceed? There is no going back. (There is, but we will not tell you how.)</p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button 
                  className="btn-hostile" 
                  style={{ background: '#333', color: '#666', borderColor: '#444' }}
                  onClick={() => setWizardStep(0)}
                >
                  Start Over
                </button>
              </div>
            </div>
            
            {/* Step 7: Final */}
            <div className={`wizard-step ${wizardStep === 6 ? 'active' : ''}`}>
              <h3 style={{ color: '#ff0000', fontSize: '32px', marginBottom: '20px' }}>Almost There!</h3>
              <p style={{ color: '#ffff00', marginBottom: '20px' }}>
                You have come so far. But is it worth it?
                <br /><br />
                <em>Hint: No.</em>
              </p>
            </div>
            
            <div className="wizard-nav">
              <button 
                className="wizard-btn wizard-prev"
                onClick={handlePrevWizardStep}
                disabled={wizardStep === 0}
              >
                {chaos.chance(50) ? 'Previous (Maybe)' : 'Go Back'}
              </button>
              <button 
                className="wizard-btn wizard-next"
                onClick={nextWizardStep}
              >
                {chaos.chance(50) ? 'Next (If You Dare)' : 'Continue (Mistake)'}
              </button>
            </div>
          </div>
        );
      
      case 'success':
        return (
          <div className="success-hostile">
            <h1 className="success-title">Congratulations!</h1>
            <p className="success-message">
              You have failed successfully.
              <br /><br />
              <span style={{ color: '#ff0000', fontSize: '18px' }}>
                Now redirecting you to... somewhere else.
              </span>
            </p>
            {renderConfetti()}
          </div>
        );
      
      case 'contact-form':
        return (
          <div className="section-hostile">
            <h2 className="section-title">Contact Us (Please Do Not)</h2>
            <form className="form-hostile" onSubmit={handleFormSubmit} ref={formRef}>
              <div className="form-group">
                <label className="form-label">
                  Name {requiredFields.includes('name') && <span style={{ color: '#ff0000' }}>*</span>}
                </label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter your name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && <p className="form-error">{formErrors.name}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Email {requiredFields.includes('email') && <span style={{ color: '#ff0000' }}>*</span>}
                </label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter your email..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {formErrors.email && <p className="form-error">{formErrors.email}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Message {requiredFields.includes('message') && <span style={{ color: '#ff0000' }}>*</span>}
                </label>
                <textarea 
                  className="form-input"
                  rows={5}
                  placeholder="Type your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                {formErrors.message && <p className="form-error">{formErrors.message}</p>}
              </div>
              
              <button type="submit" className="btn-hostile" style={{ width: '100%' }}>
                {evil.getRandomButton()}
              </button>
              
              <p style={{ color: '#666', fontSize: '12px', marginTop: '20px', textAlign: 'center' }}>
                * Required fields change randomly. Good luck figuring out which ones.
              </p>
            </form>
          </div>
        );
      
      case 'telemetry':
        const metrics = telemetry.getMetrics();
        return (
          <div className="telemetry-dashboard">
            <h1 className="telemetry-title">📊 Your Suffering Metrics</h1>
            
            <div className="telemetry-stat">
              <span className="telemetry-stat-label">Session Duration</span>
              <span className="telemetry-stat-value">
                {Math.floor(telemetry.getSessionDuration() / 60000)}m {Math.floor((telemetry.getSessionDuration() % 60000) / 1000)}s
              </span>
            </div>
            
            <div className="telemetry-stat">
              <span className="telemetry-stat-label">Rage Clicks</span>
              <span className="telemetry-stat-value">{metrics.rageClicks}</span>
            </div>
            
            <div className="telemetry-stat">
              <span className="telemetry-stat-label">Back Button Abuses</span>
              <span className="telemetry-stat-value">{metrics.backAttempts}</span>
            </div>
            
            <div className="telemetry-stat">
              <span className="telemetry-stat-label">Mouse Shakes</span>
              <span className="telemetry-stat-value">{metrics.mouseShakes}</span>
            </div>
            
            <div className="telemetry-stat">
              <span className="telemetry-stat-label">Help Desk Visits</span>
              <span className="telemetry-stat-value">{metrics.helpClicks}</span>
            </div>
            
            <div className="telemetry-stat">
              <span className="telemetry-stat-label">Form Failures</span>
              <span className="telemetry-stat-value">{metrics.formFailures}</span>
            </div>
            
            <div className="telemetry-stat">
              <span className="telemetry-stat-label">Navigation Loops</span>
              <span className="telemetry-stat-value">{metrics.loops}</span>
            </div>
            
            <div className="rage-score">
              {telemetry.getRageScore()}
            </div>
            
            <p style={{ textAlign: 'center', color: '#ff0000', fontSize: '18px' }}>
              RAGE SCORE
            </p>
            
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button 
                className="btn-hostile"
                onClick={() => {
                  telemetry.reset();
                  setCurrentPage('home');
                }}
              >
                Suffer Again
              </button>
            </div>
          </div>
        );
      
      case 'survey':
        return (
          <div className="survey-hostile">
            <h2 style={{ color: '#ff0000', textAlign: 'center', marginBottom: '30px', fontSize: '28px' }}>
              Exit Survey (Optional - But We Will Judge You Anyway)
            </h2>
            
            <div className="survey-question">
              <p style={{ color: '#ffff00', fontSize: '20px', marginBottom: '20px' }}>
                How would you describe this experience?
              </p>
              
              {[
                'Physically upsetting',
                'Malicious',
                'I feel punished',
                'Why would anyone do this?',
                'Entertaining but painful',
                'I regret every click',
                'The navigation is lying',
                'This is a crime against UX'
              ].map((option, i) => (
                <label 
                  key={i}
                  className={`survey-option ${surveyAnswer === option ? 'selected' : ''}`}
                  onClick={() => setSurveyAnswer(option)}
                >
                  {option}
                </label>
              ))}
            </div>
            
            <button 
              className="btn-hostile" 
              style={{ width: '100%' }}
              onClick={handleSurveySubmit}
              disabled={!surveyAnswer}
            >
              Submit (To Be Ignored)
            </button>
          </div>
        );
      
      default:
        return (
          <>
            {/* Hero Section */}
            <div className="hero-hostile">
              <h1 className="hero-title">{heroTitle}</h1>
              <p className="hero-subtitle">
                You are already here. Might as well suffer.
              </p>
            </div>
            
            {/* Main CTA */}
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <button 
                className="btn-hostile"
                onClick={() => {
                  setCurrentPage('wizard');
                  setWizardStep(0);
                  setWizardProgress(10);
                }}
              >
                Begin Your Journey (Mistake)
              </button>
              
              <p style={{ color: '#ff0000', marginTop: '20px', fontSize: '16px' }}>
                * This button will lead you through 7 steps of regret.
              </p>
            </div>
            
            {/* Feature blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
              {[
                { title: 'Confusing Navigation', desc: 'Links go places you do not expect', color: '#ff0000' },
                { title: 'Hostile Forms', desc: 'Validation errors without solutions', color: '#ffff00' },
                { title: 'Infinite Help', desc: 'Answers that do not answer', color: '#00ff00' },
                { title: 'Rage Tracking', desc: 'We measure your suffering', color: '#00ffff' }
              ].map((feature, i) => (
                <div 
                  key={i}
                  style={{ 
                    background: '#000', 
                    padding: '30px', 
                    border: `4px solid ${feature.color}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if (i === 0) setCurrentPage('about');
                    else if (i === 1) setCurrentPage('contact-form');
                    else if (i === 2) setShowHelp(true);
                    else setCurrentPage('telemetry');
                  }}
                >
                  <h3 style={{ color: feature.color, fontSize: '24px', marginBottom: '15px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#666', fontSize: '16px' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Pricing parody */}
            <div className="section-hostile">
              <h2 className="section-title">Pricing Plans (Why Not?)</h2>
              <div className="pricing-hostile">
                {[
                  { name: 'Free', price: '$0', features: ['Basic suffering', 'Standard confusion', '5 misclicks/day'] },
                  { name: 'Suffer', price: '$9.99', features: ['Enhanced pain', 'Priority frustration', 'Unlimited misclicks'], featured: true },
                  { name: 'Torture', price: '$99.99', features: ['Maximum UX horror', 'Personalized insults', '24/7 regret'] }
                ].map((plan, i) => (
                  <div 
                    key={i}
                    className={`pricing-card ${plan.featured ? 'featured' : ''}`}
                  >
                    <h3 className="pricing-title">{plan.name}</h3>
                    <div className="pricing-price">{plan.price}</div>
                    <ul className="pricing-features">
                      {plan.features.map((f, j) => (
                        <li key={j}>{f}</li>
                      ))}
                    </ul>
                    <button 
                      className="pricing-btn"
                      onClick={() => setCurrentPage(i === 0 ? 'home' : 'contact-form')}
                    >
                      {i === 0 ? 'Continue Suffering' : 'Pay To Suffer More'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Exit survey teaser */}
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <button 
                className="btn-hostile"
                style={{ background: '#333', color: '#666', borderColor: '#444' }}
                onClick={() => setCurrentPage('survey')}
              >
                We Value Your Feedback (Lie)
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Cookie Banner 1 */}
      <CookieBanner position="top" />
      
      {/* Cookie Banner 2 */}
      <CookieBanner position="bottom" />
      
      {/* Modal Ambush */}
      {showModal && (
        <div className="modal-ambush">
          <div className="modal-ambush-content">
            <button 
              className="modal-close"
              style={{ 
                right: `${modalClosePosition.x}px`, 
                top: `${modalClosePosition.y}px` 
              }}
              onMouseEnter={handleCloseMouseEnter}
              onClick={closeModal}
            >
              ×
            </button>
            <h2>Wait! Before You Go!</h2>
            <p>Join our newsletter for absolutely no benefit!</p>
            <p style={{ color: '#ff0000', fontSize: '14px' }}>
              (The X button is slippery. Keep trying!)
            </p>
            <button 
              className="btn-hostile"
              onClick={closeModal}
            >
              Fine, I will Subscribe (No)
            </button>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="nav-hostile">
        {navItems.map((label) => (
          <a 
            key={label}
            href="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(label);
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      
      {/* Breadcrumbs (Lies) */}
      <div className="breadcrumbs-hostile">
        <span className="breadcrumb-item" onClick={() => setCurrentPage('home')}>Home</span>
        <span className="breadcrumb-separator">›</span>
        <span style={{ color: '#ff0000' }}>{currentPage}</span>
        <span className="breadcrumb-separator">›</span>
        <span style={{ color: '#666' }}>Nowhere</span>
      </div>
      
      {/* Main Content */}
      <main>
        {renderPage()}
      </main>
      
      {/* Help Widget */}
      <div className="help-widget">
        <button 
          className="help-trigger"
          onClick={() => setShowHelp(!showHelp)}
          data-help
        >
          HELP?
        </button>
        
        {showHelp && (
          <div className="help-panel open">
            <div className="help-messages">
              {helpMessages.map((msg, i) => (
                <div key={i} className={`help-message ${msg.type}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="help-input-area">
              <input 
                type="text" 
                className="help-input"
                placeholder="Ask for help..."
                value={helpInput}
                onChange={(e) => setHelpInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendHelpMessage()}
                ref={helpInputRef}
              />
              <button className="help-send" onClick={sendHelpMessage}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Confetti overlay */}
      {renderConfetti()}
    </div>
  );
}
