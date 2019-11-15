import request from '../utils/request'
import { SERVICE_URL } from '../constants'

import { setConceptFilter } from '../helpers/filters'

const auth = {
  username: 'S4H_UX',
  password: 'compass00',
}

const BASE_URL = SERVICE_URL.concepts

const concepts = {
  async get(conceptType = 'MEN') {
    let params = ''
    params = `$filter=${setConceptFilter(conceptType)}`

    return request({
      url: `${BASE_URL}/ZC_CONCEPT?${params}`,
      baseUrl: BASE_URL,
      auth,
      csrf: false,
      requireAuth: true,
    })
  },
}

export { concepts }
