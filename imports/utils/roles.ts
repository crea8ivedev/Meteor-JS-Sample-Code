/* global Meteor */
import { check, Match } from 'meteor/check'
import { Roles } from 'meteor/alanning:roles'

/**
 * Checks if the current user or the user passed in is a super admin user or not.
 */
export function getUserRoles(userId: string | null | undefined): boolean | Array<unknown> {
  check(userId, Match.OneOf(null, String))
  if (!userId) return false
  return Roles.getRolesForUser(userId)
}

export function isSuperAdmin(userId: string | null): boolean {
  check(userId, Match.OneOf(null, String))
  if (!userId) return false
  return Roles.userIsInRole(userId, ['admin'])
}

export function isMuseumAdmin(userId: string | null): boolean {
  check(userId, Match.OneOf(null, String))
  if (!userId) return false
  return Roles.userIsInRole(userId, ['museum_admin'])
}

export function makeSuperAdmin(userId: string): void {
  check(userId, String)
  Roles.addUsersToRoles(userId, ['admin'])
}

export function assignRoles(userId: string, roles: Array<unknown>): void {
  check(userId, String)
  check(roles, Array)
  Roles.addUsersToRoles(userId, roles)
}

export function checkUserRoles(userId: string, roles: Array<unknown>): void {
  check(userId, String)
  check(roles, Array)
  return Roles.userIsInRole(userId, roles)
}

export function revokeUserRoles(userId: string, roles: Array<unknown>): void {
  check(userId, String)
  check(roles, Array)
  Roles.removeUsersFromRoles(userId, roles)
}

export function isValidRole(userId: string, roles = []): boolean {
  check(userId, Match.OneOf(null, String))
  check(roles, Array)
  if (!userId) return false
  if (!roles) return false
  return Roles.userIsInRole(userId, roles)
}

export function revokeSuperAdmin(userId: string): void {
  check(userId, String)
  Roles.removeUsersFromRoles(userId, ['admin'])
}

export function isGroupAdmin(userId: string, groupId: string) {
  check(userId, Match.OneOf(null, String))
  check(groupId, String)
  if (!userId || !groupId) return false
  // Note this will return true for super admins, regardless of the group specified
  return Roles.userIsInRole(userId, ['admin'], groupId)
}

export function makeGroupAdmin(userId: string, groupId: string) {
  check(userId, String)
  check(groupId, String)
  if (!userId || !groupId) return false // :TODO: throw
  if (Roles.userIsInRole(userId, ['banned'], groupId)) return false
  Roles.addUsersToRoles(userId, ['admin'], groupId)
}

export function revokeGroupAdmin(userId: string, groupId: string) {
  check(userId, String)
  check(groupId, String)
  if (!userId || !groupId) return false // :TODO: throw
  Roles.removeUsersFromRoles(userId, ['admin'], groupId)
}

export function isGroupMember(userId: string, groupId: string): boolean {
  check(userId, Match.OneOf(null, String))
  check(groupId, String)
  if (!userId || !groupId) return false
  return Roles.userIsInRole(userId, ['member'], groupId)
}

export function makeGroupMember(userId: string, groupId: string) {
  check(userId, String)
  check(groupId, String)
  if (!userId || !groupId) return false // :TODO: throw
  if (Roles.userIsInRole(userId, ['banned'], groupId)) return false
  Roles.addUsersToRoles(userId, ['member'], groupId)
}

export function banGroupMember(userId: string, groupId: string) {
  check(userId, String)
  check(groupId, String)
  if (!userId || !groupId) return false
  Roles.setUserRoles(userId, [], groupId)
  Roles.addUsersToRoles(userId, ['banned'], groupId)
}

export function unbanGroupMember(userId: string, groupId: string) {
  check(userId, String)
  check(groupId, String)
  if (!userId || !groupId) return false
  Roles.removeUsersFromRoles(userId, ['banned'], groupId)
}

export function revokeGroupMembership(userId: string, groupId: string) {
  check(userId, String)
  check(groupId, String)
  if (!userId || !groupId) return false // :TODO: throw
  Roles.removeUsersFromRoles(userId, ['member', 'admin'], groupId)
}

/**
 * The following are meant to be called from within Meteor methods, in the arguments check area
 */
export function checkSuperAdmin(): void {
  const userId = Meteor.userId()
  if (!userId || !isSuperAdmin(userId)) {
    // user not logged in or not super admin
    throw new Meteor.Error('access-denied', 'Access Denied')
  }
}



export function checkGroupAdmin(groupId: string): void {
  const userId = Meteor.userId()
  if (!userId || !(isGroupAdmin(userId, groupId) || isSuperAdmin(userId))) {
    throw new Meteor.Error('access-denied', 'Access Denied')
  }
}

export function checkGroupMembership(groupId: string): void {
  const userId = Meteor.userId()
  if (!userId || !isGroupMember(userId, groupId)) {
    throw new Meteor.Error('access-denied', 'AccessDenied')
  }
}
