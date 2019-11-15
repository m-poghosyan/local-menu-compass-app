import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { Affix, Badge, Card, Collapse, Icon } from 'antd'
import format from 'date-fns/format'
import addDays from 'date-fns/add_days'
import isWeekend from 'date-fns/is_weekend/'

// ! Maybe debounce the update to the items?
// import { debounce } from '../../../utils/functions'
import AddItemButton from './AddItemButton'
import LoadingBoard from './LoadingBoard'
import EmptyPlanningDay from './EmptyPlanningDay'
import StatusIcon from './StatusIcon'
import {
  updatePlannerItem,
  deletePlannerItem,
} from '../../../store/actions/PlannnerActions'

const PlannerItem = React.lazy(() => import('../PlannerItem'))

const { Panel } = Collapse

const BoardContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 250px);
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  border-radius: ${props => props.theme.borderRadius.default};
  border: 1px solid ${props => props.theme.color.grays[10]};
  transition: all 0.3s ease-in-out;

  @media all and (max-width: ${props => props.theme.screen.md}) {
    flex-flow: column nowrap;
    border: none;
  }
`

const BoardColumn = styled.div`
  min-width: 200px;
  position: relative;
  border: 1px solid ${props => props.theme.color.grays[10]};
  flex: 1;

  @media all and (max-width: ${props => props.theme.screen.md}) {
    border-radius: ${props => props.theme.borderRadius.default};
    border: 2px solid ${props => props.theme.color.grays[10]};

    &:not(:first-child) {
      margin-top: 1rem;
    }
  }
`

const ColumnDayHeader = styled.div`
  height: 38px;
  background: ${props => props.theme.color.grays[10]};
  color: ${props => props.theme.color.white};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  white-space: nowrap;

  span {
    color: ${props => props.theme.color.gray};
    margin-right: 0.5rem;
  }
`

const BoardColumnContent = styled(Collapse)`
  height: calc(100% - 38px);
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  border: none !important;
  border-radius: 0 !important;
`

const DayPartPanel = styled(Panel)`
  border-radius: 0 !important;

  .ant-collapse-header {
    background: #f1f3f4cc;
    border-radius: 0 !important;
    font-weight: bold;
    text-transform: capitalize;
  }

  .ant-collapse-content-box {
    padding: 0 8px !important;

    &:last-child {
      margin-bottom: ${props => props.theme.padding.md};
    }
  }
`

const DishTypeContainer = styled.div`
  margin-bottom: ${props => props.theme.padding.xs};

  &:not(:first-child) {
    &::before {
      content: '';
      background: ${props => props.theme.color.grays[4]};
      display: block;
      width: 42px;
      height: 1px;
      margin: ${props => props.theme.padding.lg} auto 0;
    }
  }
`

const Items = styled.div`
  width: 100%;
  height: 100%;

  & > *:not(:last-child) {
    margin-bottom: 0.5rem !important;
  }
`

const StyledDishTypeHeader = styled.div`
  padding: ${props => props.theme.padding.sm} ${props => props.theme.padding.sm};
  color: ${props => props.theme.color.grays[8]};
  font-weight: 500;
  text-transform: capitalize;
  display: flex;
  justify-content: space-between;

  .rules {
    margin-left: 16px;
    color: ${props => props.theme.color.grays[6]};
  }
