/* global FileReader */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'

const styles = {
  Container: {
    // position: 'relative',
    // display: 'inline-block',
    // boxSizing: 'border-box',
    // position:'absolute',
    // width: '100%',
    // left: '0',
  },
  FileInput: {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    bottom: 0
  }
}

class Upload extends Component {
  static defaultProps = {
    fileTypeRegex: /.*/,
    onFileLoad: (e) => undefined,
    accept: 'image/*',
    ButtonControl: Button,
    label: 'Choose File',
    multiple: false,
    disabled: false
  }

  static propTypes = {
    fileTypeRegex: PropTypes.object,
    onFileLoad: PropTypes.func,
    classes: PropTypes.object,
    accept: PropTypes.string,
    label: PropTypes.any,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool
  }

  onInputChange = (e) => {
    Array.prototype.filter.call(e.target.files,
      (file) => file.type.match(this.props.fileTypeRegex) !== null
    ).forEach(
      (file) => {
        const reader = new FileReader()
        reader.onload = (e) => this.props.onFileLoad(e, file)
        reader.readAsDataURL(file)
      }
    )
  }

  componentDidMount () {
    this.fileInput.addEventListener(
      'change',
      this.onInputChange,
      false
    )
  }

  componentWillUnmount () {
    this.fileInput.removeEventListener(
      'change',
      this.onInputChange,
      false
    )
  }

  render () {
    const { multiple, classes, accept, disabled, label, renderButton } = this.props
    const input = <input
      className={classes.FileInput}
      type="file"
      accept={accept}
      disabled={disabled}
      ref={this.handleFileInputRef}
      multiple={multiple}
    />
    return (
      <div className={classes.Container}>
        {renderButton
          ? renderButton(input)
          : <Button>
            {label}
            {input}
          </Button>}
      </div>
    )
  }

  handleFileInputRef = (fileInput) => {
    this.fileInput = fileInput
  }
}

export default withStyles(styles)(Upload)
