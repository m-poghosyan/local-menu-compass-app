import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from 'antd'

const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  line-height: 1.25;

  .rating {
    margin-right: 0.5rem;

    &__current {
      font-size: ${props => props.theme.fontSize.xxl};
      font-weight: bold;
    }

    &__max {
      font-size: ${props => props.theme.fontSize.base};
    }
  }

  i {
    font-size: 2rem;
    color: ${props => props.theme.color.gold};
    cursor: pointer;
    transition: all 0.4s ease-in-out;

    &:hover {
      color: ${props => props.theme.color.orange};
    }
  }
`

const Rating = ({ rating, maxRating }) => (
  <RatingContainer>
    <div className="rating">
      <span className="rating__current">{rating}</span>
      <span className="rating__max">/{maxRating}</span>
    </div>
    <Icon type="star" theme="filled" />
  </RatingContainer>
)

Rating.propTypes = {
  rating: PropTypes.string.isRequired,
  maxRating: PropTypes.number,
}

Rating.defaultProps = {
  maxRating: 5,
}

export default Rating
