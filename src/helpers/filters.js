import { isLastIndex } from '../utils/arrays'

export function setConceptFilter(conceptType) {
  if (!conceptType) return null

  // conceptType is an Array of Concepts to filter against
  if (Array.isArray(conceptType)) {
    let filter = ''

    conceptType.forEach((concept, index) => {
      filter = `${filter}concepttype eq '${concept}'`

      if (!isLastIndex(conceptType, index)) {
        filter += ' or '
      }
    })

    return filter
  }
  // conceptType is just a single string
  return `concepttype eq '${conceptType}'`
}
