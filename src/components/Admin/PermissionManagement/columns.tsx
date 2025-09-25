import { Badge, Button, type DataTableColumnDef } from '@paalan/react-ui';
import { FiCheck, FiEdit3, FiEye, FiKey, FiLock, FiTrash2, FiUnlock, FiX } from 'react-icons/fi';

import type { Permission } from './types';

type GetPermissionTableColumnsParams = {
  openViewDialog: (permission: Permission) => void;
  openEditDialog: (permission: Permission) => void;
  openDeleteDialog: (permission: Permission) => void;
};
export const getPermissionTableColumns = (params: GetPermissionTableColumnsParams) => {
  const { openViewDialog, openEditDialog, openDeleteDialog } = params;
  // Table columns
  const columns: DataTableColumnDef<Permission>[] = [
    {
      header: 'Permission',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FiKey className="size-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.key}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Module',
      accessorKey: 'module',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">
          {row.original.module}
        </Badge>
      ),
    },
    {
      header: 'Resource',
      accessorKey: 'resource',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.original.resource}
        </Badge>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => <span className="text-sm capitalize">{row.original.action}</span>,
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }) => (
        <Badge className="text-xs">{row.original.category.replace(/_/g, ' ')}</Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'primary' : 'secondary'}>
          {row.original.isActive ? (
            <>
              <FiCheck className="mr-1 size-3" />
              Active
            </>
          ) : (
            <>
              <FiX className="mr-1 size-3" />
              Inactive
            </>
          )}
        </Badge>
      ),
    },
    {
      header: 'System',
      accessorKey: 'isSystemDefined',
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.isSystemDefined ? (
            <FiLock className="size-4 text-muted-foreground" />
          ) : (
            <FiUnlock className="size-4 text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openViewDialog(row.original)}>
            <FiEye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditDialog(row.original)}
            disabled={row.original.isSystemDefined}
          >
            <FiEdit3 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteDialog(row.original)}
            disabled={row.original.isSystemDefined}
          >
            <FiTrash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
  return columns;
};
