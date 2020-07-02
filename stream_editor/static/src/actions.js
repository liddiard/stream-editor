import get from 'lodash/get'
import request from 'axios'

import {
  API_ROOT,
  INPUT_DELAY,
  ERROR_GENERIC,
  SET_LOADING,
  SET_ERROR,
  SET_COMMANDS,
  SET_INPUT,
  PUSH_OPERATION,
  INSERT_OPERATION,
  REMOVE_OPERATION,
  SET_API_INPUT,
  SET_OUTPUTS,
  SET_OPTION
} from './constants'

const startLoading = (dispatch) =>
  dispatch({ type: SET_LOADING, loading: true })

const endLoading = (dispatch) =>
  dispatch({ type: SET_LOADING, loading: false })

const execute = async (dispatch, input, operations) => {
  startLoading(dispatch)
  try {
    const response = await request({
      method: 'POST',
      url: `${API_ROOT}execute/`,
      data: {
        input,
        operations
      }
    })
    {
      const { input, outputs } = response.data
      dispatch({ type: SET_API_INPUT, input })
      dispatch({ type: SET_OUTPUTS, outputs })
    }
  }
  catch (error) {
    dispatch({
      type: SET_ERROR,
      error: get(error, 'response.data.error', ERROR_GENERIC)
    })
  }
  finally {
    endLoading(dispatch)
  }
}

export const getCommands = async (dispatch) => {
  startLoading(dispatch)
  try {
    const response = await request.get(`${API_ROOT}commands/`)
    const { commands } = response.data
    dispatch({ type: SET_COMMANDS, commands })
  }
  catch (error) {
    dispatch({ type: SET_ERROR, error: ERROR_GENERIC })
  }
  finally {
    endLoading(dispatch)
  }
}

let timeoutId
export const setInput = (dispatch, input, operations) => {
  dispatch({ type: SET_INPUT, input })
  if (timeoutId) {
    window.clearTimeout(timeoutId)
  }
  timeoutId = window.setTimeout(() =>
    execute(dispatch, input, operations),
  INPUT_DELAY)
}
  
