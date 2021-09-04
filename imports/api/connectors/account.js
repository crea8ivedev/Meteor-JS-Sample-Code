/* global Meteor */
import { createContext, useContext } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { isSuperAdmin, getUserRoles,isGroupAdmin,isMuseumAdmin } from '/imports/utils/roles'

// This can be used directly, but is also used by the Context provider
export const useAccountDirect = () => useTracker(() => {
  const user = Meteor.user()
  const userId = Meteor.userId()
  const roles = userId && getUserRoles(userId)
  return {
    user,
    userId,
    isLoggedIn: !!userId,
    isSuperAdmin: userId && isSuperAdmin(userId),
    roles: roles
  }
}, [])

// This can be used directly, but is also used by the Context provider
export const useAccountDirectSubGroup = () => useTracker(() => {
  let url = this.location.pathname;
  url = url.split("/");
  const userId = Meteor.userId();
  return {
    isLoggedIn: !!userId,
    isSuperAdmin: userId && isSuperAdmin(userId),
    isGroupAdmin: isGroupAdmin(userId,url[3]),
  }
}, [])


// This can be used directly, but is also used by the Context provider
export const useAccountDirectMuseum = () => useTracker(() => {
  let url = this.location.pathname;
  url = url.split("/");
  const userId = Meteor.userId();
  return {
    isLoggedIn: !!userId,
    isSuperAdmin: userId && isSuperAdmin(userId),
    isMuseumAdmin: isMuseumAdmin(userId),
  }
}, [])

const AccountContext = createContext('account')

export const AccountProvider = (props) => (
  <AccountContext.Provider value={useAccountDirect()}>
    {props.children}
  </AccountContext.Provider>
)
export const AccountConsumer = AccountContext.Consumer

// This requires AccountProvider to be included in the app tree.
 export const useAccount = () => useContext(AccountContext)
//export const useAccount = useAccountDirect

// Provides a backward compatible HOC to replace
// the old `withTracker` version.
export const withUser = (Component) => (props) => {
  const account = useAccount()
  return <Component {...props} {...account} />
}
