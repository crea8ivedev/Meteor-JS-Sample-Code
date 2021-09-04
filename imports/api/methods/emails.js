import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import '/imports/utils/linkify-configured'
import Emails from '../collections/emails/Emails'
import { EmailSchema } from '../collections/emails/EmailsSchema'

Meteor.methods({
  adminEmailsCount() {
    if (!Meteor.userId()) {
      throw new Meteor.Error('access-denied', 'Access Denied')
    }
    return Emails.find().count()
  },
  async adminGetEmailsPage(limit = 10, offset = 0, order = -1, orderBy = 'createdAt') {
    check(offset, Number)
    check(limit, Number)
    check(order, Number)
    check(orderBy, String)
    // :TODO: Add user role/capabilities validation for super admin group

    if (!Meteor.userId()) {
      // user not logged in
      throw new Meteor.Error('access-denied', 'Access Denied')
    }

    return Emails.find({}, {
      limit,
      skip: offset,
      sort: {
        [orderBy]: order
      }
    }).fetch()
  },
  createScheduleEmail(doc) {
    check(doc, Object)
    var emailValid = EmailSchema.clean(doc)
    EmailSchema.validate(emailValid)
    const email = Emails.insert(doc)
    return email
  },
  async getScheduleEmails(date) {
    check(date, String)
    return await Emails.find({ scheduleDateTime: { $lte: new Date(date) } }).fetch()
  },
  ScheduleEmailDelete(id) {
    check(id, String)
    return Emails.remove({ _id: id })
  }
})
