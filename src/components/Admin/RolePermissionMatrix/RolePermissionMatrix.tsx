import { Badge, Button, Card, Checkbox, Input, Label, Select, toast } from '@paalan/react-ui';
import { type FC, useMemo, useState } from 'react';
import { FiEyeOff, FiFilter, FiGrid, FiRefreshCw, FiSave } from 'react-icons/fi';

import type { Permission } from '../PermissionManagement';
import type { Role } from '../RoleManagement';

type RolePermissionMatrixProps = {
  roles: Role[];
  permissions: Permission[];
  onUpdateRolePermissions: (roleId: string, permissionIds: string[]) => void;
  isLoading?: boolean;
};

export const RolePermissionMatrix: FC<RolePermissionMatrixProps> = ({
  roles,
  permissions,
  onUpdateRolePermissions,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [roleTypeFilter, setRoleTypeFilter] = useState('');
  const [showInactiveRoles, setShowInactiveRoles] = useState(false);
  const [showInactivePermissions, setShowInactivePermissions] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string[]>>({});

  // Filter roles and permissions
  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const matchesSearch =
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.key.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !roleTypeFilter || role.type === roleTypeFilter;
      const matchesActive = showInactiveRoles || role.isActive;

      return matchesSearch && matchesType && matchesActive;
    });
  }, [roles, searchTerm, roleTypeFilter, showInactiveRoles]);

  const filteredPermissions = useMemo(() => {
    return permissions.filter(permission => {
      const matchesSearch =
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.key.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModule = !moduleFilter || permission.module === moduleFilter;
      const matchesCategory = !categoryFilter || permission.category === categoryFilter;
      const matchesActive = showInactivePermissions || permission.isActive;

      return matchesSearch && matchesModule && matchesCategory && matchesActive;
    });
  }, [permissions, searchTerm, moduleFilter, categoryFilter, showInactivePermissions]);

  // Group permissions by category
  const permissionsByCategory = useMemo(() => {
    return filteredPermissions.reduce(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = [];
        }
        acc[permission.category]!.push(permission);
        return acc;
      },
      {} as Record<string, Permission[]>
    );
  }, [filteredPermissions]);

  const hasPermission = (roleId: string, permissionId: string): boolean => {
    if (pendingChanges[roleId]) {
      return pendingChanges[roleId].includes(permissionId);
    }
    const role = roles.find(r => r.id === roleId);
    return role?.permissions.includes(permissionId) || false;
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    const currentPermissions =
      pendingChanges[roleId] || roles.find(r => r.id === roleId)?.permissions || [];

    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(id => id !== permissionId)
      : [...currentPermissions, permissionId];

    setPendingChanges(prev => ({
      ...prev,
      [roleId]: newPermissions,
    }));
  };

  const toggleAllPermissionsForRole = (roleId: string, category?: string) => {
    const permissionsToToggle = category
      ? permissionsByCategory[category] || []
      : filteredPermissions;

    const currentPermissions =
      pendingChanges[roleId] || roles.find(r => r.id === roleId)?.permissions || [];

    const categoryPermissionIds = permissionsToToggle.map(p => p.id);
    const allSelected = categoryPermissionIds.every(id => currentPermissions.includes(id));

    let newPermissions;
    if (allSelected) {
      // Remove all category permissions
      newPermissions = currentPermissions.filter(id => !categoryPermissionIds.includes(id));
    } else {
      // Add all category permissions
      newPermissions = [...new Set([...currentPermissions, ...categoryPermissionIds])];
    }

    setPendingChanges(prev => ({
      ...prev,
      [roleId]: newPermissions,
    }));
  };

  const toggleAllPermissionsForPermission = (permissionId: string) => {
    const newChanges = { ...pendingChanges };

    filteredRoles.forEach(role => {
      const currentPermissions = newChanges[role.id] || role.permissions || [];

      if (currentPermissions.includes(permissionId)) {
        newChanges[role.id] = currentPermissions.filter(id => id !== permissionId);
      } else {
        newChanges[role.id] = [...currentPermissions, permissionId];
      }
    });

    setPendingChanges(newChanges);
  };

  const saveChanges = async () => {
    try {
      const promises = Object.entries(pendingChanges).map(([roleId, permissionIds]) =>
        onUpdateRolePermissions(roleId, permissionIds)
      );

      await Promise.all(promises);
      setPendingChanges({});
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save changes:', error);
      toast.error('Failed to save changes');
    }
  };

  const resetChanges = () => {
    setPendingChanges({});
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="rounded-lg bg-primary/10 p-3">
          <FiGrid className="size-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Role Permission Matrix</h3>
          <p className="text-sm text-muted-foreground">
            Manage permission assignments across all roles
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FiFilter className="size-4" />
            <span className="font-medium">Filters</span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              placeholder="Search roles/permissions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Select
              value={moduleFilter}
              onValueChange={setModuleFilter}
              options={[
                { value: '', label: 'All Modules' },
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
              value={categoryFilter}
              onValueChange={setCategoryFilter}
              options={[
                { value: '', label: 'All Categories' },
                { value: 'USER_MANAGEMENT', label: 'User Management' },
                { value: 'CONTENT_MANAGEMENT', label: 'Content Management' },
                { value: 'SYSTEM_ADMINISTRATION', label: 'System Administration' },
                { value: 'BILLING_FINANCE', label: 'Billing & Finance' },
                { value: 'HR_MANAGEMENT', label: 'HR Management' },
                { value: 'CLIENT_MANAGEMENT', label: 'Client Management' },
              ]}
            />
            <Select
              value={roleTypeFilter}
              onValueChange={setRoleTypeFilter}
              options={[
                { value: '', label: 'All Role Types' },
                { value: 'SYSTEM', label: 'System' },
                { value: 'ORGANIZATION', label: 'Organization' },
                { value: 'CUSTOM', label: 'Custom' },
              ]}
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox checked={showInactiveRoles} onCheckedChange={setShowInactiveRoles} />
              <Label className="text-sm">Show inactive roles</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={showInactivePermissions}
                onCheckedChange={setShowInactivePermissions}
              />
              <Label className="text-sm">Show inactive permissions</Label>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      {hasPendingChanges && (
        <Card className="border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="warning">
                {Object.keys(pendingChanges).length} role(s) with pending changes
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={resetChanges} disabled={isLoading}>
                <FiRefreshCw className="mr-2 size-4" />
                Reset
              </Button>
              <Button size="sm" onClick={saveChanges} disabled={isLoading}>
                <FiSave className="mr-2 size-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Matrix */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="sticky left-0 border-r bg-muted/50 p-3 text-left">
                    <div className="min-w-48">
                      <div className="font-medium">Roles / Permissions</div>
                      <div className="text-xs text-muted-foreground">
                        {filteredRoles.length} roles, {filteredPermissions.length} permissions
                      </div>
                    </div>
                  </th>
                  {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                    <th
                      key={category}
                      className="border-r p-2 text-center"
                      colSpan={categoryPermissions.length}
                    >
                      <div className="mb-1 text-xs font-medium text-muted-foreground">
                        {category.replace(/_/g, ' ')}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {categoryPermissions.length}
                      </Badge>
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="sticky left-0 border-b border-r bg-muted/50 p-3">
                    {/* Role actions column */}
                  </th>
                  {Object.entries(permissionsByCategory).map(([_category, categoryPermissions]) =>
                    categoryPermissions.map(permission => (
                      <th key={permission.id} className="min-w-12 border-b border-r p-1">
                        <div className="origin-bottom-left -rotate-45">
                          <Button
                            onClick={() => toggleAllPermissionsForPermission(permission.id)}
                            className="max-w-24 truncate text-xs hover:text-primary"
                            title={`${permission.name} (${permission.key})`}
                          >
                            {permission.name}
                          </Button>
                        </div>
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map(role => (
                  <tr key={role.id} className="hover:bg-muted/20">
                    <td className="sticky left-0 border-b border-r bg-background p-3">
                      <div className="min-w-48">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{role.name}</div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {role.key}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs">
                              {role.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {role.level}
                            </Badge>
                            {!role.isActive && (
                              <Badge variant="danger" className="text-xs">
                                <FiEyeOff className="size-3" />
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex space-x-1">
                          {Object.keys(permissionsByCategory).map(category => {
                            const categoryPermissions = permissionsByCategory[category]!;
                            const hasAll = categoryPermissions.every(p =>
                              hasPermission(role.id, p.id)
                            );
                            const hasNone = categoryPermissions.every(
                              p => !hasPermission(role.id, p.id)
                            );

                            const getButtonStyles = () => {
                              if (hasAll) return 'bg-green-100 text-green-800';
                              if (hasNone) return 'bg-gray-100 text-gray-600';
                              return 'bg-orange-100 text-orange-800';
                            };

                            const getButtonText = () => {
                              if (hasAll) return 'All';
                              if (hasNone) return 'None';
                              return 'Some';
                            };

                            return (
                              <Button
                                key={category}
                                onClick={() => toggleAllPermissionsForRole(role.id, category)}
                                className={`rounded px-2 py-1 text-xs ${getButtonStyles()}`}
                                title={`Toggle all ${category.replace(/_/g, ' ')} permissions`}
                              >
                                {getButtonText()}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </td>
                    {Object.entries(permissionsByCategory).map(([_category, categoryPermissions]) =>
                      categoryPermissions.map(permission => {
                        const isChecked = hasPermission(role.id, permission.id);
                        const isPending =
                          pendingChanges[role.id]?.includes(permission.id) !==
                          (roles.find(r => r.id === role.id)?.permissions.includes(permission.id) ||
                            false);

                        return (
                          <td key={permission.id} className="border-b border-r p-1 text-center">
                            <div
                              className={`flex items-center justify-center ${
                                isPending ? 'rounded bg-orange-100' : ''
                              }`}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => togglePermission(role.id, permission.id)}
                                className={isPending ? 'border-orange-500' : ''}
                              />
                            </div>
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <div className="space-y-2">
          <h5 className="font-medium">Legend</h5>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="size-4 rounded border border-orange-500 bg-orange-100" />
              <span>Pending changes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="size-4 rounded bg-green-100" />
              <span>All permissions granted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="size-4 rounded bg-orange-100" />
              <span>Some permissions granted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="size-4 rounded bg-gray-100" />
              <span>No permissions granted</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
