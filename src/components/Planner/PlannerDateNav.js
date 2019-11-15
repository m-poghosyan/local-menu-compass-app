import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Button } from 'antd'
import addDays from 'date-fns/add_days'
import subDays from 'date-fns/sub_days'
import isWithinRange from 'date-fns/is_within_range'

const ButtonGroup = Button.Group

const DateNav = styled.div`
  display: flex;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: 12px;
  }
`

const DateRange = styled.div`
  min-width: 232px;
  font-size: 1.1rem;
  font-weight: 400;
  user-select: none;
  text-align: left;

  span {
    color: #ccc;
    font-weight: 400;
    margin: 0 8px;
  }

  em {
    font-weight: 600;
    margin-right: 4px;
  }

  .placeholder {
    color: ${props => props.theme.color.gray};
  }
`

const Nav = styled.nav``

function PlannerDateNav({
  loading,
  planStartDate,
  planEndDate,
  currentDate,
  daysToShow,
  prevDate,
  nextDate,
}) {
  const currentEndDate = addDays(currentDate, daysToShow - 1)

  const hasPrevDate = () => {
    const delta = daysToShow > 1 ? daysToShow - 1 : 1
    return isWithinRange(
      subDays(currentDate, delta),
      planStartDate,
      planEndDate
    )
  }

  const hasNextDate = () => {
    const delta = daysToShow > 1 ? daysToShow - 1 : 1
    return isWithinRange(
      addDays(currentDate, delta),
      planStartDate,
      planEndDate
    )
  }

  const buttonType = 'primary'

  return (
    <DateNav>
      <Nav>
        <ButtonGroup>
          <Button
            type={buttonType}
            icon="left"
            onClick={prevDate}
            disabled={!hasPrevDate()}
          />
          <Button
            icon="right"
            type={buttonType}
            onClick={nextDate}
            disabled={!hasNextDate()}
          />
        </ButtonGroup>
      </Nav>
      {!loading ? (
        <DateRange style={{ margin: 0 }}>
          {daysToShow > 1 ? (
            <div>
              <em>{format(currentDate, 'DD')}</em>
              {format(currentDate, 'MMMM YY')}
              <span>~</span>
              <em>{format(currentEndDate, 'DD')}</em>
              {format(currentEndDate, 'MMMM YY')}
            </div>
          ) : (
            <div> {format(currentDate, 'DD MMMM YY')}</div>
          )}
        </DateRange>
      ) : (
        <DateRange>
          <div className="placeholder">...</div>
        </DateRange>
      )}
    </DateNav>
  )
}

PlannerDateNav.propTypes = {
  loading: PropTypes.bool,
  planStartDate: PropTypes.object,
  planEndDate: PropTypes.object,
  currentDate: PropTypes.object,
  daysToShow: PropTypes.number,
  prevDate: PropTypes.func,
  nextDate: PropTypes.func,
}

export { PlannerDateNav }
