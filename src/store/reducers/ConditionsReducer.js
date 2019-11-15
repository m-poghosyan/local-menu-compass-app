const initialState = {
  loading: false,
  items: [],
}

const Conditions = (state = initialState, action) => {
  const { payload, type } = action

  switch (type) {
    case 'CONDITIONS_FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'CONDITIONS_FETCH_RESPONSE':
      return { ...state, loading: false, items: payload }
    case 'CONDITIONS_FETCH_FAILED':
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

export default Conditions
