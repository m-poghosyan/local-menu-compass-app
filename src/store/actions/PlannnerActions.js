import { createAction } from 'redux-actions'
import { message } from 'antd'

import { planner } from '../../api'

// ----- Actions --------------------

export const fetchPlannerRequest = createAction('PLANNER_FETCH_REQUEST')
export const fetchPlannerItemsResponse = createAction(
  'PLANNER_ITEMS_FETCH_RESPONSE'
)
export const fetchPlannerFailed = createAction('PLANNER_FETCH_FAILED')
export const plannerSaveRequest = createAction('PLANNER_SAVE_REQUEST')
export const plannerSaveRequestFailed = createAction(
  'PLANNER_SAVE_REQUEST_FAILED'
)
export const plannerAddItem = createAction('ADD_PLANNER_ITEM')
export const plannerUpdateItem = createAction('UPDATE_PLANNER_ITEM')
export const plannerDeleteItem = createAction('DELETE_PLANNER_ITEM')
export const plannerClearItems = createAction('PLANNER_CLEAR_ITEMS')

// ----- Side Effects --------------------

export const fetchPlannerItems = menuKey => dispatch => {
  dispatch(fetchPlannerRequest())
  return planner.getItems(menuKey).then(response => {
    if (response) {
      const data = response.d.results
      if (data) {
        dispatch(fetchPlannerItemsResponse(data))
      } else {
        message.error('Network Error')
        dispatch(fetchPlannerFailed())
      }
    }
  })
}

export const plannerCreateItem = (menuKey, formData) => dispatch => {
  dispatch(plannerSaveRequest())
  return planner.createItem(menuKey, formData).then(response => {
    if (response) {
      const data = response.d
      if (data) {
        dispatch(plannerAddItem(data))
      } else {
        message.error('Network Error')
        dispatch(plannerSaveRequestFailed())
      }
    }
  })
}

export const updatePlannerItem = (itemKey, formData) => dispatch => {
  dispatch(plannerSaveRequest())
  planner.updateItem(itemKey, formData).then(response => {
    if (response) {
      const { status } = response
      if (status === 204) {
        dispatch(
          plannerUpdateItem({ ItemUUID: itemKey, data: JSON.parse(formData) })
        )
        message.success('Item Updated')
      } else {
        message.error('Item Update Failed')
      }
    } else {
      message.error('Network Error')
      dispatch(plannerSaveRequestFailed())
    }
  })
}

export const deletePlannerItem = itemKey => dispatch =>
  planner.deleteItem(itemKey).then(response => {
    if (response) {
      dispatch(plannerDeleteItem(itemKey))
      message.success('Item Deleted')
    } else {
      message.error('Network Error')
      dispatch(fetchPlannerFailed())
    }
  })
