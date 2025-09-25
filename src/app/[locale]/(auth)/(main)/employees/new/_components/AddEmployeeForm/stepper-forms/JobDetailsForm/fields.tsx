import { numberIntl } from '@paalan/react-shared/lib';
import { type FormFieldItem, Strong } from '@paalan/react-ui';
import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { convertAmountToWords } from '@/utils/helpers';
import { jobDetailsSchema, workScheduleSchema } from '@/validations/employee/add-form.validation';

export const jobDetailsFormSchema = jobDetailsSchema.extend({
  salary: z.string().min(1, 'Salary is required'),
  workSchedule: workScheduleSchema,
});

export type JobDetailsFormData = z.infer<typeof jobDetailsFormSchema>;

export const getJobDetailsFields = (form: UseFormReturn<JobDetailsFormData>) => {
  const salary = form.watch('salary');
  const fields: FormFieldItem<JobDetailsFormData>[] = [
    {
      name: 'title',
      label: 'Job Title',
      type: 'input',
      placeholder: 'Enter job title',
      required: true,
      formItemClassName: 'col-span-1',
    },
    {
      name: 'description',
      label: 'Job Description',
      type: 'input',
      placeholder: 'Enter job description',
      required: true,
      formItemClassName: 'col-span-1',
    },
    {
      name: 'department',
      label: 'Department',
      type: 'input',
      placeholder: 'Enter department',
      required: true,
      formItemClassName: 'col-span-1',
    },
    {
      name: 'salary',
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
          form.setValue('salary', '');
          return;
        }
        form.setValue('salary', salaryValue || '');
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
