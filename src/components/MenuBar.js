import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Bar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 12px;

  .item {
    width: 100%;
    display: flex;
    align-items: center;

    & > *:not(:first-child) {
      margin-left: 8px;
    }
  }

  .left {
    justify-content: flex-start;
  }

  .central {
    justify-content: center;
  }

  .right {
    justify-content: flex-end;
  }
`
const MenuBar = ({ leftItems, centralItems, rightItems }) => (
  <Bar>
    {leftItems ? (
      <div className="item left">{leftItems()}</div>
    ) : (
      <div className="item left" />
    )}
    {centralItems ? (
      <div className="item central">{centralItems()}</div>
    ) : (
      <div className="item central" />
    )}
    {rightItems ? (
      <div className="item right">{rightItems()}</div>
    ) : (
      <div className="item right" />
    )}
  </Bar>
)

MenuBar.propTypes = {
  leftItems: PropTypes.func,
  centralItems: PropTypes.func,
  rightItems: PropTypes.func,
}

export { MenuBar }
