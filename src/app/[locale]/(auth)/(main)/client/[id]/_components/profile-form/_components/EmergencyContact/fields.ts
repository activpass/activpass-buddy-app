import type { FormFieldItem } from '@paalan/react-ui';

import { CLIENT_RELATIONSHIP } from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { ClientEmergencyContactSchema } from '@/validations/client/add-form.validation';

export const formFields: FormFieldItem<ClientEmergencyContactSchema>[] = [
  {
    type: 'input',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter full name eg. Jane Doe',
  },
  {
    type: 'select',
    name: 'relationship',
    label: 'Relationship',
    placeholder: 'Select relationship eg. Spouse',
    options: getOptionsFromDisplayConstant(CLIENT_RELATIONSHIP),
  },
  {
    type: 'input',
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: 'Enter phone number eg. 0987654321',
    inputType: 'number',
  },
  {
    type: 'input',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email eg. jane.doe@email.com',
  },
  {
    type: 'textarea',
    name: 'address',
    label: 'Address',
    className: 'resize-none',
    placeholder: 'Enter address eg. 456 Elm St, Springfield',
    formItemClassName: 'col-span-1 sm:col-span-2',
  },
];
