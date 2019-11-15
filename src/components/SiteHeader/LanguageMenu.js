import React from 'react'
import { Menu } from 'antd'
import { SiteHeaderItem } from './SiteHeaderItem'

const menu = (
  <Menu>
    <Menu.Item>English</Menu.Item>
    <Menu.Item>French</Menu.Item>
    <Menu.Item>Portuguese</Menu.Item>
  </Menu>
)

const LanguageMenu = () => (
  <SiteHeaderItem icon="global" dropdown={menu} placement="bottomRight" />
)

export { LanguageMenu }
