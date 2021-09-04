import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Hidden,
  Paper,
  Badge,
  BottomNavigation,
  BottomNavigationAction
} from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import HomeIcon from '@material-ui/icons/Home'
import AssignmentInd from '@material-ui/icons/AssignmentInd'
import ConnectionBanner from '../common/ConnectionBanner'
import { useAccount } from '/imports/api/connectors/account'



const MainLayout = ({ children,groupId,type, location, hideMakeButton, hideNavBar, backTo, backToLabel = '' }) => {
  const value = location.pathname.split('/', 2).slice(0, 2).join('/')
  const { isLoggedIn } = useAccount()
return <Fragment>
    <AppBar position="static" className="appBar">
      <Toolbar>
 
      </Toolbar>
      <ConnectionBanner />
    </AppBar>
    <div className="main">
      {children}
    </div>
    {!hideNavBar && <Paper className="bottomPaper">
      <BottomNavigation
        value={value} showLabels
        onChange={this.handleChange}
        className="bottomNavigation"
      >
        <BottomNavigationAction component={Link} to="/" classes={{ selected: 'selected', root: 'navAction' }}
          label="Home" value="/" icon={<HomeIcon />} />
      {!isLoggedIn
          ? <BottomNavigationAction component={Link} to="/manage" classes={{ selected: 'selected', root: 'navAction' }}
            label="Sign In" value="/sign-in" icon={<PersonIcon />} />:''}
        {!isLoggedIn
          ? <BottomNavigationAction component={Link} to="/sign-up" style={{ transform: 'scale(1.1)' }} classes={{ selected: 'selected', root: 'navAction' }}
            label={<strong>Sign Up!</strong>} value="/sign-up" icon={<AssignmentInd />} />
          : <BottomNavigationAction component={Link} to="/manage" classes={{ selected: 'selected', root: 'navAction' }}
            label="Manage" value="/manage" icon={<PersonIcon />} />}
      </BottomNavigation>
    </Paper>}
  </Fragment>
}

export default MainLayout
