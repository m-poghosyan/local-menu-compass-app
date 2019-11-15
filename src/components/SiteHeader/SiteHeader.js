import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Layout, Typography } from 'antd'
import { SiteHeaderItem } from './SiteHeaderItem'
import { LanguageMenu } from './LanguageMenu'

const { Header } = Layout
const { Title } = Typography

const MenuLeft = styled.div``

const MenuRight = styled.div`
  display: flex;
`

const TopMenu = ({ children }) => (
  <Header
    style={{
      background: '#fff',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {children}
  </Header>
)

TopMenu.propTypes = {
  children: PropTypes.any,
}

const SiteHeader = () => (
  <TopMenu>
    <MenuLeft style={{ paddingLeft: '1.5rem' }}>
      <Title level={4}>Title</Title>
    </MenuLeft>
    <MenuRight>
      <SiteHeaderItem icon="question-circle" />
      <SiteHeaderItem icon="bell" />
      <LanguageMenu />
    </MenuRight>
  </TopMenu>
)

export { SiteHeader }
