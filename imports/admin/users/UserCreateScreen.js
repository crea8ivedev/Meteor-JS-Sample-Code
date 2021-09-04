import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {
  AutoForm,
  TextField,
  SubmitField,
  ErrorsField
} from 'uniforms-material'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/styles'
import { Methods } from 'meteor/npdev:async-proxy'
import { CreateUserBridge } from '/imports/api/collections/Users'
import UploadField from '/imports/ui/common/uniformFields/UploadField'

const styles = (theme) => ({
  root: theme.mixins.gutters({
    padding: `${theme.spacing(2)}px 0`,
    maxWidth: 600,
    minWidth: 300,
    width: '100%',
    margin: 'auto'
  })
})

class CreateTileScreen extends Component {
  state = {
    user: {},
    redirectTo: '',
    isSubmitting: false,
    errorMessage: ''
  }

  handleSubmit = async (user) => {
    if (this.state.isSubmitting) return

    this.setState({
      isSubmitting: true,
      errorMessage: ''
    })

    let result
    try {
      result = await Methods.adminCreateUser(user)
    } catch (error) {
      console.error(error)
      this.setState({
        isSubmitting: false,
        errorMessage: error.reason
      })
      return
    }
    this.setState({ redirectTo: `/admin/users/view-${result.id}` })
  }

  render () {
    const { classes } = this.props
    const { user, redirectTo, isSubmitting, errorMessage } = this.state
    if (redirectTo) {
      return <Redirect to={redirectTo} />
    }
    return <Paper className={classes.root}>
      <h2>Create New User</h2>
      <AutoForm
        error={errorMessage}
        schema={CreateUserBridge}
        onSubmit={this.handleSubmit}
        model={user}
        disabled={isSubmitting}
      >
        <TextField name="username" />
        <TextField name="password" />
        <TextField name="email" type="email" />
        <ErrorsField />
        <SubmitField disabled={isSubmitting} />
      </AutoForm>
    </Paper>
  }
}

export default withStyles(styles)(CreateTileScreen)
