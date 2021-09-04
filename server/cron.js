/* global Meteor, SyncedCron */
import { Methods } from 'meteor/npdev:async-proxy'
import moment from 'moment-timezone'

SyncedCron.add({
  name: 'Schedule email',
  schedule: function (parser) {
    return parser.text('every 1 hours')
  },
  job: function () {
    Methods.sendSchedulerEmails()
  }
})

Meteor.startup(function () {
  SyncedCron.start()
})

Meteor.methods({
  async sendSchedulerEmails () {

  }
})
