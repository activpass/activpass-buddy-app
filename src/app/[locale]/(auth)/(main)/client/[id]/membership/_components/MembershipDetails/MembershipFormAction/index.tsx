import { Button, HStack } from '@paalan/react-ui';
import type { FC } from 'react';

type MembershipFormActionProps = {
  onCancel: () => void;
};
export const MembershipFormAction: FC<MembershipFormActionProps> = ({ onCancel }) => {
  return (
    <HStack justifyContent="end" w="full" mt="4">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button color="success" type="submit">
        Save
      </Button>
    </HStack>
  );
};
