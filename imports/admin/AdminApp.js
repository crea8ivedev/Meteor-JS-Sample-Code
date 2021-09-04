
import { Fragment } from 'react'
import { Meteor } from 'meteor/meteor'
import { Switch, Route, Link } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'

import UserListScreen from './users/UserListScreen'
import UserCreateScreen from './users/UserCreateScreen'
import UserViewScreen from './users/UserViewScreen'
import UserEditScreen from './users/UserEditScreen'
import { isValidRole,checkGroupAdmin,getUserRoles } from '/imports/utils/roles'
import AdminRoleRoute from '../ui/common/AdminRoleRoute'




export default function (props) {
    return <Fragment>
    <Switch> 
     
      <Route path="/admin/users/create" render={(props) => (
        <AdminRoleRoute roles={['admin']} render={(props) => (
          <AdminLayout pageClass="admin users" title="Add User - Admin" {...props}>
            <UserCreateScreen {...props} />
          </AdminLayout>)} />

      )} />
      <Route path="/admin/users/edit-:_id" render={(props) => (
        <AdminRoleRoute roles={['admin']} render={(props) => (
          <AdminLayout pageClass="admin users" title="Edit User - Admin" {...props}>
            <UserEditScreen {...props} />
          </AdminLayout>)} />

      )} />
      <Route path="/admin/users/view-:_id" render={(props) => (
        <AdminRoleRoute roles={['admin']} render={(props) => (
          <AdminLayout pageClass="admin users" title="View User - Admin" {...props}>
            <UserViewScreen {...props} />
          </AdminLayout>)} />

      )} />
      <Route path="/admin/users" render={(props) => (
        <AdminRoleRoute roles={['admin']} render={(props) => (
          <AdminLayout pageClass="admin users" title="Users - Admin" {...props}>
            <UserListScreen {...props} />
          </AdminLayout>)} />

      
      )} />

      <AdminRoleRoute roles={['admin']} render={(props) => (
        <Route path="/admin/" render={(props) => (
          <AdminLayout pageClass="page home" {...props} title=" Admin">
            <div><Link to="/admin/users">Users</Link> <br /></div>          </AdminLayout>
        )} />
      )} />
    </Switch>
  </Fragment >
}