/* global MouseEvent */
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Component } from 'react'
import { withStyles } from '@material-ui/styles'
import { Slingshot } from 'meteor/edgee:slingshot'
import { connectField } from 'uniforms'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import IconButton from '@material-ui/core/IconButton'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import FormHelperText from '@material-ui/core/FormHelperText'
import UploadButton from './UploadButton'
// import UploadPreview from './UploadPreview'

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  textField: {
    width: '100%'
  },
  wrap: {
    display: 'flex',
    marginTop: 16,
    marginBottom: 8
  },
  image: {
    display: 'block',
    width: '100%'
  }
})

class UploadField extends Component {
  state = {
    status: this.props.value ? 'Upload Complete!' : '',
    error: null,
    errorField: '',
    progress: 0
  }

  componentDidMount () {
    this.uploader = new Slingshot.Upload('pixstoriimages')
    this.computation = Tracker.autorun(this.track)
  }

  componentWillUnmount () {
    this.computation.stop()
  }

  // This method is reactive
  track = () => {
    this.setState({
      progress: this.uploader.progress()
    })
  }

  handleFileLoad = async (event, file) => {
    // this.setState({
    //   status: '...processing...'
    // })

    try {
      this.handleUploadFile(file)
    } catch (error) {
      this.setState({
        status: 'An Error occurred',
        error,
        errorField: this.props.name
      })
    }
    // this.props.onChange(URL.createObjectURL(file))
  }

  handleUploadFile = (file) => {
    const { uploader } = this

    this.setState({
      status: '...uploading...'
    })

    uploader.send(file, (error, url) => {

      if (error) {
        console.error(error)
        this.setState({ status: 'Please try again!.' })
        throw new Meteor.Error('upload-file-fail', error)
      } else {
        const { onChange } = this.props
        onChange(url.replace('http://', 'https://'))
        this.setState({ status: 'Upload Complete!' })
      }
    })
  }

  handleChooseImageClick = (event) => {
    event.preventDefault()
    this.fileInput.dispatchEvent(new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    }))
  }

  handleRemoveImage = () => {
    if (!window.confirm('Are you sure you want to remove this image?')) {
      return
    }
    this.props.onChange('')
  }

  render () {
    const { name, id, value, classes, label } = this.props
    const { error, errorField, status } = this.state
    return <div>
      <div><img className={classes.image}
        // applying a transformation fixes rotation problem on iOS
        src={value?.replace('/image/upload/', '/image/upload/w_552/') || null}
        srcSet={value ? [
          value?.replace('/image/upload/', '/image/upload/w_552/') + ' 1x',
          value?.replace('/image/upload/', '/image/upload/w_1104/') + ' 2x'
        ].join(', ') : null}
      /></div>
      <div className={classes.wrap}>
        <UploadButton
          label="Choose Image"
          onFileLoad={this.handleFileLoad}
          accept="image/*"
          name={name}
          onChange={this.handleUploadFile}
          disabled={status === '...uploading'}
          style={{ display: 'none' }}
          renderButton={(children) => <IconButton color="inherit" aria-label="Choose Image">
            <AddAPhotoIcon />
            {children}
          </IconButton>}
        />
        <FormControl className={classes.textField}>
          <InputLabel
            htmlFor={id}
            error={errorField === name}
          >{label}</InputLabel>
          <Input
            id={id}
            name={name}
            type="text"
            disabled={!!status}
            value={status}
            onChange={this.handleUrlChange}
            error={errorField === name}
          />
          {errorField === name &&
            <FormHelperText id="weight-helper-text" error>{error}</FormHelperText>}
        </FormControl>
      </div>
    </div>
  }
}

export default withStyles(styles)(connectField(UploadField))
