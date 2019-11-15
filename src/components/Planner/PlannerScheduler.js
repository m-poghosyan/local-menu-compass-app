import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown, Icon, Menu, Select, Switch } from 'antd'
import format from 'date-fns/format'
import addDays from 'date-fns/add_days'
import subDays from 'date-fns/sub_days'
import isWithinRange from 'date-fns/is_within_range'
import startOfWeek from 'date-fns/start_of_week'
import eachDay from 'date-fns/each_day'
import { isSameDay } from 'date-fns'
import { keyHandler, KEYDOWN } from 'react-key-handler'

import { parseODataDate } from '../../utils/dates'
import { SCHEDULER_VIEW_MODE, DAY_OF_WEEK_MAP } from '../../constants'
import { PlannerDateNav } from './PlannerDateNav'
import { MenuBar } from '../MenuBar'
import { Board } from './Board'
import { AddItemDrawer } from './AddItemDrawer'

const { Option } = Select

function isConditionDayValid(condition, day) {
  const { startsat, endsat } = condition

  // 0: Monday -> 6: Sunday (not consistent with JS Date object...)
  const dayOfWeek = DAY_OF_WEEK_MAP.get(new Date(day).getDay())
  return startsat <= dayOfWeek && dayOfWeek <= endsat
}

const createBoardStructure = function(
  startDate,
  endDate,
  conditions,
  plannerItems
) {
  if (startDate && endDate && conditions && plannerItems) {
    const { menustructure } = conditions
    const plannerDaysRange = eachDay(startDate, endDate).map(day =>
      format(day, 'MM/DD/YYYY')
    )

    const structure = plannerDaysRange.reduce((obj, day) => {
      // Add the planner days to the schedule structure
      if (!obj[day]) {
        obj[day] = { structure: {} }
      }

      // Create day structure from the conditions
      menustructure.forEach(condition => {
        // Add dayparts
        if (isConditionDayValid(condition, day)) {
          if (!obj[day].structure[condition.daypart]) {
            obj[day].structure[condition.daypart] = {}
          }

          // Add dishtypes
          if (!obj[day].structure[condition.daypart][condition.dishtype]) {
            obj[day].structure[condition.daypart][condition.dishtype] = {
              min: condition.minquantity,
              max: condition.maxquantity,
              order: condition.sortorder,
            }
          }
        }
      })

      // Add Planner Items (Recipes, Retail Items...)
      if (!obj[day].items) {
        obj[day].items = []
      }

      const plannedDays = plannerItems.filter(item =>
        isSameDay(
          parseODataDate(item.PlanningDate),
          Number.parseInt(new Date(day).getTime())
        )
      )
      obj[day].items = plannedDays

      return obj
    }, {})
    return structure
  }
}

