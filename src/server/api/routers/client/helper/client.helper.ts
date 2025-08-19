import { getTRPCError } from '@/server/api/utils/trpc-error';
import { clientRepository } from '../repository/client.repository';
import { membershipPlanRepository } from '../../membership-plan/repository/membership-plan.repository';
import { createClientIncome } from './createClientIncome.helper';

export async function updateMembershipPlan({
  clientId,
  membershipPlanId,
  isUpgrade,
}: {
  clientId: string;
  membershipPlanId: string;
  isUpgrade?: boolean;
}) {
  const client = await clientRepository.getById(clientId);

  if (isUpgrade && client.membershipPlan.toHexString() === membershipPlanId) {
    throw getTRPCError('Client already has the same membership plan', 'BAD_REQUEST');
  }

  const plan = await membershipPlanRepository.get({ id: membershipPlanId });

  // Create income record
  const incomeDoc = await createClientIncome({
    plan,
    orgId: client.organization.toHexString(),
    clientId: client.id,
  });

  // Update client membership plan and income
  client.membershipPlan = plan._id;
  client.income = incomeDoc._id;
  await client.save();

  return {
    message: isUpgrade
      ? 'Membership plan upgraded successfully'
      : 'Membership plan renewed successfully',
    data: {
      id: client.id,
    },
  };
}
