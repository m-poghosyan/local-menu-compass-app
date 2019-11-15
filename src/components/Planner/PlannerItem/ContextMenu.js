import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Menu } from 'antd'

const ContextMenu = ({ onEdit, onDelete, onDuplicate }) => (
  <Menu>
    <Menu.Item key="edit" onClick={onEdit} style={{ color: '#1890ff' }}>
      <Icon type="edit" />
      Edit
    </Menu.Item>
    <Menu.Divider />

    <Menu.Item key="duplicate" onClick={onDuplicate} disabled>
      <Icon type="copy" />
      Duplicate
    </Menu.Item>

    <Menu.Item key="delete" onClick={onDelete} style={{ color: 'red' }}>
      <Icon type="delete" />
      Delete
    </Menu.Item>
  </Menu>
)

ContextMenu.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
}

export default ContextMenu
