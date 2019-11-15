import { createAction } from 'redux-actions'
import { message } from 'antd'

import { recipes } from '../../api'

// ----- Actions --------------------

export const fetchRecipesRequest = createAction('FETCH_RECIPES_REQUEST')
export const fetchRecipesResponse = createAction('FETCH_RECIPES_RESPONSE')
export const fetchRecipesFailed = createAction('RECIPES_FETCH_FAILED')

export const fetchRecipeItemResponse = createAction(
  'FETCH_RECIPE_ITEM_RESPONSE'
)

export const searchRecipesRequest = createAction('RECIPE_SEARCH_REQUEST')
export const searchRecipeResponse = createAction('RECIPE_SEARCH_RESPONSE')
export const searchRecipeLoadMore = createAction('RECIPE_SEARCH_LOAD_MORE')
export const setSearchItemsTotal = createAction('SET_SEARCH_ITEMS_TOTAL')
export const clearSearchItems = createAction('CLEAR_SEARCH_ITEMS')
export const recipeSearchFailed = createAction('RECIPE_SEARCH_FAILED')

// ----- Side Effects --------------------

export const fetchRecipeItem = uuid => (dispatch, getState) => {
  // Check if the recipe request is cached in Redux
  const state = getState()
  const recipe = state.Recipes.items.find(r => r.RecipeUUID === uuid)
  if (recipe) return recipe

  // If not checked then fetch the recipe data
  dispatch(fetchRecipesRequest())
  return recipes.getRecipe(uuid).then(response => {
    if (response) {
      const data = response.d
      if (data) {
        dispatch(fetchRecipeItemResponse(data))
      } else {
        message.error('Network Error')
        dispatch(fetchRecipesFailed())
      }
    }
  })
}

export const searchRecipeItems = (searchTerm, top) => dispatch => {
  // If not checked then fetch the recipe data
  dispatch(searchRecipesRequest())
  return recipes.search(searchTerm, top).then(response => {
    if (response) {
      const data = response.d.results
      const total = response.d.__count
      if (data) {
        dispatch(searchRecipeResponse(data))
        dispatch(setSearchItemsTotal(total))
      } else {
        message.error('Network Error')
        dispatch(recipeSearchFailed())
      }
    }
  })
}

export const searchRecipeLoadMoreItems = (
  searchTerm,
  top,
  skip = 0
) => dispatch => {
  // If not checked then fetch the recipe data
  dispatch(searchRecipesRequest())
  return recipes.search(searchTerm, top, skip).then(response => {
    if (response) {
      const data = response.d.results
      if (data) {
        dispatch(searchRecipeLoadMore(data))
      } else {
        message.error('Network Error')
        dispatch(recipeSearchFailed())
      }
    }
  })
}
