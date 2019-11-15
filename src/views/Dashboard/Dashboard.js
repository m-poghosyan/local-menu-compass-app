import React, { useState, useEffect } from 'react'
// import { connect } from 'react-redux'
import styled from 'styled-components'
import { Checkbox, message } from 'antd'
import uuid from 'uuid/v4'
import { PlannerItem } from '../../components/Planner/PlannerItem'

// import { loadAction } from '../../store/actions/MenusActions'

const recipeData = [
  {
    id: uuid(),
    title: 'Avocado Chicken Salad with Raisins',
    isOrphan: true,
    isOrganic: true,
    image:
      'http://images.honestcooking.com/wp-content/uploads/2012/01/CranberryAvocadoSalad+1.jpg',
    recipeUrl: 'https://www.google.com',
    quantity: 1,
    revenue: 3.3,
    cost: 7.2,
    grossProfit: 7.8,
  },
  {
    id: uuid(),
    title: 'Tasty Lasagna',
    isOrphan: true,
    image: '',
    recipeUrl: 'https://www.google.com',
    quantity: 3,
    revenue: 1.2,
    cost: 3.6,
    grossProfit: -2.5,
  },
  {
    id: uuid(),
    title: 'Roasted new carrots',
    isOrganic: true,
    isFrozen: true,
    image:
      'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2019/04/roasted-new-carrots-cauliflower-grains-carrot-top-dressing.jpg',
    recipeUrl: 'https://www.google.com',
    quantity: 3,
    revenue: 0.5,
    cost: 2.3,
    grossProfit: 4.3,
  },
]

const RecipeList = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    margin-bottom: 1rem !important;
  }
`

const Dashboard = () => {
  const [recipes, setRecipes] = useState(recipeData)
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setloading(false)
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [loading])

  const [showImages, setShowImages] = useState(true)

  const deleteItem = itemId => {
    const newRecipes = recipes.filter(item => item.id !== itemId)
    setRecipes(newRecipes)
  }

  const duplicateItem = itemId => {
    const sourceItem = recipes.find(item => item.id === itemId)
    const newItem = { ...sourceItem, id: uuid() }
    setRecipes([...recipes, newItem])
  }

  const handleOnDelete = itemId => {
    deleteItem(itemId)
    message.success('Item deleted')
  }

  const handleOnDuplicate = itemId => {
    duplicateItem(itemId)
  }

  const quantityChange = (itemId, value) => {
    const itemToUpdate = recipes.find(item => item.id === itemId)
    console.log(itemToUpdate, value)
    if (value < 1) {
      itemToUpdate.quantity = 1
    } else {
      itemToUpdate.quantity = value
    }
    setRecipes([...recipes])
  }

  const handleOnQuantityIncrease = itemId => {
    const sourceItem = recipes.find(item => item.id === itemId)
    const currentQuantity = sourceItem.quantity
    quantityChange(itemId, currentQuantity + 1)
  }

  const handleOnQuantityDecrease = itemId => {
    const sourceItem = recipes.find(item => item.id === itemId)
    const currentQuantity = sourceItem.quantity
    quantityChange(itemId, currentQuantity - 1)
  }

  const plannerItems = recipes.map((item, index) => (
    <PlannerItem
      key={index}
      isOrphan={item.isOrphan}
      isFrozen={item.isFrozen}
      isOrganic={item.isOrganic}
      loading={loading}
      title={item.title}
      image={item.image}
      recipeUrl={item.recipeUrl}
      quantity={item.quantity}
      revenue={item.revenue}
      cost={item.cost}
      grossProfit={item.grossProfit}
      showImage={showImages}
      onDeleteClick={() => handleOnDelete(item.id)}
      onDuplicateClick={() => handleOnDuplicate(item.id)}
      onQuantityIncrease={() => handleOnQuantityIncrease(item.id)}
      onQuantityDecrease={() => handleOnQuantityDecrease(item.id)}
    />
  ))

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Checkbox
          checked={loading}
          onChange={() => {
            setloading(!loading)
          }}
          style={{ marginLeft: '1rem' }}
        >
          Loading
        </Checkbox>
        <Checkbox
          checked={showImages}
          onChange={() => {
            setShowImages(!showImages)
          }}
          style={{ marginLeft: '1rem' }}
        >
          Show Images
        </Checkbox>
      </div>
      <RecipeList>{plannerItems}</RecipeList>
    </div>
  )
}

// const mapStateToProps = state => ({
//   data: state.appModule.data,
// })

// const mapDispatchToProps = {
//   loadAction,
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Dashboard)

export default Dashboard
