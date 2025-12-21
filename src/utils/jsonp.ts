export function fetchJsonp<T>(url: string, callbackName: string = 'callback', timeout: number = 15000): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackFn = `jsonp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const script = document.createElement('script');
    let timeoutId: number;
    let resolved = false;

    // Cleanup function
    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Delay removal to ensure callback can execute
      setTimeout(() => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete (window as unknown as Record<string, unknown>)[callbackFn];
      }, 100);
    };

    // Set up the callback
    (window as unknown as Record<string, unknown>)[callbackFn] = (data: T) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(data);
    };

    // Set up timeout
    timeoutId = window.setTimeout(() => {
      if (resolved) return;
      resolved = true;
      cleanup();
      reject(new Error(`JSONP request timed out`));
    }, timeout);

    // Handle script errors
    script.onerror = (e) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      console.error('JSONP script error:', e);
      reject(new Error(`JSONP request failed`));
    };

    // Build URL with callback parameter
    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}${callbackName}=${callbackFn}`;
    script.async = true;

    // Add script to document body for better Safari compatibility
    (document.body || document.head || document.documentElement).appendChild(script);
  });
}
