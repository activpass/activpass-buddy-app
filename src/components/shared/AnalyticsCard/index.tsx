import { Card, CardContent, CardHeader, CardTitle, Strong, Text } from '@paalan/react-ui';

type AnalyticsCardProps = {
  title: string;
  icon: React.ComponentType<{ className: string }>;
  value: string;
  description?: string;
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
        {IconComponent && <IconComponent className="size-6" />}
      </CardHeader>
      <CardContent className="flex flex-col pb-0">
        <Strong className="text-3xl font-bold">{value}</Strong>
        {description && <Text className="text-sm text-muted-foreground">{description}</Text>}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
