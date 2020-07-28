import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

import PaneDivider from './PaneDivider'

import '../styles/IOWrapper.scss'


const IOWrapper = ({ dispatch, index, minWidth, children }) => {
  const componentRef = useRef()
  // `null` indiciates no user-defined width
  const [width, setWidth] = useState(null)

  const handleDragEnd = useCallback(dragDistance => {
    // actual width of this component: read from state if the width is
    // user-defined, else read from the DOM element itself
    const _width = width || componentRef.current.getBoundingClientRect().width
    setWidth(Math.max(_width + dragDistance, minWidth))
  }, [componentRef.current, minWidth])

  return (
    <div
      className="io"
      ref={componentRef}
      style={width ? { width } : {}}
    >
      <PaneDivider
        dispatch={dispatch}
        index={index}
        onDragEnd={handleDragEnd}
      />
      {children}
    </div>
  )
}

IOWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}

export default IOWrapper