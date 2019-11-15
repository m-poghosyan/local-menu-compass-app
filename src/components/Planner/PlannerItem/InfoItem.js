import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Tooltip } from 'antd'

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  .label {
    color: #a9a9a9;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
  }

  .value {
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    color: 'inherit';

    ${props =>
      props.positive &&
      css`
        color: ${props.theme.color.success};
      `}

    ${props =>
      props.negative &&
      css`
        color: ${props.theme.color.danger};
      `}
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .content {
    display: flex;
    justify-content: center;

    .unit {
      margin-left: 1px;
      margin-top: 5px;
      color: #a9a9a9;
      font-size: 11px;
      font-weight: 600;
    }
  }
`

const InfoItem = ({
  label,
  title,
  unit,
  positive,
  negative,
  showTooltip,
  children,
}) => {
  const content = (
    <div className="content-wrapper">
      <div className="content">
        <div className="value">{children}</div>
        {unit && <div className="unit">{unit}</div>}
      </div>
      <div className="label">{label}</div>
    </div>
  )

  return (
    <InfoWrapper positive={positive} negative={negative}>
      {showTooltip ? (
        <Tooltip placement="bottom" title={title}>
          {content}
        </Tooltip>
      ) : (
        content
      )}
    </InfoWrapper>
  )
}

InfoItem.propTypes = {
  label: PropTypes.string,
  unit: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  title: PropTypes.string,
  positive: PropTypes.bool,
  negative: PropTypes.bool,
  showTooltip: PropTypes.bool,
  children: PropTypes.node,
}

InfoItem.defaultProps = {
  showTooltip: false,
}

export { InfoItem }