function Scheduler({
  loading,
  menuUUID,
  plannerItems,
  conditions,
  startDate,
  endDate,
  keyValue,
}) {
  const [compactView, setCompactView] = useState(true)
  const [showWeekend, setShowWeekend] = useState(true)
  const [daysToShow, setDaysToShow] = useState(SCHEDULER_VIEW_MODE.get('Week'))
  const [currentDate, setCurrentDate] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  // const [collapsed, setCollapsed] = useState(false)
  const [newItemPos, setNewItemPos] = useState({ day: null, part: null })

  useEffect(() => {
    // Settings
    const compact = localStorage.getItem('compactView')
    setCompactView(JSON.parse(compact))
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      setCurrentDate(startOfWeek(startDate, { weekStartsOn: 1 }))
    }
  }, [endDate, startDate])

  // Keyboard shortcuts for display type (days to display)
  useEffect(() => {
    switch (keyValue) {
      case 'w':
        setDaysToShow(7)
        break
      case 'x':
        setDaysToShow(3)
        break
      case 'd':
        setDaysToShow(1)
        break
      default:
        break
    }
  }, [keyValue])

  const prevDate = () => {
    const delta = daysToShow > 1 ? daysToShow : 1

    if (daysToShow === 1) {
      setCurrentDate(subDays(currentDate, delta))
    } else {
      const start = subDays(currentDate, delta)
      const isStartWithin = isWithinRange(start, startDate, endDate)
      const end = addDays(start, delta)
      const isEndWithin = isWithinRange(end, startDate, endDate)

      if (isStartWithin || isEndWithin) {
        setCurrentDate(subDays(currentDate, delta))
      }
    }
  }

  const nextDate = () => {
    const delta = daysToShow > 1 ? daysToShow : 1

    if (daysToShow === 1) {
      setCurrentDate(addDays(currentDate, delta))
    } else {
      const start = addDays(currentDate, delta)
      const isStartWithin = isWithinRange(start, startDate, endDate)
      const end = addDays(start, delta)
      const isEndWithin = isWithinRange(end, startDate, endDate)

      if (isStartWithin || isEndWithin) {
        setCurrentDate(addDays(currentDate, delta))
      }
    }
  }

  // Navigation keys
  // useEffect(() => {
  //   switch (keyValue) {
  //     case 'ArrowLeft':
  //       prevDate()
  //       break
  //     case 'ArrowRight':
  //       nextDate()
  //       break
  //     default:
  //       break
  //   }
  // })

  // const handleCollapseAll = () => {
  //   setCollapsed(!collapsed)
  // }

  const handlePrevDate = () => prevDate()

  const handleNextDate = () => nextDate()

  const handleDisplayTypeSelect = value => {
    setDaysToShow(value)
    setCurrentDate(startOfWeek(startDate, { weekStartsOn: 1 }))
  }

  const handleAddItem = (day, part) => {
    // TODO Add Item to Redux Store or just submit it to backend and refresh store? Hmm...
    setNewItemPos(() => ({ day, part }))
    setShowDrawer(true)
  }

  const settings = (
    <Menu>
      <Menu.Item style={{ minWidth: 175 }}>
        <span>Compact</span>
        <Switch
          style={{ float: 'right' }}
          checked={compactView}
          onChange={() => {
            setCompactView(!compactView)
            localStorage.setItem('compactView', !compactView)
          }}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
        />
      </Menu.Item>

      <Menu.Item>
        <span>Weekend</span>
        <Switch
          style={{ float: 'right' }}
          checked={showWeekend}
          onChange={() => {
            setShowWeekend(!showWeekend)
            localStorage.setItem('showWeekend', !showWeekend)
          }}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
        />
      </Menu.Item>
    </Menu>
  )

  // TODO Review all this calculatins of costs and profits
  // const calculateGrossProfit = (recipeCost, planningPrice) => {
  //   if (!recipeCost || !planningPrice) return '-'
  //   return Number(recipeCost) / Number(planningPrice) / 100
  // }

  const boardStructure = useCallback(
    () => createBoardStructure(startDate, endDate, conditions, plannerItems),
    [conditions, endDate, plannerItems, startDate]
  )

  return (
    <>
      <MenuBar
        leftItems={() => (
          <PlannerDateNav
            loading={loading}
            currentDate={currentDate}
            planStartDate={startDate}
            planEndDate={endDate}
            daysToShow={daysToShow}
            prevDate={handlePrevDate}
            nextDate={handleNextDate}
          />
        )}
        // centralItems={() => (

        // )}
        rightItems={() => (
          <>
            {/* <Button
              type="secondary"
              icon="shrink"
              title="Collapse All"
              onClick={handleCollapseAll}
            /> */}

            <Dropdown
              overlay={settings}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button type="secondary" icon="setting" title="Options" />
            </Dropdown>

            <Select
              defaultValue="Week"
              value={daysToShow}
              onSelect={handleDisplayTypeSelect}
            >
              {Array.from(SCHEDULER_VIEW_MODE.keys()).map(type => (
                <Option
                  key={SCHEDULER_VIEW_MODE.get(type)}
                  value={SCHEDULER_VIEW_MODE.get(type)}
                >
                  {type}
                </Option>
              ))}
            </Select>
          </>
        )}
      />

      <AddItemDrawer
        showDrawer={showDrawer}
        toggleDrawer={() => {
          setShowDrawer(!showDrawer)
        }}
        menuUUID={menuUUID}
        day={newItemPos.day}
        part={newItemPos.part}
        structure={boardStructure()}
        startDate={startDate}
        endDate={endDate}
      />

      <Board
        loading={loading}
        structure={boardStructure()}
        // collapse={collapsed}
        compactView={compactView}
        showWeekend={showWeekend}
        currentDate={currentDate}
        daysToShow={daysToShow}
        onAddItem={handleAddItem}
      />
    </>
  )
}

Scheduler.propTypes = {
  loading: PropTypes.bool,
  menuUUID: PropTypes.string.isRequired,
  plannerItems: PropTypes.array,
  conditions: PropTypes.object,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  keyValue: PropTypes.string,
}

const PlannerScheduler = keyHandler({
  keyEventName: KEYDOWN,
  keyValue: ['w', 'x', 'd', 'ArrowLeft', 'ArrowRight'],
})(Scheduler)

export { PlannerScheduler }
