import request from '../utils/request'
import { SERVICE_URL } from '../constants'

const auth = {
  username: 'S4H_UX',
  password: 'compass00',
}

const BASE_URL = SERVICE_URL.conditions

const conditions = {
  async get() {
    return request({
      url: `${BASE_URL}/ConditionSet`,
      baseUrl: BASE_URL,
      auth,
      csrf: false,
      requireAuth: true,
    })
  },
}

export { conditions }
