import { Card, CardContent, CardHeader, CardTitle } from '@paalan/react-ui';

type AnalyticsCardProps = {
  title: string;
  icon: React.ComponentType;
  value: string;
  description: string;
};

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  icon: IconComponent,
  value,
  description,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {IconComponent && <IconComponent />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
