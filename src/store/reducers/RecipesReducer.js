const initialState = {
  loading: false,
  items: [],
  searchItems: [],
  loadingSearch: false,
  searchItemsTotal: 0,
}

const Recipes = (state = initialState, action) => {
  const { payload, type } = action

  switch (type) {
    case 'FETCH_RECIPES_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'FETCH_RECIPE_ITEM_RESPONSE':
      return { ...state, loading: false, items: [...state.items, payload] }
    case 'RECIPES_FETCH_FAILED':
      return {
        ...state,
        loading: false,
      }
    case 'RECIPE_SEARCH_REQUEST':
      return {
        ...state,
        loadingSearch: true,
      }
    case 'RECIPE_SEARCH_RESPONSE':
      return {
        ...state,
        loadingSearch: false,
        searchItems: payload,
      }
    case 'RECIPE_SEARCH_LOAD_MORE':
      return {
        ...state,
        loadingSearch: false,
        searchItems: [...state.searchItems, ...payload],
      }
    case 'SET_SEARCH_ITEMS_TOTAL':
      return {
        ...state,
        searchItemsTotal: payload,
      }
    case 'CLEAR_SEARCH_ITEMS':
      return {
        ...state,
        loadingSearch: false,
        searchItems: initialState.searchItems,
        searchItemsTotal: initialState.searchItemsTotal,
      }
    case 'RECIPE_SEARCH_FAILED':
      return {
        ...state,
        loadingSearch: false,
      }
    default:
      return state
  }
}

export default Recipes
