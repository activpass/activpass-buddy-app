'use client';

import type { ChartConfig } from '@paalan/react-ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@paalan/react-ui';
import { LuTrendingUp } from 'react-icons/lu';
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';

const chartItems = [
  { month: 'January', salary: 5000 },
  { month: 'February', salary: 2200 },
  { month: 'March', salary: 6400 },
  { month: 'April', salary: 4600 },
  { month: 'May', salary: 7800 },
  { month: 'June', salary: 5000 },
];

const chartConfig: ChartConfig = {
  salary: {
    label: 'Salary',
    color: 'hsl(var(--chart-1))',
  },
};

export const EmployeeSalary = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Salary Distribution</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartItems}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            {Object.keys(chartConfig).map(key => {
              const configItem = chartConfig[key as keyof typeof chartConfig];
              const color = configItem?.color || 'gray';
              return (
                <Line
                  key={key}
                  dataKey={key}
                  type="natural"
                  stroke={color}
                  strokeWidth={2}
                  dot={{
                    fill: color,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                >
                  <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                </Line>
              );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <LuTrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total salary distribution for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};
