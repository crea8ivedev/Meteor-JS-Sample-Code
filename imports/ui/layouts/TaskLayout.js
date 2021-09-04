import { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ConnectionBanner from '../common/ConnectionBanner'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import { Hidden } from '@material-ui/core'

const styles = (theme) => ({
  // #root defined in main.scss
  appBar: {
    flex: '0 0 auto',
    background: theme.palette.common.white
  },
  main: {
    padding: '0',
    margin: '0 auto',
    width: '100%',
    height: '100%',
    background: '#e7e4e6',
    position: 'relative',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  flex: {
    display: 'flex',
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  logo: {
    flex: '1 1 auto',
    textAlign: 'center'
  },
  side: {
    flex: '1 1 0'
  }
})

class TaskLayout extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    backTo: PropTypes.object.isRequired,
    backToLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  static contextTypes = {
    history: PropTypes.object
  }

  render() {
    const { classes, children, backTo, backToLabel, groupId,hideMakeButton,isSubGroupPreview, pscLayout } = this.props
    const userId = Meteor.userId();
    return <Fragment>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
       <div className={classes.side}>
       {userId &&  <Button aria-label="Back" component={Link} to={backTo}>
              <ChevronLeftIcon className={classes.leftIcon} />
              <Hidden xsDown>{backToLabel}</Hidden>
              <Hidden smUp>Back</Hidden>
            </Button>
         } </div>
        </Toolbar>
        <ConnectionBanner />
      </AppBar>
      <div className={classes.main}>
        {children}
      </div>
    </Fragment>
  }
}

export default withStyles(styles)(TaskLayout)
