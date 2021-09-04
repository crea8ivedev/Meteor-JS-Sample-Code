/* global Meteor */
import { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import ToggleIcon from 'material-ui-toggle-icon'
import Typography from '@material-ui/core/Typography'

class Login extends Component {
  state = {
    username: '',
    password: '',
    error: null,
    errorField: null,
    showPassword: false,
    redirect: null
  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value
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

  handleSubmit = async (event) => {
    import { getPromise, callAsync } from 'meteor/npdev:async-proxy'
    event.preventDefault()
    const { username, password } = this.state
    try {
      this.setState({
        error: null,
        errorField: null
      })
      await getPromise(Meteor.loginWithPassword, username, password)
    } catch (error) {
      if (error.error === 403) {
        this.setState({
          error: error.reason,
          errorField: error.reason === 'User not found' ? 'username' : 'password'
        })
      } else {
        console.error(error)
      }
      return
    }

    // Move the user to the requested resource
    const { state } = this.props.location
    const pathname = state?.from || '/'

    // Give the reactive subscription a chance to react to the account status change
    Meteor.defer(() => {
      this.setState({
        redirect: pathname
      })
    })
  }

  render () {
    const { username, password, error, errorField, showPassword, redirect } = this.state
    return <form className="login-form account" onSubmit={this.handleSubmit}>
      {redirect && <Redirect to={redirect} />}
      <div>
        <TextField
          required
          fullWidth
          margin="normal"
          value={username}
          onChange={this.handleUsernameChange}
          id="username"
          label="Username or Email Address"
          autoComplete="current-username"
          helperText={errorField === 'username' ? error : ''}
          error={errorField === 'username'}
        />
      </div>
      <div>
        <FormControl fullWidth margin="normal">
          <InputLabel
            htmlFor="password"
            error={errorField === 'password'}
          >Password</InputLabel>
          <Input
            required
            key={showPassword ? 'text' : 'password'}
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={this.handlePasswordChange}
            error={errorField === 'password'}
            autoComplete="current-password"
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
      </div>

      <FormControl margin="normal" fullWidth>
        <Button variant="contained" type="submit" color="primary" className="button">
          Log In
        </Button>
      </FormControl>
      <Typography component="p" align="center">
        <Link className="linkified" style={{ fontWeight: 'bold' }} to={{
          pathname: '/sign-up',
          state: this.props.location.state
        }}>Sign up!</Link> &nbsp; | &nbsp; <Link className="linkified" to="/forgot-password">Forgot Password?</Link>
      </Typography>
    </form>
  }
}

export default Login
