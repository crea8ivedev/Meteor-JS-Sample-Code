import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'
import { EditMyUserSchema, EditUserSchema, EditUserProfileSchema } from '/imports/api/collections/Users'
import { isGroupMember } from '/imports/utils/roles'
import { Methods } from 'meteor/npdev:async-proxy'

Meteor.methods({
  updateMyUser(userData) {
    EditMyUserSchema.validate(userData)

    const user = Meteor.user()
    const userId = Meteor.userId()
    if (!userId || userId !== userData._id) {
      // user not logged in
      throw new Meteor.Error('access-denied', 'Access Denied')
    }

    const { _id, emails, profile } = userData
    if (emails) {
      if (user.emails && Array.isArray(user.emails)) {
        for (const email of user.emails) {
          // if an existing email is not in the new array, remove it from the account
          if (!emails.some(sEmail => email.address.toLowerCase() === sEmail.address.toLowerCase())) {
            Accounts.removeEmail(_id, email.address)
          }
        }
      }
      for (const email of emails) {
        Accounts.addEmail(_id, email.address)
      }
    }
    if (profile) {
      Meteor.users.update(_id, { $set: { profile } })
    }
    return _id
  },
  updateMyProfileName(fullname) {
    check(fullname, String)

    const userId = Meteor.userId()
    if (!Meteor.userId()) {
      throw new Meteor.Error('access-denied', 'Access Denied')
    }

    Meteor.users.update(userId, { $set: { 'profile.name': fullname } })
  },
  updateProfilePic(profileImage) {
    EditUserProfileSchema.validate(profileImage)
    if (!Meteor.userId()) {
      throw new Meteor.Error('access-denied', 'Access Denied')
    }
    if (profileImage) {
      Meteor.users.update(profileImage._id, { $set: { 'profile.profileImage': profileImage.profileImage } })
    }
    return profileImage._id
  }
})

Meteor.methods({
  async adminGetUserById(_id) {
    check(_id, String)

    // :TODO: Add user role/capabilities validation for super admin group

    if (!Meteor.userId()) {
      // user not logged in
      throw new Meteor.Error('access-denied', 'Access Denied')
    }

    const user = await Meteor.users.findOne(_id)
    // patch the services prop out, we aren't using that, and shouldn't send that to the client anyway
    if (user) {
      delete user.services
    }

    return await user
  },
  adminUpdateUserData(id, user) {
    check(id, String)
    check(user, Object)
    const mod = { $set: user }
    if (!Meteor.userId()) {
      throw new Meteor.Error('access-denied', 'Access Denied')
    }
    Meteor.users.update(id, mod, { bypassCollection2: true })
    return id
  },
  async adminGetUsersPage(limit = 10, offset = 0, order = -1, orderBy = 'createdAt') {
    check(offset, Number)
    check(limit, Number)
    check(order, Number)
    check(orderBy, String)

    // :TODO: Add user role/capabilities validation for super admin group

    if (!Meteor.userId()) {
      // user not logged in
      throw new Meteor.Error('access-denied', 'Access Denied')
    }

    const allUsers = Meteor.users.find({}, {
      limit,
      skip: offset,
      sort: {
        [orderBy]: order
      }
    }).fetch()
    for (const user of allUsers) {
      const roles = await Methods.getRoles(user._id)
      user.roles = roles
    }
    return allUsers
  },
  adminGetRolesPage(limit = 10, offset = 0, order = -1, orderBy = 'createdAt') {
    check(offset, Number)
    check(limit, Number)
    check(order, Number)
    check(orderBy, String)

    // :TODO: Add user role/capabilities validation for super admin group

    if (!Meteor.userId()) {
      // user not logged in
      throw new Meteor.Error('access-denied', 'Access Denied')
    }

    return Meteor.roles.find({}, {
      limit,
      skip: offset,
      sort: {
        [orderBy]: order
      }
    }).fetch()
  },
  adminGetUserByArray(userArray) {
    check(userArray, Match.Maybe([String]))

    // :TODO: Add admin check

    if (!Meteor.userId()) {
      throw new Meteor.Error('access-denied', 'Access Denied')
    }

    const users = Meteor.users.find({ _id: { $in: userArray } }).map(function (obj) {
      // body...
      return {
        id: obj._id,
        username: obj.username
      }
    })
    return users
  },
  adminGetGroupMembers(groupId) {
    check(groupId, String)


    if (!Meteor.userId()) {
      throw new Meteor.Error('access-denied', 'Access Denied')
    }

    let groupMembers
    const allUsers = Meteor.users.find({}).fetch()

    return allUsers
  },
  adminDeleteUser(userId) {
    check(userId, String)


    const { _id, emails, profile } = user
    if (emails) {
      for (const email of emails) {
        Accounts.addEmail(_id, email.address, email.verified)
      }
    }
    if (profile) {
      Meteor.users.update(_id, { $set: { profile } })
    }
    return _id
  },

  adminDeleteUserData(id) {
    check(id, String)

    if (!Meteor.userId()) {
      // user not logged in
      throw new Meteor.Error('access-denied', 'Access Denied')
    }
    Methods.adminDeleteGroupByUsers(id);
    // :TODO: Validate admin access
    return Meteor.users.remove({ _id: id })
  },

  adminGetUserCount() {
    // :TODO: Add user role/capabilities validation for super admin group

    if (!Meteor.userId()) {
      throw new Meteor.Error('access-denied', 'Access Denied')
    }

    return Meteor.users.find({}).count()
  }
})
