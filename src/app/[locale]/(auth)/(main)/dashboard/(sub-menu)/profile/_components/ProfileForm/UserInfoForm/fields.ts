import type { FormFieldItem } from '@paalan/react-ui';

import { CLIENT_GENDER } from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { UserFormSchema } from '@/validations/user/add-form.validation';

export const formFields: FormFieldItem<UserFormSchema>[] = [
  {
    type: 'input',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter first name eg. Cristiano',
    required: true,
  },
  {
    type: 'input',
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter last name eg. Ronaldo',
    required: true,
  },
  {
    type: 'number',
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: 'Enter phone number eg. 1234567890',
    required: true,
  },
  {
    type: 'input',
    name: 'email',
    label: 'Email',
    required: true,
    placeholder: 'Enter email eg. abc@gmail.com',
  },
  {
    type: 'select',
    name: 'gender',
    label: 'Gender',
    placeholder: 'Select a gender',
    required: true,
    options: getOptionsFromDisplayConstant(CLIENT_GENDER),
  },
  {
    type: 'input',
    name: 'dob',
    label: 'Date of Birth',
    inputType: 'date',
    placeholder: 'Enter date of birth',
    required: true,
  },
  {
    type: 'textarea',
    name: 'address',
    label: 'Address',
    className: 'resize-none',
    placeholder: 'Enter address eg. 123 Main St, Springfield',
    formItemClassName: 'col-span-1 sm:col-span-2',
    required: true,
  },
];
