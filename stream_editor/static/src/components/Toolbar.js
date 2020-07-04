import React, { useState, useEffect } from 'react'

import { SET_OPTION, SET_OPERATIONS, DEFAULT_OPERATION } from '../constants'
import { optionsData } from '../context'
import { getBashString } from '../utils'

import '../styles/Toolbar.scss'


const Toolbar = ({ dispatch, operations, showDiff, syncScroll, darkMode, fontStyle, fontSize, panesInViewport }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCopied(false)
  }, [operations])

  const iconVariant = darkMode ? 'dark' : 'light'

  return (<div className="editor-options">
    <button
      className={copied ? 'copied' : ''}
      data-tip="Copy current commands to clipboard as a series of pipes suitable for pasting in a shell"
      onClick={() => {
        navigator.clipboard.writeText(getBashString(operations))
        setCopied(true)
      }}>
      {copied ?
        <><img src={`/img/check-${iconVariant}.svg`} alt="" />Commands Copied</> :
        <><img src={`/img/copy-${iconVariant}.svg`} alt="" />Copy Commands</>
      }
    </button>
    <button
      className="clear"
      data-tip="Clear the current commands"
      onClick={() => {
        const commands = operations.map(op => op.command).join(', ');
        const yes = window.confirm(`Are you sure you want to clear all your commands (${commands})?`);
        if (yes) {
          dispatch({ type: SET_OPERATIONS, operations: [{ ...DEFAULT_OPERATION }] })
        }
      }}>
      ✕ Clear All
    </button>
    <label className="option" data-tip="Show added/removed text with green/red highlights">
      <input
        type="checkbox"
        checked={showDiff}
        onChange={(ev) =>
          dispatch({ type: SET_OPTION, key: 'showDiff', value: ev.target.checked })
        }
      />
      Show diff
    </label>
    <label className="option" data-tip="Synchronize vertical scroll position among input and output panes">
      <input
        type="checkbox"
        checked={syncScroll}
        onChange={(ev) =>
          dispatch({ type: SET_OPTION, key: 'syncScroll', value: ev.target.checked })
        }
      />
      Sync scrolling
    </label>
    <div className="option" data-tip="Max number of panes to show in the viewport before introducing horizontal scroll">
      Max panes in view
      <input
        type="range"
        min={1}
        max={9}
        value={panesInViewport}
        onChange={(ev) =>
          dispatch({ type: SET_OPTION, key: 'panesInViewport', value: parseInt(ev.target.value) })
        }
      />
      {panesInViewport}
    </div>
    <div className="option" title="Font size on input and output panes">
      <span className="radio-group-label">Font size</span>
      {[10, 12, 14].map(size => (
        <label key={size}>
          <input
            type="radio"
            name="fontSize"
            checked={fontSize === size}
            onChange={() =>
              dispatch({ type: SET_OPTION, key: 'fontSize', value: size })
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
    <div className="option" title="Font style on input and output panes">
      <span className="radio-group-label">Font style</span>
      <label className="mono">
        <input
          type="radio"
          name="fontStyle" 
          checked={fontStyle === 'mono'}
          onChange={() =>
            dispatch({ type: SET_OPTION, key: 'fontStyle', value: 'mono' })
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
            dispatch({ type: SET_OPTION, key: 'fontStyle', value: 'sans' })
          }
        />
        Sans-serif
      </label>
    </div>
    <label className="option">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={(ev) =>
          dispatch({ type: SET_OPTION, key: 'darkMode', value: ev.target.checked })
        }
      />
      Dark mode
    </label>
  </div>)
}


export default optionsData(Toolbar)
