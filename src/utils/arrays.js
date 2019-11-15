export function max(arr, gt) {
  return arr.slice(1).reduce((m, cur) => (gt(m, cur) ? m : cur), arr[0])
}

export function min(arr, gt) {
  return arr.slice(1).reduce((m, cur) => (gt(m, cur) ? cur : m), arr[0])
}

export const isLastIndex = (array, index) => array.length - 1 === index

export const intersection = (a1, a2, eq) =>
  a1.filter(e1 => a2.some(e2 => eq(e1, e2)))

export function unique(array, f) {
  const vArr = array.map(f)
  return array.filter((_, i) => vArr.indexOf(vArr[i]) === i)
}

export function flatten(arr) {
  return Array.prototype.concat.apply([], arr)
}

export function range(start, len) {
  return new Array(len).fill().map((_, i) => start + i)
}
