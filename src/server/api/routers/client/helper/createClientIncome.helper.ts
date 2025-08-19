import {
  CLIENT_PAYMENT_FREQUENCY,
  CLIENT_PAYMENT_METHOD,
  CLIENT_PAYMENT_STATUS,
} from '@/constants/client/add-form.constant';
import { generateMongooseObjectId } from '@/server/api/helpers/common';
import type { CreateClientIncomeArgs } from '@/server/api/routers/client/service/client.service.types';
import { incomeRepository } from '@/server/api/routers/income/repository/income.repository';

export const createClientIncome = async ({
  plan,
  orgId,
  clientId,
  paymentDetail,
  docSave,
}: CreateClientIncomeArgs) => {
  const paymentDetailInfo = {
    paymentMethod: CLIENT_PAYMENT_METHOD.CASH.value,
    paymentFrequency: CLIENT_PAYMENT_FREQUENCY.ONE_TIME.value,
    paymentStatus: CLIENT_PAYMENT_STATUS.PAID.value,
    ...paymentDetail,
  };

  const incomeDoc = await incomeRepository.create({
    orgId,
    clientId,
    membershipPlanId: plan.id,
    data: {
      ...paymentDetailInfo,
      tenure: plan.tenure,
      amount: plan.totalAmount,
      invoiceId: generateMongooseObjectId().toHexString(),
    },
    docSave,
  });

  return incomeDoc;
};
