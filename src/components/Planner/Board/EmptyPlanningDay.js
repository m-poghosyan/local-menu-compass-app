import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from 'antd'

const NoPlanning = styled.div`
  width: 100%;
  height: 100%;
  min-height: 150px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.fontSize.xl};
  text-align: center;
  color: ${props => props.theme.color.disabled};

  svg {
    height: 1.5em !important;
    width: 1.5em !important;
  }
`

const EmptyPlanningDay = ({ text }) => (
  <NoPlanning>
    <div className="content">
      <Icon type="schedule" />
      <p>{text}</p>
    </div>
  </NoPlanning>
)

EmptyPlanningDay.propTypes = {
  text: PropTypes.string,
}

EmptyPlanningDay.defaultProps = {
  text: 'Nada',
}

export default EmptyPlanningDay
