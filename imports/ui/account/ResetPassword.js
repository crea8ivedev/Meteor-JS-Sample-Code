import { Accounts } from 'meteor/accounts-base'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  IconButton,
  FormHelperText,
  Button
} from '@material-ui/core'
import {
  Visibility,
  VisibilityOff
} from '@material-ui/icons'
import ToggleIcon from 'material-ui-toggle-icon'

class ResetPassword extends Component {
  state = {
    isLoading: false,
    successMessage: '',
    errorField: null,
    error: null,
    password: '',
    showPassword: false
  }

  handleSubmit = (event) => {
    event.preventDefault()

    this.setState({
      isLoading: true,
      errorField: null,
      error: null
    })

    Accounts.resetPassword(this.props.token, this.state.password, (error) => {
      if (!error) {
        this.setState({
          isLoading: false,
          successMessage: 'Your password has been reset.',
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

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  handleClickShowPassword = (event) => {
    this.setState({
      showPassword: !this.state.showPassword
    })
  }

  render () {
    const { successMessage, error, errorMessage, errorField, password, showPassword } = this.state

    if (successMessage) {
      return <div className="form-root">
        <p>{successMessage}</p>
        <p><Link className="linkified" to="/sign-in">Click here to sign in!</Link></p>
      </div>
    }

    return <div className="form-root">
      {/* TODO: replace span with snackbar or related Material UI */}
      <p>{errorMessage}</p>
      {/* <span className={classes.error}>{ errorMessage }</span> */}
      <p>Enter a new password</p>
      <form onSubmit={this.handleSubmit}>
        <FormControl margin="normal" fullWidth>
          <InputLabel
            htmlFor="new-password"
            error={errorField === 'password'}
          >Password *</InputLabel>
          <Input
            required
            key={showPassword ? 'text' : 'password'}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={this.handlePasswordChange}
            error={errorField === 'password'}
            autoComplete="nope"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                >
                  <ToggleIcon
                    on={showPassword}
                    onIcon={<Visibility />}
                    offIcon={<VisibilityOff />}
                  />
                </IconButton>
              </InputAdornment>
            }
          />
          {errorField === 'password' &&
            <FormHelperText id="weight-helper-text" error>{error}</FormHelperText>}
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <Button variant="contained" type="submit" color="primary" className="button">
            Reset Password
          </Button>
        </FormControl>
      </form>
    </div>
  }
}

export default ResetPassword
