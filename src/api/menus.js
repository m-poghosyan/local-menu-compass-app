import request from '../utils/request'
import { SERVICE_URL } from '../constants'

// ! Don't hardcode this...
const auth = {
  username: 'FRDEMO',
  password: 'france01',
}

const BASE_URL = SERVICE_URL.menus
const CENTRAL_BASE_URL = SERVICE_URL.central

const menus = {
  get() {
    return request({
      url: `${BASE_URL}/ZA_MenuPlanning`,
      baseUrl: BASE_URL,
      auth,
      requireAuth: true,
    })
  },

  getCentral() {
    return request({
      url: `${CENTRAL_BASE_URL}/ZA_CentralMenu`,
      baseUrl: CENTRAL_BASE_URL,
      auth,
      requireAuth: true,
    })
  },

  postMEN(data) {
    return request({
      url: `${BASE_URL}/ZA_MenuPlanning`,
      method: 'POST',
      baseUrl: BASE_URL,
      auth,
      requireAuth: true,
      body: data,
    })
  },

  async postMEC({ uuid, site, concept, firstMonday, description }) {
    const urlParams = `UUID=guid'${uuid}'&Site='${site}'&Concept='${concept}'&Firstmonday=${firstMonday}`
    try {
      const menu = await request({
        url: `${BASE_URL}/ZA_MenuPlanningCreate_from_central?${urlParams}`,
        method: 'POST',
        baseUrl: BASE_URL,
        auth,
        requireAuth: true,
      })

      // Description needs to be sent as a PATCH request.... 0_0
      if (menu) {
        const menuUUID = menu.d.UUID
        return await request({
          url: `${BASE_URL}/ZA_MenuPlanning(UUID=guid'${menuUUID}')`,
          method: 'PATCH',
          baseUrl: BASE_URL,
          auth,
          requireAuth: true,
          body: JSON.stringify({ Description: description }),
        })
      }
    } catch (error) {
      console.log('Error creating Menu from Central:', error)
    }
  },

  delete(uuid) {
    const keys = `UUID=guid'${uuid}'`
    return request({
      url: `${BASE_URL}/ZA_MenuPlanning(${keys})`,
      method: 'DELETE',
      baseUrl: BASE_URL,
      auth,
      json: false,
      requireAuth: true,
    })
  },
}

export { menus }
