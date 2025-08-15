import React, { useEffect, useState } from 'react';
import { Users, Shield, Plus, Edit, Trash2, UserCheck, Key, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];     // ["Masters.view", "Reports.export"]
  isSystem: boolean;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: number;
  name: string;           // e.g. 'view'
  description: string;
}
interface Screen {
  id: number;
  name: string;           // e.g. 'Masters'
  screen_path: string;
}

interface RolePermSelection {
  [screen_id: number]: number[]; // { 2: [1,3], 4: [1] }
}

function RoleManagement() {
  // --- Hooks ---
  const navigate = useNavigate();

  // Data states
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(false);

  // Add/Edit modal states
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);

  // New/Edit Role form state
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    isSystem: false,
    // { [screen_id]: [permission_id, ...] }
    selection: {} as RolePermSelection
  });

  // --- Load roles & options ---
  useEffect(() => {
    fetchRoles();
    fetchOptions();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
  const res = await fetch('https://tally-backend-dyn3.onrender.com/api/roles');
    const data = await res.json();
    setRoles(data.roles || []);
    setLoading(false);
  };
  const fetchOptions = async () => {
  const res = await fetch('https://tally-backend-dyn3.onrender.com/api/role-management/options');
    const data = await res.json();
    setPermissions(data.permissions || []);
    setScreens(data.screens || []);
  };

  // --- UI helpers ---
  function getRoleColor(role: Role) {
    if (role.isSystem) return 'bg-purple-100 text-purple-800';
    if (role.userCount > 15) return 'bg-blue-100 text-blue-800';
    if (role.userCount > 10) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  }

  // --- Prepare add or edit role modal ---
  function handleOpenAddRole() {
    setRoleForm({ name: '', description: '', isSystem: false, selection: {} });
    setShowAddRole(true);
  }
  function handleOpenEditRole(role: Role) {
    // Parse permissions into selection object
    const selection: RolePermSelection = {};
    role.permissions.forEach((pstr) => {
      // pstr is like "Masters.view"
      const [screenName, permName] = pstr.split('.');
      const screen = screens.find(s => s.name === screenName);
      const perm = permissions.find(p => p.name === permName);
      if (screen && perm) {
        if (!selection[screen.id]) selection[screen.id] = [];
        if (!selection[screen.id].includes(perm.id)) selection[screen.id].push(perm.id);
      }
    });
    setRoleForm({ name: role.name, description: role.description, isSystem: role.isSystem, selection });
    setEditingRoleId(role.id);
    setShowEditRole(true);
  }

  // --- Selection grid logic (used in both add/edit forms) ---
  // Removed unused isPermissionSelected and togglePermission functions

  // --- Add, Edit, Delete actions ---
  async function handleAddRole() {
    if (!roleForm.name || !roleForm.description) { alert('Name & description are required'); return; }
    const permsPayload = Object.entries(roleForm.selection)
      .filter(([, permIds]) => (permIds as number[]).length > 0)
      .map(([sid, permIds]) => ({ screen_id: Number(sid), permission_ids: permIds }));
    setLoading(true);
  const res = await fetch('https://tally-backend-dyn3.onrender.com/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: roleForm.name, description: roleForm.description, permissions: permsPayload })
    });
    if (res.ok) {
      setShowAddRole(false);
      await fetchRoles();
    } else {
      alert('Failed to add role.');
    }
    setLoading(false);
  }
  async function handleEditRoleSave() {
    if (!editingRoleId || !roleForm.name) return;
    if (roleForm.isSystem) return alert('System roles cannot be edited!');
    const permsPayload = Object.entries(roleForm.selection)
      .filter(([, permIds]) => (permIds as number[]).length > 0)
      .map(([sid, permIds]) => ({ screen_id: Number(sid), permission_ids: permIds }));

    setLoading(true);
  const res = await fetch(`https://tally-backend-dyn3.onrender.com/api/roles/${editingRoleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: roleForm.name, description: roleForm.description, permissions: permsPayload })
    });
    if (res.ok) {
      setShowEditRole(false);
      await fetchRoles();
    } else {
      alert('Failed to edit role.');
    }
    setLoading(false);
  }
  async function handleDeleteRole(role: Role) {
    if (role.isSystem) return alert('System roles cannot be deleted!');
    if (!window.confirm(`Delete ${role.name}? This affects ${role.userCount} users.`)) return;
    setLoading(true);
  const res = await fetch(`https://tally-backend-dyn3.onrender.com/api/roles/${role.id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchRoles();
    } else {
      alert('Cannot delete: this role is assigned to users or is protected.');
    }
    setLoading(false);
  }

  // --- UI rendering ---
  return (
    <div className="pt-[56px] px-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate('/app/config')}
              className="mr-4 p-2 rounded-full hover:bg-gray-200"
              title="Back to Config"
              aria-label="Back to Config"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Role Management</h2>
              <p className="text-sm text-gray-600 mt-1">Create and manage user roles with specific permissions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenAddRole}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      {/* Role stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-6 flex items-center">
          <Shield className="h-6 w-6 text-blue-600 bg-blue-100 p-2 rounded-lg" />
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Total Roles</h3>
            <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6 flex items-center">
          <UserCheck className="h-6 w-6 text-green-600 bg-green-100 p-2 rounded-lg" />
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-2xl font-bold text-gray-900">{roles.reduce((sum, r) => sum + r.userCount, 0)}</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6 flex items-center">
          <Key className="h-6 w-6 text-purple-600 bg-purple-100 p-2 rounded-lg" />
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">System Roles</h3>
            <p className="text-2xl font-bold text-gray-900">{roles.filter(r => r.isSystem).length}</p>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6 flex items-center">
          <Users className="h-6 w-6 text-orange-600 bg-orange-100 p-2 rounded-lg" />
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Custom Roles</h3>
            <p className="text-2xl font-bold text-gray-900">{roles.filter(r => !r.isSystem).length}</p>
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
                  type="button"
                  onClick={() => handleOpenEditRole(role)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit Role"
                  aria-label="Edit Role"
                ><Edit className="h-4 w-4" /></button>
                {!role.isSystem && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRole(role)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Role"
                    aria-label="Delete Role"
                  ><Trash2 className="h-4 w-4" /></button>
                )}
              </div>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Users Assigned</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role)}`}>
                {role.userCount} users
              </span>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((p, i) => (
                  <span key={p + i} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {p}
                  </span>
                ))}
                {role.permissions.length > 3 &&
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{role.permissions.length - 3} more
                  </span>
                }
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Created: {role.created_at}</div>
              <div>Updated: {role.updated_at}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Role Modal */}
      {showAddRole &&
        <Modal
          title="Add New Role"
          onClose={() => setShowAddRole(false)}
          saveLabel="Add Role"
          onSave={handleAddRole}
          disabled={loading}
        >
          <RoleForm
            roleForm={roleForm}
            setRoleForm={setRoleForm}
            permissions={permissions}
            screens={screens}
            isSystem={false}
          />
        </Modal>
      }

      {/* Edit Role Modal */}
      {showEditRole && editingRoleId != null &&
        <Modal
          title={`Edit Role: ${roleForm.name}`}
          onClose={() => setShowEditRole(false)}
          saveLabel="Save Changes"
          onSave={handleEditRoleSave}
          disabled={loading || roleForm.isSystem}
        >
          <RoleForm
            roleForm={roleForm}
            setRoleForm={setRoleForm}
            permissions={permissions}
            screens={screens}
            isSystem={roleForm.isSystem}
          />
          {roleForm.isSystem && <p className="text-xs text-gray-500 mt-2">System roles cannot be renamed or permissions modified.</p>}
        </Modal>
      }
    </div>
  );
}

