import type { FormFieldItem } from '@paalan/react-ui';

import { CLIENT_GENDER, CLIENT_RELATIONSHIP } from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { EmployeeFormSchema } from '@/validations/employee/add-form.validation';

export const formFields: FormFieldItem<EmployeeFormSchema>[] = [
  {
    type: 'input',
    name: 'emergencyContact.name',
    label: 'Emergency Name',
    placeholder: 'Enter full name eg. Jane Doe',
    required: true,
  },
  {
    type: 'number',
    name: 'emergencyContact.phoneNumber',
    label: 'Emergency Contact',
    placeholder: 'Enter phone number eg. 9876543219',
    required: true,
  },
  {
    type: 'select',
    name: 'emergencyContact.relationship',
    label: 'Relationship',
    placeholder: 'Select relationship eg. Spouse',
    options: getOptionsFromDisplayConstant(CLIENT_RELATIONSHIP),
    required: true,
  },
  {
    type: 'select',
    name: 'emergencyContact.gender',
    label: 'Gender',
    placeholder: 'Select a gender',
    options: getOptionsFromDisplayConstant(CLIENT_GENDER),
    required: true,
  },
];
