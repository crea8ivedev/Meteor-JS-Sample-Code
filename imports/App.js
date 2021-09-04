import { Loadable } from 'meteor/npdev:react-loadable'
import { Helmet } from 'react-helmet-async'
import { Switch, Route, Redirect } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import Loading from './ui/common/Loading'
import { AccountProvider } from './api/connectors/account'
import PrivateRoute from './ui/common/PrivateRoute'
import { Paper, Typography } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import theme from './ui/common/theme'


const MainLayout = Loadable({
  loader: () => import('./ui/layouts/MainLayout'),
  loading: Loading
})

const Manage = Loadable({
  loader: () => import('./ui/manage/Manage'),
  loading: Loading
})
const EditProfile = Loadable({
  loader: () => import('./ui/manage/EditProfile'),
  loading: Loading
})

const Login = Loadable({
  loader: () => import('./ui/account/Login'),
  loading: Loading
})
const Register = Loadable({
  loader: () => import('./ui/account/Register'),
  loading: Loading
})
const ForgotPassword = Loadable({
  loader: () => import('./ui/account/ForgotPassword'),
  loading: Loading
})
const ResetPassword = Loadable({
  loader: () => import('./ui/account/ResetPassword'),
  loading: Loading
})
const NotFound = Loadable({
  loader: () => import('./ui/common/NotFound'),
  loading: Loading
})

const AdminApp = Loadable({
  loader: () => import('./admin/AdminApp'),
  loading: Loading
})


const userId = Meteor.userId();
export default function App (props) {
  return <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={3}>
      <AccountProvider>
        <Switch>
          <Route path="/sign-in" render={(props) => (
            <MainLayout pageClass="page home" {...props}>
              <Helmet>
                <title>Sign In - crea8ivedev</title>
              </Helmet>
              <div className="account-main">
                <Paper className="account-paper" elevation={4}>
                  <Typography variant="h5" component="p">
                  crea8ivedev
                  </Typography>
                  <Login mode="login" {...props} />
                </Paper>
              </div>
            </MainLayout>
          )} />
          <Route path="/sign-up" render={(props) => (
            <MainLayout pageClass="page sign-up" {...props}>
              <Helmet>
                <title>Sign Up - crea8ivedev</title>
              </Helmet>
              <div className="account-main">
                <Paper className="account-paper" elevation={4}>
                  <Typography variant="h5" component="p">
                  crea8ivedev
                  </Typography>
                  <Register mode="sign-up" {...props} />
                </Paper>
              </div>
            </MainLayout>
          )} />
          <Route path="/forgot-password" render={(props) => (
            <MainLayout pageClass="page forgot-password" {...props}>
              <Helmet>
                <title>Retrieve Password - crea8ivedev</title>
              </Helmet>
              <div className="account-main">
                <Paper className="account-paper" elevation={4}>
                  <Typography variant="h5" component="p">
                  crea8ivedev
                  </Typography>
                  <ForgotPassword {...props} />
                </Paper>
              </div>
            </MainLayout>
          )} />
          <Route path="/reset-password/:token" render={(props) => (
            <MainLayout pageClass="page reset-password" {...props}>
              <div className="account-main">
                <Paper className="account-paper" elevation={4}>
                  <Typography variant="h5" component="p">
                  crea8ivedev
                  </Typography>
                  <ResetPassword token={props.match.params.token} {...props} />
                </Paper>
              </div>
            </MainLayout>
          )} />
          <PrivateRoute path="/admin" render={(props) => (
            <AdminApp {...props} />
          )} />


          <PrivateRoute path="/activity" render={(props) => (
            <MainLayout {...props}>
              <Helmet>
                <title>Activity - PixStori</title>
              </Helmet>
              <Activity limit={100} {...props} />
            </MainLayout>
          )} />
          <PrivateRoute path="/manage/editProfile" render={(props) => (
            <MainLayout {...props}>
              <Helmet>
                <title>Edit Profile - PixStori</title>
              </Helmet>
              <EditProfile {...props} />
            </MainLayout>
          )} />
          <PrivateRoute path="/manage" render={(props) => (
            <MainLayout {...props}>
              <Helmet>
                <title>Manage - PixStori</title>
              </Helmet>
              <Manage {...props} />
            </MainLayout>
          )} />


          <Route path="/pages/:pageSlug" render={(props) => (
            <MainLayout {...props}>
              <Page {...props.match.params} />
            </MainLayout>
          )} />
          <Route path="/tags/:hashtag" render={(props) => (
            <MainLayout {...props}>
              <TagFeed hashtag={props.match.params.hashtag} {...props} />
            </MainLayout>
          )} />
          <Route path="/mentions/:mention" render={(props) => (
            <MainLayout {...props}>
              <MentionFeed mention={props.match.params.mention} {...props} />
            </MainLayout>
          )} />
          <Route path="/contact" render={(props) => (
            <MainLayout {...props}>
              <Helmet>
                <title>Contact PixStori</title>
              </Helmet>
              <ContactUs {...props} />
            </MainLayout>
          )} />
          <Route path="/" render={(props) => (
            <MainLayout {...props}>
              <Helmet>
                <title>PixStori</title>
              </Helmet>
            </MainLayout>
          )} />

          <Route render={(props) => (
            <MainLayout {...props}>
              <NotFound {...props} />
            </MainLayout>
          )} />
        </Switch>
      </AccountProvider>
    </SnackbarProvider>
  </ThemeProvider>
}
