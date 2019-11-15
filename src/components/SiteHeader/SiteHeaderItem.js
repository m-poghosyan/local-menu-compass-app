import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Dropdown, Icon } from 'antd'

const Wrapper = styled.div`
  height: 100%;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
`

const InnerItem = styled.div`
  height: 100%;
  width: 100%;

  * > {
    vertical-align: center;
  }
`

const SiteHeaderItem = ({ icon, dropdown, placement }) => (
  <Wrapper>
    {dropdown ? (
      <Dropdown overlay={dropdown} placement={placement}>
        <InnerItem>
          <Icon type={icon} />
        </InnerItem>
      </Dropdown>
    ) : (
      <Icon type={icon} />
    )}
  </Wrapper>
)

SiteHeaderItem.propTypes = {
  icon: PropTypes.string,
  dropdown: PropTypes.any,
  placement: PropTypes.string,
}

export { SiteHeaderItem }
