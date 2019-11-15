import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Icon,
  Input,
  Form,
  List,
  message,
  Popover,
  Row,
  Select,
  Typography,
} from 'antd'
import { format } from 'date-fns'
import moment from 'moment'
import pluralize from 'pluralize'
import LazyLoad from 'react-lazy-load'

import { convertToJsonODataDate } from '../../utils/dates'
import { capitalize, capitalizeAll } from '../../utils/strings'
import useDebounce from '../../hooks/useDebounce'
import RecipeModal from '../Recipe/RecipeModal'
import { ImageLoader } from '../ImageLoader'
import {
  searchRecipeItems,
  searchRecipeLoadMoreItems,
} from '../../store/actions/RecipesActions'
// import { planner as plannerAPI } from '../../api'
import { plannerCreateItem } from '../../store/actions/PlannnerActions'

const { Search } = Input
const { Option } = Select
const { Text } = Typography

const IMAGE_HEIGHT = 80

const FormContainer = styled.div`
  margin-bottom: 1rem;

  .ant-form-item {
    margin-bottom: 8px !important;
  }
`

const ItemsList = styled(List)`
  .ant-row:first-child {
    margin-top: 16px;
  }
`

const ItemCard = styled(Card)`
  width: 100%;
  position: relative;
  border-radius: ${props => props.theme.borderRadius.default} !important;
  border: 1px solid ${props => props.theme.color.border} !important;
  transition: all 0.4s ease;

  .coverWrapper {
    position: relative;
    user-select: none;

    img {
      width: 100%;
      height: ${IMAGE_HEIGHT}px;
      border-radius: ${props => props.theme.borderRadius.default}
        ${props => props.theme.borderRadius.default} 0 0 !important;
      object-fit: cover;
      user-select: none;
    }

    &:hover {
      cursor: pointer;

      img {
        transition: filter 0.4s cubic-bezier(0.43, 0.41, 0.22, 0.91);
        filter: saturate(0%);
      }
    }

    .iconWrapper {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      font-weight: 600;
      text-align: center;
      border-radius: ${props => props.theme.borderRadius.default}
        ${props => props.theme.borderRadius.default} 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 5;

      .icon {
        width: 100%;
        background: #0a0a0ab5;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;
        opacity: 0;
        border-radius: ${props => props.theme.borderRadius.default}
          ${props => props.theme.borderRadius.default} 0 0;
        transition: opacity 0.4s cubic-bezier(0.43, 0.41, 0.22, 0.91);
        cursor: pointer;

        &--check {
          color: ${props => props.theme.color.blue};
        }

        &--remove {
          color: ${props => props.theme.color.red};
        }

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  &:hover {
    background: ${props => props.theme.color.blues[1]};
    border: 1px solid ${props => props.theme.color.blue} !important;
  }

  &.selected {
    background: ${props => props.theme.color.greens[1]} !important;
    color: ${props => props.theme.color.green} !important;
    border: 1px solid ${props => props.theme.color.green} !important;

    .coverWrapper .iconWrapper .icon {
      opacity: 1;

      &--check {
        color: ${props => props.theme.color.green} !important;
      }
    }
  }
`

const ItemTitle = styled.div`
  color: black;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.color.link};
  }
`

const Footer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid ${props => props.theme.color.grays[4]};
  padding: 10px 16px;
  background: white;
  text-align: right;
`

const ItemsPopover = styled.ul`
  padding: 0;
  margin: 0;
  margin-left: 1rem;
