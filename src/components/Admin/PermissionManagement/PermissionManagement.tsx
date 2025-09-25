import {
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
import { useRef, useState } from 'react';
import { FiDownload, FiPlus } from 'react-icons/fi';

import { api } from '@/trpc/client';

import { getPermissionTableColumns } from './columns';
import { PermissionForm, type PermissionFormRefProps } from './PermissionForm';
import type { Permission, PermissionFormData } from './types';

type PermissionManagementProps = {
  organizationId?: string;
};

export const PermissionManagement = (_params: PermissionManagementProps) => {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    module: '',
    resource: '',
    action: '',
    category: '',
    isActive: 'all',
    isSystemDefined: 'all',
  });

  const formRef = useRef<PermissionFormRefProps>(null);

  // tRPC hooks
  const {
    data: permissionsData,
    isLoading,
    refetch,
  } = api.permissions.getAll.useQuery({
    page: currentPage,
    limit: pageSize,
    search: filters.search || undefined,
    isActive:
      filters.isActive && filters.isActive !== 'all' ? filters.isActive === 'true' : undefined,
    isSystemDefined:
      filters.isActive && filters.isSystemDefined !== 'all'
        ? filters.isSystemDefined === 'true'
        : undefined,
  });

  const resetForm = () => {
    formRef.current?.resetForm();
  };

  const createPermissionMutation = api.permissions.create.useMutation({
    onSuccess: result => {
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Permission created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const updatePermissionMutation = api.permissions.update.useMutation({
    onSuccess: result => {
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Permission updated successfully');
      setIsEditDialogOpen(false);
      setSelectedPermission(null);
      resetForm();
      refetch();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const deletePermissionMutation = api.permissions.delete.useMutation({
    onSuccess: result => {
      if (!result.data && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Permission deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedPermission(null);
      refetch();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const handleCreatePermission = (formData: PermissionFormData) => {
    createPermissionMutation.mutate(formData);
  };

  const handleUpdatePermission = (formData: PermissionFormData) => {
    if (selectedPermission) {
      updatePermissionMutation.mutate({ id: selectedPermission.id, data: formData });
    }
  };

  const handleDeletePermission = () => {
    if (selectedPermission) {
      deletePermissionMutation.mutate({ id: selectedPermission.id });
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsViewDialogOpen(true);
  };

  const columns = getPermissionTableColumns({
    openViewDialog,
    openEditDialog,
    openDeleteDialog,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Permission Management</h1>
          <p className="text-gray-600">Manage system permissions and access controls</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <FiDownload className="mr-2 size-4" />
            Export
          </Button>
          <Button onClick={openCreateDialog}>
            <FiPlus className="mr-2 size-4" />
            Create Permission
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input
            placeholder="Search permissions..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            value={filters.isActive}
            onValueChange={value => setFilters({ ...filters, isActive: value })}
            placeholder="Status"
            options={[
              {
                label: 'All Status',
                value: 'all',
              },
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
          />

          <Select
            value={filters.isSystemDefined}
            onValueChange={value => setFilters({ ...filters, isSystemDefined: value })}
            options={[
              {
                label: 'All Types',
                value: 'all',
              },
              { label: 'System Defined', value: 'true' },
              { label: 'Custom', value: 'false' },
            ]}
          />

          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                search: '',
                module: '',
                resource: '',
                action: '',
                category: '',
                isActive: 'all',
                isSystemDefined: 'all',
              })
            }
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Box>
            <DataTable columns={columns} rows={permissionsData?.data || []} />
            <Pagination
              currentPage={currentPage}
              total={permissionsData?.pagination?.total || 0}
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

      {/* Create Permission Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        contentClassName="max-w-2xl"
        header={{ title: '' }}
        content={
          <PermissionForm
            ref={formRef}
            onSubmit={handleCreatePermission}
            isLoading={createPermissionMutation.isPending}
            onCancel={() => {
              setIsCreateDialogOpen(false);
            }}
          />
        }
      />

      {/* Edit Permission Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        contentClassName="max-w-2xl"
        header={{ title: '' }}
        content={
          <PermissionForm
            ref={formRef}
            permission={selectedPermission}
            onSubmit={handleUpdatePermission}
            isLoading={updatePermissionMutation.isPending}
            onCancel={() => {
              setIsEditDialogOpen(false);
            }}
          />
        }
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        header={{
          title: 'Delete Permission',
          description: 'This action cannot be undone.',
        }}
      >
        <div className="space-y-4 p-6">
          <p>Are you sure you want to delete permission "{selectedPermission?.name}"?</p>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={handleDeletePermission}
              isLoading={deletePermissionMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>

      {/* View Permission Dialog */}
      <Dialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        header={{
          title: 'Permission Details',
          description: 'Detailed information about the permission',
          className: 'text-lg font-semibold',
        }}
      >
        <div className="space-y-4 p-6">
          {selectedPermission && (
            <div className="space-y-3">
              <div>
                <Label>Key</Label>
                <p className="text-sm text-gray-900">{selectedPermission.key}</p>
              </div>
              <div>
                <Label>Name</Label>
                <p className="text-sm text-gray-900">{selectedPermission.name}</p>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-gray-900">
                  {selectedPermission.description || 'No description'}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Module</Label>
                  <p className="text-sm text-gray-900">{selectedPermission.module}</p>
                </div>
                <div>
                  <Label>Resource</Label>
                  <p className="text-sm text-gray-900">{selectedPermission.resource}</p>
                </div>
                <div>
                  <Label>Action</Label>
                  <p className="text-sm text-gray-900">{selectedPermission.action}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
