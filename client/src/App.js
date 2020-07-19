import React, { useReducer, useRef, useEffect } from 'react'
import ReactTooltip from 'react-tooltip';

import {
  INPUT_DELAY,
  DEFAULT_OPERATION
} from './context/constants'
import { OptionsContext } from './context'
import initialState from './context/initialState'
import reducer from './context/reducer'
import {
  getCommands,
  execute
} from './context/actions'
import {
  writeOperationsToQuerystring,
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
  const timeoutId = useRef()
  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    loading,
    commands,
    input,
    operations,
    outputs,
    apiInput,
    errors,
    options
  } = state
  const { syncScroll, darkMode } = options

  useEffect(() => {
    getCommands(dispatch)
  }, [])

  useEffect(() => {
    writeOperationsToQuerystring(operations)
    ReactTooltip.rebuild()
  }, [operations])

  useEffect(() => {
    sessionStorage.setItem('input', input)
  }, [input])

  useEffect(() => {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current)
    }
    timeoutId.current = window.setTimeout(() =>
      execute(dispatch, input, operations),
    INPUT_DELAY)
  }, [dispatch, input, operations])

  useEffect(() => {
    toggleSyncScrolling(syncScroll)
  }, [syncScroll])

  useEffect(() => rebindSyncScrolling, [outputs.length])

  useEffect(() => {
    const { classList } = document.documentElement
    classList.remove('theme-dark')
    classList.remove('theme-light')
    classList.add(darkMode ? 'theme-dark' : 'theme-light')
  }, [darkMode])

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
      input={input}
      text={output}
      prevText={index === 0 ? apiInput : outputs[index-1]}
      isError={!!errors.operation.message}
      isLast={index === outputs.length - 1}
    />
  )

  return (
    <OptionsContext.Provider value={options}>
      <>
        {/* <Header /> */}
        <Toolbar
          dispatch={dispatch}
          operations={operations}
        />
        <main>
          <div className="io-container">
            <Input 
              dispatch={dispatch}
              text={input}
              error={errors.upload}
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
                error={
                  errors.operation.index === index ?
                  errors.operation.message :
                  null
                }
              />
            )}
          </div>
        </main>
        <ReactTooltip
          effect="solid"
          className="sans"
          type={darkMode ? 'light' : 'dark'} 
        />
      </>
    </OptionsContext.Provider>
  )
}

export default App