`

const DishTypeHeader = ({ structure, isValid = false, dishType }) => {
  const { min, max } = structure

  return (
    <StyledDishTypeHeader>
      <div className="text">
        <Badge
          status={isValid ? 'success' : 'error'}
          text={dishType.toLowerCase()}
        />
      </div>
      <div className="rules">{`(${min}/${max})`}</div>
    </StyledDishTypeHeader>
  )
}

DishTypeHeader.propTypes = {
  structure: PropTypes.object.isRequired,
  isValid: PropTypes.bool.isRequired,
  dishType: PropTypes.string.isRequired,
}

// const collapseAll = () => {
//   console.log('Collapse All')
// }

function Board({
  loading,
  structure,
  currentDate,
  daysToShow,
  // collapse,
  compactView,
  showWeekend,
  onAddItem,
}) {
  const dispatch = useDispatch()

  // Call collapse all when collapse prop changes
  // useEffect(() => {
  //   collapseAll()
  // }, [collapse])

  const updateItem = (itemUUID, data) => {
    dispatch(updatePlannerItem(itemUUID, JSON.stringify(data)))
  }

  const handleAddItem = (day, part) => {
    onAddItem(day, part)
  }

  const handleItemUpdate = (ItemUUID, data) => {
    updateItem(ItemUUID, data)
  }

  const handleDeleteItem = itemUUID => {
    dispatch(deletePlannerItem(itemUUID))
  }

  const handleQuantityIncrease = (itemUUID, currentQuantity) => {
    const newQuantity = Number(currentQuantity) + 1
    const data = {
      Quantity: String(newQuantity),
    }
    updateItem(itemUUID, data)
  }

  const handleQuantityDecrease = (itemUUID, currentQuantity) => {
    const newQuantity = Number(currentQuantity) - 1

    if (newQuantity >= 0) {
      const data = {
        Quantity: String(newQuantity),
      }
      updateItem(itemUUID, data)
    }
  }

  // const handleQuantityIncrease = (itemUUID, currentQuantity) => {
  //   updateQuantity(itemUUID, currentQuantity + 1)
  // }

  // const handleQuantityDecrease = (itemUUID, currentQuantity) => {
  //   updateQuantity(itemUUID, currentQuantity - 1)
  // }

  function getDaysToRender() {
    const range = Array.from(Array(daysToShow).keys()) // range of days [1-7, 1-3, 1]
    const firstKeyDate = currentDate.getTime()
    const days = range
      .map(delta => {
        const keyDate = addDays(firstKeyDate, delta).getTime()
        return keyDate
      })
      .filter(day => !isWeekend(day) || (showWeekend && isWeekend(day)))
    return days
  }

  const sortByOrder = (a, b) => b.order - a.order

  // TODO Add information about the day (financials, etc in the popup)
  // TODO Also add status button color, icon depending on that info (rules)
  const renderDayPartPanelExtra = (day, part) => (
    <StatusIcon day={day} dayPart={part} />
  )

  const renderBoard = () => {
    // console.log(structure)
    if (structure && currentDate && daysToShow) {
      const days = getDaysToRender()

      // Render Planner Items per Day
      return days.map(plannerDay => {
        const day = format(plannerDay, 'MM/DD/YYYY')
        const dayStructure = structure[day]
        const dayItems = dayStructure ? dayStructure.items : []
        const menuStructure = dayStructure ? dayStructure.structure : {}
        const dayParts = Object.keys(menuStructure)

        return (
          <BoardColumn key={`day-${plannerDay}`}>
            <Affix offsetTop={0}>
              <ColumnDayHeader key={`header-${plannerDay}`}>
                <span>{format(plannerDay, 'DD')}</span>
                {format(plannerDay, 'dddd')}
              </ColumnDayHeader>
            </Affix>

            <BoardColumnContent
              defaultActiveKey={dayParts.map(
                dayPart => `${plannerDay}-${dayPart}`
              )}
              expandIcon={({ isActive }) => (
                <Icon type="caret-right" rotate={isActive ? 90 : 0} />
              )}
            >
              {dayParts.length ? (
                dayParts.map(dayPart => {
                  // Day Parts (Lunch, Dinner, ...)
                  const dayPartItems = dayItems.filter(
                    item => item.DayPart.toLowerCase() === dayPart.toLowerCase()
                  )
                  const dishTypes = Object.keys(menuStructure[dayPart])

                  return (
                    <DayPartPanel
                      key={`${plannerDay}-${dayPart}`}
                      header={dayPart.toLowerCase()}
                      extra={renderDayPartPanelExtra(plannerDay, dayPart)}
                    >
                      {dishTypes.length > 0 && // Items per Dish Type [Course] (Main Dish, Desert, ...)
                        dishTypes.sort(sortByOrder).map(course => {
                          // Items filtered by current Course (DishType)
                          const itemsByDishType =
                            dayPartItems.length &&
                            dayPartItems.filter(
                              item =>
                                item.DishType.toLowerCase() ===
                                course.toLowerCase()
                            )

                          return (
                            <DishTypeContainer
                              key={`${plannerDay}-${dayPart}-${course}`}
                            >
                              <DishTypeHeader
                                key={`dayPartHeader-${plannerDay}-${dayPart}-${course}`}
                                structure={menuStructure[dayPart][course]}
                                isValid={false} // Todo Calculate condition rules per dishType
                                dishType={course}
                              />

                              <Items
                                key={`items-${plannerDay}-${dayPart}-${course}`}
                              >
                                {itemsByDishType.length > 0 ? (
                                  itemsByDishType.map(item => {
                                    const {
                                      ItemUUID,
                                      RecipeDescription,
                                      RecipeImageURL,
                                      RecipeUUID,
                                      ItemNumber,
                                      Quantity,
                                      PlanningCost,
                                      PlanningPrice,
                                      Currency,
                                    } = item

                                    return (
                                      <Suspense
                                        key={`${ItemUUID}-${ItemNumber}`}
                                        fallback={
                                          <Card
                                            key={`loading-${ItemUUID}-${ItemNumber}`}
                                            style={{
                                              width: '100%',
                                              minHeight: 125,
                                            }}
                                            loading
                                          />
                                        }
                                      >
                                        {/* // TODO: Review Fiancials: cost, grossProfit, revenue, etc... */}
                                        <PlannerItem
                                          key={`item-${ItemUUID}-${ItemNumber}`}
                                          useQuickButtons
                                          loading={loading}
                                          compactView={compactView}
                                          title={RecipeDescription}
                                          image={RecipeImageURL}
                                          itemUUID={ItemUUID}
                                          recipeUUID={RecipeUUID}
                                          quantity={Quantity}
                                          // cost={PlanningCost}
                                          // revenue={PlanningPrice}
                                          cost={5}
                                          revenue={10}
                                          // grossProfit={
                                          //   (PlanningPrice - PlanningCost) * 100
                                          // }
                                          grossProfit={((10 - 5) / 10) * 100}
                                          currency={Currency}
                                          onUpdateItem={data =>
                                            handleItemUpdate(ItemUUID, data)
                                          }
                                          onDeleteClick={handleDeleteItem}
                                          onQuantityIncrease={itemUUID =>
                                            handleQuantityIncrease(
                                              itemUUID,
                                              Number(Quantity)
                                            )
                                          }
                                          onQuantityDecrease={itemUUID =>
                                            handleQuantityDecrease(
                                              itemUUID,
                                              Number(Quantity)
                                            )
                                          }
                                        />
                                      </Suspense>
                                    )
                                  })
                                ) : (
                                  <Items key={`items-${plannerDay}-${dayPart}`}>
                                    <AddItemButton
                                      onClick={() =>
                                        handleAddItem(plannerDay, dayPart)
                                      }
                                    />
                                  </Items>
                                )}
                              </Items>
                            </DishTypeContainer>
                          )
                        })}
                    </DayPartPanel>
                  )
                })
              ) : (
                <EmptyPlanningDay
                  text="Nothing Planned"
                  key={`no-planning-${plannerDay}`}
                />
              )}
            </BoardColumnContent>
          </BoardColumn>
        )
      })
    }
  }

  // Render the Board or Loading Placeholder
  return !loading ? (
    <BoardContainer>{renderBoard()}</BoardContainer>
  ) : (
    <LoadingBoard />
  )
}

Board.propTypes = {
  loading: PropTypes.bool,
  structure: PropTypes.object,
  // collapse: PropTypes.bool,
  compactView: PropTypes.bool,
  showWeekend: PropTypes.bool,
  currentDate: PropTypes.object,
  daysToShow: PropTypes.number,
  onAddItem: PropTypes.func,
}

export default Board
