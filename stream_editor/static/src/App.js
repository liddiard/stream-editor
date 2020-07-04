import React, { useReducer, useRef, useEffect } from 'react'
import ReactTooltip from 'react-tooltip';

import {
  INPUT_DELAY,
  SET_INPUT,
  DEFAULT_OPERATION
} from './constants'
import { OptionsContext } from './context'
import reducer, { initialState } from './reducer'
import {
  getCommands,
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
import Toolbar from './components/Toolbar'
import Input from './components/Input'
import Operation from './components/Operation'
import Output from './components/Output'

import './styles/App.scss'


const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const timeoutId = useRef()
  const {
    loading,
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
    ReactTooltip.rebuild()
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
    const { classList } = document.documentElement
    classList.remove('theme-dark')
    classList.remove('theme-light')
    classList.add(options.darkMode ? 'theme-dark' : 'theme-light')
  }, [options.darkMode])

  useEffect(() => {
    const action = loading ? 'add' : 'remove'
    document.body.classList[action]('loading')
  }, [loading])

  useEffect(() => {
    writeOptionsToLocalStorage(options)
  }, [options])

  const _outputs = outputs
  .map((output, index) =>
    <Output
      key={index}
      index={index}
      dispatch={dispatch}
      text={output}
      prevText={index === 0 ? apiInput : outputs[index-1]}
      isError={!!error.message}
      isLast={index === outputs.length - 1}
    />
  )

  return (
    <OptionsContext.Provider value={options}>
      <>
        <Toolbar
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
        <ReactTooltip
          effect="solid"
          className="sans"
          type={options.darkMode ? 'light' : 'dark'} 
        />
      </>
    </OptionsContext.Provider>
  )
}

export default App