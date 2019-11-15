import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { parseODataDate } from '../../utils/dates'
import { PlannerScheduler } from '../../components/Planner/PlannerScheduler'
import * as plannerActions from '../../store/actions/PlannnerActions'
import * as menusActions from '../../store/actions/MenusActions'
import * as conceptsActions from '../../store/actions/ConceptsActions'
import * as conditionsActions from '../../store/actions/ConditionsActions'

const Planner = ({
  actions,
  match,
  loading,
  setTitle,
  setSubTitle,
  // headerExtra,
  plannerItems,
  menuItems,
  conceptItems,
  conditionsItems,
}) => {
  const [menu, setMenu] = useState(null)
  const [conditions, setConditions] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const { menuUUID } = match.params

  useEffect(() => {
    // Fetch current Planner items
    actions.fetchPlannerItems(menuUUID)
  }, [actions, menuUUID])

  useEffect(() => {
    // Fetch Menu items if needed
    if (!menuItems.length) {
      actions.fetchMenus()
    }

    // Fetch Conditions if needed
    if (!conditionsItems.length) {
      actions.fetchConditions()
    }

    if (!conceptItems.length) {
      actions.fetchConcepts(['MEN', 'MEC'])
    }
  }, [actions, conceptItems, conditionsItems, menuItems])

  // Set current Menu Item
  useEffect(() => {
    const menuItem = menuItems.find(item => item.UUID === menuUUID)
    setMenu(menuItem)
  }, [menuItems, menuUUID])

  useEffect(() => {
    function setPlannerConditions() {
      const conceptId = menu.Concept
      // Get the Concept associated with the current Menu
      const conceptItem = conceptItems.find(
        concept => concept.conceptoffer === conceptId
      )
      /* If Concept exists (it should...) grab the conditions
        key from it and parse the conditions set object */
      if (conceptItem) {
        const conditionsKey = conceptItem.conditionkey
        const conditionSet = conditionsItems.find(
          item => item.ID.toLowerCase() === conditionsKey.toLowerCase()
        )
        if (conditionSet) {
          const conditionsRes = JSON.parse(conditionSet.Context)
          setConditions(conditionsRes)
        }
      }
    }

    function setDates() {
      const start = new Date(parseODataDate(menu.DateFrom))
      const end = new Date(parseODataDate(menu.DateTo))
      setStartDate(start)
      setEndDate(end)
    }

    if (menu && conceptItems.length && conditionsItems.length) {
      setDates()

      // Set the conditions based on the current concept(s)
      setPlannerConditions()
    }
  }, [conceptItems, conditionsItems, menu])

  // Component Unmount
  useEffect(
    () => () => {
      actions.plannerClearItems()
    },
    [actions]
  )

  // Set Page Header Items
  // headerExtra(() => (
  //   <div>
  //     <Button>Print Planner</Button>
  //     <Button style={{ marginLeft: 8 }}>Print Instructions</Button>
  //   </div>
  // ))

  // Set Titlebar content
  if (menu) {
    setTitle(menu.Description)
    setSubTitle(menu.MenuID)
  }

  return (
    <PlannerScheduler
      loading={loading}
      menuUUID={menuUUID}
      plannerItems={plannerItems}
      conditions={conditions}
      startDate={startDate}
      endDate={endDate}
    />
  )
}

Planner.propTypes = {
  actions: PropTypes.object,
  match: PropTypes.object,
  loading: PropTypes.bool,
  plannerItems: PropTypes.array,
  menuItems: PropTypes.array,
  conceptItems: PropTypes.array,
  conditionsItems: PropTypes.array,
  setTitle: PropTypes.func,
  setSubTitle: PropTypes.func,
  // headerExtra: PropTypes.func,
}

const mapStateToProps = state => ({
  loading: state.Planner.loading,
  plannerItems: state.Planner.items,
  menuItems: state.Menus.items,
  conceptItems: state.Concepts.items,
  conditionsItems: state.Conditions.items,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...plannerActions,
      ...menusActions,
      ...conceptsActions,
      ...conditionsActions,
    },
    dispatch
  ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Planner))
