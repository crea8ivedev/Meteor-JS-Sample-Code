/* global tinymce Meteor */
import React, { Component } from 'react'
import { connectField } from 'uniforms'
import TinyMCE from 'react-tinymce'
import Loading from '../Loading'

var tinyMCELoaded = false
var listeners = []
function addLoadListener (listener) {
  listeners.push(listener)
}
function removeLoadListener (listener) {
  var i = listeners.indexOf(listener)
  if (i > -1) listeners.splice(i, 1)
}
function onTinyMCELoaded () {
  tinyMCELoaded = true
  listeners.forEach(listener => listener())
}
function loadTinyMCE () {
  if (tinyMCELoaded) return
  const tagid = 'tinymce-script'
  if (document.getElementById(tagid)) {
    tinyMCELoaded = true
    return
  }
  const head = document.getElementsByTagName('head')[0]
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.id = tagid
  script.onreadystatechange = function () {
    if (this.readyState === 'complete') onTinyMCELoaded()
  }
  script.onload = onTinyMCELoaded
  script.async = true
  // :TODO: Move TinyMCE key to settings.json, or use local assets
  // :NOTE: This needs to be updated with an apiKey
  script.src = 'https://cloud.tinymce.com/stable/tinymce.min.js?apiKey=rww8usbko5u6var8jn6qc99dedejurzv4ndsg99f25cb8hzq'
  head.appendChild(script)
}
if (Meteor.isClient) loadTinyMCE()

class FieldTinyMCE extends Component {
  state = { tinyMCELoaded, timeoutHackComplete: tinyMCELoaded }

  componentDidMount () {
    if (!tinyMCELoaded) {
      addLoadListener(this.handleTinyMCELoad)
    }
    setTimeout(() => {
      this.setState({ timeoutHackComplete: true })
    }, 1000)
  }

  handleTinyMCELoad = () => {
    this.setState({ tinyMCELoaded: true })
  }

  componentWillUnmount () {
    removeLoadListener(this.handleTinyMCELoad)
  }

  render () {
    if (!this.state.tinyMCELoaded || !this.state.timeoutHackComplete) {
      return <Loading />
    }
    return <div style={{ margin: '16px 0' }}><TinyMCE
      ref={this.handleEditorRef}
      content={this.props.value}
      config={{
        height: 300,
        theme: 'modern',
        plugins: [
          'advlist autolink lists link image charmap print preview hr anchor pagebreak',
          'searchreplace wordcount visualblocks visualchars code fullscreen',
          'insertdatetime media nonbreaking save table contextmenu directionality',
          'emoticons template paste textcolor colorpicker textpattern imagetools codesample'
        ],
        toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
        image_advtab: true,
        templates: [
          { title: 'Test template 1', content: 'Test 1' },
          { title: 'Test template 2', content: 'Test 2' }
        ],
        content_css: [
          '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
          '//www.tinymce.com/css/codepen.min.css'
        ],
        paste_data_images: true,
        relative_urls: true
      }}
      onBlur={this.handleEditorChange}
    /></div>
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.value !== this.props.value && this.editor) {
      // This should work, but doesn't - hence the hack above
      this.editor.setContent(this.props.value)
    }
  }

  handleEditorRef = (ref) => {
    this.editor = ref ? tinymce.EditorManager.get(ref.id) : null
  }

  handleEditorChange = (event) => {
    this.props.onChange(event.target.getContent())
  }
}

const TinyMCEField = connectField(FieldTinyMCE)
export default TinyMCEField
