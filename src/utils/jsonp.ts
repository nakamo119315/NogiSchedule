export function fetchJsonp<T>(url: string, callbackName: string = 'callback', timeout: number = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackFn = `jsonp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const script = document.createElement('script');
    let timeoutId: number;

    // Cleanup function
    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as unknown as Record<string, unknown>)[callbackFn];
    };

    // Set up the callback
    (window as unknown as Record<string, unknown>)[callbackFn] = (data: T) => {
      cleanup();
      resolve(data);
    };

    // Set up timeout
    timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error(`JSONP request to ${url} timed out`));
    }, timeout);

    // Handle script errors
    script.onerror = () => {
      cleanup();
      reject(new Error(`JSONP request to ${url} failed`));
    };

    // Build URL with callback parameter
    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}${callbackName}=${callbackFn}`;

    // Add script to document
    document.head.appendChild(script);
  });
}
