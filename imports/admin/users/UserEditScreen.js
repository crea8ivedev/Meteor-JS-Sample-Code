import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {
  AutoForm,
  TextField,
  SubmitField,
  ErrorsField,
  ListField,
  BoolField,
  ListItemField,
  NestField
} from 'uniforms-material'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/styles'
import { Methods } from 'meteor/npdev:async-proxy'
import { EditUserBridge } from '/imports/api/collections/Users'

const styles = (theme) => ({
  root: theme.mixins.gutters({
    padding: `${theme.spacing(2)}px 0`,
    maxWidth: 600,
    minWidth: 300,
    width: '100%',
    margin: 'auto'
  }),
  listItem: {
    padding: 0
  }
})

class CreateTileScreen extends Component {
  state = {
    user: {},
    redirectTo: '',
    isSubmitting: false,
    isLoading: false,
    errorMessage: ''
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({
      isLoading: true,
      errorMessage: ''
    })

    const { _id } = this.props.match.params

    let result
    try {
      result = await Methods.adminGetUserById(_id)
    } catch (error) {
      console.error(error)
      this.setState({
        isLoading: false,
        errorMessage: error.reason
      })
      return
    }

    this.setState({
      isLoading: false,
      user: result
    })
  }

  handleSubmit = async (user) => {
    if (this.state.isSubmitting) return

    this.setState({
      isSubmitting: true,
      errorMessage: ''
    })

    let result
    try {
      result = await Methods.adminUpdateUser(user)
    } catch (error) {
      console.error(error)
      this.setState({
        isSubmitting: false,
        errorMessage: error.reason
      })
      return
    }

    this.setState({ redirectTo: `/admin/users/view-${result}` })
  }

  render () {
    const { classes } = this.props
    const { user, redirectTo, isSubmitting, isLoading, errorMessage } = this.state
    if (redirectTo) {
      return <Redirect to={redirectTo} />
    }
    return <Paper className={classes.root}>
      <h2>Edit User: {user._id}</h2>
      <AutoForm
        error={errorMessage}
        schema={EditUserBridge}
        onSubmit={this.handleSubmit}
        model={user}
        disabled={isSubmitting || isLoading}
      >
        <TextField name="username" readOnly />
        <ListField name="emails">
          <ListItemField name="$" className={classes.listItem}>
            <NestField name="">
              <TextField name="address" />
              <BoolField name="verified" />
            </NestField>
          </ListItemField>
        </ListField>
        <ErrorsField />
        <SubmitField disabled={isSubmitting} />
      </AutoForm>
    </Paper>
  }
}

export default withStyles(styles)(CreateTileScreen)
