// Cliente API simple reutilizable
// Requiere que VITE_API_BASE_URL esté definido (sin fallback)
const BASE = import.meta.env.VITE_API_BASE_URL
if (!BASE) {
  throw new Error('Falta la variable de entorno VITE_API_BASE_URL')
}

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? path : '/' + path}`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })
  
  // Read body once as text
  const bodyText = await res.text()
  
  if (!res.ok) {
    let errorBody
    try { 
      errorBody = JSON.parse(bodyText) 
    } catch { 
      errorBody = bodyText 
    }
    throw new Error(`API ${res.status} ${res.statusText}: ${typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody)}`)
  }
  
  // Parse response based on content type
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json') && bodyText) {
    try {
      return JSON.parse(bodyText)
    } catch {
      return bodyText
    }
  }
  return bodyText
}

export const apiClient = {
  get: (p) => request(p),
  post: (p, b) => request(p, { method: 'POST', body: JSON.stringify(b) }),
  put: (p, b) => request(p, { method: 'PUT', body: JSON.stringify(b) }),
  patch: (p, b) => request(p, { method: 'PATCH', body: JSON.stringify(b) }),
  delete: (p) => request(p, { method: 'DELETE' })
}

export { BASE as API_BASE_URL }
