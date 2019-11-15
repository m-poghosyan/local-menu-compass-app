import { combineReducers } from 'redux'

import Menus from './MenusReducer'
import Concepts from './ConceptsReducer'
import Conditions from './ConditionsReducer'
import Recipes from './RecipesReducer'
import Planner from './PlannerReducer'

const reducers = combineReducers({
  Menus,
  Concepts,
  Conditions,
  Recipes,
  Planner,
})

export default reducers
