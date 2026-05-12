import { useEffect, useState } from "react";
import { Download, X, Share, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return (
    (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    !!(navigator as any).standalone
  );
}

const DISMISS_KEY = "afrinza-pwa-dismissed";
const DISMISS_DAYS = 7;

function wasDismissedRecently() {
  try {
    const ts = localStorage.getItem(DISMISS_KEY);
    if (!ts) return false;
    const diff = (Date.now() - parseInt(ts, 10)) / (1000 * 60 * 60 * 24);
    return diff < DISMISS_DAYS;
  } catch {
    return false;
  }
}

function saveDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {}
}

export function PwaInstallPrompt() {
  const [nativePrompt, setNativePrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isInStandaloneMode()) { setInstalled(true); return; }
    if (wasDismissedRecently()) { setDismissed(true); return; }

    const onPrompt = (e: Event) => { e.preventDefault(); setNativePrompt(e); };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleDismiss = () => {
    saveDismissed();
    setDismissed(true);
    setShowIosGuide(false);
  };

  const handleNativeInstall = async () => {
    if (!nativePrompt) return;
    nativePrompt.prompt();
    const { outcome } = await nativePrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setNativePrompt(null);
  };

  if (!mounted || installed || dismissed) return null;

  const ios = isIos();
  const android = isAndroid();

  // On iOS: always show the banner (no beforeinstallprompt exists there)
  // On Android/Chrome: show when native prompt is available
  // On other (desktop): show when native prompt is available
  const shouldShow = ios || !!nativePrompt;
  if (!shouldShow) return null;

  return (
    <>
      {/* iOS step-by-step guide overlay */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end" onClick={() => setShowIosGuide(false)}>
          <div
            className="bg-[#1a1a2e] text-white rounded-t-3xl shadow-2xl px-6 py-6 border-t border-white/10 mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-5" />
            <p className="font-bold text-lg mb-1">Add Afrinza to Home Screen</p>
            <p className="text-white/60 text-sm mb-5">Follow these steps in Safari:</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">1</div>
                <div>
                  <p className="text-sm font-semibold">Tap the Share button</p>
                  <p className="text-white/50 text-xs mt-0.5">The <Share className="inline w-3 h-3" /> icon at the bottom of your screen</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">2</div>
                <div>
                  <p className="text-sm font-semibold">Scroll down and tap <span className="text-amber-400">"Add to Home Screen"</span></p>
                  <p className="text-white/50 text-xs mt-0.5">It has a plus icon next to it</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">3</div>
                <div>
                  <p className="text-sm font-semibold">Tap <span className="text-amber-400">"Add"</span> in the top right</p>
                  <p className="text-white/50 text-xs mt-0.5">Afrinza will appear on your home screen</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full mt-6 py-3 rounded-2xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Install banner */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm">
        <div className="bg-[#1a1a2e] text-white rounded-2xl shadow-2xl px-5 py-4 flex items-start gap-3 border border-white/10">
          <img src="/apple-touch-icon.png" alt="Afrinza" className="w-10 h-10 rounded-xl shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Install Afrinza</p>
            <p className="text-white/60 text-xs mt-0.5 leading-relaxed">
              {ios
                ? "Add to your home screen for fast, app-like access."
                : "Get the full app experience — fast & offline-ready."}
            </p>
            {ios ? (
              <button
                onClick={() => setShowIosGuide(true)}
                className="mt-2.5 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold px-4 inline-flex items-center gap-1.5 transition-colors"
              >
                <Share className="w-3 h-3" /> How to Install
              </button>
            ) : (
              <Button
                size="sm"
                className="mt-2.5 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold px-4"
                onClick={handleNativeInstall}
              >
                <Download className="w-3 h-3 mr-1.5" /> Install App
              </Button>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/40 hover:text-white transition-colors shrink-0 mt-0.5"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
