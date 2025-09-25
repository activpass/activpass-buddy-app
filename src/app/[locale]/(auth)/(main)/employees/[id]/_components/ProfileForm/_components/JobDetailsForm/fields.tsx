import { numberIntl } from '@paalan/react-shared/lib';
import { type FormFieldItem, Strong } from '@paalan/react-ui';
import type { UseFormReturn } from 'react-hook-form';

import { convertAmountToWords } from '@/utils/helpers';
import type { EmployeeFormSchema } from '@/validations/employee/add-form.validation';

export const getFormFields = (form: UseFormReturn<EmployeeFormSchema>) => {
  const salary = form.watch('payroll.grossSalary');
  const fields: FormFieldItem<EmployeeFormSchema>[] = [
    {
      name: 'jobDetails.title',
      label: 'Job Title',
      type: 'input',
      placeholder: 'Enter job title',
      required: true,
      formItemClassName: 'col-span-1',
    },
    {
      name: 'jobDetails.description',
      label: 'Job Description',
      type: 'input',
      placeholder: 'Enter job description',
      formItemClassName: 'col-span-1',
    },
    {
      name: 'jobDetails.department',
      label: 'Department',
      type: 'input',
      placeholder: 'Enter department',
      required: true,
      formItemClassName: 'col-span-1',
    },
    {
      name: 'payroll.grossSalary',
      label: 'Salary',
      type: 'input',
      placeholder: 'Enter a salary, e.g., 50000',
      required: true,
      formItemClassName: 'col-span-1',
      description: (
        <span>
          Enter amount in INR{' '}
          {!!salary && (
            <span>
              - <Strong>{convertAmountToWords(salary)}</Strong>
            </span>
          )}
        </span>
      ),
      onValueChange(value) {
        const strValue = value.replace(/,/g, '');
        const parsedValue = parseFloat(strValue);
        const salaryValue = numberIntl.format(parsedValue);
        if (Number.isNaN(parsedValue)) {
          form.setValue('payroll.grossSalary', '');
          return;
        }
        form.setValue('payroll.grossSalary', salaryValue || '');
      },
    },
    {
      name: 'workSchedule.shiftStartTime',
      label: 'Shift Start Time',
      type: 'input',
      inputType: 'time',
      placeholder: '07:00',
      required: true,
      formItemClassName: 'col-span-1',
    },
    {
      name: 'workSchedule.shiftEndTime',
      label: 'Shift End Time',
      type: 'input',
      inputType: 'time',
      placeholder: '07:00',
      required: true,
      formItemClassName: 'col-span-1',
    },
    {
      name: 'workSchedule.breakHours',
      label: 'Break hours',
      type: 'number',
      placeholder: 'Enter break hours, e.g., 1',
      required: true,
      formItemClassName: 'col-span-1',
      numberInputProps: {
        zeroAsEmptyString: true,
      },
    },
    {
      name: 'workSchedule.entitledHolidays',
      label: 'Entitled Holidays',
      type: 'number',
      placeholder: 'Enter number of holidays, e.g., 12',
      required: true,
      formItemClassName: 'col-span-1',
      numberInputProps: {
        zeroAsEmptyString: true,
      },
    },
  ];
  return fields;
};
