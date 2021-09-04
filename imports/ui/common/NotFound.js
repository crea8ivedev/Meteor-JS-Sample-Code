
import { Helmet } from 'react-helmet-async'
import { Card, CardContent } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

const styles = (theme) => ({
  card: theme.mixins.gutters({
    maxWidth: 600,
    minWidth: 320,
    width: '100%',
    margin: `${theme.spacing(2)}px auto`,
    padding: '0 !important'
  })
})

const NotFound = ({ classes }) => <Card className={classes.card} square>
  <Helmet>
    <title>Not Found</title>
  </Helmet>
  <CardContent>Not Found...</CardContent>
</Card>

export default withStyles(styles)(NotFound)
