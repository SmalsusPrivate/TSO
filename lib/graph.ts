export async function getAccessToken() {
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', clientId!);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('client_secret', clientSecret!);
  params.append('grant_type', 'client_credentials');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
    next: { revalidate: 3500 } // Token lives for 3600 seconds, revalidate early
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching access token:", errorData);
    throw new Error('Failed to obtain access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Global cache for site ID to avoid redundant lookups
let cachedSiteId: string | null = null;

export async function getSiteId(token: string) {
  if (cachedSiteId) return cachedSiteId;

  const siteUrl = process.env.SHAREPOINT_SITE_URL!;
  const urlObj = new URL(siteUrl);
  const hostname = urlObj.hostname;
  const path = urlObj.pathname;

  const url = `https://graph.microsoft.com/v1.0/sites/${hostname}:${path}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    console.error("Error fetching site ID:", response.status, await response.text());
    throw new Error('Failed to resolve SharePoint site');
  }

  const data = await response.json();
  cachedSiteId = data.id;
  return cachedSiteId;
}

export async function graphFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  const siteId = await getSiteId(token);

  // We allow endpoints to be relative to the site
  // If endpoint starts with /lists, we prepend the site scope
  const url = endpoint.startsWith('https://') 
    ? endpoint 
    : `https://graph.microsoft.com/v1.0/sites/${siteId}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (typeof FormData === 'undefined' || !(options.body instanceof FormData)) {
     defaultHeaders['Content-Type'] = 'application/json';
     defaultHeaders['Prefer'] = 'HonorNonIndexedQueriesWarningMayFailRandomly'; // useful for filtering
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return response;
}
