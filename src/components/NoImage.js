import React from 'react'
import styled from 'styled-components'
import { Icon } from 'antd'

const Empty = styled.div`
  min-height: 125px;
  background: ${props => props.theme.color.background};
  padding: 10px 0;
  color: ${props => props.theme.color.disabled};
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    margin-left: 0.5rem;
  }
`

const NoImage = () => (
  <Empty>
    <Icon type="file-image" />
    <span>No Image</span>
  </Empty>
)

export { NoImage }
