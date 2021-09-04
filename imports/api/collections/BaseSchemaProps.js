import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

const anonymous = Meteor.isServer && Meteor.users.findOne({ username: 'anonymous' })

const BaseSchemaProps = {
  owner: {
    type: SimpleSchema.RegEx.Id,
    optional: true,
    autoValue () {
      if (this.isInsert) {
        try {
          return Meteor.userId() || anonymous._id
        } catch (error) {
          return anonymous._id
        }
      }
    }
  },
  updatedBy: {
    type: SimpleSchema.RegEx.Id,
    autoValue () {
      try {
        return Meteor.userId() || anonymous._id
      } catch (error) {
        return anonymous._id
      }
    }
  },
  createdBy: {
    type: SimpleSchema.RegEx.Id,
    label: 'Created By',
    optional: true,
    autoValue () {
      if (this.isInsert) {
        try {
          return Meteor.userId() || anonymous._id
        } catch (error) {
          return anonymous._id
        }
      }
    },
    denyUpdate: true
  },
  updatedAt: {
    type: Date,
    label: 'Updated On',
    autoValue () {
      return new Date()
    }
  },
  createdAt: {
    type: Date,
    label: 'Created On',
    optional: true,
    autoValue () {
      if (this.isInsert) {
        return new Date()
      }
    },
    denyUpdate: true
  }
}

export default BaseSchemaProps

export const links = {
  links: { type: Array, optional: true, defaultValue: [] },
  'links.$': { type: Object },
  'links.$.type': { type: String },
  'links.$.href': { type: String },
  'links.$.value': { type: String },
  'links.$.valueLower': { type: String }
}
export const privacy = {
  public: {
    type: Boolean,
    defaultValue: true
  },
  listable: {
    type: Boolean,
    defaultValue: true
  }
}
