'use client';

import { dateIntl } from '@paalan/react-shared/lib';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Loading,
  Select,
  Text,
} from '@paalan/react-ui';
import { useState } from 'react';

import { api } from '@/trpc/client';

const StatusFilterLabel = {
  all: 'All Status',
  pending: 'Pending',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
} as const;

const statusFilterOptions = Object.entries(StatusFilterLabel).map(([value, label]) => ({
  value,
  label,
}));

type ContactStatus = 'pending' | 'in-progress' | 'resolved';
type InquiryType = 'general' | 'support' | 'billing' | 'feature' | 'bug' | 'partnership';

const getStatusVariant = (status: ContactStatus) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in-progress':
      return 'info';
    case 'resolved':
      return 'success';
    default:
      return 'secondary';
  }
};

const getTypeLabel = (type: InquiryType) => {
  switch (type) {
    case 'general':
      return 'General Inquiry';
    case 'support':
      return 'Technical Support';
    case 'billing':
      return 'Billing Question';
    case 'feature':
      return 'Feature Request';
    case 'bug':
      return 'Bug Report';
    case 'partnership':
      return 'Partnership';
    default:
      return type;
  }
};

const AdminContactsPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');

  const { data, isLoading, refetch } = api.contacts.list.useQuery({
    page,
    limit: 10,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const updateStatusMutation = api.contacts.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleStatusUpdate = (id: string, newStatus: ContactStatus) => {
    updateStatusMutation.mutate({
      id,
      status: newStatus,
    });
  };

  if (isLoading) {
    return <Loading parentClassName="h-full" content="Loading..." />;
  }

  return (
    <Box className="h-full bg-background p-8">
      <Box className="mx-auto max-w-7xl">
        {/* Header */}
        <Box className="mb-8">
          <Text className="text-3xl font-bold text-secondary-foreground">Contact Submissions</Text>
          <Text className="mt-2 text-muted-foreground">
            Manage and respond to customer inquiries
          </Text>
        </Box>

        {/* Filters */}

        <Select
          className="mb-5 w-48"
          options={statusFilterOptions}
          value={statusFilter}
          onValueChange={(value: ContactStatus) => setStatusFilter(value || 'all')}
        />

        {/* Contact Cards */}
        <Box className="space-y-4">
          {data?.contacts.map(contact => (
            <Card key={contact.id}>
              <CardHeader>
                <Box className="flex items-start justify-between">
                  <Box>
                    <CardTitle className="text-lg">{contact.subject}</CardTitle>
                    <Text className="text-sm text-muted-foreground">
                      From: {contact.name} ({contact.email})
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {dateIntl.format(new Date(contact.createdAt), {
                        dateFormat: 'MMMM d, yyyy at hh:mm a',
                      })}
                    </Text>
                  </Box>
                  <Box className="flex gap-2">
                    <Badge variant="outline">{getTypeLabel(contact.type as InquiryType)}</Badge>
                    <Badge variant={getStatusVariant(contact.status as ContactStatus)}>
                      {StatusFilterLabel[contact.status]}
                    </Badge>
                  </Box>
                </Box>
              </CardHeader>
              <CardContent>
                <Text className="mb-4 text-sm">{contact.message}</Text>

                {contact.adminNotes && (
                  <Box className="mb-4 rounded-md bg-blue-50 p-3">
                    <Text className="text-xs font-medium text-blue-900">Admin Notes:</Text>
                    <Text className="text-sm text-blue-800">{contact.adminNotes}</Text>
                  </Box>
                )}

                <Box className="flex gap-2">
                  {contact.status !== 'in-progress' && (
                    <Button
                      size="sm"
                      variant="outline"
                      color="blue"
                      onClick={() => handleStatusUpdate(contact.id, 'in-progress')}
                      isLoading={updateStatusMutation.isPending}
                    >
                      Mark In Progress
                    </Button>
                  )}
                  {contact.status !== 'resolved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      color="success"
                      onClick={() => handleStatusUpdate(contact.id, 'resolved')}
                      disabled={updateStatusMutation.isPending}
                    >
                      Mark Resolved
                    </Button>
                  )}
                  {contact.status !== 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      color="orange"
                      onClick={() => handleStatusUpdate(contact.id, 'pending')}
                      disabled={updateStatusMutation.isPending}
                    >
                      Mark Pending
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Pagination */}
        {!!data?.pagination?.total && (
          <Box className="mt-8 flex items-center justify-between">
            <Text className="text-sm text-muted-foreground">
              Showing {data.contacts.length} of {data.pagination.total} contacts
            </Text>
            <Box className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.pagination.hasPreviousPage}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Text className="flex items-center px-3 text-sm">
                Page {data.pagination.currentPage} of {data.pagination.totalPages}
              </Text>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.pagination.hasNextPage}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {data?.contacts.length === 0 && (
          <Box className="py-12 text-center">
            <Text className="text-muted-foreground">No contact submissions found.</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminContactsPage;
