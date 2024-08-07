import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  SET_INPUT,
  SET_OPTIONS,
  SET_OPERATIONS,
  SET_PANES,
  DEFAULT_OPERATION,
  DEFAULT_PANES
} from '../context/constants'
import { OptionsConsumer } from '../context'
import { getBashString } from '../utils'
import Logo from './Logo'

import '../styles/Toolbar.scss'


const Toolbar = ({
  dispatch,
  operations,
  options
}) => {
  const { syncScroll, darkMode, fontStyle, fontSize } = options
  const iconVariant = darkMode ? 'dark' : 'light'

  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  return (<div className={`toolbar ${expanded ? 'expanded' : ''}`}>
    <Logo />
    <div className="buttons">
      <button
        className={copied ? 'copied' : ''}
        data-tip="Copy current commands to clipboard as a series of pipes suitable for pasting in a shell"
        data-place="right"
        onClick={() => {
          navigator.clipboard.writeText(getBashString(operations))
          setCopied(true)
        }}
        onBlur={() => setCopied(false)}
      >
        {copied ?
          <><img src={`/img/check-${iconVariant}.svg`} alt="" />Commands Copied</> :
          <><img src={`/img/copy-${iconVariant}.svg`} alt="" />Copy Commands</>
        }
      </button>
      <button
        className="clear"
        data-tip="Clear current input and commands"
        data-place="bottom"
        onClick={() => {
          const commands = operations.map(op => op.command).join(', ');
          const yes = window.confirm(`Clear input and commands (${commands})?`);
          if (yes) {
            dispatch({ type: SET_INPUT, input: '' })
            dispatch({ type: SET_OPERATIONS, operations: [DEFAULT_OPERATION] })
            dispatch({ type: SET_PANES, panes: DEFAULT_PANES })
          }
        }}>
        ✕ Clear All
      </button>
    </div>
    <label className="option" data-tip="Synchronize vertical scroll position among input and output panes">
      <input
        type="checkbox"
        checked={syncScroll}
        onChange={(ev) =>
          dispatch({
            type: SET_OPTIONS,
            options: { syncScroll: ev.target.checked }
          })
        }
      />
      Sync scrolling
    </label>
    <label className="option" data-tip="Toggle light/dark theme">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={(ev) =>
          dispatch({
            type: SET_OPTIONS,
            options: { darkMode: ev.target.checked }
          })
        }
      />
      Dark mode
    </label>
    <div className="option">
      <span className="radio-group-label">Font size</span>
      {[10, 12, 14].map(size => (
        <label key={size}>
          <input
            type="radio"
            name="fontSize"
            checked={fontSize === size}
            onChange={() =>
              dispatch({
                type: SET_OPTIONS,
                options: { fontSize: size }
              })
            }
          />
          <img 
            src={`/img/font-${iconVariant}.svg`}
            alt={`${size}-point font`}
            className="font-icon"
            style={{ height: Math.pow(size, 2)/10 }}
          />
        </label>
      ))}
    </div>
    <div className="option">
      <span className="radio-group-label">Font style</span>
      <label className="mono">
        <input
          type="radio"
          name="fontStyle" 
          checked={fontStyle === 'mono'}
          onChange={() =>
            dispatch({
              type: SET_OPTIONS,
              options: { fontStyle: 'mono' }
            })
          }
        />
        Monospace
      </label>
      <label>
        <input
          type="radio"
          name="fontStyle"
          checked={fontStyle === 'sans'}
          onChange={() =>
            dispatch({
              type: SET_OPTIONS,
              options: { fontStyle: 'sans' }
            })
          }
        />
        Sans-serif
      </label>
    </div>
    <a
      className="github-link"
      href="https://github.com/liddiard/stream-editor"
      target="_blank"
      rel="noopener noreferrer"
      data-tip="Stream Editor on GitHub"
    >
      <img src={`/img/github-${iconVariant}.svg`} alt="GitHub icon" />
    </a>
    <a
      className="privacy-policy"
      href="/privacy-policy"
      title="Privacy policy"
      target="_blank"
    >
      Privacy
    </a>
    <button
      className="expand-arrow"
      data-tip={expanded ? 'Collapse toolbar' : 'Expand toolbar'}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? '«' : '»'}
    </button>
  </div>)
}

Toolbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  operations: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired
}

export default OptionsConsumer(Toolbar)
