import React, { useState } from 'react';
import { Users, Shield, Plus, Edit, Trash2,  UserCheck,  Key } from 'lucide-react';//UserX,Save,

const RoleManagement = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);

  const roles = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Complete system access with all administrative privileges',
      userCount: 2,
      permissions: ['all'],
      isSystem: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative access with most system privileges',
      userCount: 5,
      permissions: ['users', 'settings', 'reports', 'audit', 'masters', 'vouchers'],
      isSystem: false,
      createdAt: '2023-02-15',
      updatedAt: '2023-12-01'
    },
    {
      id: 3,
      name: 'Manager',
      description: 'Department-level management with approval permissions',
      userCount: 12,
      permissions: ['reports', 'approve', 'masters', 'vouchers'],
      isSystem: false,
      createdAt: '2023-03-10',
      updatedAt: '2023-11-15'
    },
    {
      id: 4,
      name: 'Accountant',
      description: 'Financial data access with transaction permissions',
      userCount: 8,
      permissions: ['vouchers', 'reports', 'masters'],
      isSystem: false,
      createdAt: '2023-04-05',
      updatedAt: '2023-10-20'
    },
    {
      id: 5,
      name: 'Data Entry',
      description: 'Basic data entry with limited access',
      userCount: 15,
      permissions: ['vouchers', 'masters'],
      isSystem: false,
      createdAt: '2023-05-20',
      updatedAt: '2023-09-30'
    },
    {
      id: 6,
      name: 'Viewer',
      description: 'Read-only access to reports and data',
      userCount: 20,
      permissions: ['reports'],
      isSystem: false,
      createdAt: '2023-06-12',
      updatedAt: '2023-08-25'
    }
  ];

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const availablePermissions = [
    { id: 'all', name: 'All Permissions', description: 'Complete system access' },
    { id: 'users', name: 'User Management', description: 'Manage user accounts and roles' },
    { id: 'settings', name: 'System Settings', description: 'Configure system settings' },
    { id: 'reports', name: 'Reports', description: 'View and generate reports' },
    { id: 'audit', name: 'Audit Logs', description: 'Access audit trails and logs' },
    { id: 'masters', name: 'Master Data', description: 'Manage master data entries' },
    { id: 'vouchers', name: 'Vouchers', description: 'Create and manage vouchers' },
    { id: 'approve', name: 'Approvals', description: 'Approve transactions and requests' },
    { id: 'backup', name: 'Backup & Restore', description: 'Manage system backups' }
  ];

  const handleAddRole = () => {
    if (newRole.name && newRole.description) {
      alert('Role added successfully!');
      setShowAddRole(false);
      setNewRole({ name: '', description: '', permissions: [] });
    }
  };

  const handleDeleteRole = (role) => {
    if (role.isSystem) {
      alert('System roles cannot be deleted!');
      return;
    }
    if (confirm(`Are you sure you want to delete the ${role.name} role? This will affect ${role.userCount} users.`)) {
      alert('Role deleted successfully!');
    }
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowEditRole(true);
  };

  const togglePermission = (permissionId) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getRoleColor = (role) => {
    if (role.isSystem) return 'bg-purple-100 text-purple-800';
    if (role.userCount > 15) return 'bg-blue-100 text-blue-800';
    if (role.userCount > 10) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Role Management</h2>
            <p className="text-sm text-gray-600 mt-1">Create and manage user roles with specific permissions</p>
          </div>
          <button
            onClick={() => setShowAddRole(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Roles</h3>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
              <p className="text-2xl font-bold text-gray-900">{roles.reduce((sum, role) => sum + role.userCount, 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Key className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">System Roles</h3>
              <p className="text-2xl font-bold text-gray-900">{roles.filter(r => r.isSystem).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Custom Roles</h3>
              <p className="text-2xl font-bold text-gray-900">{roles.filter(r => !r.isSystem).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  {role.isSystem && (
                    <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      System
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditRole(role)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit Role"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {!role.isSystem && (
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Role"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Users Assigned</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role)}`}>
                  {role.userCount} users
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((permission) => (
                  <span key={permission} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {permission}
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{role.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Created: {role.createdAt}</div>
              <div>Updated: {role.updatedAt}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Role</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter role name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter role description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={newRole.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="mt-1 rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                        <div className="text-xs text-gray-600">{permission.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddRole(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRole && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Role: {selectedRole.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                <input
                  type="text"
                  defaultValue={selectedRole.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={selectedRole.isSystem}
                />
                {selectedRole.isSystem && (
                  <p className="text-xs text-gray-500 mt-1">System roles cannot be renamed</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  defaultValue={selectedRole.description}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Permissions</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked={selectedRole.permissions.includes(permission.id)}
                        className="mt-1 rounded"
                        disabled={selectedRole.isSystem}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                        <div className="text-xs text-gray-600">{permission.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedRole.isSystem && (
                  <p className="text-xs text-gray-500 mt-1">System role permissions cannot be modified</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Role Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Users Assigned:</span>
                    <span className="ml-2 font-medium">{selectedRole.userCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 font-medium">{selectedRole.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="ml-2 font-medium">{selectedRole.updatedAt}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium">{selectedRole.isSystem ? 'System' : 'Custom'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowEditRole(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={selectedRole.isSystem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;