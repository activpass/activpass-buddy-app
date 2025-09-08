import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormFieldItems, Grid, VStack } from '@paalan/react-ui';
import { startOfDay } from 'date-fns';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';

import {
  type ClientInformationSchema,
  clientInformationSchema,
} from '@/validations/client/add-form.validation';

import { useClientFormStore, useEmergencyContact, usePersonalInformation } from '../../store';
import { StepperFormActions } from '../StepperFormActions';
import { getEmergencyContactFields, getPersonalInfoFields } from './fields';

export const ClientInformationForm: FC = () => {
  const nextStep = useClientFormStore(state => state.nextStep);
  const setPersonalInformation = useClientFormStore(state => state.setPersonalInformation);
  const setEmergencyContact = useClientFormStore(state => state.setEmergencyContact);
  const clientPersonalInformation = usePersonalInformation();
  const clientEmergencyContact = useEmergencyContact();

  const form = useForm<ClientInformationSchema>({
    resolver: zodResolver(clientInformationSchema),
    defaultValues: {
      ...clientPersonalInformation,
      phoneNumber: clientPersonalInformation.phoneNumber || undefined,
      emergencyContact: {
        ...clientEmergencyContact,
        phoneNumber: clientEmergencyContact.phoneNumber || undefined,
      },
    },
  });

  // const [avatarUrl, setAvatarUrl] = useState<string>('');

  // const avatar = form.watch('avatar');

  // useEffect(() => {
  //   const url = avatar ? URL.createObjectURL(avatar) : '';
  //   setAvatarUrl(url);
  //   return () => URL.revokeObjectURL(url);
  // }, [avatar]);

  // useLayoutEffect(() => {
  //   if (form.formState.errors.avatar) {
  //     setAvatarUrl('');
  //     toast.error(form.formState.errors.avatar.message);
  //   }
  // }, [form.formState.errors.avatar]);

  // const onAvatarChange = (file: File) => {
  //   form.setValue('avatar', file, {
  //     shouldDirty: true,
  //     shouldValidate: true,
  //   });
  // };

  // const onRemoveAvatar = () => {
  //   form.setValue('avatar', null, {
  //     shouldDirty: true,
  //     shouldValidate: true,
  //   });
  // };

  const onSubmit = ({ emergencyContact, ...data }: ClientInformationSchema) => {
    setPersonalInformation({
      ...data,
      dob: startOfDay(new Date(data.dob)),
    });
    setEmergencyContact(emergencyContact);
    nextStep();
  };

  return (
    <Form<ClientInformationSchema>
      form={form}
      onSubmit={onSubmit}
      hideResetButton
      hideSubmitButton
      fields={[]}
    >
      <VStack gap="12">
        {/* <div className="mt-5 flex max-w-min flex-col items-center justify-center gap-4 sm:float-left sm:mr-10">
            <AvatarUpload
              src={avatarUrl}
              onAvatarChange={onAvatarChange}
              inputProps={{
                value: '',
              }}
            />
            {avatarUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<TrashIcon boxSize="4" />}
                onClick={onRemoveAvatar}
              >
                Remove
              </Button>
            )}
          </div> */}
        <Grid className="mt-5 grid-cols-1 gap-5 sm:grid-cols-2">
          <FormFieldItems<ClientInformationSchema>
            fields={getPersonalInfoFields(form)}
            control={form.control}
          />
        </Grid>
        <Grid className="grid-cols-1 gap-5 sm:grid-cols-2">
          <FormFieldItems<ClientInformationSchema>
            fields={getEmergencyContactFields(form)}
            control={form.control}
          />
        </Grid>
      </VStack>
      <StepperFormActions />
    </Form>
  );
};
