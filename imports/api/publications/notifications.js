import { Meteor } from 'meteor/meteor'
// import { Counter } from 'meteor/natestrauser:publish-performant-counts'
// import { Notifications } from '../collections/notifications'

Meteor.publish('notifications.unseen', function () {
  // const userId = Meteor.userId()
  // if (Meteor.userId()) {
  //   const notes = Notifications.find({
  //     userId,
  //     seen: false
  //   })
  //   const counter = new Counter('countUnseenUserNotifications', notes)

  //   return counter
  // } else {
    this.ready()
  // }
})
