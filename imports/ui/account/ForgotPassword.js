import { Accounts } from 'meteor/accounts-base'
import { Component } from 'react'
import { ForgotPasswordBridge } from '/imports/api/collections/UserActivity'
import {
  AutoForm,
  TextField,
  ErrorsField,
  SubmitField
} from 'uniforms-material'

class ForgotPassword extends Component {
  state = {
    isLoading: false,
    onSuccess: '',
    errorMessage: '',
    error: null,
    email: { email: '' }
  }

  handleSubmit = async (data) => {
    this.setState({
      isLoading: true,
      errorMessage: '',
      error: null
    })

    Accounts.forgotPassword({ email: data.email }, (error) => {
      if (!error) {
        this.setState({
          isLoading: false,
          onSuccess: 'Reset password link sent to your email',
          error: null,
          errorMessage: ''
        })
      } else {
        console.error(error.reason)
        this.setState({
          isLoading: false,
          errorMessage: error.reason,
          error: error
        })
      }
    })
  }

  render () {
    const { isLoading, onSuccess, error, email } = this.state

    return (
      <div className="form-root account">
        {/* TODO: replace span with snackbar or related Material UI */}
        <span className="success">{onSuccess}</span>
        {/* <span className="error">{ errorMessage }</span> */}
        <p>Enter your registered e-mail address</p>
        <AutoForm
          error={error}
          schema={ForgotPasswordBridge}
          onSubmit={this.handleSubmit}
          model={email}
          disabled={isLoading}
        >
          <TextField name="email" />
          <ErrorsField />
          <SubmitField disabled={isLoading} />
        </AutoForm>
      </div>
    )
  }
}

export default ForgotPassword
