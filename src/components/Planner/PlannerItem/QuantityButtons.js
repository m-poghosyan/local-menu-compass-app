import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from 'antd'

const QuantityWrapper = styled.div`
  height: 100%;
  width: 100%;
  color: white;

  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  border-radius: 2px 2px 0 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;

  .button {
    width: 100%;
    background: #0a0a0a7d;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.3s cubic-bezier(0.43, 0.41, 0.22, 0.91);

    &.plus {
      border-top-left-radius: ${props => props.theme.borderRadius.default};
      border-top-right-radius: ${props => props.theme.borderRadius.default};
    }

    svg {
      background: #0a0a0acf;
      border-radius: 50%;
      padding: 2px;
    }

    &:hover {
      opacity: 1;
    }

    &:active {
      opacity: 0.5;
    }
  }
`

const QuantityButtons = ({ onIncrease, onDecrease }) => (
  <QuantityWrapper>
    <Icon className="button plus" type="plus" onClick={onIncrease} />
    <Icon className="button minus" type="minus" onClick={onDecrease} />
  </QuantityWrapper>
)

QuantityButtons.propTypes = {
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
}

export { QuantityButtons }
