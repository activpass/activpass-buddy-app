'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@paalan/react-shared/lib';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  type FormItemField,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from '@paalan/react-ui';
import { useFieldArray, useForm } from 'react-hook-form';

import {
  profileFormSchema,
  type ProfileFormSchemaType,
} from '@/validations/client-profile.validation';

// This can come from your database or API.
const defaultValues: Partial<ProfileFormSchemaType> = {
  bio: 'I own a computer.',
  urls: [{ value: 'https://shadcn.com' }, { value: 'http://twitter.com/shadcn' }],
};

const formFields: FormItemField[] = [
  {
    type: 'input',
    name: 'username',
    label: 'Username',
    placeholder: 'shadcn',
    description:
      'This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.',
  },
  {
    type: 'select',
    name: 'email',
    label: 'Email',
    options: ['m@example.com', 'm@google.com', 'm@support.com'],
    placeholder: 'Select a verified email to display',
  },
  {
    type: 'textarea',
    name: 'bio',
    label: 'Bio',
    className: 'resize-none',
    placeholder: 'Tell us a little bit about yourself',
    description: 'You can @mention other users and organizations to link to them.',
  },
];
export const ProfileForm = () => {
  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  });

  const onSubmit = (data: ProfileFormSchemaType) => {
    toast('You submitted the following values:', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form<ProfileFormSchemaType>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Profile"
      hideResetButton
    >
      <div>
        {fields.map((field, index) => (
          <FormField
            control={form.control}
            key={field.id}
            name={`urls.${index}.value`}
            render={({ field: item }) => (
              <FormItem>
                <FormLabel className={cn(index !== 0 && 'sr-only')}>URLs</FormLabel>
                <FormDescription className={cn(index !== 0 && 'sr-only')}>
                  Add links to your website, blog, or social media profiles.
                </FormDescription>
                <FormControl>
                  <Input {...item} />
                </FormControl>
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
          Add URL
        </Button>
      </div>
    </Form>
  );
};
