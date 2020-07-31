import React, { useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

import { SET_PANE_OPTIONS } from '../context/constants'
import PaneDivider from './PaneDivider'

import '../styles/Pane.scss'


const Pane = ({ dispatch, index, isLast, pulseAddButton, width, minWidth, children }) => {
  const componentRef = useRef()

  const handleCommandAdd = useCallback(() => {
    componentRef.current.scrollIntoView({
      inline: 'start',
      behavior: 'smooth'
    })
  }, [])

  const handleDragEnd = useCallback(dragDistance => {
    // actual width of this component: read from state if the width is
    // user-defined, else read from the DOM element itself
    const _width = width || componentRef.current.getBoundingClientRect().width
    dispatch({
      type: SET_PANE_OPTIONS,
      index,
      options: { width: Math.max(_width + dragDistance, minWidth) }
    })
  }, [dispatch, index, width, minWidth])

  return (
    <div
      className="io"
      ref={componentRef}
      style={width ? { width } : {}}
    >
      <PaneDivider
        dispatch={dispatch}
        index={index}
        onCommandAdd={handleCommandAdd}
        onDragEnd={handleDragEnd}
        showAddButton={isLast}
        pulseAddButton={pulseAddButton}
      />
      {children}
    </div>
  )
}

Pane.propTypes = {
  dispatch: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isLast: PropTypes.bool,
  pulseAddButton: PropTypes.bool,
  width: PropTypes.number,
  minWidth: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}

Pane.defaultProps = {
  // `null` indiciates no user-defined width
  width: null
}

export default Pane