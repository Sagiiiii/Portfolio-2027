const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

// '2024-01' -> 'ene 2024' ; null -> 'actualidad'
export function formatPeriod(value) {
  if (!value) return 'actualidad'
  const [y, m] = String(value).split('-')
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y
}

// Hash "falso" estilo git a partir de un texto
export function fakeHash(str) {
  let h = 0
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h.toString(16).padStart(7, '0').slice(0, 7)
}
