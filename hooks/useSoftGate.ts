import { useState, useEffect } from 'react';

export function useSoftGate(delayMs: number = 60000, scrollThreshold: number = 50) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if already seen
    const hasSeen = localStorage.getItem('hasSeenBlogPopup');
    if (hasSeen === 'true') {
      return;
    }

    let timeMet = false;
    let scrollMet = false;

    const checkConditions = () => {
      if (timeMet && scrollMet) {
        setShouldShow(true);
      }
    };

    // Timer
    const timer = setTimeout(() => {
      timeMet = true;
      checkConditions();
    }, delayMs);

    // Scroll listener
    const handleScroll = () => {
      if (scrollMet) return; // already met
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      
      // Calculate scroll percentage, guarding against division by zero
      const scrollableHeight = docHeight - winHeight;
      const scrollPercent = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 100;

      if (scrollPercent >= scrollThreshold) {
        scrollMet = true;
        checkConditions();
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial check in case page is small and already "scrolled" > 50%
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [delayMs, scrollThreshold]);

  const dismiss = () => {
    localStorage.setItem('hasSeenBlogPopup', 'true');
    setShouldShow(false);
  };

  return { shouldShow, dismiss };
}
