import { check } from 'meteor/check'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'

// We are using the built in Meteor users collection on Meteor.users so we don't create one here.

// We will be defining a set of custom properties on the user document. Profile is public, and this describes that field.
export const UserProfileSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
}, { check })
export const UserProfileBridge = new SimpleSchema2Bridge(UserProfileSchema)

// The Accounts.createUser method requires a different object shape, and this schema provides that for validation.
export const CreateUserSchema = new SimpleSchema({
  username: { type: String },
  email: { type: SimpleSchema.RegEx.Email },
  password: { type: String, optional: true },
}, { check })
export const CreateUserBridge = new SimpleSchema2Bridge(CreateUserSchema)

export const EditUserSchema = new SimpleSchema({
  _id: { type: SimpleSchema.RegEx.Id },
  username: { type: String },
  emails: { type: Array, minCount: 0 },
  'emails.$': { type: Object },
  'emails.$.address': { type: SimpleSchema.RegEx.Email },
  'emails.$.verified': { type: Boolean, defaultValue: false, optional: true },
  password: { type: String, optional: true },
  createdAt: { type: Date },
  status: { type: Object, blackbox: true, optional: true }
}, { check })
export const EditUserBridge = new SimpleSchema2Bridge(EditUserSchema)

export const EditUserProfileSchema = new SimpleSchema({
  _id: { type: SimpleSchema.RegEx.Id, optional: true },
  profileImage: { type: String }
}, { check })
export const EditUserProfileBridge = new SimpleSchema2Bridge(EditUserProfileSchema)

export const EditMyUserSchema = new SimpleSchema({
  _id: { type: SimpleSchema.RegEx.Id },
  username: { type: String },
  emails: { type: Array, minCount: 0 },
  'emails.$': { type: Object },
  'emails.$.address': { type: SimpleSchema.RegEx.Email },
  'emails.$.verified': { type: Boolean, defaultValue: false, optional: true },
  profile: { type: UserProfileSchema }
}, { check })
export const EditMyUserBridge = new SimpleSchema2Bridge(EditMyUserSchema)
