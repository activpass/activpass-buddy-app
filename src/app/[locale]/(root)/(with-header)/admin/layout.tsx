import { Box } from '@paalan/react-ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Administrative interface for managing roles, permissions, and system settings.',
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <Box className="min-h-screen bg-gray-50">{children}</Box>;
};

export default AdminLayout;
