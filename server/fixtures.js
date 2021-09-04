import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles'
import { makeSuperAdmin } from '/imports/utils/roles'

Meteor.startup(() => {
  Accounts.emailTemplates.siteName = 'Crea8ivedev'

  Accounts.emailTemplates.resetPassword = {
    subject () {
      return 'Reset Password Request - Crea8ivedev'
    },
    text (user, url) {
      const urlWithOutHash = url.replace('#/', '')

      return urlWithOutHash
    }
  }

  const roles = Roles.getAllRoles().fetch().map(role => role._id)
  if (!roles.includes('admin')) {
    Roles.createRole('admin')
  }
  if (!roles.includes('user')) {
    Roles.createRole('user')
  }



  let user = Accounts.findUserByUsername('crea8ivedev')
  if (!user) {
    const userId = Accounts.createUser({
      username: 'crea8ivedev',
      email: 'crea8ivedev@gmail.com',
      password: 'crea8ivedev',
      profile: {
        name: 'crea8ivedev'
      }
    })
    makeSuperAdmin(userId)
  }

})
