import React from 'react'

export default function contextize (name, connector) {
  const Context = React.createContext(name)

  return {
    Provider: connector(props => (
      <Context.Provider value={props.value}>
        {props.children}
      </Context.Provider>
    )),
    Consumer: Context.Consumer
  }
}
