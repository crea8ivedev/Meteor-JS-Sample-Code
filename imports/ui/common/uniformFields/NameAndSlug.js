import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import slug from 'slug'
import TextField from '@material-ui/core/TextField'

const getSlug = (raw) => slug(raw, { mode: 'rfc3986' })

export default class NameAndSlug extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    nameLabel: PropTypes.string,
    slugLabel: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    nameLabel: 'Name',
    slugLabel: 'URL Fragment'
  }

  constructor (props) {
    super(props)
    this.state = {
      // if the slugged name matches the slug, then we assume autoSlug
      autoSlug: (props.slug === getSlug(props.name)),
      name: props.name,
      slug: props.slug,
      slugEditMode: false
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { name, slug } = this.props
    if (prevProps.slug === slug && prevProps.name === name) return
    this.setState({ name, slug })
  }

  handleNameChange = (event) => {
    const { state } = this
    const name = event.target.value
    if (state.autoSlug) {
      this.setState({ name, slug: getSlug(name) })
    } else {
      this.setState({ name })
    }
  }

  handleNameBlur = () => {
    this.propagateOnChange({
      name: this.state.name,
      slug: this.state.slug
    })
  }

  handleSlugChange = (event) => {
    const slugVal = event.target.value
    this.setState({
      autoSlug: false,
      slug: slugVal
    })
  }

  handleSlugBlur = (event) => {
    // Even if the user sets their own slug, we still have to clean it.
    const userSlugVal = getSlug(event.target.value)
    const autoSlugVal = getSlug(this.state.name)
    // If the slug is empty or the same as the slugged name
    // we assume the user wants to reset to autoSlug true.
    if (userSlugVal === '' || userSlugVal === autoSlugVal) {
      this.setState({
        autoSlug: true,
        slug: autoSlugVal,
        slugEditMode: false
      })
      // setState is async, so we need to pass the values
      this.propagateOnChange({
        name: this.state.name,
        slug: autoSlugVal
      })
    } else {
      this.setState({
        autoSlug: false,
        slug: userSlugVal,
        slugEditMode: false
      })
      // setState is async, so we need to pass the values
      this.propagateOnChange({
        name: this.state.name,
        slug: userSlugVal
      })
    }
  }

  handleEditSlugClick = (event) => {
    event.preventDefault()
    this.setState({
      slugEditMode: true
    })
  }

  propagateOnChange = (nameAndSlug) => {
    const { props } = this
    props.onChange(nameAndSlug)
  }

  render () {
    const { state, props } = this
    return <div>
      <div>
        <TextField
          name="name"
          label={props.nameLabel}
          value={state.name}
          onChange={this.handleNameChange}
          onBlur={this.handleNameBlur}
          margin="normal"
          style={{ width: '100%' }}
        />
      </div>
      {state.slugEditMode // || !state.autoSlug
        ? <div>
          <TextField
            name="slug"
            label={props.slugLabel}
            value={state.slug}
            onChange={this.handleSlugChange}
            onBlur={this.handleSlugBlur}
            margin="normal"
            autoFocus={state.slugEditMode}
          />
        </div>
        : <div className="name-slug__slug-display">
          <a onClick={this.handleEditSlugClick}>URL Fragment</a>: {state.slug}
        </div>
      }
    </div>
  }
}
