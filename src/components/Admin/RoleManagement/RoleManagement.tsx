import {
  AlertDialog,
  Badge,
  Box,
  Button,
  Card,
  DataTable,
  Dialog,
  Input,
  Label,
  Pagination,
  Select,
  useToast,
} from '@paalan/react-ui';
import { type FC, useState } from 'react';
import { FiDownload, FiPlus, FiShield } from 'react-icons/fi';

import { api } from '@/trpc/client';

import { getRoleTableColumns } from './columns';
import { getLevelColor, getTypeColor } from './constants';
import { RoleForm } from './RoleForm';
import type { Role, RoleFilter } from './types';

type RoleManagementProps = {
  organizationId?: string;
};

export const RoleManagement: FC<RoleManagementProps> = ({ organizationId }) => {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [filters, setFilters] = useState<RoleFilter>({
    search: '',
    type: undefined,
    level: undefined,
    isActive: undefined,
    isSystemDefined: undefined,
  });

  // tRPC hooks
  const {
    data: rolesData,
    isLoading,
    refetch,
  } = api.roles.getAll.useQuery({
    page: currentPage,
    limit: pageSize,
    search: filters.search || undefined,
    type: filters.type || undefined,
    level: filters.level || undefined,
    isActive:
      filters.isActive && filters.isActive !== 'all' ? filters.isActive === 'true' : undefined,
    isSystemDefined: filters.isSystemDefined,
    organizationId,
  });

  const { data: permissionsData } = api.permissions.getAll.useQuery();

  const createRoleMutation = api.roles.create.useMutation({
    onSuccess: () => {
      toast.success('Role created successfully');
      setIsCreateDialogOpen(false);
      refetch();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const updateRoleMutation = api.roles.update.useMutation({
    onSuccess: () => {
      toast.success('Role updated successfully');
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      refetch();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const deleteRoleMutation = api.roles.delete.useMutation({
    onSuccess: () => {
      toast.success('Role deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedRole(null);
      refetch();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const cloneRoleMutation = api.roles.clone.useMutation({
    onSuccess: () => {
      toast.success('Role cloned successfully');
      setIsCloneDialogOpen(false);
      setSelectedRole(null);
      refetch();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setIsViewDialogOpen(true);
  };

  const handleClone = (role: Role) => {
    setSelectedRole(role);
    setIsCloneDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRole) {
      deleteRoleMutation.mutate({ id: selectedRole.id });
    }
  };

  const confirmClone = () => {
    if (selectedRole) {
      cloneRoleMutation.mutate({
        sourceRoleId: selectedRole.id,
        newRoleKey: `${selectedRole.key}_copy`,
        newRoleName: `${selectedRole.name} (Copy)`,
        newRoleDescription: selectedRole.description,
      });
    }
  };

  const columns = getRoleTableColumns({
    handleView,
    handleEdit,
    handleClone,
    handleDelete,
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Role Management</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage roles for your organization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <FiDownload className="size-4" />
            <span>Export</span>
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center space-x-2"
          >
            <FiPlus className="size-4" />
            <span>Create Role</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search roles..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            value={filters.type}
            onValueChange={(value: NonNullable<RoleFilter['type']>) =>
              setFilters({ ...filters, type: value })
            }
            options={[
              { label: 'System', value: 'SYSTEM' },
              { label: 'Organization', value: 'ORGANIZATION' },
              { label: 'Custom', value: 'CUSTOM' },
            ]}
          />
          <Select
            value={filters.level}
            onValueChange={(value: NonNullable<RoleFilter['level']>) =>
              setFilters({ ...filters, level: value })
            }
            options={[
              { label: 'Super Admin', value: 'SUPER_ADMIN' },
              { label: 'Admin', value: 'ADMIN' },
              { label: 'Manager', value: 'MANAGER' },
              { label: 'Employee', value: 'EMPLOYEE' },
              { label: 'Viewer', value: 'VIEWER' },
              { label: 'Guest', value: 'GUEST' },
            ]}
          />
          <Select
            value={filters.isActive}
            onValueChange={value => setFilters({ ...filters, isActive: value })}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
          />
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Box>
            <DataTable columns={columns} rows={rolesData?.data || []} />
            <Pagination
              currentPage={currentPage}
              total={rolesData?.pagination?.total || 0}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={size => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </Box>
        )}
      </Card>

      {/* Create Role Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        contentClassName="max-w-2xl"
        content={
          <RoleForm
            permissions={permissionsData?.data || []}
            onSubmit={data => createRoleMutation.mutate(data)}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createRoleMutation.isPending}
          />
        }
      />

      {/* Edit Role Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        contentClassName="max-w-2xl"
      >
        {selectedRole && (
          <RoleForm
            role={selectedRole}
            permissions={permissionsData?.data || []}
            onSubmit={data => updateRoleMutation.mutate({ id: selectedRole.id, data })}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={updateRoleMutation.isPending}
          />
        )}
      </Dialog>

      {/* View Role Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <div className="max-w-2xl">
          {selectedRole && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FiShield className="size-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedRole.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRole.key}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <div className="mt-1">
                    <Badge className={getTypeColor(selectedRole.type)}>{selectedRole.type}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Level</Label>
                  <div className="mt-1">
                    <Badge className={getLevelColor(selectedRole.level)}>
                      {selectedRole.level}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedRole.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="mt-1 text-sm">{selectedRole.description}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Permissions ({selectedRole.permissions?.length || 0})
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedRole.permissions?.map(permissionId => {
                    const permission = permissionsData?.data?.find(p => p.id === permissionId);
                    return (
                      <Badge key={permissionId} variant="secondary" className="text-xs">
                        {permission?.name || permissionId}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Delete Role</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{selectedRole?.name}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="soft" onClick={confirmDelete} isLoading={deleteRoleMutation.isPending}>
              {deleteRoleMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </AlertDialog>

      {/* Clone Confirmation Dialog */}
      <AlertDialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen}>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Clone Role</h3>
            <p className="text-sm text-muted-foreground">
              This will create a copy of "{selectedRole?.name}" with the same permissions.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCloneDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmClone} isLoading={cloneRoleMutation.isPending}>
              {cloneRoleMutation.isPending ? 'Cloning...' : 'Clone Role'}
            </Button>
          </div>
        </div>
      </AlertDialog>
    </div>
  );
};
