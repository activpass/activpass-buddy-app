'use client';

import { DataTable } from '@paalan/react-ui';
import { type FC, use, useCallback, useEffect, useMemo, useState } from 'react';

import { MEMBERSHIP_TENURE_DISPLAY_ITEM } from '@/constants/client/membership';

import type { MembershipPlan } from '../../types';
import { AddMembershipPlanButton } from '../AddMembershipPlanButton';
import { getMembershipColumns } from './columns';

type MembershipPlanTableProps = {
  membershipListPromise: Promise<MembershipPlan[]>;
};
export const MembershipPlanTable: FC<MembershipPlanTableProps> = ({ membershipListPromise }) => {
  const membershipLists = use(membershipListPromise);
  const [memberships, setMemberships] = useState(membershipLists);

  useEffect(() => {
    setMemberships(membershipLists);
  }, [membershipLists]);

  const onAdd = useCallback((newMembership: MembershipPlan) => {
    setMemberships(prev => [newMembership, ...prev]);
  }, []);

  const onUpdate = useCallback((updatedMembership: MembershipPlan) => {
    setMemberships(prev =>
      prev.map(membership =>
        membership.id === updatedMembership.id ? updatedMembership : membership
      )
    );
  }, []);

  const onDelete = useCallback((id: string) => {
    setMemberships(prev => prev.filter(membership => membership.id !== id));
  }, []);

  const tenureFacetOptions = useMemo(() => {
    return Object.entries(MEMBERSHIP_TENURE_DISPLAY_ITEM).map(([key, value]) => ({
      label: value,
      value: key,
    }));
  }, []);

  return (
    <DataTable
      columns={getMembershipColumns({ onUpdate, onDelete })}
      rows={memberships}
      noResultsMessage="No membership plans found."
      facetFilterColumns={[
        {
          accessorKey: 'tenure',
          title: 'Tenure',
          options: tenureFacetOptions,
        },
      ]}
      search={{
        enabled: true,
        accessorKey: 'planName',
        className: 'lg:w-full max-w-sm',
        placeholder: 'Search by plan name',
      }}
      toolbarRightSideContent={<AddMembershipPlanButton onAdd={onAdd} />}
    />
  );
};
