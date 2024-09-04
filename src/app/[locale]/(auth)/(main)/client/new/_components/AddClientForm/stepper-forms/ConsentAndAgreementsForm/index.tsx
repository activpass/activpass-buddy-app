import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import { uploadToImagekit } from '@/lib/imagekit';
import { useRouter } from '@/lib/navigation';
import { api } from '@/trpc/client';
import {
  type ConsentAndAgreementSchema,
  consentAndAgreementSchema,
} from '@/validations/client/add-form.validation';

import { useClientConsentAndAgreement, useClientFormState, useClientFormStore } from '../../store';
import { StepperFormActions } from '../StepperFormActions';

const fields: FormFieldItem<ConsentAndAgreementSchema>[] = [
  {
    type: 'checkbox',
    name: 'termsAndConditions',
    label: 'Agreement to Terms and Conditions',
    required: true,
  },
  {
    type: 'checkbox',
    name: 'privacyPolicy',
    label: 'Consent to Collect and Use Data for Health and Fitness Purposes',
    required: true,
  },
  {
    type: 'checkbox',
    name: 'websAppCommunication',
    label: 'Consent to contact via WhatsApp for communication.',
    required: true,
  },
  {
    type: 'checkbox',
    name: 'promotionalCommunication',
    label: 'Consent to Receive Promotional Communication',
  },
  {
    type: 'input',
    name: 'signature.name',
    label: 'Signature',
    placeholder: 'Enter your name',
    required: true,
    formItemClassName: 'pt-10',
  },
];

export const ConsentAndAgreementsForm: FC = () => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const clientCreateMutation = api.clients.create.useMutation();

  const clientFormState = useClientFormState();
  const setConsentAndAgreement = useClientFormStore(state => state.setConsentAndAgreement);
  const consentAndAgreement = useClientConsentAndAgreement();

  const form = useForm<ConsentAndAgreementSchema>({
    resolver: zodResolver(consentAndAgreementSchema),
    defaultValues: consentAndAgreement,
  });

  const onSubmit = async (data: ConsentAndAgreementSchema) => {
    setConsentAndAgreement(data);
    try {
      setIsSubmitting(true);
      const { avatar } = clientFormState.clientInformation;
      const requestBody = {
        ...clientFormState,
        clientInformation: {
          ...clientFormState.clientInformation,
          dob: clientFormState.clientInformation.dob || new Date(),
          avatar: '',
        },
        consentAndAgreement: data,
      };

      if (avatar) {
        const response = await uploadToImagekit({
          file: avatar,
          fileName: avatar.name,
        });
        requestBody.clientInformation.avatar = response.url;
      }

      await clientCreateMutation.mutateAsync(requestBody);
      router.push('/client');
      toast.success('Client added successfully');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form<ConsentAndAgreementSchema>
      form={form}
      onSubmit={onSubmit}
      hideResetButton
      hideSubmitButton
      fields={fields}
    >
      <StepperFormActions isSubmitting={isSubmitting} />
    </Form>
  );
};
