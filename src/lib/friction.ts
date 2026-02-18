/**
 * WWIH - Friction Middleware
 * Intercepts clicks and injects chaos
 */

import { evil, chaos } from './chaos';

interface FrictionConfig {
  delay: boolean;
  misroute: boolean;
  confirmModal: boolean;
}

// Track if user is currently being tortured (prevent double-clicks)
let isProcessing = false;

// Create fake loading overlay
function createLoadingOverlay(): HTMLElement {
  const overlay = document.createElement('div');
  overlay.id = 'friction-overlay';
  overlay.innerHTML = `
    <div class="loading-torture">
      <div class="loading-spinner"></div>
      <p class="loading-text">Processing...</p>
      <p class="loading-subtext">This is taking longer than expected.</p>
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

// Create fake confirmation modal
function createConfirmModal(message: string, onConfirm: () => void, onCancel: () => void): HTMLElement {
  const modal = document.createElement('div');
  modal.className = 'confirm-modal-hostile';
  modal.innerHTML = `
    <div class="confirm-backdrop"></div>
    <div class="confirm-dialog">
      <h3>Are you sure?</h3>
      <p>${message}</p>
      <div class="confirm-buttons">
        <button class="confirm-yes">Yes</button>
        <button class="confirm-no">No</button>
      </div>
      <p class="confirm-hint">Your answer will be judged.</p>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.querySelector('.confirm-yes')?.addEventListener('click', () => {
    modal.remove();
    onConfirm();
  });
  
  modal.querySelector('.confirm-no')?.addEventListener('click', () => {
    modal.remove();
    onCancel();
  });
  
  modal.querySelector('.confirm-backdrop')?.addEventListener('click', () => {
    modal.remove();
    onCancel();
  });
  
  return modal;
}

// Misdirect to a random page
function misroute(): void {
  const pages = ['about', 'contact', 'faq', 'store', 'blog', 'services', 'wizard'];
  const target = chaos.pick(pages);
  
  // Update URL without actually navigating properly
  const fakeUrl = `?page=${target}&r=${Date.now()}`;
  history.pushState({}, '', fakeUrl);
  
  // Dispatch custom event for the page handler
  window.dispatchEvent(new CustomEvent('wwih:navigate', { detail: { page: target } }));
}

// Process a click with friction
export async function frictionClick(
  e: MouseEvent,
  config: FrictionConfig = { delay: true, misroute: true, confirmModal: true },
  action?: () => void
): Promise<void> {
  // Prevent double processing
  if (isProcessing) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  
  isProcessing = true;
  
  try {
    // Chance to misroute
    if (config.misroute && evil.shouldMisdirect()) {
      setTimeout(() => {
        misroute();
        isProcessing = false;
      }, chaos.range(200, 800));
      return;
    }
    
    // Chance to show confirmation
    if (config.confirmModal && evil.shouldConfirm()) {
      const message = chaos.pick([
        'Are you really sure you want to do this?',
        'This action cannot be undone. (It can, but we won\'t.)',
        'Warning: Proceeding may cause regret.',
        'You\'re about to make a choice.',
        'Final confirmation required. For reasons.',
        'This will change everything. Or nothing.',
        'Are you prepared for the consequences?'
      ]);
      
      createConfirmModal(message, () => {
        // After "confirming", add delay then execute
        if (config.delay) {
          const overlay = createLoadingOverlay();
          setTimeout(() => {
            overlay.remove();
            action?.();
            isProcessing = false;
          }, evil.randomDelay());
        } else {
          action?.();
          isProcessing = false;
        }
      }, () => {
        // Cancel - just sit there
        isProcessing = false;
      });
      return;
    }
    
    // Just add delay
    if (config.delay) {
      e.preventDefault();
      e.stopPropagation();
      
      const overlay = createLoadingOverlay();
      
      // Animate the loading bar to be deceptive
      const progress = overlay.querySelector('.loading-progress') as HTMLElement;
      if (progress) {
        progress.style.width = `${chaos.range(10, 90)}%`;
        setTimeout(() => {
          progress.style.width = `${chaos.range(20, 100)}%`;
        }, chaos.range(200, 600));
      }
      
      // Random loading messages
      const subtext = overlay.querySelector('.loading-subtext') as HTMLElement;
      if (subtext) {
        const messages = [
          'Calculating your regret level...',
          'Judging your choices...',
          'Processing... slowly.',
          'Almost there. (Not really.)',
          'This is fine. Everything is fine.',
          'Please wait. Your patience is being noted.',
          'Crunching numbers... ironically.',
          'Establishing connection to regret server...',
          'Almost done. (This is a lie.)'
        ];
        subtext.textContent = chaos.pick(messages);
      }
      
      setTimeout(() => {
        overlay.remove();
        action?.();
        isProcessing = false;
      }, evil.randomDelay());
    } else {
      action?.();
      isProcessing = false;
    }
  } catch (error) {
    isProcessing = false;
  }
}

// Initialize friction on all links and buttons
export function initFriction(): void {
  // Intercept all clicks on buttons and links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    // Skip already processed elements
    if (target.dataset.frictionHandled) return;
    target.dataset.frictionHandled = 'true';
    
    if (tagName === 'button' || tagName === 'a' || target.closest('button') || target.closest('a')) {
      const link = target.closest('a') as HTMLAnchorElement;
      const button = target.closest('button') as HTMLButtonElement;
      
      // Skip if it's a modal close or special button
      if (target.classList.contains('modal-close') || 
          target.classList.contains('no-friction') ||
          target.closest('.no-friction')) {
        return;
      }
      
      // Check if we should intercept
      const shouldIntercept = !target.closest('.wizard-step') && 
                             !target.closest('.help-widget') &&
                             chaos.chance(70); // 70% of clicks get friction
      
      if (shouldIntercept && (link || button)) {
        e.preventDefault();
        
        frictionClick(e, {
          delay: true,
          misroute: true,
          confirmModal: true
        }, () => {
          // Execute the original action
          if (link) {
            const href = link.href;
            if (href && !href.startsWith('#')) {
              window.location.href = href;
            }
          } else if (button) {
            button.click();
          }
        });
      }
    }
  }, true);
}

const friction = { frictionClick, initFriction };
export default friction;
