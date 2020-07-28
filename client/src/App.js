import React, { useReducer, useRef, useEffect } from 'react'
import ReactTooltip from 'react-tooltip';

import { INPUT_DELAY, DEFAULT_OPERATION } from './context/constants'
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
import IOWrapper from './components/IOWrapper'
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

  const _operations = [...operations, DEFAULT_OPERATION]
  .map((operation, index) =>
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
  )

  const _outputs = outputs
  .map((output, index) => {
    const isLast = index === outputs.length - 1
    return (
      <IOWrapper
        key={index}
        dispatch={dispatch}
        index={index+1}
        // the last pane has a wider minimum because it has more buttons at the top
        minWidth={isLast ? 400 : 240}
      >
        <Output
          index={index}
          dispatch={dispatch}
          input={input}
          text={output}
          prevText={index === 0 ? apiInput : outputs[index-1]}
          isError={!!errors.operation.message}
          isLast={isLast}
          operation={_operations[index+1]}
        />
      </IOWrapper>
    )
  })

  return (
    <OptionsContext.Provider value={options}>
      <Toolbar
        dispatch={dispatch}
        operations={operations}
      />
      <main>
        <IOWrapper
          dispatch={dispatch}
          index={0}
          minWidth={180}
        >
          <Input 
            dispatch={dispatch}
            text={input}
            error={errors.upload}
            operation={_operations[0]}
          />
        </IOWrapper>
        {_outputs}
      </main>
      <ReactTooltip
        effect="solid"
        className="sans"
        type={darkMode ? 'light' : 'dark'} 
      />
    </OptionsContext.Provider>
  )
}

export default App