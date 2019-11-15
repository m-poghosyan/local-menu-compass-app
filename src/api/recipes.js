import request from '../utils/request'
import { SERVICE_URL } from '../constants'

const auth = {
  username: 'S4H_UX',
  password: 'compass00',
}

const BASE_URL = SERVICE_URL.recipes

const recipes = {
  async getRecipe(uuid) {
    const keys = `guid'${uuid}'`
    const params = `$expand=to_RecipeInstructions,to_Ingredients,to_NutritionalInformation`
    return request({
      url: `${BASE_URL}/ZA_Recipe(${keys})?${params}`,
      baseUrl: BASE_URL,
      auth,
      csrf: false,
      requireAuth: true,
    })
  },

  search(searchTerm, top, skip = 0) {
    const params = `$top=${top}&$skip=${skip}&$inlinecount=allpages`
    return request({
      url: `${BASE_URL}/ZA_RecipeFinder(search='${searchTerm}')/Set?${params}`,
      baseUrl: BASE_URL,
      auth,
      csrf: false,
      requireAuth: true,
    })
  },
}

export { recipes }
