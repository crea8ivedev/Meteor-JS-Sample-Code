import { Meteor } from 'meteor/meteor'
import React, { Component, Fragment } from 'react'
import { Tracker } from 'meteor/tracker'

function getSetting (key, defaultText) {
  if (Meteor?.settings?.public?.connectionBanner[key]) {
    return Meteor.settings.public.connectionBanner[key]
  }
  return defaultText
}

export default class ConnectionBanner extends Component {
  state = {
    isConnected: true,
    wasConnected: false,
    retryTimeSeconds: 0,
    failedReason: null
  }

  componentDidMount () {
    this.computation = Tracker.nonreactive(() => Tracker.autorun(() => {
      const connectedStatus = Meteor.status().connected
      if (connectedStatus) {
        Meteor.clearInterval(this.connectionRetryUpdateInterval)
        this.connectionRetryUpdateInterval = undefined
        this.setState({
          wasConnected: true,
          retryTimeSeconds: 0,
          failedReason: null
        })
      } else if (this.state.wasConnected && !this.connectionRetryUpdateInterval) {
        this.connectionRetryUpdateInterval = Meteor.setInterval(() => {
          let retryIn = Math.round((Meteor.status().retryTime - (new Date()).getTime()) / 1000)
          if (isNaN(retryIn)) retryIn = 0
          this.setState({
            retryTimeSeconds: retryIn,
            failedReason: Meteor.status().reason
          })
        }, 500)
      }
      this.setState({
        isConnected: connectedStatus
      })
    }))
  }

  componentWillUnmount () {
    if (this.connectionRetryUpdateInterval) Meteor.clearInterval(this.connectionRetryUpdateInterval)
    if (this.computation) this.computation.stop()
  }

  connectionLostText () {
    return getSetting('connectionLostText', 'Connection to Server Lost!')
  }

  tryReconnectText () {
    return getSetting('tryReconnectText', 'Click to try reconnecting now')
  }

  reconnectBeforeCountdownText () {
    return getSetting('reconnectBeforeCountdownText', 'Automatically attempting to reconnect in')
  }

  reconnectAfterCountdownText () {
    return getSetting('reconnectAfterCountdownText', 'seconds.')
  }

  render () {
    const { state } = this
    const showBanner = state.wasConnected && !state.isConnected && Meteor.status().retryCount > 2

    if (!showBanner) return null

    return <div id="connection-lost-banner" className="alert alert-danger">
      <b><i className="fa fa-exclamation-triangle fa-lg" /> {this.connectionLostText()}</b>
      &nbsp;
      {this.reconnectBeforeCountdownText()} {state.retryTimeSeconds} {this.reconnectAfterCountdownText()}
      &nbsp;
      <a href="" id="connection-try-reconnect" className="alert-link" onClick={this.handleClick}>
        <i className="fa fa-refresh fa-lg" /> {this.tryReconnectText()}</a>
      {state.failedReason &&
        <Fragment><br />{state.failedReason}</Fragment>}
    </div>
  }

  handleClick = (event) => {
    event.preventDefault()
    Meteor.reconnect()
  }
}
