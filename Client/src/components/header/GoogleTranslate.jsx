import React, { useEffect } from 'react';
import useScript from '../../hooks/useScript';

/**
 * GoogleTranslate component that integrates with the Google Translate API
 */
const GoogleTranslate = () => {
  // Load Google Translate script
  useScript('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
  
  useEffect(() => {
    // Define the callback function for Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en'
        },
        'google_translate_element'
      );
    };
    
    // Cleanup function
    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);
  
  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;