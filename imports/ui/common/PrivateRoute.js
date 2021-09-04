import { Route, Redirect } from 'react-router-dom'
import { useAccountDirect } from '/imports/api/connectors/account'

// This is doing double duty. It protects the auth routes,
// but also prevents SSR from trying to render these
// routes.
export default function PrivateRoute ({ render, ...props }) {
  // The react router redirect mechanism is faster than trackers update,
  // so we use the direct account data instead of the context based one.
  const account = useAccountDirect()
  return <Route render={
    (routeProps) => (account.isLoggedIn
      ? render(Object.assign({}, props, routeProps))
      : <Redirect replace to={{
        pathname: '/sign-in',
        state: { from: props.location.pathname }
      }} />)
  } />
}
