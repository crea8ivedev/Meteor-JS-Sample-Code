import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { withTracker } from 'meteor/react-meteor-data'
import { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
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
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { Redirect, Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { isSuperAdmin, checkUserRoles } from '/imports/utils/roles'
import { callAsync } from 'meteor/npdev:async-proxy'
import {
  AutoForm,
  ErrorsField,
  SubmitField
} from 'uniforms-material'
import { EditUserProfileSchema, EditUserProfileBridge } from '/imports/api/collections/Users'
import UploadField from '/imports/ui/common/uniformFields/UploadField'
import { List, ListItem, ListItemText, Divider } from '@material-ui/core'

const styles = theme => ({
  card: theme.mixins.gutters({
    maxWidth: 600,
    minWidth: 320,
    width: '100%',
    margin: `${theme.spacing(2)}px auto`,
    padding: '0 !important'
  }),
  profileImage: {
    textAlign: 'center'
  },
  cover: {
    width: 151,
    height: 151,
    borderRadius: '50%',
    marginBottom: theme.spacing(2),
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  button: {
    margin: theme.spacing(1)
  },
  table: {
    marginBottom: theme.spacing(2)
  },
  modal: {
    maxWidth: 600,
    minWidth: 320,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  },
  '@media (min-width: 480px)': {
    profileImage: {
      textAlign: 'center',
      display: 'flex'
    },
    cover: {
      marginLeft: 0,
      marginRight: theme.spacing(2)
    }
  }
})

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose
        ? (
          <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
          )
        : null}
    </MuiDialogTitle>
  )
})

