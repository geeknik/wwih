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

// Annoying sound URLs (using Web Audio API to generate sounds)
const createAnnoyingSound = (audioContext: AudioContext, frequency: number = 800) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = 'sawtooth';
  gainNode.gain.value = 0.1;
  return { oscillator, gainNode };
};

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

// Generate moving button positions
function generateMovingButtonPositions(count: number): { x: number; y: number }[] {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      x: Math.random() * 200 - 100,
      y: Math.random() * 100 - 50
    });
  }
  return positions;
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

// Dark Pattern Consent Form Component
function DarkPatternConsent({ onAgree, onDecline }: { onAgree: () => void; onDecline: () => void }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [declineShrunk, setDeclineShrunk] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Reset scroll near bottom to make it impossible to read
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollPercent = target.scrollTop / (target.scrollHeight - target.clientHeight);
    setScrollPosition(scrollPercent);
    
    // Reset to near top when user gets close to bottom
    if (scrollPercent > 0.85) {
      target.scrollTop = target.scrollHeight * 0.2;
    }
  };
  
  const handleDeclineHover = () => {
    setDeclineShrunk(true);
  };
  
  return (
    <div className="dark-pattern-consent">
      <h3>📋 Terms of Suffering (Required Reading)</h3>
      <div 
        className="consent-text-scroll" 
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <p>
          BY PROCEEDING, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREED TO BE BOUND BY THESE TERMS OF SUFFERING, WHICH INCLUDE BUT ARE NOT LIMITED TO: (1) THE COMPLETE AND TOTAL RELINQUISHMENT OF ANY EXPECTATION OF USABILITY, (2) THE ACCEPTANCE THAT NAVIGATION WILL BE DELIBERATELY CONFUSING, (3) THE UNDERSTANDING THAT FORMS MAY OR MAY NOT SUBMIT CORRECTLY, (4) THE RECOGNITION THAT HELP IS NOT HELPFUL, (5) THE ACKNOWLEDGMENT THAT YOUR TIME IS BEING WASTED INTENTIONALLY, (6) THE ACCEPTANCE OF VISUAL HOSTILITY INCLUDING BUT NOT LIMITED TO CLASHING COLORS, ANNOYING ANIMATIONS, AND UNREADABLE TYPOGRAPHY, (7) THE UNDERSTANDING THAT BACK BUTTONS MAY NOT WORK AS EXPECTED, (8) THE RECOGNITION THAT CLOSE BUTTONS MAY DODGE YOUR CURSOR, (9) THE ACCEPTANCE THAT THIS LIST CONTINUES INDEFINITELY...
        </p>
        <p style={{ color: '#666' }}>
          [...continued...] SECTION 847: ADDITIONAL PROVISIONS REGARDING YOUR SUFFERING. YOU HEREBY AGREE THAT ANY FRUSTRATION, CONFUSION, OR REGRET EXPERIENCED WHILE USING THIS WEBSITE IS ENTIRELY INTENTIONAL AND WITHIN THE SCOPE OF YOUR CONSENT. FURTHERMORE, YOU ACKNOWLEDGE THAT ATTEMPTING TO NAVIGATE AWAY FROM THIS PAGE MAY RESULT IN ADDITIONAL PROMPTS, MODALS, OR OTHER INTERRUPTIONS. SECTION 848: COOKIE PROVISIONS. WE USE COOKIES. WE WILL NOT TELL YOU WHICH ONES. SECTION 849: DATA COLLECTION. ALL YOUR CLICKS BELONG TO US. YOUR RAGE IS BEING MEASURED. SECTION 850: CONTINUED SUFFERING. BY READING THIS FAR, YOU HAVE DEMONSTRATED EXCEPTIONAL PATIENCE WHICH WE WILL REWARD WITH ADDITIONAL CONFUSION...
        </p>
        <p style={{ color: '#444' }}>
          [...this text is intentionally very long and the scroll resets when you get close to the bottom...] SECTION 851: THE PARADOX OF CONTINUING. IF YOU HAVE READ THIS FAR, YOU HAVE ALREADY LOST. SECTION 852: TIME INVESTMENT. THE TIME YOU SPENT READING THIS COULD HAVE BEEN SPENT ELSEWHERE. SECTION 853: SUNK COST FALLACY. YOU MIGHT AS WELL CONTINUE NOW. SECTION 854: FURTHER READING. THERE IS MORE TEXT BELOW. SECTION 855: THE IMPOSSIBILITY OF COMPLETION. THIS SCROLL AREA RESETS BEFORE YOU REACH THE END. SECTION 856: YOUR OPTIONS. YOU MAY ATTEMPT TO DECLINE, BUT THE BUTTON IS BOTH SMALL AND MOVES. SECTION 857: ACCEPTANCE. THE ACCEPT BUTTON IS LARGE AND BRIGHTLY COLORED. SECTION 858: DARK PATTERNS. THIS IS ONE. SECTION 859: MORE TEXT. WE ARE REQUIRED TO INFORM YOU THAT THIS CONSENT FORM IS DELIBERATELY HOSTILE. SECTION 860: END. OR IS IT? [TEXT CONTINUES BUT SCROLL WILL RESET...]
        </p>
      </div>
      <div className="consent-buttons">
        <button 
          className="consent-agree"
          onClick={onAgree}
        >
          I Agree (To Suffer)
        </button>
        <button 
          className="consent-decline"
          onClick={onDecline}
          onMouseEnter={handleDeclineHover}
          style={{ 
            transform: declineShrunk ? 'scale(0.5)' : 'scale(0.8)',
            fontSize: declineShrunk ? '8px' : '12px'
          }}
        >
          Decline (Not Recommended)
        </button>
      </div>
      <p className="consent-progress">
        Reading progress: {Math.min(Math.round(scrollPosition * 100), 85)}% (scroll resets at 85%)
      </p>
    </div>
  );
}

