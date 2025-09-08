import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, Form, type FormFieldItem, Heading, Text, toast } from '@paalan/react-ui';
import { type FC, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import {
  CLIENT_PAYMENT_FREQUENCY,
  CLIENT_PAYMENT_METHOD,
  CLIENT_PAYMENT_STATUS,
} from '@/constants/client/add-form.constant';
import { uploadToImagekit } from '@/lib/imagekit';
import { useRouter } from '@/lib/navigation';
import type { SubmitOnboardingClientInputSchema } from '@/server/api/routers/client/client.input';
import { api } from '@/trpc/client';
import { currencyIntl } from '@/utils/currency-intl';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import {
  type PaymentDetailSchema,
  paymentDetailSchema,
} from '@/validations/client/add-form.validation';

import {
  useClientFormState,
  useClientFormStore,
  useClientMemberShipDetail,
  useClientPaymentDetail,
} from '../../store';
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
    disabled: true,
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
    disabled: true,
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
  const { onboardClientId, organization } = useClientFormStore(state => state.onboardingData);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitOnboardClientMutation = api.clients.submitOnboardingClient.useMutation();
  const clientCreateMutation = api.clients.create.useMutation();

  const clientFormState = useClientFormState();

  const setPaymentDetail = useClientFormStore(state => state.setPaymentDetail);
  const { selectedPlan } = useClientMemberShipDetail();
  const paymentDetail = useClientPaymentDetail();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const form = useForm<PaymentDetailSchema>({
    resolver: zodResolver(paymentDetailSchema),
    defaultValues: paymentDetail,
  });

  const onSubmit = async (data: PaymentDetailSchema) => {
    setPaymentDetail(data);
    try {
      setIsSubmitting(true);
      const { avatar } = clientFormState.personalInformation;
      const requestBody: Omit<SubmitOnboardingClientInputSchema, 'orgId' | 'onboardClientId'> = {
        ...clientFormState,
        personalInformation: {
          ...clientFormState.personalInformation,
          dob: clientFormState.personalInformation.dob || new Date(),
          avatar: null,
        },
      };

      // If avatar is present, upload it to imagekit and get the URL
      if (avatar) {
        const response = await uploadToImagekit({
          file: avatar,
          fileName: avatar.name,
        });
        requestBody.personalInformation.avatar = response;
      }

      // If the client is being onboarded, we need to submit the client using the onboarding client mutation
      if (onboardClientId) {
        // If the organization is not found, throw an error
        if (!organization) {
          throw new Error('Organization not found');
        }

        await submitOnboardClientMutation.mutateAsync({
          ...requestBody,
          orgId: organization.id,
          onboardClientId,
        });

        startTransition(() => {
          router.push(
            `/onboarding-client/success?organizationName=${organization.name}&organizationType=${organization.type}`
          );
        });
      } else {
        await clientCreateMutation.mutateAsync(requestBody);
        startTransition(() => {
          router.push('/client');
        });
        toast.success('Client added successfully');
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
        <Heading as="h2">Payment Details</Heading>
        <Text className="text-muted-foreground">Your selected membership plan information</Text>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          {' '}
          <Text>
            Plan Name: <strong>{selectedPlan.name}</strong>
          </Text>
          <Text>
            Plan Amount:{' '}
            {!!selectedPlan.discountPercentage && (
              <>
                <del>{currencyIntl.format(selectedPlan.amount)}</del>
                &nbsp;&nbsp;
              </>
            )}
            <strong>{currencyIntl.format(selectedPlan.totalAmount)}</strong>
          </Text>
          {!!selectedPlan.discountPercentage && (
            <Text>
              Plan Discount Percentage: <strong>{selectedPlan.discountPercentage}% off</strong>
            </Text>
          )}
          <Text>
            Amount to be paid: <strong>{currencyIntl.format(selectedPlan.totalAmount)}</strong>
          </Text>
        </div>
      </div>
      <Form<PaymentDetailSchema>
        form={form}
        onSubmit={onSubmit}
        hideResetButton
        hideSubmitButton
        fields={fields}
      >
        <Checkbox
          id="acceptTerms"
          checked={isTermsAccepted}
          onCheckedChange={setIsTermsAccepted}
          label="Accept terms and conditions"
        />
        <StepperFormActions disabled={!isTermsAccepted} isSubmitting={isSubmitting || isPending} />
      </Form>
    </>
  );
};
