import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from 'antd'

const AddButton = styled.div`
  width: 100%;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: ${props => props.theme.borderRadius.default};
  border: 1px dashed ${props => props.theme.color.gray};
  background: ${props => props.theme.color.grays[1]};
  color: ${props => props.theme.color.grays[7]};
  padding: ${props => props.theme.padding.sm};
  transition: color 0.3s ease-in-out, border 0.3s ease-in-out,
    background 0.5s ease-in-out;

  &:hover {
    background: ${props => props.theme.color.blues[1]};
    color: ${props => props.theme.color.blues[7]};
    border-color: ${props => props.theme.color.blues[7]};
    cursor: pointer;

    svg {
      color: ${props => props.theme.color.blues[7]};
    }
  }

  & > :not(:first-child) {
    margin-left: 0.25rem;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    height: 1.5em !important;
    width: 1.5em !important;
    margin-right: 0.5rem;
  }
`

function AddItemButton({ text, icon, onClick, children }) {
  return (
    <AddButton onClick={onClick} role="button">
      <span>
        <Icon type={icon} />
        {text}
      </span>
      <span>{children}</span>
    </AddButton>
  )
}

AddItemButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

AddItemButton.defaultProps = {
  text: 'Add Item',
  icon: 'plus',
}

export default AddItemButton
