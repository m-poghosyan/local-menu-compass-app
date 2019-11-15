const initialState = {
  loading: false,
  saving: false,
  items: [],
  newPlannedItems: [], // Items to submit to the planner
}

const updateItems = ({ items }, { ItemUUID, data }) => {
  const itemIdx = items.findIndex(i => i.ItemUUID === ItemUUID)
  const item = items[itemIdx]
  const updatedItem = { ...item, ...data }

  return [...items.slice(0, itemIdx), updatedItem, ...items.slice(itemIdx + 1)]
}

const Planner = (state = initialState, action) => {
  const { payload, type } = action

  switch (type) {
    case 'PLANNER_FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'PLANNER_ITEMS_FETCH_RESPONSE':
      return { ...state, loading: false, items: payload }
    case 'PLANNER_FETCH_FAILED':
      return {
        ...state,
        loading: false,
      }
    case 'PLANNER_SAVE_REQUEST':
      return { ...state, saving: true }
    case 'PLANNER_SAVE_REQUEST_FAILED':
      return { ...state, saving: false }
    case 'ADD_PLANNER_ITEM':
      return { ...state, saving: false, items: [...state.items, payload] }
    case 'UPDATE_PLANNER_ITEM':
      return { ...state, saving: false, items: updateItems(state, payload) }
    case 'DELETE_PLANNER_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.ItemUUID !== payload),
      }
    case 'PLANNER_CLEAR_ITEMS':
      return { ...state, items: [] }
    case 'PLANNER_ADD_NEW_PLANNED_ITEM':
      return { ...state, newPlannedItems: [...state.newPlannedItems, payload] }
    case 'PLANNER_REMOVE_NEW_ITEM':
      return {
        ...state,
        newPlannedItems: state.newPlannedItems.filter(
          i => i.RecipeUUID !== payload.RecipeUUID
        ),
      }
    case 'PLANNER_CLEAR_NEW_ITEMS':
      return { ...state, newPlannedItems: [] }
    default:
      return state
  }
}

export default Planner
