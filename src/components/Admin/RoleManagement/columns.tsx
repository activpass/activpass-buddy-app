import { Badge, Button, type DataTableColumnDef, Tooltip } from '@paalan/react-ui';
import {
  FiCheck,
  FiCopy,
  FiEdit3,
  FiEye,
  FiKey,
  FiShield,
  FiTrash2,
  FiUsers,
  FiX,
} from 'react-icons/fi';

import { getLevelColor, getTypeColor } from './constants';
import type { Role } from './types';

type GetRoleTableColumns = {
  handleView: (role: Role) => void;
  handleEdit: (role: Role) => void;
  handleClone: (role: Role) => void;
  handleDelete: (role: Role) => void;
};
export const getRoleTableColumns = (params: GetRoleTableColumns) => {
  const { handleView, handleEdit, handleClone, handleDelete } = params;
  // Table columns
  const columns: DataTableColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Role Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FiShield className="size-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">{row.original.key}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge className={`text-xs ${getTypeColor(row.original.type)}`}>{row.original.type}</Badge>
      ),
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => (
        <Badge className={`text-xs ${getLevelColor(row.original.level)}`}>
          {row.original.level}
        </Badge>
      ),
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <FiKey className="size-4 text-muted-foreground" />
          <span className="text-sm">{row.original.permissions?.length || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: 'memberCount',
      header: 'Members',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <FiUsers className="size-4 text-muted-foreground" />
          <span className="text-sm">{row.original.memberCount || 0}</span>
          {row.original.maxMembers && (
            <span className="text-xs text-muted-foreground">/ {row.original.maxMembers}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
          {row.original.isActive ? (
            <>
              <FiCheck className="mr-1 size-3" /> Active
            </>
          ) : (
            <>
              <FiX className="mr-1 size-3" /> Inactive
            </>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Tooltip
            content="View Details"
            trigger={
              <Button variant="ghost" size="sm" onClick={() => handleView(row.original)}>
                <FiEye className="size-4" />
              </Button>
            }
          />

          <Tooltip
            content="Edit Role"
            trigger={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(row.original)}
                disabled={row.original.isSystemDefined}
              >
                <FiEdit3 className="size-4" />
              </Button>
            }
          />

          <Tooltip
            content="Clone Role"
            trigger={
              <Button variant="ghost" size="sm" onClick={() => handleClone(row.original)}>
                <FiCopy className="size-4" />
              </Button>
            }
          />

          <Tooltip
            content="Delete Role"
            trigger={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(row.original)}
                disabled={row.original.isSystemDefined || row.original.isCreatorRole}
              >
                <FiTrash2 className="size-4" />
              </Button>
            }
          />
        </div>
      ),
    },
  ];
  return columns;
};
