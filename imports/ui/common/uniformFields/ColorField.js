import React, { Component } from 'react'
import { SketchPicker } from 'react-color'
import { connectField } from 'uniforms'
import './ColorField.scss'

class ColorField extends Component {
  state = {
    displayPicker: false
  }

  handleClick = () => {
    this.setState({ displayPicker: !this.state.displayPicker })
  }

  handleClose = () => {
    this.setState({ displayPicker: false })
  }

  handleChange = (color) => {
    this.props.onChange(color.hex)
  }

  handleRemoveClick = () => {
    this.props.onChange('')
  }

  renderPicker () {
    const { props } = this
    // :HACK: this is hacky and a performance nightmare - also, it's written with awareness of its container
    const { scrollTop } = document.querySelector('.sidebar.sidebar--right .sidebar__content')
    return <div className="popover">
      <div className="cover" onClick={this.handleClose} />
      <div style={{ top: -scrollTop, position: 'absolute' }}>
        <SketchPicker
          color={props.value} presetColors={this.props.colors}
          onChangeComplete={this.handleChange} />
      </div>
    </div>
  }

  render () {
    const { props, state } = this
    return <div className="color-field">
      <label className="control-label">{props.label}</label>
      <div className="control-wrap">
        <div onClick={this.handleClick} className="button">
          <div className="swatch" style={{ backgroundColor: props.value }} />
        </div>
        {props.value && !props.hideRemoveBtn &&
          <div className="remove-btn" onClick={this.handleRemoveClick}>
            <a className="detail">clear</a>
          </div>}
      </div>
      {state.displayPicker && this.renderPicker()}
    </div>
  }
}

export default connectField(ColorField)
