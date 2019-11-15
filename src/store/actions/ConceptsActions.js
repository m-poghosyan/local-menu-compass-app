import { createAction } from 'redux-actions'
import { message } from 'antd'

import { concepts } from '../../api'

// ----- Actions --------------------

export const fetchConceptsRequest = createAction('CONCEPTS_FETCH_REQUEST')
export const fetchConceptsResponse = createAction('CONCEPTS_FETCH_RESPONSE')
export const fetchConceptsFailed = createAction('CONCEPTS_FETCH_FAILED')

// ----- Side Effects --------------------

export const fetchConcepts = conceptType => dispatch => {
  dispatch(fetchConceptsRequest())
  return concepts.get(conceptType).then(response => {
    if (response) {
      const data = response.d.results
      if (data) {
        dispatch(fetchConceptsResponse(data))
      } else {
        message.error('Network Error')
        dispatch(fetchConceptsFailed())
      }
    }
  })
}
