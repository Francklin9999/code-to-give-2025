import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const GoogleTranslate = forwardRef((props, ref) => {
  const translateElementRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const translateInstanceRef = useRef(null);

  const changeLanguage = (languageCode) => {
    if (!window.google || !window.google.translate) {
      console.warn('Google Translate not loaded yet');
      return;
    }

    try {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        selectElement.value = languageCode;
        selectElement.dispatchEvent(new Event('change'));
      } else {
        document.cookie = `googtrans=/en/${languageCode};path=/;max-age=31536000`;
        window.location.reload();
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    changeLanguage,
    isLoaded: () => scriptLoadedRef.current && !!window.google?.translate,
  }));

  const initializeTranslate = () => {
    if (!window.google || !window.google.translate || !translateElementRef.current) {
      return;
    }

    try {
      translateInstanceRef.current = new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages:
            'en,fr,es,de,it,hy,pt,zh-CN,ja,ko,ar,hi,ru,pl,nl,sv,da,fi,no,tr,vi,th,id,ms,uk,cs,ro,hu,el,fa,bn,ur,ta,te,ml,kn,gu,pa',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
        },
        'google_translate_element'
      );
    } catch (error) {
      console.error('Error initializing Google Translate:', error);
    }
  };

  useEffect(() => {
    const existingScript = document.querySelector('script[src*="translate.google.com"]');

    // If the script is already present, just initialize
    if (existingScript) {
      scriptLoadedRef.current = true;
      if (window.google && window.google.translate && translateElementRef.current) {
        initializeTranslate();
      }
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;

    script.onload = () => {
      scriptLoadedRef.current = true;
      if (window.google && window.google.translate) {
        initializeTranslate();
      }
    };

    script.onerror = () => {
      console.error('Failed to load Google Translate script');
    };

    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      initializeTranslate();
    };

    return () => {
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement) {
        translateElement.innerHTML = '';
      }
    };
  }, []);

  // Keep the element in the DOM but visually hidden via CSS/layout.
  return (
    <div className="google-translate-wrapper" style={{ display: 'none' }}>
      <div id="google_translate_element" ref={translateElementRef} />
    </div>
  );
});

GoogleTranslate.displayName = 'GoogleTranslate';

export default GoogleTranslate;

