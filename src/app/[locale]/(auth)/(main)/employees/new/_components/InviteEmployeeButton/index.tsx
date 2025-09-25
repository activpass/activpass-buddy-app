'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '@/trpc/client';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
});
type FormSchema = z.infer<typeof formSchema>;

const fields: FormFieldItem<FormSchema>[] = [
  {
    name: 'email',
    label: 'Employee Email',
    type: 'input',
    placeholder: 'Enter employee email',
  },
];

type DialogContentProps = {
  onClose: () => void;
};
const DialogContent: FC<DialogContentProps> = ({ onClose }) => {
  const sendInviteMutation = api.onboardEmployee.sendOnboardingEmailWithOrgDetails.useMutation({
    onSuccess: () => {
      onClose();
      toast.success('Onboarding email sent successfully');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: FormSchema) => {
    sendInviteMutation.mutate(data);
  };

  return (
    <Form<FormSchema>
      onSubmit={onSubmit}
      onReset={onClose}
      actionClassName="justify-end"
      resetText="Cancel"
      isSubmitting={sendInviteMutation.isPending}
      submitText={sendInviteMutation.isPending ? 'Sending Invite...' : 'Send Invite'}
      form={form}
      fields={fields}
    />
  );
};

type InviteEmployeeButtonProps = {
  className?: string;
};
export const InviteEmployeeButton: FC<InviteEmployeeButtonProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={onOpen} color="indigo">
        Send Invite via Email
      </Button>
      {isOpen && (
        <Dialog
          open={isOpen}
          onOpenChange={setIsOpen}
          header={{
            title: 'Send Invite Employee via Email',
            description: "Send an onboarding link to the employee's email address",
          }}
          content={<DialogContent onClose={onClose} />}
        />
      )}
    </>
  );
};
