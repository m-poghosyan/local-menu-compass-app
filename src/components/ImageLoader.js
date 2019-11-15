import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Image = styled.img`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  &.${props => props.loadingClassName} {
    width: 100%;
    height: auto;
    opacity: 0;
  }

  &.${props => props.loadedClassName} {
    position: relative;
    opacity: 0;
    animation: fadeIn cubic-bezier(0.23, 1, 0.32, 1) 1;
    animation-fill-mode: forwards;
    animation-duration: ${props => (props.duration ? props.duration : '0.5s')};
    animation-delay: 0.1s;
  }
`

const _loaded = {}

function ImageLoader({
  src,
  alt,
  className,
  loadingClassName,
  loadedClassName,
  duration,
  loadedCallback,
}) {
  const [loaded, setLoaded] = useState(_loaded[src])

  const onLoad = () => {
    _loaded[src] = true
    setLoaded(true)
    if (loadedCallback) loadedCallback()
  }

  const cssClass = `${className} ${loaded ? loadedClassName : loadingClassName}`

  return (
    <Image
      src={src}
      className={cssClass}
      onLoad={onLoad}
      alt={alt}
      loadingClassName={loadingClassName}
      loadedClassName={loadedClassName}
      duration={duration}
    />
  )
}

ImageLoader.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  loadingClassName: PropTypes.string,
  loadedClassName: PropTypes.string,
  duration: PropTypes.string,
  loadedCallback: PropTypes.func,
}

ImageLoader.defaultProps = {
  className: '',
  loadingClassName: 'img-loading',
  loadedClassName: 'img-loaded',
}

export { ImageLoader }
