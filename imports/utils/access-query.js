import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'

/**
 * Gets a permissive access query for any tile the user might have access to, for whatever reason.
 * This includes, public access, group membership, group administration, and tile ownership.
 * This does not include private shareable tiles, since those should not appear in feeds. Permissions
 * to grab those will be added in the single query connector used by the single screen.
 * @param {withUser} withUser This flag will allow the user to skip user specific access (in SSR for example)
 */
export function getAccessQuery () {
  // Load tiles this user has rights to view, including private ones
  const user = Meteor.user()

  // For users who are not logged in, deliver a set of "public" documents
  const publicQuery = { public: true }
  const query = user
    ? {
      $or: [
        publicQuery,
        { groupId: { $in: Roles.getScopesForUser(user, 'member') } },
        { owner: user._id }
      ]
    }
    : publicQuery

  return query
}

/**
 * Gets a permissive access query for any Group the user might have access to, for whatever reason.
 * This includes, public, listable, group membership, and group administration, and group ownership.
 * @param {withUser} withUser This flag will allow the user to skip user specific access (in SSR for example)
 */
export function getGroupAccessQuery () {
  // Load groups this user has rights to view, including private ones
  const user = Meteor.user()

  // Only load listable groups, and groups the current user has access to
  const publicQuery = { listable: true }
  const query = user
    ? {
      $or: [
        publicQuery,
        { _id: { $in: Roles.getScopesForUser(user, 'member') } },
        { owner: user._id }
      ]
    }
    : publicQuery

  return query
}
