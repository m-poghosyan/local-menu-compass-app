import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { darken } from 'polished'
import { Icon, Tooltip } from 'antd'

function StatusIcon({ day, dayPart }) {
  const [isValid, setIsValid] = useState(false)

  const color = {
    valid: '#52c41a',
    invalid: '#ff4d4f',
  }

  const StyledIcon = styled(Icon)`
    margin-top: 2px;
    font-size: 18px !important;
    color: ${isValid ? color.valid : color.invalid} !important;

    &:hover {
      color: ${isValid
        ? darken(0.1, color.valid)
        : darken(0.1, color.invalid)} !important;
    }
  `

  return (
    <Tooltip
      placement="top"
      title={`${new Date(day).getDate()} - ${dayPart} Info`}
    >
      <StyledIcon
        type="check-circle"
        onClick={event => {
          event.stopPropagation()
          console.log(`Check Status: ${isValid}`)
        }}
      />
    </Tooltip>
  )
}

StatusIcon.propTypes = {
  day: PropTypes.number.isRequired,
  dayPart: PropTypes.string.isRequired,
}

export default StatusIcon
