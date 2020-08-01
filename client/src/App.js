import React, { useReducer, useRef, useEffect } from 'react'
import ReactTooltip from 'react-tooltip';
import isEqual from 'lodash/isEqual'

import { INPUT_DELAY, INITIAL_OPERATION } from './context/constants'
import { OptionsContext } from './context'
import initialState from './context/initialState'
import reducer from './context/reducer'
import {
  getCommands,
  execute
} from './context/actions'
import {
  writeOperationsToQuerystring,
  writeJSONToLocalStorage,
  writeJSONToSessionStorage,
  toggleSyncScrolling,
  rebindSyncScrolling
} from './utils'
import Toolbar from './components/Toolbar'
import Pane from './components/Pane'
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
    panes,
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
  }, [operations])

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [operations, outputs])

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

  useEffect(() => rebindSyncScrolling, [panes.length])

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
    writeJSONToLocalStorage('options', options)
  }, [options])

  useEffect(() => {
    writeJSONToSessionStorage(
      'panes',
      panes.map(({ text, ...rest }) => rest)
    )
  }, [panes])

  const _operations = operations
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

  const _outputs = panes.slice(1)
  .map((pane, index) => {
    const output = outputs[index]
    const isLast = index === outputs.length - 1
    // pulse the add button, giving a visual indication of what we want the
    // user to click, if this is the last output pane and the app is in a 
    // state with its initial panes and operation
    const pulseAddButton = (
      isLast &&
      panes.length === 2 &&
      isEqual(operations[0], INITIAL_OPERATION)
    )
    return (
      <Pane
        key={pane.id}
        dispatch={dispatch}
        // index + 1 because we're slicing off the first pane above (input pane)
        index={index+1}
        width={pane.width}
        // the last pane has a wider minimum because it has more buttons at the top
        minWidth={isLast ? 410 : 250}
        isLast={isLast}
        pulseAddButton={pulseAddButton}
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
          {...pane}
        />
      </Pane>
    )
  })

  return (
    <OptionsContext.Provider value={options}>
      <Toolbar
        dispatch={dispatch}
        operations={operations}
      />
      <main>
        <Pane
          dispatch={dispatch}
          index={0}
          width={panes[0].width}
          minWidth={180}
        >
          <Input 
            dispatch={dispatch}
            text={input}
            error={errors.upload}
            operation={_operations[0]}
          />
        </Pane>
        {_outputs}
        <div className="output-spacer" />
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