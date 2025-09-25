'use client';

import {
  Badge,
  Button,
  Card,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@paalan/react-ui';
import { type FC, useState } from 'react';
import { LuBarChart3, LuCheckCircle, LuSettings, LuShield, LuUsers } from 'react-icons/lu';

import { api } from '@/trpc/client';

import { PermissionManagement } from './PermissionManagement';
import { RoleManagement } from './RoleManagement/RoleManagement';

type ABACDashboardProps = {
  organizationId?: string;
};

export const ABACDashboard: FC<ABACDashboardProps> = ({ organizationId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Get statistics for overview
  const { data: permissionsStats } = api.permissions.getAll.useQuery({
    page: 1,
    limit: 1,
  });

  const { data: rolesStats } = api.roles.getAll.useQuery({
    page: 1,
    limit: 1,
  });

  const { data: systemPermissions } = api.permissions.getStats.useQuery();
  const { data: systemRoles } = api.roles.getStats.useQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center space-x-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <LuShield className="size-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ABAC Management</h1>
          </div>
          <p className="text-gray-600">
            Comprehensive Attribute-Based Access Control system for managing permissions and roles
          </p>
        </div>

        {/* Navigation Tabs */}
        <TabsRoot value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <LuBarChart3 className="size-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center space-x-2">
              <LuShield className="size-4" />
              <span>Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center space-x-2">
              <LuUsers className="size-4" />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <LuSettings className="size-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Statistics Cards */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Permissions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {permissionsStats?.pagination?.total || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3">
                    <LuShield className="size-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Roles</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rolesStats?.pagination?.total || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-100 p-3">
                    <LuUsers className="size-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Permissions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {systemPermissions?.data?.total || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-100 p-3">
                    <LuCheckCircle className="size-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Roles</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {systemRoles?.data?.total || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-3">
                    <LuSettings className="size-6 text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button
                  onClick={() => setActiveTab('permissions')}
                  className="flex h-12 items-center space-x-2"
                >
                  <LuShield className="size-5" />
                  <span>Manage Permissions</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('roles')}
                  className="flex h-12 items-center space-x-2"
                  variant="outline"
                >
                  <LuUsers className="size-5" />
                  <span>Manage Roles</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('settings')}
                  className="flex h-12 items-center space-x-2"
                  variant="outline"
                >
                  <LuSettings className="size-5" />
                  <span>System Settings</span>
                </Button>
              </div>
            </Card>

            {/* ABAC Features */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">ABAC Features</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Permission Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">User Management</Badge>
                    <Badge variant="outline">Content Management</Badge>
                    <Badge variant="outline">System Administration</Badge>
                    <Badge variant="outline">Reporting & Analytics</Badge>
                    <Badge variant="outline">Security & Compliance</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Resource Types</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">User</Badge>
                    <Badge variant="outline">Role</Badge>
                    <Badge variant="outline">Permission</Badge>
                    <Badge variant="outline">Organization</Badge>
                    <Badge variant="outline">Client</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">System Health</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <div className="flex items-center space-x-3">
                    <LuCheckCircle className="size-5 text-green-600" />
                    <span className="text-sm font-medium">ABAC System</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <div className="flex items-center space-x-3">
                    <LuCheckCircle className="size-5 text-green-600" />
                    <span className="text-sm font-medium">Permission Engine</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <div className="flex items-center space-x-3">
                    <LuCheckCircle className="size-5 text-green-600" />
                    <span className="text-sm font-medium">Role Hierarchy</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Configured</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions">
            <PermissionManagement organizationId={organizationId} />
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles">
            <RoleManagement organizationId={organizationId} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">ABAC Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Default Permissions</h4>
                    <p className="text-sm text-gray-600">
                      Initialize system with default permissions
                    </p>
                  </div>
                  <Button variant="outline">Initialize</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Default Roles</h4>
                    <p className="text-sm text-gray-600">Create standard role hierarchy</p>
                  </div>
                  <Button variant="outline">Create Roles</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Export Configuration</h4>
                    <p className="text-sm text-gray-600">Download current ABAC setup</p>
                  </div>
                  <Button variant="outline">Export</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Import Configuration</h4>
                    <p className="text-sm text-gray-600">Import ABAC configuration from file</p>
                  </div>
                  <Button variant="outline">Import</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Permission Audit Log</h4>
                    <p className="text-sm text-gray-600">Log all permission checks and changes</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Role Change Notifications</h4>
                    <p className="text-sm text-gray-600">
                      Notify administrators of role modifications
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Context Validation</h4>
                    <p className="text-sm text-gray-600">Validate ABAC conditions in real-time</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>
        </TabsRoot>
      </div>
    </div>
  );
};
