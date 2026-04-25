const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// In-memory access token storage
let currentAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  currentAccessToken = token;
}

export function getAccessToken() {
  return currentAccessToken;
}

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

// Queue for waiting requests while token is refreshing
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function apiFetch(endpoint: string, options: FetchOptions = {}): Promise<any> {
  const { params, headers, ...rest } = options;
  
  // Construct URL with query params if any
  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (currentAccessToken) {
    defaultHeaders['Authorization'] = `Bearer ${currentAccessToken}`;
  }

  const config: RequestInit = {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: 'include', // Important to send cookies
  };

  try {
    let response = await fetch(url, config);
    
    // Parse response
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // Not JSON
    }

    if (!response.ok) {
      // Handle 401 Unauthorized (token expired)
      if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login' && endpoint !== '/auth/me') {
        if (isRefreshing) {
          // Wait until refresh is done
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            if (token) {
              const newHeaders = { ...config.headers, 'Authorization': `Bearer ${token}` };
              return fetch(url, { ...config, headers: newHeaders }).then(res => res.json());
            }
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        isRefreshing = true;

        try {
          // Try to refresh token
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
          });
          
          const refreshData = await refreshRes.json();
          
          if (!refreshRes.ok || !refreshData.success) {
            throw new Error('Refresh failed');
          }

          // Refresh successful
          setAccessToken(refreshData.data.accessToken);
          processQueue(null, refreshData.data.accessToken);
          
          // Retry original request
          const newHeaders = { ...config.headers, 'Authorization': `Bearer ${refreshData.data.accessToken}` };
          const retryRes = await fetch(url, { ...config, headers: newHeaders });
          return await retryRes.json();

        } catch (refreshError) {
          // Refresh failed - force logout
          setAccessToken(null);
          processQueue(refreshError as Error, null);
          throw new Error('Session expired. Please log in again.');
        } finally {
          isRefreshing = false;
        }
      }
      
      throw new Error(data?.message || 'Something went wrong');
    }

    return data;
  } catch (error: any) {
    throw error;
  }
}
