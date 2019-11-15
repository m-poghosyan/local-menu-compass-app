// Convert object values to strings
export function deepStringifyValues(obj) {
  Object.keys(obj).forEach(key =>
    typeof obj[key] === 'object'
      ? deepStringifyValues(obj[key])
      : (obj[key] = String(obj[key]))
  )
  return obj
}
