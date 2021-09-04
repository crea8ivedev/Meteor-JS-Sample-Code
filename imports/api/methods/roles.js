import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import '/imports/utils/linkify-configured'
import { getUserRoles, assignRoles, revokeUserRoles, checkUserRoles } from '/imports/utils/roles'

Meteor.methods({
  async assignRoles (id, roles) {
    check(id, String)
    check(roles, Array)
    return await assignRoles(id, roles)
  },
  async getRoles (id) {
    check(id, String)
    return await getUserRoles(id)
  },
  async revokeRoles (id, roles) {
    check(id, String)
    check(roles, Array)
    return await revokeUserRoles(id, roles)
  },
  async checkRoles (id, roles) {
    check(id, String)
    check(roles, Array)
    return await checkUserRoles(id, roles)
  }
})
