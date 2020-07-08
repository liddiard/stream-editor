import React from 'react'

import { initialState } from './reducer'


export const OptionsContext = React.createContext(initialState.options);

export const OptionsConsumer = (Component) => (props) => (
  <OptionsContext.Consumer>
    {value => <Component {...props} options={value} />}
  </OptionsContext.Consumer>
)