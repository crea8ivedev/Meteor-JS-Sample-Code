import { check } from 'meteor/check'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'

export const PasswordResetSchema = new SimpleSchema({
  password: { type: String }
}, { check })
export const PasswordResetBridge = new SimpleSchema2Bridge(PasswordResetSchema)

export const ForgotPasswordSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
}, { check })
export const ForgotPasswordBridge = new SimpleSchema2Bridge(ForgotPasswordSchema)
