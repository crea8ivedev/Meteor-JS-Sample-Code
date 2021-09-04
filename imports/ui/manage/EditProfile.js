import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {
  AutoForm,
  // BoolField,
  TextField,
  SubmitField,
  ListField,
  ListItemField,
  ErrorsField,
  NestField
} from 'uniforms-material'
import Paper from '@material-ui/core/Paper'
import withStyles from '@material-ui/styles/withStyles'
import { callAsync } from 'meteor/npdev:async-proxy'

import { EditMyUserBridge } from '/imports/api/collections/Users'

const styles = (theme) => ({
  root: theme.mixins.gutters({
    padding: `${theme.spacing(2)}px 0`,
    maxWidth: 600,
    minWidth: 300,
    width: '100%',
    margin: 'auto'
  }),
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing(3) + 'px auto',
    minWidth: 300,
    width: '100%'
  })
})

class EditProfile extends Component {
  state = {
    redirectTo: '',
    isSubmitting: false,
    errorMessage: null,
    open: false
  }

  handleSubmit = async (user) => {
    if (this.state.isSubmitting) return

    this.setState({
      isSubmitting: true,
      errorMessage: null
    })
    let result
    try {
      result = await callAsync('updateMyUser', user)
    } catch (error) {
      console.error(error)
      this.setState({
        isSubmitting: false,
        errorMessage: error
      })
      return
    }
    if (result) {
      this.setState({ redirectTo: '/manage' })
    }
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render () {
    const { classes, user } = this.props
    const { redirectTo, isSubmitting, errorMessage } = this.state
    if (redirectTo) {
      return <Redirect to={redirectTo} />
    }
    return <div className="central-scrollable">
      <Paper className={classes.root}>
        <h2>Edit User: </h2>
        <AutoForm
          error={errorMessage}
          schema={EditMyUserBridge}
          onSubmit={this.handleSubmit}
          model={user}
          disabled={isSubmitting}
        >
          <TextField name="username" disabled margin="normal" />
          <NestField name="profile">
            <TextField name="name" />
          </NestField>
          <ListField name="emails">
            <ListItemField name="$">
              <NestField name="">
                <TextField name="address" />
                {/* <BoolField name="verified" disabled /> */}
              </NestField>
            </ListItemField>
          </ListField>
          <ErrorsField />
          <SubmitField disabled={isSubmitting} label="Update" />
        </AutoForm>
      </Paper>
    </div>
  }
}

const EditProfileContainer = withTracker(props => {
  const user = Meteor.user()
  // monkey patch the roles array out
  user && delete user.roles
  return {
    userId: Meteor.userId(),
    user
  }
})(EditProfile)

export default withStyles(styles)(EditProfileContainer)
