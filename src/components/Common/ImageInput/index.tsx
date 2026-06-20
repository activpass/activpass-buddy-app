import { DeleteIcon } from '@paalan/react-icons';
import { Box, IconButton, Input } from '@paalan/react-ui';
import { useRef } from 'react';
import { type ControllerRenderProps, type Path, useFormState } from 'react-hook-form';

type ImageInputProps<TData extends Record<string, unknown>> = {
  field: ControllerRenderProps<TData, Path<TData>>;
};
export const ImageInput = <TData extends Record<string, unknown>>({
  field,
}: ImageInputProps<TData>) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      field.onChange(file);
    }
  };

  const { errors } = useFormState();

  const isError = !!errors[field.name];

  const handleFileRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    field.onChange(null);
  };

  return (
    <Box className="flex items-center gap-2">
      <Input
        {...field}
        value={undefined}
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        isInvalid={isError}
        inputClassName="py-2"
      />
      {field.value && (
        <IconButton
          type="button"
          icon={<DeleteIcon className="size-4" />}
          onClick={handleFileRemove}
          color="red"
        />
      )}
    </Box>
  );
};
