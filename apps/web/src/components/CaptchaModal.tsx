import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiShieldCheck } from 'react-icons/hi';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface CaptchaModalProps {
  isOpen: boolean;
  onSubmit: (token: string) => void;
  onClose: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function CaptchaModal({
  isOpen,
  onSubmit,
  onClose,
  isLoading = false,
  error
}: CaptchaModalProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isOpen) return;

    // In development, skip reCAPTCHA and show test button
    if (isDevelopment) {
      console.log('ℹ️  reCAPTCHA disabled in development mode');
      return;
    }

    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        renderRecaptcha();
      };
    } else {
      renderRecaptcha();
    }

    return () => {
      // Cleanup widget when modal closes
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (e) {
          // Widget might not exist anymore
        }
      }
    };
  }, [isOpen, isDevelopment]);

  const renderRecaptcha = () => {
    if (!recaptchaRef.current || !window.grecaptcha?.render || !siteKey) return;

    try {
      widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          onSubmit(token);
        },
        'error-callback': () => {
          console.error('reCAPTCHA error');
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expired');
        },
      });
    } catch (e) {
      console.error('Failed to render reCAPTCHA:', e);
    }
  };

  const handleDevBypass = () => {
    // In development, bypass with a test token
    onSubmit('dev-bypass-token');
  };

  const handleClose = () => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch (e) {
        // Ignore
      }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 flex items-center justify-center z-[101]"
          >
            <div className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <HiShieldCheck className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-primary">
                    Verification Required
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-muted-foreground text-center">
                  {isDevelopment 
                    ? 'reCAPTCHA is disabled in development mode.'
                    : "You've reached the rate limit. Please verify you're human to continue:"}
                </p>

                {/* reCAPTCHA Container */}
                {isDevelopment ? (
                  <div className="flex justify-center">
                    <button
                      onClick={handleDevBypass}
                      disabled={isLoading}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg
                               hover:bg-primary/90 transition-colors disabled:opacity-50
                               font-semibold"
                    >
                      {isLoading ? 'Verifying...' : 'Continue (Dev Mode)'}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div ref={recaptchaRef} />
                  </div>
                )}

                {error && (
                  <p className="text-sm text-destructive text-center">
                    {error}
                  </p>
                )}

                {isLoading && (
                  <div className="text-center text-sm text-muted-foreground">
                    Verifying...
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg
                             hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}