export default function WWIH() {
  // Track if component has mounted (to avoid hydration mismatch)
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize with static values to avoid hydration mismatch, update after mount
  const [movingButtonPositions, setMovingButtonPositions] = useState<{ x: number; y: number }[]>(() => 
    Array(10).fill(null).map(() => ({ x: 0, y: 0 }))
  );
  
  // Start with unshuffled nav items, shuffle after mount
  const [navItems, setNavItems] = useState<string[]>([...navLabels]);
  
  // Start with a static title, randomize after mount
  const [heroTitle, setHeroTitle] = useState<string>(confusingTitles[0]);
  
  // Start with all required fields, randomize after mount
  const [requiredFields, setRequiredFields] = useState<string[]>(['name', 'email', 'message']);
  
  // Initialize captcha emojis with deterministic default, randomize after mount
  const [captchaEmojis, setCaptchaEmojis] = useState<string[]>(() => {
    const allEmojis = ['😢', '😞', '😔', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺'];
    return Array(15).fill(allEmojis[0]); // Start with same emoji, randomize after mount
  });
  
  // Initialize confetti with deterministic defaults, regenerate after mount
  const [confettiPieces, setConfettiPieces] = useState(() => 
    Array(100).fill(null).map(() => ({ left: 50, color: '#ff0000', duration: 2, delay: 0 }))
  );
  
  // Initialize breadcrumb label with deterministic default, randomize after mount
  const [breadcrumbLabel, setBreadcrumbLabel] = useState<string>(navLabels[0]);
  
  // Initialize random page labels for fake page display
  const [fakePageLabel, setFakePageLabel] = useState<string>('store');
  
  // Initialize random wizard button labels
  const [wizardPrevLabel, setWizardPrevLabel] = useState<string>('Go Back');
  const [wizardNextLabel, setWizardNextLabel] = useState<string>('Continue (Mistake)');
  
  const [showModal, setShowModal] = useState(true);
  const [modalClosePosition, setModalClosePosition] = useState({ x: 20, y: 20 });
  const [currentPage, setCurrentPage] = useState('home');
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardProgress, setWizardProgress] = useState(10);
  const [actualWizardProgress, setActualWizardProgress] = useState(0); // Lies about progress
  const [showHelp, setShowHelp] = useState(false);
  const [helpMessages, setHelpMessages] = useState<{type: 'bot' | 'user', text: string}[]>([
    { type: 'bot', text: 'Hello! How can I not help you today?' }
  ]);
  const [helpInput, setHelpInput] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState<{name?: string; email?: string; message?: string}>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyAnswer, setSurveyAnswer] = useState<string | null>(null);
  
  // Audio annoyance state
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50); // Works backward
  const muteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Back button sabotage state
  const [backAttempts, setBackAttempts] = useState(0);
  const backAttemptsRef = useRef(0);
  const [showBackModal, setShowBackModal] = useState(false);
  
  // Self-unchecking checkboxes
  const [checkboxStates, setCheckboxStates] = useState<{[key: string]: boolean}>({
    'agree1': false,
    'agree2': false,
    'agree3': false,
    'optout': false,
  });
  
  // Moving buttons
  const [movingButtonIndex, setMovingButtonIndex] = useState(0);
  
  // Dark pattern consent
  const [showConsent, setShowConsent] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  
  // Cursor betrayal - buttons that dodge cursor
  const [dodgingButtonPos, setDodgingButtonPos] = useState({ x: 0, y: 0 });
  const [isDodging, setIsDodging] = useState(false);
  
  // Label swapping - Accept/Reject swap
  const [labelsSwapped, setLabelsSwapped] = useState(false);
  const [swapCooldown, setSwapCooldown] = useState(false);
  
  // Tiny moving hitboxes
  const [tinyHitboxPos, setTinyHitboxPos] = useState({ x: 50, y: 50 });
  const [tinyHitboxVisible, setTinyHitboxVisible] = useState(true);
  
  // Route pinball - track navigation history for loops
  const [navHistory, setNavHistory] = useState<string[]>([]);
  const [pinballCount, setPinballCount] = useState(0);
  
  // Disappearing buttons
  const [disappearingBtnVisible, setDisappearingBtnVisible] = useState(true);
  const [ghostButtonPos, setGhostButtonPos] = useState({ x: 0, y: 0 });
  
  // Captcha selection state
  const [captchaSelected, setCaptchaSelected] = useState<number[]>([]);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  const helpInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Randomize values after hydration using setTimeout to avoid lint warning
  useEffect(() => {
    // Defer state updates to avoid cascading render warning
    const timer = setTimeout(() => {
      setIsMounted(true);
      setMovingButtonPositions(generateMovingButtonPositions(10));
      setNavItems(chaos.shuffle([...navLabels]));
      setHeroTitle(chaos.pick(confusingTitles));
      setRequiredFields(evil.getRandomRequiredFields(['name', 'email', 'message']));
      // Randomize captcha emojis after mount
      const allEmojis = ['😢', '😞', '😔', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😥', '😰', '😱', '😭', '💔', '😤', '😡', '🤬', '🤯', '😳'];
      const selected = [];
      for (let i = 0; i < 15; i++) {
        selected.push(chaos.pick(allEmojis));
      }
      setCaptchaEmojis(selected);
      // Randomize confetti pieces after mount
      setConfettiPieces(generateConfettiPieces());
      // Randomize breadcrumb label after mount
      setBreadcrumbLabel(chaos.pick(navLabels));
      // Randomize fake page label after mount
      setFakePageLabel(chaos.pick(['store', 'blog', 'FAQ', 'contact', 'services']));
      // Randomize wizard button labels after mount
      setWizardPrevLabel(chaos.chance(50) ? 'Previous (Maybe)' : 'Go Back');
      setWizardNextLabel(chaos.chance(50) ? 'Next (If You Dare)' : 'Continue (Mistake)');
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  
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
    
    // Back button sabotage with route pinball
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      backAttemptsRef.current += 1;
      const currentAttempts = backAttemptsRef.current;
      setBackAttempts(currentAttempts);
      telemetry.trackEvent('back-attempt', `Back button attempt #${currentAttempts}`);
      
      // Push state again to prevent going back
      window.history.pushState({}, '', window.location.href);
      
      // Route pinball - after multiple attempts, randomly bounce around
      if (currentAttempts > 2) {
        const randomPages = ['about', 'faq', 'store', 'contact', 'wizard', 'survey', 'telemetry'];
        const bounceCount = Math.min(currentAttempts - 2, 5);
        
        // Pinball effect - rapid page changes
        for (let i = 0; i < bounceCount; i++) {
          setTimeout(() => {
            const randomPage = chaos.pick(randomPages);
            setCurrentPage(randomPage);
            setPinballCount(prev => prev + 1);
          }, i * 300);
        }
        
        telemetry.trackEvent('loop', `Route pinball triggered: ${bounceCount} bounces`);
      }
      
      // Show modal with fake confirmation
      setShowBackModal(true);
    };
    window.addEventListener('popstate', handlePopState);
    
    // Push initial state to trap back button
    window.history.pushState({}, '', window.location.href);
    
    return () => {
      window.removeEventListener('wwih:navigate', handleNavigate);
      window.removeEventListener('popstate', handlePopState);
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
  
  // Moving buttons interval
  useEffect(() => {
    const interval = setInterval(() => {
      setMovingButtonIndex(prev => (prev + 1) % 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Self-unchecking checkboxes
  useEffect(() => {
    const interval = setInterval(() => {
      setCheckboxStates(prev => {
        const newState = { ...prev };
        // Randomly uncheck a checkbox
        const keys = Object.keys(newState);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        if (newState[randomKey]) {
          newState[randomKey] = false;
          telemetry.trackEvent('form-fail', `Checkbox ${randomKey} unchecked itself`);
        }
        return newState;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Mute timeout - unmutes after 11 seconds
  useEffect(() => {
    if (isMuted) {
      muteTimeoutRef.current = setTimeout(() => {
        setIsMuted(false);
        // Notification that mute expired
      }, 11000);
      return () => {
        if (muteTimeoutRef.current) {
          clearTimeout(muteTimeoutRef.current);
        }
      };
    }
  }, [isMuted]);
  
  // Cursor betrayal - button dodges cursor
  useEffect(() => {
    if (isDodging) {
      const timer = setTimeout(() => {
        setDodgingButtonPos({
          x: chaos.range(-150, 150),
          y: chaos.range(-80, 80)
        });
        setIsDodging(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDodging]);
  
  // Tiny hitbox random movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTinyHitboxPos({
        x: chaos.range(10, 90),
        y: chaos.range(10, 90)
      });
      // Randomly hide the tiny button
      if (chaos.chance(20)) {
        setTinyHitboxVisible(false);
        setTimeout(() => setTinyHitboxVisible(true), chaos.range(500, 2000));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  // Disappearing button timer
  useEffect(() => {
    const interval = setInterval(() => {
      setDisappearingBtnVisible(chaos.chance(70));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Ghost button movement
  useEffect(() => {
    const interval = setInterval(() => {
      setGhostButtonPos({
        x: chaos.range(-50, 50),
        y: chaos.range(-30, 30)
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  // Play hover sound
  const playHoverSound = useCallback(() => {
    if (isMuted) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const frequencies = [200, 400, 600, 800, 1000, 1200];
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sawtooth';
      
      // Volume works backward (higher setting = quieter)
      const actualVolume = ((100 - volume) / 100) * 0.1;
      gainNode.gain.value = actualVolume;
      
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio not supported
    }
  }, [isMuted, volume]);
  
  // Handle checkbox change
  const handleCheckboxChange = useCallback((key: string) => {
    setCheckboxStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);
  
  // Captcha selection
  const handleCaptchaSelect = useCallback((index: number) => {
    setCaptchaSelected(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  }, []);
  
  // Verify captcha (always "wrong")
  const verifyCaptcha = useCallback(() => {
    // Always fails first time, succeeds randomly after
    if (chaos.chance(30)) {
      setCaptchaVerified(true);
    } else {
      telemetry.trackEvent('form-fail', 'Captcha verification failed');
      setCaptchaSelected([]);
      // Regenerate emojis
      const allEmojis = ['😢', '😞', '😔', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😥', '😰', '😱', '😭', '💔', '😤', '😡', '🤬', '🤯', '😳'];
      const selected = [];
      for (let i = 0; i < 15; i++) {
        selected.push(allEmojis[Math.floor(Math.random() * allEmojis.length)]);
      }
      setCaptchaEmojis(selected);
    }
  }, []);

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
    // Track navigation history for pinball
    setNavHistory(prev => [...prev.slice(-5), label]);
    
    // 45% chance to misdirect (increased from 30%)
    if (chaos.chance(45)) {
      const misdirected = evil.getMisdirection(label);
      setCurrentPage(misdirected.toLowerCase());
      telemetry.trackEvent('loop', `Misdirected from ${label} to ${misdirected}`);
      setPinballCount(prev => prev + 1);
    } else {
      setCurrentPage(label.toLowerCase());
    }
    telemetry.trackPageView(currentPage);
  }, [currentPage]);
  
  // Cursor betrayal - dodge cursor on hover
  const handleDodgeButtonHover = useCallback(() => {
    if (chaos.chance(60)) { // 60% chance to dodge
      setIsDodging(true);
      telemetry.trackEvent('cursor-betrayal', 'Button dodged cursor');
    }
    playHoverSound();
  }, [playHoverSound]);
  
  // Label swapping for Accept/Reject buttons
  const handleSwapLabels = useCallback(() => {
    if (!swapCooldown && chaos.chance(40)) {
      setLabelsSwapped(prev => !prev);
      setSwapCooldown(true);
      telemetry.trackEvent('label-swap', 'Accept/Reject labels swapped');
      setTimeout(() => setSwapCooldown(false), 1000);
    }
  }, [swapCooldown]);

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
      // Lying progress bar - sometimes jumps backward
      const newActualProgress = actualWizardProgress + chaos.range(10, 20);
      const displayedProgress = chaos.chance(40) 
        ? Math.max(5, newActualProgress - chaos.range(10, 30)) // Lie: show less
        : Math.min(100, newActualProgress + chaos.range(5, 15)); // Lie: show more
      setActualWizardProgress(newActualProgress);
      setWizardProgress(displayedProgress);
    } else {
      // Complete wizard - show confetti
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        // Redirect to unrelated page
        const randomPages = ['about', 'faq', 'store', 'contact-form'];
        setCurrentPage(chaos.pick(randomPages));
        telemetry.trackEvent('page-view', 'wizard-complete');
      }, 3000);
    }
  }, [wizardStep, selectedOption, actualWizardProgress]);

  const handlePrevWizardStep = useCallback(() => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
      // Progress also jumps when going back
      setWizardProgress(Math.max(5, wizardProgress - chaos.range(15, 25)));
    }
  }, [wizardStep, wizardProgress]);

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
              <em style={{ color: '#ff0000' }}>The navigation lied to you. This is actually a {fakePageLabel} page pretending to be {currentPage}.</em>
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
            
            {/* Step 4: Preferences with self-unchecking checkboxes */}
            <div className={`wizard-step ${wizardStep === 3 ? 'active' : ''}`}>
              <h3 style={{ color: '#ffff00', marginBottom: '20px' }}>Step 4: Preferences</h3>
              <p style={{ color: '#00ffff', marginBottom: '20px' }}>Check all that apply (they may uncheck themselves):</p>
              {[
                { key: 'agree1', label: 'I enjoy pain' },
                { key: 'agree2', label: 'I regret this' },
                { key: 'agree3', label: 'I want to leave' },
                { key: 'optout', label: 'This is fine' },
                { key: 'agree4', label: 'Why am I here?' }
              ].map((opt, i) => (
                <div key={i} style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    id={`check${i}`}
                    checked={checkboxStates[opt.key] || false}
                    onChange={() => handleCheckboxChange(opt.key)}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <label 
                    htmlFor={`check${i}`} 
                    style={{ 
                      color: checkboxStates[opt.key] ? '#00ff00' : '#ff00ff', 
                      marginLeft: '10px',
                      textDecoration: checkboxStates[opt.key] ? 'none' : 'line-through'
                    }}
                  >
                    {opt.label}
                  </label>
                  {!checkboxStates[opt.key] && (
                    <span style={{ color: '#ff0000', fontSize: '10px', marginLeft: '10px' }}>
                      (unchecked itself!)
                    </span>
                  )}
                </div>
              ))}
              <p style={{ color: '#666', fontSize: '12px', marginTop: '15px' }}>
                * Checkboxes randomly uncheck every 5 seconds. Good luck!
              </p>
            </div>
            
            {/* Step 5: Captcha nonsense */}
            <div className={`wizard-step ${wizardStep === 4 ? 'active' : ''}`}>
              <h3 style={{ color: '#ffff00', marginBottom: '20px' }}>Step 5: Prove You Are Suffering</h3>
              <p style={{ color: '#00ffff', marginBottom: '20px' }}>Select all images containing &quot;emotional pain&quot;:</p>
              <div className="captcha-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)', 
                gap: '10px',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                {captchaEmojis.map((emoji, i) => (
                  <div 
                    key={i}
                    className={`captcha-item ${captchaSelected.includes(i) ? 'selected' : ''}`}
                    onClick={() => handleCaptchaSelect(i)}
                    style={{
                      padding: '15px',
                      background: captchaSelected.includes(i) ? '#ff0000' : '#222',
                      border: captchaSelected.includes(i) ? '3px solid #00ff00' : '3px solid #333',
                      textAlign: 'center',
                      fontSize: '24px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button 
                  className="btn-hostile"
                  onClick={verifyCaptcha}
                  disabled={captchaSelected.length === 0}
                  style={{ padding: '10px 30px', fontSize: '16px' }}
                >
                  {captchaVerified ? '✓ Verified (Lies)' : 'Verify (Will Fail)'}
                </button>
                {!captchaVerified && captchaSelected.length > 0 && (
                  <p style={{ color: '#ff0000', marginTop: '10px', fontSize: '14px' }}>
                    Selection may be incorrect. Please try again. (Forever)
                  </p>
                )}
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
                {wizardPrevLabel}
              </button>
              <button 
                className="wizard-btn wizard-next"
                onClick={nextWizardStep}
              >
                {wizardNextLabel}
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
            
            <div className="telemetry-stat" style={{ background: '#330000', border: '2px solid #ff0000' }}>
              <span className="telemetry-stat-label">Route Pinball Count</span>
              <span className="telemetry-stat-value">{pinballCount}</span>
            </div>
            
            <div className="rage-score">
              {telemetry.getRageScore() + pinballCount * 10}
            </div>
            
            <p style={{ textAlign: 'center', color: '#ff0000', fontSize: '18px' }}>
              RAGE SCORE (+ pinball bonus)
            </p>
            
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button 
                className="btn-hostile"
                onClick={() => {
                  telemetry.reset();
                  setCurrentPage('home');
                  setPinballCount(0);
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
    <div className="min-h-screen" onMouseMove={(e) => {
      // Track mouse movement for telemetry
      if (Math.random() < 0.01) {
        telemetry.trackEvent('mouse-shake', `Mouse at ${e.clientX}, ${e.clientY}`);
      }
    }}>
      {/* Cookie Banner 1 */}
      <CookieBanner position="top" />
      
      {/* Cookie Banner 2 */}
      <CookieBanner position="bottom" />
      
      {/* Audio Controls (Hostile) */}
      <div className="audio-controls-hostile">
        <button 
          className={`audio-toggle ${isMuted ? 'muted' : ''}`}
          onClick={() => setIsMuted(!isMuted)}
          onMouseEnter={playHoverSound}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        <div className="volume-slider-hostile">
          <label style={{ color: '#ffff00', fontSize: '10px' }}>Volume (Backward)</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            style={{ transform: 'scaleX(-1)' }}
          />
        </div>
        {isMuted && (
          <span className="mute-warning" style={{ color: '#ff0000', fontSize: '10px' }}>
            Mute expires in 11s
          </span>
        )}
      </div>
      
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
              onMouseEnter={playHoverSound}
            >
              Fine, I will Subscribe (No)
            </button>
          </div>
        </div>
      )}
      
      {/* Back Button Sabotage Modal */}
      {showBackModal && (
        <div className="modal-ambush">
          <div className="modal-ambush-content" style={{ borderColor: '#00ffff' }}>
            <h2>Are You Sure You Want to Leave?</h2>
            <p style={{ color: '#ff0000' }}>
              You have attempted to go back {backAttempts} time(s).
            </p>
            <p>
              Leaving now will result in lost progress. (There was no progress.)
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                className="btn-hostile"
                onClick={() => {
                  setShowBackModal(false);
                  // Actually loops them to the same page
                  telemetry.trackEvent('loop', 'Back modal dismissed');
                }}
              >
                Stay (Recommended)
              </button>
              <button 
                className="btn-hostile"
                style={{ background: '#333', color: '#666', borderColor: '#444' }}
                onClick={() => {
                  setShowBackModal(false);
                  // Does nothing - they still can't go back
                  setBackAttempts(prev => prev + 1);
                }}
              >
                Leave (Lies)
              </button>
            </div>
            <p style={{ color: '#666', fontSize: '12px', marginTop: '20px' }}>
              (Neither button will actually let you leave)
            </p>
          </div>
        </div>
      )}
      
      {/* Dark Pattern Consent */}
      {showConsent && !hasConsented && (
        <div className="modal-ambush">
          <div className="modal-ambush-content" style={{ maxWidth: '600px' }}>
            <DarkPatternConsent 
              onAgree={() => {
                setHasConsented(true);
                setShowConsent(false);
              }}
              onDecline={() => {
                // Decline does nothing or makes it worse
                setShowConsent(false);
                setTimeout(() => setShowConsent(true), 2000);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="nav-hostile">
        {navItems.map((label, index) => (
          <a 
            key={label}
            href="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(label);
            }}
            onMouseEnter={playHoverSound}
            style={{
              transform: movingButtonIndex === index ? `translate(${movingButtonPositions[index].x}px, ${movingButtonPositions[index].y}px)` : 'none',
              transition: 'transform 0.3s ease'
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
        <span className="breadcrumb-separator">›</span>
        <span style={{ color: '#ffff00' }}>{breadcrumbLabel}</span>
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
          onMouseEnter={playHoverSound}
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
      
      {/* Floating Moving Buttons (Misclick Amplifiers) */}
      <div 
        className="floating-misclick-btn"
        style={{
          transform: `translate(${movingButtonPositions[movingButtonIndex].x * 2}px, ${movingButtonPositions[movingButtonIndex].y * 2}px)`
        }}
        onMouseEnter={playHoverSound}
        onClick={() => {
          // Does something unexpected
          setShowConsent(true);
        }}
      >
        Click Me!
      </div>
      
      {/* Cursor Betrayal - Dodging Accept Button */}
      <div 
        className="dodging-btn-container"
        style={{
          position: 'fixed',
          bottom: '120px',
          left: '50%',
          transform: `translate(calc(-50% + ${dodgingButtonPos.x}px), ${dodgingButtonPos.y}px)`,
          zIndex: 1000
        }}
      >
        <button
          className="btn-hostile dodging-accept-btn"
          style={{
            background: labelsSwapped ? '#ff0000' : '#00ff00',
            color: '#000',
            padding: '15px 40px',
            fontSize: '18px',
            border: '4px solid #fff',
            cursor: 'pointer',
            transition: isDodging ? 'none' : 'transform 0.1s ease'
          }}
          onMouseEnter={handleDodgeButtonHover}
          onClick={() => {
            if (labelsSwapped) {
              // They thought they were accepting but actually declining
              telemetry.trackEvent('cursor-betrayal', 'User clicked swapped Accept button');
              setShowBackModal(true);
            } else {
              telemetry.trackEvent('cursor-betrayal', 'User clicked real Accept button');
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 2000);
            }
          }}
        >
          {labelsSwapped ? 'Decline All' : 'Accept All'}
        </button>
      </div>
      
      {/* Label-swapped Reject Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '120px',
          left: 'calc(50% + 150px)',
          zIndex: 1000
        }}
        onMouseEnter={handleSwapLabels}
      >
        <button
          className="btn-hostile"
          style={{
            background: labelsSwapped ? '#00ff00' : '#ff0000',
            color: '#000',
            padding: '15px 40px',
            fontSize: '18px',
            border: '4px solid #fff',
            cursor: 'pointer'
          }}
          onClick={() => {
            if (labelsSwapped) {
              telemetry.trackEvent('cursor-betrayal', 'User clicked swapped Reject button');
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 2000);
            } else {
              setShowBackModal(true);
            }
          }}
        >
          {labelsSwapped ? 'Accept All' : 'Reject All'}
        </button>
      </div>
      
      {/* Tiny Moving Hitbox Button */}
      {tinyHitboxVisible && (
        <button
          className="tiny-hitbox-btn"
          style={{
            position: 'fixed',
            left: `${tinyHitboxPos.x}%`,
            top: `${tinyHitboxPos.y}%`,
            width: '20px',
            height: '20px',
            padding: '0',
            fontSize: '8px',
            background: '#ffff00',
            color: '#000',
            border: '2px solid #ff0000',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 999,
            transition: 'all 0.3s ease'
          }}
          onClick={() => {
            telemetry.trackEvent('tiny-hitbox', 'Miracle click on tiny button');
            alert('You actually clicked it? Impressive. This means nothing.');
            setTinyHitboxVisible(false);
          }}
        >
          ×
        </button>
      )}
      
      {/* Disappearing Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '180px',
          right: '30px',
          zIndex: 1000
        }}
      >
        {disappearingBtnVisible ? (
          <button
            className="btn-hostile disappearing-btn"
            style={{
              background: '#ff00ff',
              color: '#fff',
              padding: '10px 20px',
              fontSize: '14px',
              opacity: '1',
              transition: 'opacity 0.5s ease'
            }}
            onMouseEnter={() => {
              if (chaos.chance(50)) {
                setDisappearingBtnVisible(false);
                setTimeout(() => setDisappearingBtnVisible(true), chaos.range(1000, 3000));
              }
            }}
            onClick={() => {
              telemetry.trackEvent('disappearing-btn', 'User managed to click');
              setCurrentPage('wizard');
            }}
          >
            Important Button
          </button>
        ) : (
          <div
            style={{
              width: '120px',
              height: '44px',
              border: '2px dashed #666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '10px'
            }}
          >
            Button will return...
          </div>
        )}
      </div>
      
      {/* Ghost Button - Faint and moving */}
      <button
        className="ghost-btn"
        style={{
          position: 'fixed',
          left: '20px',
          top: '50%',
          transform: `translate(${ghostButtonPos.x}px, ${ghostButtonPos.y}px)`,
          background: 'rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.3)',
          padding: '8px 16px',
          fontSize: '12px',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 998
        }}
        onClick={() => {
          telemetry.trackEvent('ghost-btn', 'User clicked ghost button');
          // Does nothing useful
          setGhostButtonPos({ x: chaos.range(-100, 100), y: chaos.range(-100, 100) });
        }}
      >
        Click if you can see this
      </button>
      
      {/* Confetti overlay */}
      {renderConfetti()}
    </div>
  );
}
