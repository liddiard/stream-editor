import React from 'react'

import { initialState } from './reducer'


export const OptionsContext = React.createContext(initialState.options);

export const optionsData = (Component) => (props) => (
  <OptionsContext.Consumer>
    {value => <Component {...props} {...value} />}
  </OptionsContext.Consumer>
)