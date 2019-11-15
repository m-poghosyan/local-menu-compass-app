import { unique } from '../../utils/arrays'

const initialState = {
  loading: false,
  items: [],
}

function setConcepts(concepts) {
  // Clean any duplicated concepts or empty (safeguard backend problems...)
  const filteredConcepts = unique(concepts, c => c.conceptoffer).filter(
    c => c.conceptoffer.length
  )
  return filteredConcepts
}

const Concepts = (state = initialState, action) => {
  const { payload, type } = action

  switch (type) {
    case 'CONCEPTS_FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'CONCEPTS_FETCH_RESPONSE':
      return { ...state, loading: false, items: setConcepts(payload) }
    case 'CONCEPTS_FETCH_FAILED':
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

export default Concepts
