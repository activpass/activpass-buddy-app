import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, Heading, useStepper } from '@paalan/react-ui';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import {
  CLIENT_PAYMENT_FREQUENCY,
  CLIENT_PAYMENT_METHOD,
  CLIENT_PAYMENT_STATUS,
} from '@/constants/client/add-form.constant';
import { currencyIntl } from '@/utils/currency-intl';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import {
  type PaymentDetailSchema,
  paymentDetailSchema,
} from '@/validations/client/add-form.validation';

import { useClientFormStore, useClientMemberShipDetail, useClientPaymentDetail } from '../../store';
import { StepperFormActions } from '../StepperFormActions';

const fields: FormFieldItem<PaymentDetailSchema>[] = [
  {
    type: 'select',
    name: 'paymentMethod',
    label: 'Payment Method',
    options: getOptionsFromDisplayConstant(CLIENT_PAYMENT_METHOD).map(option => ({
      ...option,
      disabled: option.value !== CLIENT_PAYMENT_METHOD.CASH.value,
    })),
    required: true,
  },
  {
    type: 'select',
    name: 'paymentFrequency',
    label: 'Payment Frequency',
    options: getOptionsFromDisplayConstant(CLIENT_PAYMENT_FREQUENCY).map(option => ({
      ...option,
      disabled: option.value !== CLIENT_PAYMENT_FREQUENCY.ONE_TIME.value,
    })),
    required: true,
  },
  {
    type: 'select',
    name: 'paymentStatus',
    label: 'Payment Status',
    options: getOptionsFromDisplayConstant(CLIENT_PAYMENT_STATUS),
    required: true,
  },
];

export const PaymentDetailsForm: FC = () => {
  const { nextStep } = useStepper();

  const setPaymentDetail = useClientFormStore(state => state.setPaymentDetail);
  const { selectedPlan } = useClientMemberShipDetail();
  const paymentDetail = useClientPaymentDetail();

  const form = useForm<PaymentDetailSchema>({
    resolver: zodResolver(paymentDetailSchema),
    defaultValues: paymentDetail,
  });

  const onSubmit = (data: PaymentDetailSchema) => {
    setPaymentDetail(data);
    nextStep();
  };

  if (!selectedPlan) {
    return (
      <>
        <Heading as="h3" className="my-6 text-center text-muted-foreground">
          No membership plan selected!
        </Heading>
        <StepperFormActions />
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        <Heading as="h3">Selected Membership Plan Info:</Heading>
        <div className="flex flex-col gap-1">
          <Heading as="h5">
            Plan Name: <strong>{selectedPlan.name}</strong>
          </Heading>
          <Heading as="h5">
            Plan Amount:{' '}
            {!!selectedPlan.discountPercentage && (
              <>
                <del>{currencyIntl.format(selectedPlan.amount)}</del>
                &nbsp;&nbsp;
              </>
            )}
            <strong>{currencyIntl.format(selectedPlan.discountAmount)}</strong>
          </Heading>
          {!!selectedPlan.discountPercentage && (
            <Heading as="h5">
              Plan Discount Percentage: <strong>{selectedPlan.discountPercentage}% off</strong>
            </Heading>
          )}
        </div>
      </div>
      <Form<PaymentDetailSchema>
        form={form}
        onSubmit={onSubmit}
        hideResetButton
        hideSubmitButton
        fields={fields}
      >
        <StepperFormActions />
      </Form>
    </>
  );
};
