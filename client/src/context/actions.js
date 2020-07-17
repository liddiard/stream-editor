import get from 'lodash/get'
import request from 'axios'

import {
  API_ROOT,
  MAX_INPUT_LENGTH,
  ERROR_GENERIC,
  ERROR_NULL,
  SET_LOADING,
  SET_UPLOAD_ERROR,
  SET_OPERATION_ERROR,
  SET_COMMANDS,
  SET_API_INPUT,
  SET_INPUT,
  SET_OUTPUTS,
} from './constants'

export const startLoading = (dispatch) =>
  dispatch({ type: SET_LOADING, loading: true })

export const endLoading = (dispatch) =>
  dispatch({ type: SET_LOADING, loading: false })

export const execute = async (dispatch, input, operations) => {
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
      dispatch({ type: SET_OPERATION_ERROR, error: ERROR_NULL })
    }
  }
  catch (error) {
    dispatch({
      type: SET_OPERATION_ERROR,
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
    dispatch({ type: SET_OPERATION_ERROR, error: ERROR_GENERIC })
  }
  finally {
    endLoading(dispatch)
  }
}

export const uploadFile = async (dispatch, file) => {
  // clear any existing errors
  dispatch({ type: SET_UPLOAD_ERROR, error: null })
  if (file.size > MAX_INPUT_LENGTH) {
    return dispatch({
      type: SET_UPLOAD_ERROR,
      error: 'File exceeds maximum allowed size of 1 MB.'
    })
  }
  startLoading(dispatch)
  const input = await file.text()
  endLoading(dispatch)
  dispatch({ type: SET_INPUT, input })
}