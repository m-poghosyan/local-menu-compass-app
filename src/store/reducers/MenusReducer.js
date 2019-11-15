const initialState = {
  loading: false,
  items: [],
  central: [],
}

const Menus = (state = initialState, action) => {
  const { payload, type } = action

  switch (type) {
    case 'MENUS_FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'MENUS_FETCH_RESPONSE':
      return { ...state, loading: false, items: payload }
    case 'MENUS_FETCH_FAILED':
      return {
        ...state,
        loading: false,
      }
    case 'MENUS_CREATE_RESPONSE':
      return { ...state, loading: false }
    case 'MENU_DELETE_RESPONSE':
      return {
        ...state,
        loading: false,
        items: state.items.filter(item => item.MenuID !== payload),
      }
    case 'MENUS_FETCH_CENTRAL_RESPONSE':
      return {
        ...state,
        loading: false,
        central: payload,
      }
    default:
      return state
  }
}

export default Menus
