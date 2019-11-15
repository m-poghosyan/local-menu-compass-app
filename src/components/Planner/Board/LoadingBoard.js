import React from 'react'
import styled from 'styled-components'
import { Spin } from 'antd'

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 250px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.padding.xl};
  border-radius: ${props => props.theme.borderRadius.default};
  border: 1px dashed ${props => props.theme.color.grays[5]};
`

function LoadingBoard() {
  return (
    <Container>
      <Spin size="large" />
    </Container>
  )
}

export default LoadingBoard
