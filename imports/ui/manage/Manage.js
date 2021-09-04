import { Component, Fragment } from 'react'
import PropTypes, { arrayOf } from 'prop-types'
import { Route, Switch, Link } from 'react-router-dom'
import { Loadable } from 'meteor/npdev:react-loadable'
import { withStyles } from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Profile from './Profile'
import Loading from '../common/Loading'
import { isSuperAdmin, isMuseumAdmin } from '/imports/utils/roles'



const styles = theme => ({
  root: {
    maxWidth: 600,
    minWidth: 320,
    width: '100%',
    margin: 'auto'
  },
  search: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  searchField: {
    width: '100%'
  },
  selected: {},
  tabs: {
    color: theme.palette.grey[500],
    '&$selected': {
      color: theme.palette.grey[700]
    }
  }
})

const tabLookup = (key) => ({
  '/manage/': 0,
  '/manage': 0,
  '/manage/my-groups': 1,
  '/manage/my-groups/new': 1,
  '/manage/my-groups/edit/:_id': 1,
  '/manage/my-tiles': 2,
  '/manage/collection-groups': 3,
  '/manage/collection-groups/new': 3,
  '/manage/mymuseum': 3,
  '/manage/mymuseum/': 3,
}[key])

class ManageScreen extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  }

  state = {
    tabValue: tabLookup(this.props.location.pathname)
  }

  handleChange = (event, tabValue) => {
    this.setState({ tabValue })
  }

  render () {
    const { classes, location,tabValue } = this.props
    const userId = Meteor.userId();
    const museumAdmin = isMuseumAdmin(userId);
    // NOTE: We aren't actually using the state value, but we are leaving the handlers to force render.
    const index = tabLookup(location.pathname)

    return <div className="central-scrollable">
      <div className={classes.root}>
        <Switch>
         <Route path="/manage" render={(props) =>
            <Fragment>
              <AppBar position="static" color="default">
                <Tabs
                  value={index}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="Profile" value={tabValue} component={Link} to="/manage" classes={{ selected: classes.selected, root: classes.tabs }} />
         </Tabs>
              </AppBar>
              <Switch>
                <Route path="/manage" component={Profile} />
              </Switch>
            </Fragment>} />
        </Switch>
      </div>
    </div>
  }
}

export default withStyles(styles, { withTheme: true })(ManageScreen)
