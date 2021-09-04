/* global Meteor */
import { Component, Fragment } from 'react'
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

class Register extends Component {
  state = {
    username: '',
    password: '',
    email: '',
    name: '',
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

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  handleClickShowPassword = (event) => {
    this.setState({
      showPassword: !this.state.showPassword
    })
  }

  handleSubmit = async (event) => {
    import { Accounts } from 'meteor/accounts-base'
    import { getPromise, callAsync } from 'meteor/npdev:async-proxy'
    event.preventDefault()
    const { username, password, email, name } = this.state
    try {
      this.setState({
        error: null,
        errorField: null
      })
      await getPromise(Accounts.createUser, { username, password, email })
      await callAsync('updateMyProfileName', name)
    } catch (error) {
      let newState = {}
      switch (error.reason) {
        case 'Username already exists.':
          newState = {
            error: <Fragment>
              Username taken. Choose another, or <Link to="/forgot-password">Recover Password</Link>.
            </Fragment>,
            errorField: 'username'
          }
          break
        case 'Email already exists.':
          newState = {
            error: <Fragment>
              Email associated with account. <Link to="/forgot-password">Recover Password?</Link>
            </Fragment>,
            errorField: 'email'
          }
          break
        default:
          console.error(error)
      }
      this.setState(newState)
      return
    }


    // :HACK: Forces fetch of missing profile data, including role information
    getPromise(Meteor.loginWithPassword, username, password)

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
    const { username, email, name, password, error, errorField, showPassword, redirect } = this.state
    return <div className="account register-form">
      {redirect && <Redirect to={redirect} />}
      <Typography component="p">Sign up for your FREE account below!</Typography>
      <form onSubmit={this.handleSubmit} autoComplete="off">
        <input style={{ position: 'fixed', left: -1000 }} type="text" name="username" id="username" />
        <input style={{ position: 'fixed', left: -1000 }} type="password" name="password" id="password" />
        <div>
          <TextField
            required
            value={username}
            onChange={this.handleUsernameChange}
            label="Username"
            margin="normal"
            autoComplete="nope"
            helperText={errorField === 'username' ? error : 'Your public handle - everyone can see it'}
            error={errorField === 'username'}
            fullWidth
          />
        </div>
        <div>
          <TextField
            type="email"
            value={email}
            onChange={this.handleEmailChange}
            label="Email"
            margin="normal"
            autoComplete="nope"
            helperText={errorField === 'email' ? error : 'Optional, but needed for password recovery'}
            error={errorField === 'email'}
            fullWidth
          />
        </div>
        <div>
          <TextField
            value={name}
            onChange={this.handleNameChange}
            label="Full Name"
            margin="normal"
            autoComplete="nope"
            helperText={errorField === 'name' ? error : 'Optional'}
            error={errorField === 'name'}
            fullWidth
          />
        </div>
        <div>
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
        </div>
        <FormControl margin="normal" fullWidth>
          <Button variant="contained" type="submit" color="primary" className="button">
            Sign Up
          </Button>
        </FormControl>
        <Typography component="p" align="center">
          <Link className="linkified" style={{ fontWeight: 'bold' }} to={{
            pathname: '/sign-in',
            state: this.props.location.state
          }}>Log in</Link> &nbsp; | &nbsp; <Link className="linkified" to="/forgot-password">Forgot Password?</Link>
        </Typography>
      </form>
    </div>
  }
}

export default Register
