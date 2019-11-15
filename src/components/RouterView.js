import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import routes from '../routes'

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return React.createElement(component, finalProps)
}

export const RouterView = ({ name, ...rest }) =>
  routes.map(route => (
    <Route
      {...rest}
      key={route.path}
      path={route.path}
      exact={route.exact}
      render={routeProps => renderMergedProps(route[name], routeProps, rest)}
    />
  ))

RouterView.propTypes = {
  name: PropTypes.string.isRequired,
}
