import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

import { INSERT_OPERATION } from '../context/constants'

import '../styles/PaneDivider.scss'


const PaneDivider = ({ dispatch, index, showAddButton, onCommandAdd, onDragEnd }) => {
  const [dragDistance, setDragDistance] = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragStartX = useRef()

  const handleMouseMove = useCallback((ev) => {
    setDragDistance(ev.pageX - dragStartX.current)
  }, [])

  const handleMouseUp = useCallback((ev) => {
    setDragging(false)
    // horizontal distance of drag (positive or negative)
    onDragEnd(ev.pageX - dragStartX.current)
    document.documentElement.classList.remove('dragging')
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [onDragEnd, handleMouseMove])

  const handleMouseDown = useCallback((ev) => {
    // prevent unintentional selection of background text while dragging
    ev.preventDefault()
    // store the x coordinate of where the drag started
    dragStartX.current = ev.pageX
    setDragDistance(0)
    setDragging(true)
    document.documentElement.classList.add('dragging')
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove, handleMouseUp])

  return (
    <div
      className="pane-divider"
      onMouseDown={handleMouseDown}
    >
      <button
        data-tip="Add a command"
        onMouseDown={() => {
          // index + 1 to insert an operation AFTER the current element's index
          dispatch({ type: INSERT_OPERATION, index: index + 1 })
          if (onCommandAdd) {
            onCommandAdd()
          }
        }}
        className={showAddButton ? 'show' : ''}
      >
        +
      </button>
      <div
        className={`vertical-rule ${dragging ? 'visible' : ''}`}
        style={{ left: `calc(50% + ${dragDistance}px)` }}
      />
    </div>
  )
}

PaneDivider.propTypes = {
  dispatch: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  showAddButton: PropTypes.bool,
  onCommandAdd: PropTypes.func,
  onDragEnd: PropTypes.func.isRequired
}

export default PaneDivider