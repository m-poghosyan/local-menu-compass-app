import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'

import Recipe from './Recipe'

function RecipeModal({ isVisible, setVisible, recipeUUID }) {
  return (
    <Modal
      centered
      width="75%"
      style={{ maxWidth: 1000 }}
      title="Recipe Information"
      visible={isVisible}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <Recipe recipeUUID={recipeUUID} />
    </Modal>
  )
}

RecipeModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  recipeUUID: PropTypes.string,
}

export default RecipeModal
