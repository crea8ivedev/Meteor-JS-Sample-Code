import { Component } from 'react'

export default function Loading (props) {
  if (props.error) {
    console.error(props.error)
    return <div className="central-component">Error!</div>
  } else if (props.timedOut) {
    return <div className="central-component">Taking a long time...</div>
  } else if (props.pastDelay) {
    return <div className="central-component">Loading</div>
  } else {
    return null
  }
}

export class DelayedLoading extends Component {
  state = {
    displayAfterDelay: false
  }
  componentDidMount () {
    this.tid = setTimeout(() => {
      this.setState({ displayAfterDelay: true })
    }, 200)
  }
  componentWillUnmount () {
    clearTimeout(this.tid)
  }
  render () {
    return this.state.displayAfterDelay
      ? <div className="central-component">Loading</div>
      : null
  }
}
