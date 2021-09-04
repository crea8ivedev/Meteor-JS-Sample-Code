import { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import moment from 'moment'
import { Methods } from 'meteor/npdev:async-proxy'

const styles = {
  root: {
    width: '100%',
    maxWidth: 360
  },
  card: {
    maxWidth: '50%',
    textAlign: 'center',
    margin: '0 auto'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  }
}

class UserViewScreen extends Component {
  state = {
    user: null
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData = async () => {
    const { _id } = this.props.match.params

    let result
    try {
      result = await Methods.adminGetUserById(_id)
    } catch (error) {
      console.error(error)
      // TODO: Display a useful error in UI
      return
    }
    this.setState({
      user: result
    })
  }

  render () {
    const { classes } = this.props
    const { user } = this.state

    if (!user) {
      return <div>Loading...</div>
    }

    const { profile, emails, username } = user

    return <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="#"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5">
            {user.title}
          </Typography>
          <Typography component="p">
            <div className={classes.root}>
              <List>
                <ListItem>
                  <ListItemText primary="Username:" />
                  <ListItemText primary={username} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Name:" />
                  <ListItemText primary={profile.name} />
                </ListItem>
                {emails && emails.map(({ address, verified }) => (
                  <ListItem>
                    <ListItemText primary="Email:" />
                    <ListItemText primary={address} />
                  </ListItem>
                ))}
                <ListItem>
                  <ListItemText primary="CreatedAt:" />
                  <ListItemText primary={moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} />
                </ListItem>
              </List>
            </div>
          </Typography>
        </CardContent>
      </Card>
    </div>
  }
}

UserViewScreen.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(UserViewScreen)
