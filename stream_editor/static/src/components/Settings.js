import React, { useState, useEffect } from 'react'

import { SET_OPTION, SET_OPERATIONS, DEFAULT_OPERATION } from '../constants'
import { optionsData } from '../context'
import { getBashString } from '../utils'

import '../styles/Settings.scss'


const Settings = ({ dispatch, operations, showDiff, syncScroll, darkMode, fontStyle, fontSize, panesInViewport }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCopied(false)
  }, [operations])

  return (<div className="editor-options">
    <button
      className={copied ? 'copied' : ''}
      onClick={() => {
        navigator.clipboard.writeText(getBashString(operations))
        setCopied(true)
      }}>
      {copied ?
        <><img src="/img/icon-check.svg"/>Copied as Bash</> :
        <><img src="/img/icon-copy.svg"/>Copy as Bash</>
      }
    </button>
    <button
      className="clear"
      onClick={() => {
        const yes = window.confirm('Are you sure you want to clear all commands?');
        if (yes) {
          dispatch({ type: SET_OPERATIONS, operations: [{ ...DEFAULT_OPERATION }] })
        }
      }}>
      ✕ Clear All
    </button>
    <label className="option" title="Show added/removed text with green/red highlights">
      <input
        type="checkbox"
        checked={showDiff}
        onChange={(ev) =>
          dispatch({ type: SET_OPTION, key: 'showDiff', value: ev.target.checked })
        }
      />
      Show diff
    </label>
    <label className="option" title="Synchronize scrolling among input and output panes">
      <input
        type="checkbox"
        checked={syncScroll}
        onChange={(ev) =>
          dispatch({ type: SET_OPTION, key: 'syncScroll', value: ev.target.checked })
        }
      />
      Sync scrolling
    </label>
    <label className="option" title="Toggle dark/light theme">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={(ev) =>
          dispatch({ type: SET_OPTION, key: 'darkMode', value: ev.target.checked })
        }
      />
      Dark mode
    </label>
    <div className="option" title="Maximum number of panes to show in the viewport">
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
        <label>
          <input
            type="radio"
            name="fontSize" 
            checked={fontSize === size}
            onChange={() =>
              dispatch({ type: SET_OPTION, key: 'fontSize', value: size })
            }
          />
          <img 
            src="/img/icon-font.svg"
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
  </div>)
}


export default optionsData(Settings)
