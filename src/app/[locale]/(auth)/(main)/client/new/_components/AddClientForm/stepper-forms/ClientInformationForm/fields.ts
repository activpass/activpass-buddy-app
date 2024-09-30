import { dateIntl } from '@paalan/react-shared/lib';
import type { FormFieldItem } from '@paalan/react-ui';
import type { UseFormReturn } from 'react-hook-form';

import { CLIENT_GENDER, CLIENT_RELATIONSHIP } from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { ClientInformationSchema } from '@/validations/client/add-form.validation';

export const getPersonalInfoFields = (form: UseFormReturn<ClientInformationSchema>) => {
  const dob = form.watch('dob');
  const dobValue = dateIntl.formatDate(dob, {
    dateFormat: 'yyyy-MM-dd',
  });
  const fields: FormFieldItem<ClientInformationSchema>[] = [
    {
      type: 'input',
      name: 'firstName',
      label: 'First Name',
      placeholder: 'Enter first name eg. John',
      required: true,
    },
    {
      type: 'input',
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter last name eg. Doe',
      required: true,
    },
    {
      type: 'number',
      name: 'phoneNumber',
      label: 'Contact Number (WatsApp)',
      placeholder: 'Enter contact number eg. 9123456789',
      required: true,
      onValueChange(value) {
        const strValue = value.toString();
        if (!strValue) return;
        if (strValue.length > 10) {
          form.setValue('phoneNumber', +strValue.slice(0, 10));
        } else {
          form.setValue('phoneNumber', value);
        }
      },
    },
    {
      type: 'input',
      name: 'email',
      label: 'Email',
      placeholder: 'Enter email eg. john.deo@gmail.com',
      required: true,
    },
    {
      type: 'select',
      name: 'gender',
      label: 'Gender',
      placeholder: 'Select a gender',
      options: getOptionsFromDisplayConstant(CLIENT_GENDER),
      required: true,
    },
    {
      type: 'input',
      name: 'dob',
      label: 'Date of Birth',
      placeholder: 'Enter date of birth eg. 01/01/1990',
      required: true,
      inputType: 'date',
      inputProps: {
        value: dobValue,
      },
    },
    {
      type: 'textarea',
      name: 'address',
      label: 'Address',
      formItemClassName: 'sm:col-span-2',
      textareaProps: {
        rows: 3,
        className: 'resize-none',
      },
      placeholder: 'Enter address eg. 123, Main Street, City',
      required: true,
    },
  ];
  return fields;
};

export const getEmergencyContactFields = (form: UseFormReturn<ClientInformationSchema>) => {
  const fields: FormFieldItem<ClientInformationSchema>[] = [
    {
      type: 'input',
      name: 'emergencyContact.name',
      label: 'Name',
      placeholder: 'Enter name eg. John Doe',
      required: true,
    },
    {
      type: 'select',
      name: 'emergencyContact.relationship',
      label: 'Relationship',
      placeholder: 'Select a relationship',
      options: getOptionsFromDisplayConstant(CLIENT_RELATIONSHIP),
      required: true,
    },
    {
      type: 'number',
      name: 'emergencyContact.phoneNumber',
      label: 'Contact Number',
      placeholder: 'Enter phone number eg. 9123456789',
      required: true,
      onValueChange(value) {
        const strValue = value.toString();
        if (!strValue) return;
        if (strValue.length > 10) {
          form.setValue('emergencyContact.phoneNumber', +strValue.slice(0, 10));
        } else {
          form.setValue('emergencyContact.phoneNumber', value);
        }
      },
    },
    {
      type: 'input',
      name: 'emergencyContact.email',
      label: 'Email',
      placeholder: 'Enter email eg. abc@gmail.com',
    },
    {
      type: 'textarea',
      name: 'emergencyContact.address',
      label: 'Address',
      placeholder: 'Enter address eg. 123, Main Street, City',
      formItemClassName: 'sm:col-span-2',
      textareaProps: {
        rows: 3,
        className: 'resize-none',
      },
    },
  ];
  return fields;
};
