import { useEffect } from 'react';

/**
 * Dynamically loads an external script into the document.
 * @param {string} url - The URL of the script to load.
 */
const useScript = (url) => {
  useEffect(() => {
    if (!url) return;

    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, [url]);
};

export default useScript;