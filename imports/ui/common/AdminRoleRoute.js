import { Route, Redirect } from 'react-router-dom'
import { useAccountDirect } from '/imports/api/connectors/account'

// This is doing double duty. It protects the auth routes,
// but also prevents SSR from trying to render these
// routes.
export default function AdminRoleRoute({ render, ...props }) {
  // The react router redirect mechanism is faster than trackers update,
  // so we use the direct account data instead of the context based one.
  const roles = props.roles
  const account = useAccountDirect()
  let validRole = true
  return <Route render={
    (routeProps) => (validRole
      ? render(Object.assign({}, props, routeProps))
      : <Redirect replace to={{
        pathname: '/'
      }} />)
  } />
}
