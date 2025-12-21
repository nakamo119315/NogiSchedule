// Request queue for sequential JSONP requests (API uses fixed 'res' callback)
interface QueueItem<T> {
  url: string;
  timeout: number;
  resolve: (data: T) => void;
  reject: (error: Error) => void;
}

const requestQueue: QueueItem<unknown>[] = [];
let isProcessing = false;
let currentResolve: ((data: unknown) => void) | null = null;

// Define global 'res' callback that the Nogizaka46 API expects
(window as unknown as Record<string, unknown>)['res'] = (data: unknown) => {
  if (currentResolve) {
    currentResolve(data);
  }
};

async function processQueue(): Promise<void> {
  if (isProcessing || requestQueue.length === 0) return;

  isProcessing = true;

  while (requestQueue.length > 0) {
    const item = requestQueue.shift()!;

    try {
      const result = await executeRequest(item.url, item.timeout);
      item.resolve(result);
    } catch (error) {
      item.reject(error as Error);
    }
  }

  isProcessing = false;
}

function executeRequest<T>(url: string, timeout: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    let timeoutId: number;
    let resolved = false;

    const cleanup = () => {
      currentResolve = null;
      if (timeoutId) clearTimeout(timeoutId);
      setTimeout(() => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }, 100);
    };

    currentResolve = (data: unknown) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(data as T);
    };

    timeoutId = window.setTimeout(() => {
      if (resolved) return;
      resolved = true;
      cleanup();
      reject(new Error(`Request timed out`));
    }, timeout);

    script.onerror = () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      reject(new Error(`Request failed`));
    };

    script.src = url;
    script.async = true;
    (document.body || document.head || document.documentElement).appendChild(script);
  });
}

export function fetchJsonp<T>(url: string, _callbackName: string = 'callback', timeout: number = 20000): Promise<T> {
  return new Promise((resolve, reject) => {
    requestQueue.push({
      url,
      timeout,
      resolve: resolve as (data: unknown) => void,
      reject,
    });
    processQueue();
  });
}
