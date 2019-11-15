import React from 'react'
import { Icon, Dropdown } from 'antd'
import ContextMenu from './ContextMenu'

const Actions = ({ onEdit, onDelete, onDuplicate }) => [
  <Dropdown
    key="dropdown"
    overlay={ContextMenu({ onEdit, onDelete, onDuplicate })}
    trigger={['hover', 'click']}
  >
    <Icon type="more" />
  </Dropdown>,
]
export default Actions
