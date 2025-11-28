import React, { useEffect, useRef } from 'react';

const BitcoinWidget = () => {
	const widgetRef = useRef(null);

	useEffect(() => {
		// Remove any previous script
		const prevScript = document.getElementById('bitcoin-widget-script');
		if (prevScript) prevScript.remove();

		// Create script element
		const script = document.createElement('script');
		script.src = 'https://ifxmarket.online/widgets.bitcoin.com/widget.js';
		script.id = 'bitcoin-widget-script';
		script.async = true;
		// Append script to the widget container or body
		if (widgetRef.current) {
			widgetRef.current.innerHTML = '';
			widgetRef.current.appendChild(script);
		} else {
			document.body.appendChild(script);
		}
		// Cleanup
		return () => {
			if (script.parentNode) script.parentNode.removeChild(script);
		};
	}, []);

	return <div ref={widgetRef} />;
};

export default BitcoinWidget;
