import { zodResolver } from '@hookform/resolvers/zod';
import { CrossCircledIcon } from '@paalan/react-icons';
import { cn } from '@paalan/react-shared/lib';
import {
  Button,
  Dialog,
  Form,
  FormControl,
  FormField,
  type FormFieldItem,
  FormItem,
  FormLabel,
  FormMessage,
  IconButton,
  Input,
  NumberInput,
  useToast,
} from '@paalan/react-ui';
import { type FC } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { CLIENT_MEMBERSHIP_TENURE } from '@/constants/client/membership.constant';
import { api } from '@/trpc/client';
import {
  type CreateMembershipPlanSchema,
  createMembershipPlanSchema,
} from '@/validations/client/membership.validation';

import type { MembershipPlan } from '../../types';

const formFields: FormFieldItem<CreateMembershipPlanSchema>[] = [
  {
    type: 'input',
    name: 'name',
    label: 'Plan Name',
    placeholder: 'Enter plan name',
    required: true,
  },
  {
    type: 'input',
    name: 'description',
    label: 'Plan Description',
    placeholder: 'Enter plan description',
    required: true,
  },
  {
    type: 'select',
    name: 'tenure',
    label: 'Tenure',
    options: Object.keys(CLIENT_MEMBERSHIP_TENURE).map(key => ({
      value: key,
      label: CLIENT_MEMBERSHIP_TENURE[key as keyof typeof CLIENT_MEMBERSHIP_TENURE].display,
    })),
    placeholder: 'Select tenure',
    required: true,
  },
  {
    type: 'number',
    name: 'amount',
    label: 'Amount',
    placeholder: 'Enter amount',
    description: 'Amount should be in INR',
    numberInputProps: {
      isPositiveFloat: true,
    },
    required: true,
  },
];

const defaultValues: Partial<CreateMembershipPlanSchema> = {
  name: '',
  description: '',
  tenure: undefined,
  amount: undefined,
  features: [
    {
      value: '',
    },
  ],
  discountPercentage: undefined,
};

type AddEditMembershipPlanDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (membershipPlan: MembershipPlan) => void;
  membershipPlan?: MembershipPlan;
};
export const AddEditMembershipPlanDialog: FC<AddEditMembershipPlanDialogProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  membershipPlan,
}) => {
  const toast = useToast();
  const { id } = membershipPlan || {};

  const createMembershipPlanMutation = api.membershipPlans.create.useMutation();
  const updateMembershipPlanMutation = api.membershipPlans.update.useMutation();

  const form = useForm<CreateMembershipPlanSchema>({
    resolver: zodResolver(createMembershipPlanSchema),
    defaultValues: membershipPlan || defaultValues,
    mode: 'onChange',
  });

  const {
    fields: featureFields,
    append,
    remove,
  } = useFieldArray({
    name: 'features',
    control: form.control,
  });

  const onCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: CreateMembershipPlanSchema) => {
    try {
      let result: MembershipPlan;
      if (id) {
        result = await updateMembershipPlanMutation.mutateAsync({ id, data });
      } else {
        result = await createMembershipPlanMutation.mutateAsync(data);
      }
      onSave(result);
      toast.success(`Membership plan ${id ? 'updated' : 'created'} successfully`);
      onCancel();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={openValue => {
        if (!openValue) {
          form.reset();
        }
        onOpenChange(openValue);
      }}
      header={{
        title: 'Create Plan',
        description: 'Create a new membership plan',
      }}
    >
      <Form<CreateMembershipPlanSchema>
        form={form}
        fields={formFields}
        onSubmit={onSubmit}
        actionClassName="justify-end"
        onReset={onCancel}
        resetText="Cancel"
        submitText={id ? 'Update Plan' : 'Create Plan'}
        className="max-h-[32.5rem] space-y-4 overflow-y-auto pl-1 pr-2"
      >
        <div className="space-y-4">
          <div>
            {featureFields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`features.${index}.value`}
                render={({ field: item }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && 'sr-only')} required>
                      Features
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...item} placeholder="Enter the feature name" />
                      </FormControl>
                      <IconButton
                        type="button"
                        disabled={featureFields.length === 1}
                        icon={<CrossCircledIcon className="size-4 text-muted-foreground" />}
                        onClick={() => remove(index)}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: '' })}
            >
              Add Feature
            </Button>
          </div>
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="discountInPercentage">
                  Discount in Percentage (Optional)
                </FormLabel>
                <FormControl>
                  <NumberInput
                    id="discountInPercentage"
                    placeholder="Enter discount in percentage"
                    isPositiveFloat
                    name={field.name}
                    disabled={field.disabled}
                    value={field.value || undefined}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    onValueChange={value => {
                      if (value > 100) return;
                      field.onChange(value || undefined);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </Dialog>
  );
};
