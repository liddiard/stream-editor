import React, { useReducer, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  INPUT_DELAY,
  SET_INPUT,
  SET_OPERATIONS,
  DEFAULT_OPERATION
} from './constants'
import { OptionsContext } from './context'
import reducer, { initialState } from './reducer'
import {
  getCommands,
  setInput,
  execute
} from './actions'

import {
  updateOperationsFromQuerystring,
  writeOperationsToQuerystring,
  updateOptionsFromLocalStorage,
  writeOptionsToLocalStorage,
  toggleSyncScrolling,
  rebindSyncScrolling
} from './utils'
import Header from './components/Header'
import Settings from './components/Settings'
import Input from './components/Input'
import Operation from './components/Operation'
import Output from './components/Output'

import './styles/App.scss'


const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const timeoutId = useRef()
  const {
    commands,
    input,
    operations,
    outputs,
    apiInput,
    error,
    options
  } = state

  useEffect(() => {
    getCommands(dispatch)
    updateOptionsFromLocalStorage(dispatch)
    updateOperationsFromQuerystring(dispatch)
  }, [])

  useEffect(() => {
    writeOperationsToQuerystring(operations)
  }, [operations])

  useEffect(() => {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current)
    }
    timeoutId.current = window.setTimeout(() =>
      execute(dispatch, input, operations),
    INPUT_DELAY)
  }, [dispatch, input, operations])

  useEffect(() => {
    toggleSyncScrolling(options.syncScroll)
  }, [options.syncScroll])

  useEffect(() => rebindSyncScrolling, [outputs.length])

  useEffect(() => {
    const operation = options.darkMode ? 'add' : 'remove'
    document.body.classList[operation]('dark')
  }, [options.darkMode])

  useEffect(() => {
    writeOptionsToLocalStorage(options)
  }, [options])

  const _outputs = outputs
  .concat(outputs.length < operations.length ? [''] : [])
  .map((output, index) =>
    <Output
      key={index}
      text={output}
      prevText={index === 0 ? apiInput : outputs[index-1]}
      isLast={index === outputs.length - 1}
    />
  )

  return (
    <OptionsContext.Provider value={options}>
      <>
        <Settings
          dispatch={dispatch}
          operations={operations}
        />
        <main>
          <div className="io-container">
            <Input 
              text={input}
              onChange={ev => dispatch({ type: SET_INPUT, input: ev.target.value })}
            />
            {_outputs}
          </div>
          <div className="operations">
            {[...operations, { ...DEFAULT_OPERATION }].map((operation, index) =>
              <Operation
                key={index}
                dispatch={dispatch}
                index={index}
                commands={commands}
                operations={operations}
                operation={operation}
                error={error.index === index ? error.message : null}
              />
            )}
          </div>
        </main>
      </>
    </OptionsContext.Provider>
  )
}

export default App