
import { Meteor } from 'meteor/meteor'

const Api = new Restivus({
  useDefaultAuth: true,
  enableCors: true,
  prettyJson: true
})
Api.addRoute('groups', { authRequired: false }, {
  get: function () {

  }
})