`

const getDayPartKeys = (structure, day) =>
  Object.keys(structure[format(day, 'MM/DD/YYYY')].structure)

const getDishTypeKeys = (structure, day, part) => {
  const dayStructure = structure[format(day, 'MM/DD/YYYY')].structure
  return Object.keys(dayStructure[part])
}

const getDefaultDishType = dishTypes =>
  dishTypes && dishTypes.length ? dishTypes[0] : ''

function DrawerForm({
  menuUUID,
  day,
  part,
  structure,
  startDate,
  endDate,
  showDrawer,
  toggleDrawer,
  form,
}) {
  const SEARCH_DELAY = 500
  const SEARCH_ITEMS_LIMIT = 20

  const [saving, setSaving] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedDayPart, setSelectedDayPart] = useState(null)
  const [dayPartKeys, setDayPartKeys] = useState(null)
  const [selectedDishType, setSelectedDishType] = useState(null)
  const [dishTypeKeys, setDishTypeKeys] = useState(null)
  const [recipeVisible, setRecipeVisible] = useState(false)
  const [recipeUUID, setRecipeUUID] = useState(null)
  const [searchQuery, setSearchQuery] = useState(null)
  const [searchOffset, setSearchOffset] = useState(0) // OData $skip

  const dispatch = useDispatch()
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DELAY)
  const newPlannedItems = useSelector(state => state.Planner.newPlannedItems)

  // Initialize state based on props
  useEffect(() => {
    if (structure && day && part) {
      setSelectedDay(day)
      setSelectedDayPart(part)
      setDayPartKeys(getDayPartKeys(structure, day))

      const dishTypes = getDishTypeKeys(structure, day, part)
      setSelectedDishType(getDefaultDishType(dishTypes))
      setDishTypeKeys(dishTypes)
    }
  }, [day, part, structure])

  // Set Current Day Parts when selected day changes
  useEffect(() => {
    if (structure && selectedDay) {
      setDayPartKeys(getDayPartKeys(structure, selectedDay))
    }
  }, [selectedDay, structure])

  // Set Current Dish Types when selected day and day partchanges
  useEffect(() => {
    if (structure && selectedDay && selectedDayPart) {
      const dishTypes = getDishTypeKeys(structure, day, part)
      setSelectedDishType(getDefaultDishType(dishTypes))
      setDishTypeKeys(dishTypes)
    }
  }, [day, part, selectedDay, selectedDayPart, structure])

  // Fetch Search Items
  useEffect(() => {
    function loadSearchItems() {
      dispatch(searchRecipeItems(debouncedSearchQuery, SEARCH_ITEMS_LIMIT))
    }

    if (debouncedSearchQuery) {
      setSearchOffset(0)
      loadSearchItems()
    } else {
      dispatch({ type: 'CLEAR_SEARCH_ITEMS' })
    }
  }, [debouncedSearchQuery, dispatch])

  // Post Items synchronously so we don't get race conditions
  const saveItems = (items, uuid, dayPart, dishType, date) =>
    items.reduce((prevPromise, item) => {
      const data = JSON.stringify({
        RecipeUUID: item.RecipeUUID,
        DayPart: dayPart,
        DishType: dishType,
        PlanningDate: date,
      })
      // return prevPromise.then(() => plannerAPI.saveItem(uuid, data))
      return prevPromise.then(() => dispatch(plannerCreateItem(uuid, data)))
    }, Promise.resolve())

  // TODO Exclude also days with no planned days (from the structure)
  const disabledDate = current =>
    current.endOf('day') < moment(startDate).endOf('day') ||
    current.endOf('day') > moment(endDate).endOf('day')

  const formattedTitle = title =>
    capitalize(title ? title.toLowerCase() : title)

  const clearForm = () => {
    toggleDrawer()
    dispatch({ type: 'CLEAR_SEARCH_ITEMS' })
    if (newPlannedItems.length) dispatch({ type: 'PLANNER_CLEAR_NEW_ITEMS' })
    form.resetFields()
  }

  const isItemSelected = useCallback(
    item => newPlannedItems.some(i => i.RecipeUUID === item.RecipeUUID),
    [newPlannedItems]
  )

  const addItem = item =>
    dispatch({ type: 'PLANNER_ADD_NEW_PLANNED_ITEM', payload: item })

  const removeItem = item =>
    dispatch({ type: 'PLANNER_REMOVE_NEW_ITEM', payload: item })

  const addOrRemoveItem = item => {
    const isItemAdded = isItemSelected(item)

    if (!isItemAdded) {
      addItem(item)
    } else {
      removeItem(item)
    }
  }

  const itemSelectedClass = item =>
    `${isItemSelected(item) ? 'selected' : null}`

  const handleSetRecipeVisible = isVisible => setRecipeVisible(isVisible)

  const handleClose = () => {
    clearForm()
  }

  const handleDayChange = value => {
    setSelectedDay(moment(value).valueOf())
  }

  const handleDayPartChange = value => {
    setSelectedDayPart(value)
  }

  const handleDishTypeChange = value => {
    setSelectedDishType(value)
  }

  const handleSubmitItems = event => {
    event.preventDefault()
    const planningDate = convertToJsonODataDate(selectedDay) // ! BUG: Date is being created wrongly!

    // Subit the items
    try {
      setSaving(true)
      saveItems(
        newPlannedItems,
        menuUUID,
        selectedDayPart,
        selectedDishType,
        planningDate
      )
        .then(() => {
          setSaving(false)
          message.success('Items added to Planner')
          clearForm()
        })
        .catch(error => {
          setSaving(false)
          message.error('Save Items error: ', error)
        })
    } catch (error) {
      setSaving(false)
      message.error('Save Items error: ', error)
    }
  }

  const handleLoadMore = () => {
    dispatch(
      searchRecipeLoadMoreItems(
        debouncedSearchQuery,
        SEARCH_ITEMS_LIMIT,
        searchOffset + SEARCH_ITEMS_LIMIT
      )
    )
    setSearchOffset(searchOffset + SEARCH_ITEMS_LIMIT)
  }

  const { getFieldDecorator } = form

  const loading = useSelector(state => state.Recipes.loadingSearch)
  const searchItems = useSelector(state => state.Recipes.searchItems)
  const searchItemsTotal = useSelector(state => state.Recipes.searchItemsTotal)

  const renderCover = item =>
    !loading && (
      <div
        className="coverWrapper"
        role="presentation"
        onClick={() => {
          addOrRemoveItem(item)
        }}
      >
        <div className="iconWrapper">
          <Icon className="icon icon--check" type="check" />
        </div>
        <div className="imageWrapper">
          <LazyLoad
            width="100%"
            height={IMAGE_HEIGHT}
            debounce={false}
            offsetVertical={500}
          >
            <ImageLoader src={item.ImageURL} duration="1s" alt="" />
          </LazyLoad>
        </div>
      </div>
    )

  const DrawerTitle = () => (
    <>
      <span style={{ color: '#8c8c8c' }}>Add Item: </span>
      <span style={{ color: '#262626' }}>
        <span>{format(selectedDay, 'DD MMMM')}</span>
        <span style={{ color: '#d9d9d9' }}> &bull; </span>
        <span style={{ color: '#13c2c2' }}>
          {formattedTitle(selectedDayPart)}
        </span>
      </span>
    </>
  )

  const addedItemsPopover = (
    <ItemsPopover>
      {newPlannedItems.length > 0
        ? newPlannedItems.map(item => (
            <li key={item.RecipeUUID}>{item.RecipeDescription}</li>
          ))
        : 'None'}
    </ItemsPopover>
  )

  const listItem = item => (
    <List.Item key={item.RecipeUUID}>
      <ItemCard
        size="small"
        loading={loading}
        cover={renderCover(item)}
        className={itemSelectedClass(item)}
      >
        <ItemTitle
          role="presentation"
          onClick={() => {
            setRecipeUUID(item.RecipeUUID)
            setRecipeVisible(true)
          }}
        >
          {item.RecipeDescription}
        </ItemTitle>
      </ItemCard>
    </List.Item>
  )

  const listHeader = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {!searchItems.length ? (
        <div>
          <Text strong>{searchItems.length}</Text> items
        </div>
      ) : (
        <div>
          <Text strong>{`${searchItems.length} / ${searchItemsTotal}`}</Text>{' '}
          {pluralize('item', searchItems.length)}
        </div>
      )}

      <Popover
        content={addedItemsPopover}
        placement="right"
        style={{ minWidth: '400px' }}
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>Items to Add</Text>
            <Button
              onClick={() => dispatch({ type: 'PLANNER_CLEAR_NEW_ITEMS' })}
              type="link"
              style={{ paddingRight: 0 }}
            >
              Clear
            </Button>
          </div>
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Badge
            count={newPlannedItems.length}
            style={{
              backgroundColor: `${
                newPlannedItems.length ? '#52c41a' : '#f5f5f5'
              }`,
            }}
          />
          <span
            style={{
              marginLeft: 8,
              color: `${newPlannedItems.length ? '#52c41a' : '#f5f5f5'}`,
            }}
          >{`${pluralize('item', newPlannedItems.length)}`}</span>
        </div>
      </Popover>
    </div>
  )

  const loadMore =
    !loading && searchItems.length < searchItemsTotal ? (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          style={{
            width: '100%',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          type="primary"
          onClick={() => handleLoadMore()}
        >
          Load more
        </Button>
      </div>
    ) : null

  return (
    <Drawer
      title={<DrawerTitle />}
      width={400}
      onClose={handleClose}
      visible={showDrawer}
      placement="left"
    >
      <Alert
        style={{ marginBottom: 16 }}
        message="Conditions"
        type="info"
        description="Show conditions here!"
      />

      <FormContainer>
        <Form hideRequiredMark layout="vertical" className="searchForm">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Day">
                {getFieldDecorator('day', {
                  initialValue: moment(day),
                  rules: [
                    { required: true, message: 'Please enter the items date' },
                  ],
                })(
                  <DatePicker
                    format="D MMMM YY"
                    disabledDate={disabledDate}
                    onChange={handleDayChange}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Day Part">
                {getFieldDecorator('part', {
                  initialValue: part ? part.toLowerCase() : '',
                  rules: [
                    { required: true, message: 'Please choose the day part' },
                  ],
                })(
                  <Select placeholder="Day Part" onChange={handleDayPartChange}>
                    {dayPartKeys &&
                      dayPartKeys.length > 0 &&
                      dayPartKeys.map(item => (
                        <Option value={item.toLowerCase()} key={item}>
                          {capitalize(item.toLowerCase())}
                        </Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Dish Type">
                {getFieldDecorator('dish', {
                  initialValue: selectedDishType
                    ? selectedDishType.toLowerCase()
                    : '',
                  rules: [
                    { required: true, message: 'Please choose the dish type' },
                  ],
                })(
                  <Select
                    placeholder="Dish Type"
                    onChange={handleDishTypeChange}
                  >
                    {dishTypeKeys &&
                      dishTypeKeys.length > 0 &&
                      dishTypeKeys.map(item => (
                        <Option value={item.toLowerCase()} key={item}>
                          {capitalizeAll(item)}
                        </Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Search">
                {getFieldDecorator('search')(
                  <Search
                    enterButton
                    allowClear
                    autoComplete="off"
                    placeholder="Search items..."
                    onSearch={event => {
                      const query = event.target
                        ? event.target.value.toLowerCase()
                        : null
                      if (query) {
                        setSearchQuery(query)
                      }
                    }}
                    onChange={event => {
                      setSearchQuery(event.target.value.toLowerCase())
                    }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormContainer>

      <ItemsList
        bordered
        style={{ marginBottom: 53 }}
        grid={{
          gutter: 16,
          column: 1,
        }}
        loading={loading}
        loadMore={loadMore}
        dataSource={searchItems}
        header={listHeader}
        renderItem={listItem}
      />

      <Footer style={{ zIndex: 1000 }}>
        <Button onClick={handleClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button
          type="primary"
          key="submit"
          loading={saving}
          disabled={!newPlannedItems.length}
          onClick={handleSubmitItems}
        >
          {`Add (${newPlannedItems.length}) ${pluralize(
            'item',
            newPlannedItems.length
          )}`}
        </Button>
      </Footer>

      <RecipeModal
        isVisible={recipeVisible}
        setVisible={handleSetRecipeVisible}
        recipeUUID={recipeUUID}
      />
    </Drawer>
  )
}

DrawerForm.propTypes = {
  menuUUID: PropTypes.string.isRequired,
  day: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  part: PropTypes.string,
  structure: PropTypes.object,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  showDrawer: PropTypes.bool,
  toggleDrawer: PropTypes.func,
  form: PropTypes.object,
}

const AddItemDrawer = Form.create()(DrawerForm)

export { AddItemDrawer }
