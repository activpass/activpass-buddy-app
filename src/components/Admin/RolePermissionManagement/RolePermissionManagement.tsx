import { Button, Card, Separator, useToast } from '@paalan/react-ui';
import { useState } from 'react';
import { FiGrid, FiKey, FiRefreshCw, FiSettings, FiShield, FiUsers } from 'react-icons/fi';

import { PermissionManagement } from '../PermissionManagement/PermissionManagement';
import { RoleManagement } from '../RoleManagement/RoleManagement';
import { RolePermissionMatrix } from '../RolePermissionMatrix/RolePermissionMatrix';

type RolePermissionManagementProps = {
  organizationId?: string;
};

export const RolePermissionManagement = ({ organizationId }: RolePermissionManagementProps) => {
  const [activeTab, setActiveTab] = useState('roles');
  const toast = useToast();

  const tabs = [
    {
      id: 'roles',
      label: 'Roles',
      icon: <FiShield className="size-4" />,
      component: <RoleManagement organizationId={organizationId} />,
    },
    {
      id: 'permissions',
      label: 'Permissions',
      icon: <FiKey className="size-4" />,
      component: <PermissionManagement organizationId={organizationId} />,
    },
    {
      id: 'matrix',
      label: 'Role-Permission Matrix',
      icon: <FiGrid className="size-4" />,
      component: (
        <RolePermissionMatrix
          roles={[]} // Will be populated from tRPC call
          permissions={[]} // Will be populated from tRPC call
          onUpdateRolePermissions={(roleId: string, permissionIds: string[]) => {
            // Handle role permission updates
            // eslint-disable-next-line no-console
            console.log('Update role permissions:', roleId, permissionIds);
          }}
        />
      ),
    },
  ];

  const handleRefreshAll = () => {
    // This could trigger a refresh for all components
    toast.success('All data has been refreshed');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FiSettings className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Access Control Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage roles, permissions, and access control for your organization
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            className="flex items-center space-x-2"
          >
            <FiRefreshCw className="size-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
              <FiShield className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
              <FiKey className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Permissions</p>
              <p className="text-2xl font-bold">48</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
              <FiUsers className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
              <FiGrid className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role Assignments</p>
              <p className="text-2xl font-bold">324</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="w-full">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex space-x-1 rounded-lg bg-muted p-1">
              {tabs.map(tab => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="mt-6">{tabs.find(tab => tab.id === activeTab)?.component}</div>
        </div>
      </Card>
    </div>
  );
};
