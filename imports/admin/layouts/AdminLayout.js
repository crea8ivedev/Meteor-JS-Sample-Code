import { Meteor } from 'meteor/meteor'
import { Component, Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'
import { withStyles } from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import TileIcon from '@material-ui/icons/BorderAll'
import GroupIcon from '@material-ui/icons/GroupWork'
import CommentIcon from '@material-ui/icons/ModeComment'
import UserIcon from '@material-ui/icons/Group'
import PageIcon from '@material-ui/icons/InsertDriveFile'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import cx from '/imports/utils/classnames'
import { AccountConsumer } from '/imports/api/connectors/account'
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import { isValidRole,isGroupAdmin } from '/imports/utils/roles'
import DashboardIcon from '@material-ui/icons/Dashboard'
import SettingsIcon from '@material-ui/icons/Settings'
import EmailIcon from '@material-ui/icons/Email'
import LoadingOverlay from 'react-loading-overlay'
import FeedbackIcon from '@material-ui/icons/Feedback';


const userId = Meteor.userId()

class UserContent extends Component {
  render(){
     const {groupId} = this.props;
     return  <Fragment>

   <ListItem button component={Link} to='/admin/users'>
      <ListItemIcon>
        <UserIcon />
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItem>
  </Fragment>
  }

}





const drawerWidth = 240

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 430,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    overflow: 'auto',
    '-webkit-overflow-scrolling': 'touch'
  },
  flex: {
    display: 'flex',
    flex: 1
  },
  headerLink: {
    color: 'inherit',
    textDecoration: 'none'
  }
})

class AdminLayout extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  }

  state = {
    anchorEl: null,
    open: false,
    redirectTo: null,
    isLoaderStatus: false,
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleNavigation = event => {
    switch (event.currentTarget.value) {
      case 0:
        this.setState({ redirectTo: '/manage' })
        break
      case 1:
        this.setState({ redirectTo: null })
        break
    }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true })
  }

  handleDrawerClose = () => {
    this.setState({ open: false })
  }

  handleLogoutClick = () => {
    this.setState({ isLoaderStatus: true })
    Meteor.logout()
    this.setState({ isLoaderStatus: false })
  }

  render() {
    const { classes, theme } = this.props
    const { anchorEl, redirectTo } = this.state
    const open = Boolean(anchorEl)
    const { children, title } = this.props
    if (redirectTo) {
      return <Redirect to={redirectTo} />
    }

    return <div className={classes.root}>
            <LoadingOverlay className='admin-loader' active={this.state.isLoaderStatus} spinner text='Please Wait...' />
      {title && <Helmet><title>{title}</title></Helmet>}
      <AppBar className={cx(classes.appBar, this.state.open && classes.appBarShift)}>
        <Toolbar disableGutters={!this.state.open}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerOpen}
            className={cx(classes.menuButton, this.state.open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            <Link to="/admin" className={classes.headerLink}>Admin</Link>
          </Typography>
          <AccountConsumer>{
            (account) => <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem value='0' onClick={this.handleNavigation}>Profile</MenuItem>
                {/* <MenuItem value='1' onClick={this.handleNavigation}>My account</MenuItem> */}
                <MenuItem onClick={this.handleLogoutClick}>Sign Out</MenuItem>
              </Menu>
            </div>
          }</AccountConsumer>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: cx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose)
        }}
        open={this.state.open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List><UserContent   /></List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  }
}

export default withStyles(styles, { withTheme: true })(AdminLayout)
