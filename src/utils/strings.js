export const capitalize = str => {
  if (typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const capitalizeAll = sentence => {
  if (typeof sentence !== 'string') return ''
  return sentence
    .split(' ')
    .map(str => capitalize(str))
    .join(' ')
}
