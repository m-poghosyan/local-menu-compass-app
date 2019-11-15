import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import pluralize from 'pluralize'
import { Button, DatePicker, Input, Popconfirm, Table, Tooltip } from 'antd'

import { MenuBar } from '../../components/MenuBar'
import { CreateMenuFormModal } from '../../components/Menus/CreateMenuFormModal'
import { capitalize } from '../../utils/strings'
import { dateRange } from '../../helpers/formatters'
// import { DATE_FORMAT } from '../../constants'
import * as menusActions from '../../store/actions/MenusActions'
import * as conceptsActions from '../../store/actions/ConceptsActions'
import * as conditionsActions from '../../store/actions/ConditionsActions'

const { Search } = Input
const { RangePicker } = DatePicker

function searchItem(item, prop, query) {
  return (
    item[prop] &&
    String(item[prop])
      .toLowerCase()
      .indexOf(query) > -1
  )
}

const Menus = ({
  actions,
  loading,
  headerExtra,
  menuItems,
  conceptItems,
  centralMenuItems,
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sorted, setSorted] = useState({})

  useEffect(() => {
    actions.fetchMenus()
    actions.fetchCentralMenus()
    actions.fetchConcepts(['MEN', 'MEC'])
    actions.fetchConditions()
  }, [actions])

  const handleTableChange = (_pagination, _filters, sorter) => {
    setSorted(sorter)
  }

  const handleRangePickerChange = value => {
    const dateFrom = new Date(value[0])
    const dateTo = new Date(value[1])
    console.log(dateFrom, dateTo)
  }

  const handleRowDelete = id => {
    actions.deleteMenu(id)
  }

  const handleCreateMenu = (menuType, data) => {
    if (menuType === 'MEN') {
      actions.createMenuMEN(data)
    } else if (menuType === 'MEC') {
      actions.createMenuMEC(data)
    }
    setIsFormVisible(false)
  }

  const handleSetVisible = isVisible => setIsFormVisible(isVisible)

  // Set Page Header Items
  headerExtra(() => <div />)

  const filterItems = useCallback(
    () =>
      menuItems.filter(
        menu =>
          searchItem(menu, ['Description'], searchQuery) ||
          searchItem(menu, ['Concept'], searchQuery)
      ),
    [menuItems, searchQuery]
  )

  // Filter the menuItems against the search query
  const filteredMenuItems = filterItems()

  const columns = [
    {
      title: 'Menu Description',
      dataIndex: 'Description',
      key: 'description',
      sorter: (a, b) => a.Description.length - b.Description.length,
      sortOrder: sorted.columnKey === 'description' && sorted.order,
      render: (text, record) => {
        const description = text.length ? text : 'Menu'
        return (
          <Link to={`/planner/${record.UUID}`}>{capitalize(description)}</Link>
        )
      },
    },
    {
      title: 'Menu ID',
      dataIndex: 'MenuID',
      key: 'menuid',
      align: 'right',
      sorter: (a, b) => Number(a.MenuID) - Number(b.MenuID),
      sortOrder: sorted.columnKey === 'menuid' && sorted.order,
    },
    {
      title: 'Concept',
      dataIndex: 'Concept',
      key: 'concept',
      sorter: (a, b) => a.Concept.length - b.Concept.length,
      sortOrder: sorted.columnKey === 'concept' && sorted.order,
    },
    // {
    //   title: 'Menu Type',
    //   dataIndex: 'MenuType',
    //   key: 'menutype',
    //   align: 'center',
    //   width: 130,
    //   sorter: (a, b) => a.MenuType.length - b.MenuType.length,
    //   sortOrder: sorted.columnKey === 'menutype' && sorted.order,
    //   render: type => {
    //     let color

    //     switch (type) {
    //       case 'MEN':
    //         color = 'blue'
    //         break
    //       case 'MEC':
    //         color = 'blue'
    //         break
    //       default:
    //         color = 'gray'
    //         break
    //     }

    //     return <Tag color={color}>{type.toUpperCase()}</Tag>
    //   },
    // },
    {
      title: 'Date Range',
      key: 'dateRange',
      render: (_text, record) => {
        const { DateFrom, DateTo } = record
        return <span>{dateRange(DateFrom, DateTo, true, 'Do MMM')}</span>
      },
    },
    {
      title: 'Created On',
      dataIndex: 'CreatedOn',
      key: 'created',
    },
    {
      title: 'Actions',
      align: 'center',
      width: 125,
      render: (_text, record) =>
        filteredMenuItems.length >= 1 ? (
          <Tooltip placement="left" title="Delete Item">
            <Popconfirm
              title="Confirm delete?"
              onConfirm={() => handleRowDelete(record.UUID)}
            >
              <Button ghost type="danger" icon="delete" />
            </Popconfirm>
          </Tooltip>
        ) : null,
    },
  ]

  return (
    <div>
      <MenuBar
        leftItems={() => (
          <Search
            enterButton
            allowClear
            disabled={loading}
            style={{ width: 400 }}
            placeholder="Search menus..."
            onChange={event => setSearchQuery(event.target.value.toLowerCase())}
          />
        )}
        rightItems={() => (
          <>
            <RangePicker
              // format={DATE_FORMAT}
              disabled={loading}
              onChange={handleRangePickerChange}
            />
            <Button
              type="primary"
              icon="plus"
              disabled={loading}
              onClick={() => setIsFormVisible(true)}
            >
              Add Menu
            </Button>
          </>
        )}
      />

      <Table
        bordered
        size="middle"
        rowKey={record => record.UUID}
        columns={columns}
        dataSource={filteredMenuItems}
        onChange={handleTableChange}
        pagination={false}
        loading={loading}
        footer={() => (
          <span>
            <strong>{menuItems.length}</strong>{' '}
            {pluralize('menu', menuItems.length)}
          </span>
        )}
      />
      <CreateMenuFormModal
        loading={loading}
        isVisible={isFormVisible}
        setVisible={handleSetVisible}
        conceptItems={conceptItems}
        centralMenuItems={centralMenuItems}
        createMenu={handleCreateMenu}
      />
    </div>
  )
}

Menus.propTypes = {
  actions: PropTypes.object,
  headerExtra: PropTypes.func,
  loading: PropTypes.bool,
  menuItems: PropTypes.array,
  centralMenuItems: PropTypes.array,
  conceptItems: PropTypes.array,
}

const mapStateToProps = state => ({
  loading: state.Menus.loading,
  menuItems: state.Menus.items,
  centralMenuItems: state.Menus.central,
  conceptItems: state.Concepts.items,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...menusActions, ...conceptsActions, ...conditionsActions },
    dispatch
  ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menus)
