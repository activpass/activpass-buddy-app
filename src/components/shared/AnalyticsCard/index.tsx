import {
  CardContent,
  CardHeader,
  CardRoot,
  CardTitle,
  Skeleton,
  Strong,
  Text,
} from '@paalan/react-ui';

type AnalyticsCardProps = {
  title: string;
  icon: React.ComponentType<{ className: string }>;
  value: string;
  description?: string;
  isLoading?: boolean;
};

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  icon: IconComponent,
  value,
  description,
  isLoading,
}) => {
  return (
    <CardRoot>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {IconComponent && <IconComponent className="size-6" />}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {isLoading ? (
          <Skeleton h="8" pt="6" />
        ) : (
          <Strong className="text-3xl font-bold">{value}</Strong>
        )}
        {description && <Text className="text-sm text-muted-foreground">{description}</Text>}
      </CardContent>
    </CardRoot>
  );
};

export default AnalyticsCard;
