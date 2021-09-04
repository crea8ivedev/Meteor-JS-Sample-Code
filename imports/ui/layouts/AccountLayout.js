import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import cx from '/imports/utils/classnames'
import ConnectionBanner from '../common/ConnectionBanner'

const styles = theme => ({
  appBar: {
    flex: '0 0 auto',
    background: theme.palette.common.white
  },
  main: {
    background: '#e7e4e6',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    flex: 1
  },
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing(3) + 'px auto',
    minWidth: 300,
    maxWidth: 600,
    width: '100%'
  }),
  loginWrap: {
    display: 'flex',
    justifyContent: 'center'
  },
  header: {
    display: 'flex',
    flex: 1,
    textDecoration: 'none'
  },
  flex: {
    display: 'flex',
    flex: 1
  },
  title: {
    textDecoration: 'none',
    textAlign: 'center'
  }
})

class AccountLayout extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render () {
    const { children, classes } = this.props
    return <Fragment>
      <AppBar position="static" className={classes.appBar}>
        <ConnectionBanner />
      </AppBar>
      <div className={classes.main}>
        <Paper className={classes.paper} square elevation={4}>
          <Typography variant="h5" component="p">
              crea8ivedev
          </Typography>
          {children}
        </Paper>
      </div>
    </Fragment>
  }
}

export default withStyles(styles)(AccountLayout)
