import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Layout } from 'antd'

const { Header } = Layout

const StyledHeader = styled(Header)`
  width: 100%;
  position: static;
  display: flex;
  background: #001529;
  margin-right: 24px;
  padding: 0 !important;
`

const StyledMenu = styled(Menu)`
  width: 100%;
  position: relative;
  line-height: 64px !important;

  &:before {
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(
        to left,
        rgba(255, 255, 255, 0) 25%,
        #001529
      ),
      url('/images/bg.jpeg') !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-blend-mode: normal;
    opacity: 0.4;
  }
`

const LogoWrapper = styled.div`
  width: 320px;
  height: 64px;
  background: #001529;
  margin: 0 82px 0 24px;
  line-height: 64px;
  transition: all 0.3s;

  .image {
    height: 28px;
    vertical-align: middle;
  }

  .text {
    display: inline-block;
    margin: 0 0 0 16px;
    color: #e9eff5;
    font-weight: 600;
    font-size: 22px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    vertical-align: middle;
  }
`

const Logo = ({ text }) => (
  <LogoWrapper>
    <Link to="/">
      <img className="image" src="/images/logo.svg" alt="Matrix Project" />
      <h1 className="text">{text}</h1>
    </Link>
  </LogoWrapper>
)

Logo.propTypes = {
  text: PropTypes.string,
}

const TopMenu = withRouter(({ title, location }) => (
  <StyledHeader>
    <Logo alt="Logo" text={title || 'Matrix Project'} />
    <StyledMenu
      className="menu"
      mode="horizontal"
      theme="dark"
      selectedKeys={[location.pathname]}
    >
      <Menu.Item key="/">
        <Link to="/">Menus</Link>
      </Menu.Item>

      <Menu.Item key="/recipes">
        <Link to="/recipes">Recipes</Link>
      </Menu.Item>
    </StyledMenu>
  </StyledHeader>
))

TopMenu.propTypes = {
  location: PropTypes.object,
}

export default TopMenu
