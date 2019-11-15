import request from '../utils/request'
import { SERVICE_URL } from '../constants'

const auth = {
  username: 'FRDEMO',
  password: 'france01',
}

const BASE_URL = SERVICE_URL.menus

const planner = {
  // Get all the planner Items for the Menu UUID
  getItems(uuid) {
    const keys = `UUID=guid'${uuid}'`
    return request({
      url: `${BASE_URL}/ZA_MenuPlanning(${keys})/to_Items`,
      baseUrl: BASE_URL,
      csrf: false,
      auth,
      requireAuth: true,
    })
  },

  // Get Planner Item with the expanded Recipe
  getItem(uuid) {
    const keys = `UUID=guid'${uuid}'`
    const params = '?$expand=to_Recipe'
    return request({
      url: `${BASE_URL}/ZA_MenuPlanningItem(${keys})${params}`,
      baseUrl: BASE_URL,
      csrf: false,
      auth,
      requireAuth: true,
    })
  },

  // Create/Add item to the Planner Menu
  createItem(uuid, data) {
    const keys = `UUID=guid'${uuid}'`
    return request({
      url: `${BASE_URL}/ZA_MenuPlanning(${keys})/to_Items`,
      method: 'POST',
      baseUrl: BASE_URL,
      auth,
      requireAuth: true,
      body: data,
    })
  },

  updateItem(uuid, data) {
    const keys = `ItemUUID=guid'${uuid}'`
    return request({
      url: `${BASE_URL}/ZA_MenuPlanningItem(${keys})`,
      method: 'PATCH',
      baseUrl: BASE_URL,
      auth,
      requireAuth: true,
      body: data,
    })
  },

  deleteItem(uuid) {
    const keys = `ItemUUID=guid'${uuid}'`
    return request({
      url: `${BASE_URL}/ZA_MenuPlanningItem(${keys})`,
      method: 'DELETE',
      baseUrl: BASE_URL,
      csrf: false,
      auth,
      requireAuth: true,
    })
  },

  // Expand the Planner Items with all the Recipes (this is expensive...)
  getRecipes(uuid) {
    const keys = `UUID=guid'${uuid}'`
    const params = '?$expand=to_Items/to_Recipe'
    return request({
      url: `${BASE_URL}/ZA_MenuPlanning(${keys})${params}`,
      baseUrl: BASE_URL,
      csrf: false,
      auth,
      requireAuth: true,
    })
  },
}

export { planner }
