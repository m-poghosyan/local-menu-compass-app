import { createAction } from 'redux-actions'
import { message } from 'antd'

import { conditions } from '../../api'

// ----- Actions --------------------

export const fetchConditionsRequest = createAction('CONDITIONS_FETCH_REQUEST')
export const fetchConditionsResponse = createAction('CONDITIONS_FETCH_RESPONSE')
export const fetchConditionsFailed = createAction('CONDITIONS_FETCH_FAILED')

// ----- Side Effects --------------------

export const fetchConditions = conceptType => dispatch => {
  dispatch(fetchConditionsRequest())
  return conditions.get(conceptType).then(response => {
    if (response) {
      const data = response.d.results
      if (data) {
        dispatch(fetchConditionsResponse(data))
      } else {
        message.error('Network Error')
        dispatch(fetchConditionsFailed())
      }
    }
  })
}