// ----- Subcomponents -----

/** Generic modal dialog for Add/Edit role */
function Modal({ title, children, onClose, saveLabel, onSave, disabled = false }: {
  title: string, children: React.ReactNode, onClose: () => void,
  saveLabel: string, onSave: () => void, disabled?: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        {children}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >Cancel</button>
          <button
            onClick={onSave}
            disabled={disabled}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >{saveLabel}</button>
        </div>
      </div>
    </div>
  );
}

/** RoleForm for Add/Edit including permissions grid */
interface RoleFormProps {
  roleForm: {
    name: string;
    description: string;
    isSystem: boolean;
    selection: RolePermSelection;
  };
  setRoleForm: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    isSystem: boolean;
    selection: RolePermSelection;
  }>>;
  permissions: Permission[];
  screens: Screen[];
  isSystem: boolean;
}
function RoleForm({ roleForm, setRoleForm, permissions, screens, isSystem }: RoleFormProps) {
  // For each screen, permissions grid
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
        <input
          type="text"
          value={roleForm.name}
          readOnly={isSystem}
          onChange={e => setRoleForm(rf => ({ ...rf, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter role name"
          title="Role Name"
        />
        {isSystem && <p className="text-xs text-gray-500 mt-1">System roles cannot be renamed</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={roleForm.description}
          readOnly={isSystem}
          onChange={e => setRoleForm(rf => ({ ...rf, description: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe role purpose"
          title="Role Description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
        <div className="overflow-x-auto">
          <table className="w-full border text-xs">
            <thead>
              <tr>
                <th className="px-2 py-1">Screen</th>
                {permissions.map((p) => (
                  <th key={p.id} className="px-2 py-1">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {screens.map(screen => (
                <tr key={screen.id}>
                  <td className="px-2 py-1 font-semibold">{screen.name}</td>
                  {permissions.map(perm => (
                    <td key={perm.id} className="px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        disabled={isSystem}
                        checked={roleForm.selection[screen.id]?.includes(perm.id) ?? false}
                        onChange={() => setRoleForm(rf => {
                          const arr = rf.selection[screen.id] || [];
                          const selected = arr.includes(perm.id)
                            ? arr.filter((id: number) => id !== perm.id)
                            : [...arr, perm.id];
                          return {
                            ...rf,
                            selection: { ...rf.selection, [screen.id]: selected }
                          };
                        })}
                        title={`Toggle ${perm.name} for ${screen.name}`}
                        aria-label={`Toggle ${perm.name} for ${screen.name}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isSystem && <p className="text-xs text-gray-500 mt-1">System role permissions cannot be modified</p>}
      </div>
    </div>
  );
}

export default RoleManagement;
