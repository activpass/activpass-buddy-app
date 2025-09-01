import { Button, Paper } from '@paalan/react-ui';

import Link from '@/components/Link';

export const NoMembershipPlans: React.FC = () => {
  return (
    <Paper className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">You have no membership plans</h3>
        <p className="text-sm text-muted-foreground">
          You can add a membership plan to start tracking your clients.
        </p>
        <Link href="/membership">
          <Button className="mt-4">Add Membership Plan</Button>
        </Link>
      </div>
    </Paper>
  );
};
