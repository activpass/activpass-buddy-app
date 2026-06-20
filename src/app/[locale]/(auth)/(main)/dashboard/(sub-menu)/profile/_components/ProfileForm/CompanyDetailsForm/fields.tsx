import { type FormFieldItem } from '@paalan/react-ui';

import { ImageInput } from '@/components/Common/ImageInput';
import { BUSINESS_TYPE_OPTIONS } from '@/constants/organization/form.constants';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { UserFormSchema } from '@/validations/user/add-form.validation';

export const getFormFields = () => {
  const fields: FormFieldItem<UserFormSchema>[] = [
    {
      type: 'input',
      name: 'organization.name',
      label: 'Company Name',
      placeholder: 'Enter your Company name',
      required: true,
    },
    {
      type: 'select',
      name: 'organization.type',
      label: 'Company Type',
      placeholder: 'Select Company type',
      required: true,
      options: getOptionsFromDisplayConstant(BUSINESS_TYPE_OPTIONS),
    },
    {
      type: 'custom',
      name: 'organization.logo',
      label: 'Business Logo',
      render: ({ field }) => <ImageInput field={field} />,
    },
    {
      type: 'input',
      name: 'organization.address',
      label: 'Address',
      placeholder: 'Enter your address',
      required: true,
    },
    {
      type: 'input',
      name: 'organization.city',
      label: 'City',
      placeholder: 'Enter your city',
      required: true,
    },
    {
      type: 'input',
      name: 'organization.pincode',
      label: 'Pincode',
      placeholder: 'Enter your pincode',
      required: true,
      inputProps: {
        maxLength: 6,
      },
    },
  ];
  return fields;
};
