import {
  Badge,
  Button,
  Card,
  Input,
  Label,
  Select,
  Separator,
  Switch,
  Textarea,
} from '@paalan/react-ui';
import { type FC, useEffect, useImperativeHandle, useState } from 'react';
import { FiActivity, FiInfo, FiKey, FiSave, FiX } from 'react-icons/fi';

import { permissionBaseSchema } from '@/validations/permission.validation';

import type { Permission, PermissionFormData } from './types';

export type PermissionFormRefProps = {
  resetForm: () => void;
};
export type PermissionFormProps = {
  permission?: Permission | null;
  onSubmit: (data: PermissionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  ref?: React.Ref<PermissionFormRefProps>;
};

const defaultFormData: PermissionFormData = {
  key: '',
  name: '',
  description: '',
  module: Object.values(permissionBaseSchema.shape.module.enum)[0]!,
  resource: Object.values(permissionBaseSchema.shape.resource.enum)[0]!,
  action: Object.values(permissionBaseSchema.shape.action.enum)[0]!,
  category: 'USER_MANAGEMENT',
  priority: 50,
  isActive: true,
  conditions: {},
  metadata: {},
};
export const PermissionForm: FC<PermissionFormProps> = ({
  permission,
  onSubmit,
  onCancel,
  isLoading = false,
  ref,
}) => {
  const [formData, setFormData] = useState<PermissionFormData>(defaultFormData);

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  useImperativeHandle(ref, () => ({
    resetForm,
  }));

  useEffect(() => {
    if (permission) {
      setFormData({
        key: permission.key || '',
        name: permission.name || '',
        description: permission.description || '',
        module: permission.module || '',
        resource: permission.resource || '',
        action: permission.action || '',
        category: permission.category || 'USER_MANAGEMENT',
        priority: permission.priority || 50,
        isActive: permission.isActive ?? true,
        conditions: permission.conditions || {},
        metadata: permission.metadata || {},
      });
    }
  }, [permission]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const generatePermissionKey = () => {
    const { module, resource, action } = formData;
    if (module && resource && action) {
      const key = `${module}:${resource}:${action}`;
      setFormData(prev => ({ ...prev, key }));
    }
  };

  const generateNameFromKey = () => {
    const { module, resource, action } = formData;
    if (module && resource && action) {
      const name = `${module.charAt(0).toUpperCase() + module.slice(1)} ${resource} ${action}`;
      setFormData(prev => ({ ...prev, name }));
    }
  };

  const handleModuleChange = (module: PermissionFormData['module']) => {
    setFormData(prev => ({ ...prev, module }));
    if (formData.resource && formData.action) {
      setTimeout(() => {
        generatePermissionKey();
        generateNameFromKey();
      }, 0);
    }
  };

  const handleResourceChange = (resource: PermissionFormData['resource']) => {
    setFormData(prev => ({ ...prev, resource }));
    if (formData.module && formData.action) {
      setTimeout(() => {
        generatePermissionKey();
        generateNameFromKey();
      }, 0);
    }
  };

  const handleCategoryChange = (category: PermissionFormData['category']) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const handleActionChange = (action: PermissionFormData['action']) => {
    setFormData(prev => ({ ...prev, action }));
    if (formData.module && formData.resource) {
      setTimeout(() => {
        generatePermissionKey();
        generateNameFromKey();
      }, 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="rounded-lg bg-primary/10 p-3">
          <FiKey className="size-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            {permission ? 'Edit Permission' : 'Create New Permission'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {permission ? 'Update permission details' : 'Define a new permission for your system'}
          </p>
        </div>
      </div>

      <Separator />

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="flex items-center space-x-2 text-base font-medium">
          <FiInfo className="size-4" />
          <span>Basic Information</span>
        </h4>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label className="mb-2 block text-sm font-medium text-muted-foreground">Module *</Label>
            <Select
              value={formData.module}
              onValueChange={handleModuleChange}
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
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-muted-foreground">
              Resource *
            </Label>
            <Select
              value={formData.resource}
              onValueChange={handleResourceChange}
              options={[
                { value: 'profile', label: 'Profile' },
                { value: 'users', label: 'Users' },
                { value: 'roles', label: 'Roles' },
                { value: 'permissions', label: 'Permissions' },
                { value: 'organizations', label: 'Organizations' },
                { value: 'memberships', label: 'Memberships' },
                { value: 'billing', label: 'Billing' },
                { value: 'invoices', label: 'Invoices' },
                { value: 'payments', label: 'Payments' },
                { value: 'subscriptions', label: 'Subscriptions' },
                { value: 'content', label: 'Content' },
                { value: 'posts', label: 'Posts' },
                { value: 'pages', label: 'Pages' },
                { value: 'media', label: 'Media' },
                { value: 'analytics', label: 'Analytics' },
              ]}
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-muted-foreground">Action *</Label>
            <Select
              value={formData.action}
              onValueChange={handleActionChange}
              options={[
                { value: 'read', label: 'Read' },
                { value: 'create', label: 'Create' },
                { value: 'update', label: 'Update' },
                { value: 'delete', label: 'Delete' },
                { value: 'manage', label: 'Manage' },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-2 block text-sm font-medium text-muted-foreground">
              Permission Key *
            </Label>
            <div className="flex space-x-2">
              <Input
                value={formData.key}
                onChange={e => setFormData({ ...formData, key: e.target.value })}
                placeholder="module:resource:action"
                disabled={!!permission}
                required
                className="font-mono"
              />
              {!permission && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePermissionKey}
                  disabled={!formData.module || !formData.resource || !formData.action}
                >
                  Generate
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-muted-foreground">
              Permission Name *
            </Label>
            <div className="flex space-x-2">
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Descriptive permission name"
                required
              />
              {!permission && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateNameFromKey}
                  disabled={!formData.module || !formData.resource || !formData.action}
                >
                  Generate
                </Button>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium text-muted-foreground">
            Description
          </Label>
          <Textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this permission allows"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label className="mb-2 block text-sm font-medium text-muted-foreground">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
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

          <div className="flex items-center space-x-2 pt-6">
            <Switch
              checked={formData.isActive}
              onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
            />
            <Label className="text-sm font-medium">Active Permission</Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Permission Preview */}
      <div className="space-y-4">
        <h4 className="flex items-center space-x-2 text-base font-medium">
          <FiActivity className="size-4" />
          <span>Permission Preview</span>
        </h4>

        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="font-mono">
                {formData.key || 'module:resource:action'}
              </Badge>
              <Badge variant="secondary">{formData.category.replace(/_/g, ' ')}</Badge>
              {formData.isActive ? (
                <Badge variant="success">Active</Badge>
              ) : (
                <Badge variant="danger">Inactive</Badge>
              )}
            </div>

            <div>
              <h5 className="font-medium">{formData.name || 'Permission Name'}</h5>
              {formData.description && (
                <p className="mt-1 text-sm text-muted-foreground">{formData.description}</p>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">Module:</span>
                <Badge variant="outline">{formData.module || 'N/A'}</Badge>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">Resource:</span>
                <Badge variant="outline">{formData.resource || 'N/A'}</Badge>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">Action:</span>
                <Badge variant="outline">{formData.action || 'N/A'}</Badge>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">Priority:</span>
                <Badge variant="secondary">{formData.priority}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-2 border-t pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          <FiX className="mr-2 size-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Saving..."
          disabled={
            !formData.name ||
            !formData.key ||
            !formData.module ||
            !formData.resource ||
            !formData.action
          }
          leftIcon={<FiSave className="size-4" />}
        >
          {permission ? 'Update Permission' : 'Create Permission'}
        </Button>
      </div>
    </form>
  );
};