class Profile extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object,
    userId: PropTypes.string,
    isSuperAdmin: PropTypes.bool,
    isGuestCurator: PropTypes.bool,
    redirectTo: PropTypes.string
  }

  state = {
    photo: {},
    isSubmitting: false,
    errorMessage: null,
    profileOpen: false,
    passwordOpen: false,
    oldPassword: '',
    password: '',
    errorField: null,
    showPassword: false,
    showOldPassword: false,
    redirectTo: ''
  }

  handleLogoutClick = (event) => {
    this.setState({
      redirectTo: '/sign-in'
    })
    Meteor.logout()
    setTimeout(() => {
      location.reload()
    }, 50)
  }

  handleOpenProfileImage = () => {
    this.setState({ profileOpen: true })
  }

  handleCloseProfileImage = () => {
    this.setState({ profileOpen: false })
  }

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  handleOldPasswordChange = (event) => {
    this.setState({
      oldPassword: event.target.value
    })
  }

  handleClickShowOldPassword = () => {
    this.setState({ showOldPassword: !this.state.showOldPassword })
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }

  handleOpenPassword = () => {
    this.setState({ passwordOpen: true })
  }

  handleClosePassword = () => {
    this.setState({ passwordOpen: false, password: '', oldPassword: '', errorField: null, errorMessage: '' })
  }

  handleChangePassword = (event) => {
    const { password, oldPassword } = this.state
    Accounts.changePassword(oldPassword, password, (error) => {
      if (error) {
        console.error(error)
        this.setState({
          errorField: 'oldPassword',
          errorMessage: error.reason
        })
        return
      }
      this.handleClosePassword()
    })
  }

  handlePhotoUpload = async (profileImage) => {
    if (this.state.isSubmitting) return
    this.setState({
      isSubmitting: true,
      errorMessage: null
    })

    const profile = { _id: Meteor.userId(), profileImage: profileImage.profileImage }

    try {
      await callAsync('updateProfilePic', profile)
    } catch (error) {
      console.error(error)
      this.setState({
        isSubmitting: false,
        errorMessage: error
      })
      return
    } finally {
      this.setState({
        isSubmitting: false,
        profileOpen: false
      })
    }
  }

  render () {
    const { classes, user, isSuperAdmin, isGuestCurator } = this.props
    const { photo, isSubmitting, errorMessage, showPassword, showOldPassword, errorField, password, oldPassword } = this.state

    const redirectTo = this.props.redirectTo || this.state.redirectTo
    if (redirectTo) {
      return <Redirect to={redirectTo} />
    }

    if (!user) {
      return <div>Loading...</div>
    }

    let imageUrl = '/images/profile.png'
    let profileName = 'Edit Profile'
    const { emails } = user

    if (user.profile) {
      const { profile } = user
      if (profile.name) profileName = profile.name
      if (profile.profileImage) {
        imageUrl = profile.profileImage
      }
    }

    const profileImageOptions = {
      width: 151,
      height: 151,
      crop: 'thumb',
      gravity: 'face',
      zoom: '0.9'
    }

    return <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">Name:</TableCell>
              <TableCell>{profileName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Email(s):</TableCell>
              <TableCell>{!emails || emails.length < 1 ? 'no emails' : emails.map(email => <Typography key={email.address}>{email.address}</Typography>)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button variant="contained" color="default" className={classes.button} onClick={this.handleOpenPassword}>Change Password</Button>
        <Button variant="contained" color="default" className={classes.button} component={Link} to="/manage/editProfile">Edit&nbsp;Profile</Button><br />
        <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleLogoutClick}>Log Out</Button><br />
        <Divider /><br />
      </CardContent>
      <Dialog
        open={this.state.profileOpen}
        onClose={this.handleCloseProfileImage}
        aria-labelledby="profile-image-form-title"
      >
        <DialogTitle id="profile-image-form-title" onClose={this.handleCloseProfileImage}>Profile Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upload a profile image.
          </DialogContentText>
          <AutoForm
            fullWidth
            error={errorMessage}
            schema={EditUserProfileBridge}
            model={EditUserProfileSchema.clean(photo)}
            onSubmit={this.handlePhotoUpload}
            disabled={isSubmitting}>
            <UploadField name="profileImage" fullWidth />
            <ErrorsField />
            <SubmitField disabled={isSubmitting} />
          </AutoForm>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseProfileImage} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={this.state.passwordOpen}
        onClose={this.handleClosePassword}
        aria-labelledby="change-password-form-title"
      >
        <DialogTitle id="change-password-form-title" onClose={this.handleClosePassword}>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a new Password
          </DialogContentText>
          <form>
            <FormControl fullWidth margin="normal">
              <InputLabel
                htmlFor="oldPassword"
                error={errorField === 'oldPassword'}
              >Current Password</InputLabel>
              <Input
                required
                key={showOldPassword ? 'text1' : 'password1'}
                id="oldPassword"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={this.handleOldPasswordChange}
                error={errorField === 'oldPassword'}
                autoComplete="current-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowOldPassword}
                    >
                      <ToggleIcon
                        on={showOldPassword}
                        onIcon={<Visibility />}
                        offIcon={<VisibilityOff />}
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errorField === 'oldPassword' &&
                <FormHelperText id="weight-helper-text" error>{errorMessage}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel
                htmlFor="password"
                error={errorField === 'password'}
              >New Password</InputLabel>
              <Input
                required
                key={showPassword ? 'text' : 'password'}
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={this.handlePasswordChange}
                error={errorField === 'password'}
                autoComplete="new-password"
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
                <FormHelperText id="weight-helper-text" error>{errorMessage}</FormHelperText>}
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClosePassword} color="default">
            Cancel
          </Button>
          <Button onClick={this.handleChangePassword} color="secondary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  }
}

// Use withTracker for "reactive" Meteor data sources

const ProfileContainer = withTracker((props) => {
  const user = Meteor.user()
  const userId = Meteor.userId()
  const isGuestCurator = checkUserRoles(userId, ['curator'])
  return { user, userId, isSuperAdmin: userId && isSuperAdmin(userId), isGuestCurator }
})(Profile)

const ProfileStyle = withStyles(styles)(ProfileContainer)

export default ProfileStyle
