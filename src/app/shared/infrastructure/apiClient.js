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
  if (!res.ok) {
    let body
    try { body = await res.json() } catch { body = await res.text() }
    throw new Error(`API ${res.status} ${res.statusText}: ${typeof body === 'string' ? body : JSON.stringify(body)}`)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export const apiClient = {
  get: (p) => request(p),
  post: (p, b) => request(p, { method: 'POST', body: JSON.stringify(b) }),
  put: (p, b) => request(p, { method: 'PUT', body: JSON.stringify(b) }),
  patch: (p, b) => request(p, { method: 'PATCH', body: JSON.stringify(b) }),
  delete: (p) => request(p, { method: 'DELETE' })
}

export { BASE as API_BASE_URL }
