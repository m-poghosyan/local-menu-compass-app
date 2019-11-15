import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Skeleton, Typography } from 'antd'

import { formatDecimal } from '../../helpers/formatters'
import Rating from './Rating'
import Nutrition from './Nutrition'
import { fetchRecipeItem } from '../../store/actions/RecipesActions'

const { Text } = Typography

const IMAGE_HEIGHT = 232

const RecipeContainer = styled.div`
  width: 100%;
`

const RecipeHeader = styled.div`
  width: 100%;
  height: ${IMAGE_HEIGHT}px;
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  background-size: cover;
  background-position: 50%;
  background-repeat: none;
  border-radius: ${props => props.theme.borderRadius.default};
  /* transition: all 0.3s ease-in-out; */

  .headerContent {
    padding: ${props => props.theme.padding.md};
  }
`

const NutrionInfo = styled.div`
  height: 100%;
  background: white;
  border-radius: ${props => props.theme.borderRadius.default};
  box-shadow: ${props => props.theme.boxShadow.lg};
  opacity: 0.95;
`

const MetaTags = styled.div`
  position: absolute;
  top: ${IMAGE_HEIGHT - 20}px;
  left: 16px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  opacity: 0.9;
  transition: all 0.5s ease-in;

  .tag {
    height: 20px;
    color: white;
    background: ${props => props.theme.color.gray};
    padding: 2px 6px;
    margin-right: 0.25rem;
    border-radius: 2px 2px 0 0;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    z-index: 10;

    &.isOrphan {
      background: ${props => props.theme.color.reds[5]};
    }

    &.isOrganic {
      background: ${props => props.theme.color.greens[6]};
    }
  }
`

const RecipeContent = styled.div`
  width: 100%;
  position: relative;
`

const RecipeMeta = styled.div`
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-flow: col wrap;
  justify-content: space-between;
  align-content: center;

  h2 {
    margin: 0;
  }
`

const RecipeBody = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-content: center;

  h3 {
    margin-bottom: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid ${props => props.theme.color.grays[3]};
  }
`

const RecipeBodyCol = styled.div`
  min-width: 200px;
  flex: 1;

  &:first-child {
    margin-right: 64px;
  }
`

const Ingredients = styled.ul`
  margin-top: 1rem;
  padding: 0;
  text-transform: capitalize;

  li {
    display: flex;
    margin: 0 0 0.5rem 0.25rem;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    text-transform: capitalize;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      margin-right: 8px;
      font-size: ${props => props.theme.fontSize.md};
      text-align: center;
      background: ${props => props.theme.color.primary};
      border-radius: ${props => props.theme.borderRadius.full};
      /* border: 2px solid ${props => props.theme.color.grays[4]}; */
    }

    .unit {
      margin-right: 0.25rem;
      text-transform: lowercase;
    }
  }
`

const Instructions = styled.ol`
  margin-top: 1rem;
  padding: 0;
  list-style: none;
  text-transform: capitalize;

  .list {
    display: list-item;
  }

  /* li {
    counter-increment: inst;
    display: flex;
    margin: 0 0 0.5rem 0;
    line-height: 1.75;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    text-transform: capitalize;

    &::before {
      content: counter(inst);
      width: 1.75rem;
      height: 1.75rem;
      margin-right: 8px;
      font-size: ${props => props.theme.fontSize.md};
      text-align: center;
      color: ${props => props.theme.color.black};
      border: 2px solid ${props => props.theme.color.grays[4]};
      border-radius: ${props => props.theme.borderRadius.full};
    }

    &:hover {
      &::before {
        color: ${props => props.theme.color.blues[5]};
        border: 2px solid ${props => props.theme.color.blues[2]};
      }
    }
  } */
`

function Recipe({ recipeUUID }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchRecipeItem(recipeUUID))
  }, [dispatch, recipeUUID])

  const recipe = useSelector(state =>
    state.Recipes.items.find(r => r.RecipeUUID === recipeUUID)
  )

  // const parseInstructions = () => {
  //   if (recipe) {
  //     if (recipe.to_RecipeInstructions) {
  //       if (recipe.to_RecipeInstructions.results) {
  //         if (recipe.to_RecipeInstructions.results.length) {
  //           const instructions =
  //             recipe.to_RecipeInstructions.results[0].Instructions
  //           return instructions
  //             .split('</div>')
  //             .map(s => s.replace(/(<([^>]+)>)/gi, ''))
  //             .map((item, index) => ({ step: index, text: item }))
  //             .filter(i => i.text.length)
  //         }
  //       }
  //     }
  //   }
  // }

  return (
    <RecipeContainer>
      {recipe ? (
        <>
          <RecipeHeader style={{ backgroundImage: `url(${recipe.ImageURL})` }}>
            <div className="headerContent">
              <MetaTags>
                {recipe.IsOrphan && <div className="tag isOrphan">Orphan</div>}
                {recipe.IsOrganic && (
                  <div className="tag isOrganic">Organic</div>
                )}
              </MetaTags>

              <NutrionInfo>
                <Nutrition recipe={recipe} />
              </NutrionInfo>
            </div>
          </RecipeHeader>

          <RecipeContent>
            <RecipeMeta>
              <h2>{recipe.Description}</h2>
              <Rating rating={recipe.StarRating} />
            </RecipeMeta>

            <RecipeBody>
              <RecipeBodyCol>
                <h3>Ingredients</h3>
                <Ingredients>
                  {recipe.to_Ingredients.results.map((item, idx) => (
                    <li key={`${item.RcpFmlaItemUUID}-${idx}`}>
                      <Text strong>
                        {formatDecimal(item.RcpFmlaItemQuantity, 0)}
                      </Text>
                      <Text type="secondary" className="unit">
                        {item.RcpFmlaItemUnit === 'PC'
                          ? '×'
                          : item.RcpFmlaItemUnit}
                      </Text>
                      <Text>{item.IngredientDescription.toLowerCase()}</Text>
                    </li>
                  ))}
                </Ingredients>
              </RecipeBodyCol>

              <RecipeBodyCol>
                <h3>Instructions</h3>
                <Instructions>
                  <div
                    className="list"
                    // eslint-disable-next-line
                    dangerouslySetInnerHTML={{
                      __html:
                        recipe.to_RecipeInstructions.results[0].Instructions,
                    }}
                  />
                </Instructions>
              </RecipeBodyCol>
            </RecipeBody>
          </RecipeContent>
        </>
      ) : (
        <Skeleton />
      )}
    </RecipeContainer>
  )
}

Recipe.propTypes = {
  recipeUUID: PropTypes.string,
}

export default Recipe
