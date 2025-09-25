import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  Select,
  Separator,
  Switch,
  Textarea,
} from '@paalan/react-ui';
import { type FC, useEffect, useState } from 'react';
import { FiInfo, FiKey, FiSave, FiShield, FiX } from 'react-icons/fi';

import type { Permission } from '../PermissionManagement';
import type { Role, RoleFormData } from './types';

type RoleFormProps = {
  role?: Role;
  permissions: Permission[];
  onSubmit: (data: RoleFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export const RoleForm: FC<RoleFormProps> = ({
  role,
  permissions,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<RoleFormData>({
    key: '',
    name: '',
    description: '',
    type: 'CUSTOM',
    level: 'EMPLOYEE',
    priority: 50,
    permissions: [],
    inheritsFrom: [],
    isActive: true,
    maxMembers: undefined,
    conditions: {},
    metadata: {},
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionSearch, setPermissionSearch] = useState('');
  const [permissionFilter, setPermissionFilter] = useState({
    module: '',
    category: '',
  });

  useEffect(() => {
    if (role) {
      setFormData({
        key: role.key || '',
        name: role.name || '',
        description: role.description || '',
        type: role.type || 'CUSTOM',
        level: role.level || 'EMPLOYEE',
        priority: role.priority || 50,
        permissions: role.permissions || [],
        inheritsFrom: role.inheritsFrom || [],
        isActive: role.isActive ?? true,
        maxMembers: role.maxMembers,
        conditions: role.conditions || {},
        metadata: role.metadata || {},
      });
      setSelectedPermissions(role.permissions || []);
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      permissions: selectedPermissions,
    };
    onSubmit(submitData);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]
    );
  };

  const handleSelectAllPermissions = (category: string) => {
    const categoryPermissions = permissions.filter(p => p.category === category).map(p => p.id);

    const allSelected = categoryPermissions.every(id => selectedPermissions.includes(id));

    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !categoryPermissions.includes(id)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
    }
  };

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch =
      permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      permission.key.toLowerCase().includes(permissionSearch.toLowerCase());
    const matchesModule = !permissionFilter.module || permission.module === permissionFilter.module;
    const matchesCategory =
      !permissionFilter.category || permission.category === permissionFilter.category;

    return matchesSearch && matchesModule && matchesCategory;
  });

  const groupedPermissions = filteredPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category]!.push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  const generateKeyFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      key: !role ? `org:${generateKeyFromName(name)}` : prev.key,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      <div className="flex items-center space-x-3">
        <div className="rounded-lg bg-primary/10 p-3">
          <FiShield className="size-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{role ? 'Edit Role' : 'Create New Role'}</h3>
          <p className="text-sm text-muted-foreground">
            {role
              ? 'Update role details and permissions'
              : 'Define a new role for your organization'}
          </p>
        </div>
      </div>

      <Separator />

      <Box className="mt-0 flex-1 basis-[65vh] space-y-4 overflow-auto px-2">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="flex items-center space-x-2 text-base font-medium">
            <FiInfo className="size-4" />
            <span>Basic Information</span>
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                Role Name *
              </Label>
              <Input
                value={formData.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                Role Key *
              </Label>
              <Input
                value={formData.key}
                onChange={e => setFormData({ ...formData, key: e.target.value })}
                placeholder="org:role_name"
                disabled={!!role}
                required
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-muted-foreground">
              Description
            </Label>
            <Textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the role's purpose and responsibilities"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label className="mb-2 block text-sm font-medium text-muted-foreground">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: NonNullable<Role['type']>) =>
                  setFormData({ ...formData, type: value })
                }
                options={[
                  { value: 'CUSTOM', label: 'Custom' },
                  { value: 'ORGANIZATION', label: 'Organization' },
                  { value: 'SYSTEM', label: 'System', disabled: true },
                ]}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-muted-foreground">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value: NonNullable<Role['level']>) =>
                  setFormData({ ...formData, level: value })
                }
                options={[
                  { value: 'SUPER_ADMIN', label: 'Super Admin' },
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'MANAGER', label: 'Manager' },
                  { value: 'EMPLOYEE', label: 'Employee' },
                  { value: 'VIEWER', label: 'Viewer' },
                  { value: 'GUEST', label: 'Guest' },
                ]}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                Priority (1-100)
              </Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.priority}
                onChange={e =>
                  setFormData({ ...formData, priority: parseInt(e.target.value, 10) || 50 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                Max Members (Optional)
              </Label>
              <Input
                type="number"
                min="0"
                value={formData.maxMembers || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    maxMembers: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  })
                }
                placeholder="Unlimited"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                checked={formData.isActive}
                onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
              />
              <Label className="text-sm font-medium">Active Role</Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Permissions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center space-x-2 text-base font-medium">
              <FiKey className="size-4" />
              <span>Permissions ({selectedPermissions.length})</span>
            </h4>
          </div>

          {/* Permission Filters */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              placeholder="Search permissions..."
              value={permissionSearch}
              onChange={e => setPermissionSearch(e.target.value)}
            />
            <Select
              value={permissionFilter.module}
              onValueChange={value => setPermissionFilter({ ...permissionFilter, module: value })}
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
                { value: 'billing', label: 'Billing' },
                { value: 'content', label: 'Content' },
                { value: 'analytics', label: 'Analytics' },
                { value: 'system', label: 'System' },
                { value: 'organization', label: 'Organization' },
                { value: 'hr', label: 'HR' },
                { value: 'finance', label: 'Finance' },
                { value: 'client', label: 'Client' },
                { value: 'employee', label: 'Employee' },
              ]}
            />
            <Select
              value={permissionFilter.category}
              onValueChange={value => setPermissionFilter({ ...permissionFilter, category: value })}
              options={[
                { value: 'USER_MANAGEMENT', label: 'User Management' },
                { value: 'CONTENT_MANAGEMENT', label: 'Content Management' },
                { value: 'SYSTEM_ADMINISTRATION', label: 'System Administration' },
                { value: 'BILLING_FINANCE', label: 'Billing & Finance' },
                { value: 'HR_MANAGEMENT', label: 'HR Management' },
                { value: 'CLIENT_MANAGEMENT', label: 'Client Management' },
              ]}
            />
          </div>

          {/* Permission Groups */}
          <div className="max-h-96 space-y-4 overflow-y-auto">
            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
              <Card key={category} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium">{category.replace(/_/g, ' ')}</h5>
                    <Badge variant="secondary" className="text-xs">
                      {categoryPermissions.length}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAllPermissions(category)}
                  >
                    {categoryPermissions.every(p => selectedPermissions.includes(p.id))
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {categoryPermissions.map(permission => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-3 rounded-lg p-2 hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{permission.name}</div>
                        <div className="truncate font-mono text-xs text-muted-foreground">
                          {permission.key}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {permission.module}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {permission.action}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Box>
      {/* Form Actions */}
      <div className="mt-2 flex items-center justify-end space-x-2 border-t pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          <FiX className="mr-2 size-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Saving..."
          disabled={!formData.name || !formData.key}
        >
          <FiSave className="mr-2 size-4" />
          {role ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
};
