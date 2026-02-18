/**
 * WWIH - Rage Telemetry
 * Tracks user suffering metrics
 */

interface RageEvent {
  type: 'rage-click' | 'back-attempt' | 'mouse-shake' | 'help-click' | 'form-fail' | 'loop' | 'page-view';
  timestamp: number;
  page: string;
  details?: string;
}

interface RageMetrics {
  events: RageEvent[];
  sessionStart: number;
  pageViews: number;
  rageClicks: number;
  backAttempts: number;
  mouseShakes: number;
  helpClicks: number;
  formFailures: number;
  loops: number;
  lastPages: string[];
}

class RageTelemetry {
  private metrics: RageMetrics;
  private mouseShakeThreshold = 20; // px of movement to count as shake
  private lastMouseX = 0;
  private lastMouseY = 0;
  private shakeCount = 0;
  private lastPageTime = 0;
  private loopThreshold = 3; // Same page 3 times = loop
  
  constructor() {
    this.metrics = {
      events: [],
      sessionStart: Date.now(),
      pageViews: 0,
      rageClicks: 0,
      backAttempts: 0,
      mouseShakes: 0,
      helpClicks: 0,
      formFailures: 0,
      loops: 0,
      lastPages: []
    };
    
    this.init();
  }
  
  private init(): void {
    // Track page views
    this.trackPageView(window.location.pathname || 'home');
    
    // Listen for back button
    window.addEventListener('popstate', () => {
      this.trackEvent('back-attempt', 'Browser back button');
    });
    
    // Track mouse movement for shake detection
    document.addEventListener('mousemove', (e) => this.detectMouseShake(e));
    
    // Track rapid clicks (rage clicks)
    let lastClickTime = 0;
    document.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastClickTime < 200) {
        this.trackEvent('rage-click', 'Rapid clicking detected');
      }
      lastClickTime = now;
    });
    
    // Track help clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.help-trigger') || target.closest('[data-help]')) {
        this.trackEvent('help-click', 'User sought help');
      }
    });
  }
  
  private detectMouseShake(e: MouseEvent): void {
    const dx = e.clientX - this.lastMouseX;
    const dy = e.clientY - this.lastMouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > this.mouseShakeThreshold) {
      this.shakeCount++;
      if (this.shakeCount > 3) {
        this.trackEvent('mouse-shake', 'User is shaking mouse aggressively');
        this.shakeCount = 0;
      }
    }
    
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }
  
  trackPageView(page: string): void {
    const now = Date.now();
    
    // Check for loops (same page viewed multiple times quickly)
    if (this.metrics.lastPages.length > 0) {
      const lastPage = this.metrics.lastPages[this.metrics.lastPages.length - 1];
      if (lastPage === page && now - this.lastPageTime < 5000) {
        const pageCount = this.metrics.lastPages.filter(p => p === page).length;
        if (pageCount >= this.loopThreshold) {
          this.trackEvent('loop', `Stuck on ${page}`);
        }
      }
    }
    
    this.metrics.lastPages.push(page);
    if (this.metrics.lastPages.length > 10) {
      this.metrics.lastPages.shift();
    }
    
    this.lastPageTime = now;
    this.metrics.pageViews++;
    this.trackEvent('page-view', page);
  }
  
  trackEvent(type: RageEvent['type'], details?: string): void {
    const event: RageEvent = {
      type,
      timestamp: Date.now(),
      page: window.location.pathname || 'unknown',
      details
    };
    
    this.metrics.events.push(event);
    
    // Update counters
    switch (type) {
      case 'rage-click':
        this.metrics.rageClicks++;
        break;
      case 'back-attempt':
        this.metrics.backAttempts++;
        break;
      case 'mouse-shake':
        this.metrics.mouseShakes++;
        break;
      case 'help-click':
        this.metrics.helpClicks++;
        break;
      case 'form-fail':
        this.metrics.formFailures++;
        break;
      case 'loop':
        this.metrics.loops++;
        break;
    }
    
    // Keep only last 1000 events
    if (this.metrics.events.length > 1000) {
      this.metrics.events = this.metrics.events.slice(-500);
    }
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('wwih_telemetry', JSON.stringify(this.metrics));
    } catch (e) {
      // Ignore storage errors
    }
  }
  
  getMetrics(): RageMetrics {
    return { ...this.metrics };
  }
  
  getSessionDuration(): number {
    return Date.now() - this.metrics.sessionStart;
  }
  
  // Calculate a "rage score" - higher = more suffering
  getRageScore(): number {
    const duration = this.getSessionDuration() / 1000; // seconds
    const events = this.metrics.events.length;
    
    let score = 0;
    score += this.metrics.rageClicks * 10;
    score += this.metrics.backAttempts * 15;
    score += this.metrics.mouseShakes * 5;
    score += this.metrics.helpClicks * 20;
    score += this.metrics.formFailures * 25;
    score += this.metrics.loops * 30;
    score += (events - this.metrics.pageViews) * 2;
    
    // Time penalty - more time = more rage
    score += Math.min(duration / 10, 100);
    
    return Math.round(score);
  }
  
  // Get formatted report for judges
  getReport(): string {
    const duration = this.getSessionDuration();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    return `
╔══════════════════════════════════════════════════╗
║        RAGE TELEMETRY REPORT                      ║
╠══════════════════════════════════════════════════╣
║  Session Duration: ${minutes}m ${seconds}s                      ║
║  Page Views: ${this.metrics.pageViews}                                 ║
║  ─────────────────────────────────────────────── ║
║  RAGE METRICS:                                    ║
║  • Rage Clicks: ${this.metrics.rageClicks}                             ║
║  • Back Attempts: ${this.metrics.backAttempts}                          ║
║  • Mouse Shakes: ${this.metrics.mouseShakes}                            ║
║  • Help Seeks: ${this.metrics.helpClicks}                               ║
║  • Form Failures: ${this.metrics.formFailures}                          ║
║  • Navigation Loops: ${this.metrics.loops}                             ║
║  ─────────────────────────────────────────────── ║
║  FINAL RAGE SCORE: ${this.getRageScore()}                              ║
╚══════════════════════════════════════════════════╝
    `.trim();
  }
  
  // Reset telemetry
  reset(): void {
    this.metrics = {
      events: [],
      sessionStart: Date.now(),
      pageViews: 0,
      rageClicks: 0,
      backAttempts: 0,
      mouseShakes: 0,
      helpClicks: 0,
      formFailures: 0,
      loops: 0,
      lastPages: []
    };
    try {
      localStorage.removeItem('wwih_telemetry');
    } catch (e) {}
  }
}

// Global telemetry instance
export const telemetry = new RageTelemetry();

export default telemetry;
