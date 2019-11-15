import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Progress } from 'antd'

const NutritionContainer = styled.div`
  height: 100%;
  width: 300px;
  padding: ${props => props.theme.padding.md};
  display: flex;
  flex-flow: column nowrap;

  .energy {
    width: 100%;
    color: ${props => props.theme.color.gray};
    font-size: ${props => props.theme.fontSize.lg};
    font-weight: 200;
    margin-top: 1rem;
    line-height: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    &__quantity {
      color: ${props => props.theme.color.green};
      font-size: ${props => props.theme.fontSize.xxl};
      text-align: center;
      align-items: center;
    }

    &__unit {
      margin-left: 0.25rem;
      color: ${props => props.theme.color.grays[7]};
      font-size: ${props => props.theme.fontSize.xl};
      text-transform: capitalize;
      align-self: flex-end;
    }
  }
`

const Title = styled.div`
  width: 100%;
  margin-bottom: 0.25rem;
  font-size: ${props => props.theme.fontSize.lg};
  text-align: center;

  span {
    color: ${props => props.theme.color.gray};
  }
`

const Nutrition = ({ recipe }) => {
  const energy = recipe.to_NutritionalInformation.results.find(
    i => i.ComponentSpecification === 'ENERGY'
  )

  return (
    <NutritionContainer>
      <Title>
        Macros <span>(per serving)</span>
      </Title>
      <Progress percent={50} showInfo={false} strokeColor="#ffc53d" />
      <Progress percent={70} showInfo={false} strokeColor="#ff4d4f" />
      <Progress percent={100} showInfo={false} strokeColor="#40a9ff" />
      <div className="energy">
        <div className="energy__quantity">
          {Number.parseFloat(energy.Quantity).toFixed(1)}
        </div>
        <div>
          <span className="energy__unit">{energy.Unit.toLowerCase()}</span>
          <span> (per serving)</span>
        </div>
      </div>
    </NutritionContainer>
  )
}

Nutrition.propTypes = {
  recipe: PropTypes.object.isRequired,
}

export default Nutrition
