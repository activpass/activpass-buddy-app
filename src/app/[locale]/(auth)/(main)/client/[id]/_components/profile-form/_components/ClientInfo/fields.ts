import type { FormFieldItem } from '@paalan/react-ui';
import type { z } from 'zod';

import { CLIENT_GENDER } from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import { clientPersonalInformationSchema } from '@/validations/client/add-form.validation';

const clientPersonalInformationWithoutAvatarSchema = clientPersonalInformationSchema.omit({
  avatar: true,
});

export type ClientPersonalInformationSchema = z.infer<
  typeof clientPersonalInformationWithoutAvatarSchema
>;

export const formFields: FormFieldItem<ClientPersonalInformationSchema>[] = [
  {
    type: 'input',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter first name eg. Cristiano',
  },
  {
    type: 'input',
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter last name eg. Ronaldo',
  },
  {
    type: 'input',
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: 'Enter phone number eg. 1234567890',
    inputType: 'number',
  },
  {
    type: 'input',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email eg. abc@gmail.com',
  },
  {
    type: 'select',
    name: 'gender',
    label: 'Gender',
    placeholder: 'Select gender eg. Male',
    options: getOptionsFromDisplayConstant(CLIENT_GENDER),
  },
  {
    type: 'date-picker',
    name: 'dob',
    label: 'Date of Birth',
    placeholder: 'Enter date of birth eg. 1985-02-05',
  },
  {
    type: 'textarea',
    name: 'address',
    label: 'Address',
    className: 'resize-none',
    placeholder: 'Enter address eg. 123 Main St, Springfield',
    formItemClassName: 'col-span-1 sm:col-span-2',
  },
];
