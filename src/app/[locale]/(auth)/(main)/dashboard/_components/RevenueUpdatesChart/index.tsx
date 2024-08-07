'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@paalan/react-ui';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

type ChartItems = {
  date: string;
  revenue: number;
  expense: number;
};

const chartItems: ChartItems[] = [
  { date: '2024-04-01', revenue: 222, expense: 150 },
  { date: '2024-04-02', revenue: 97, expense: 180 },
  { date: '2024-04-03', revenue: 167, expense: 120 },
  { date: '2024-04-04', revenue: 242, expense: 260 },
  { date: '2024-04-05', revenue: 373, expense: 290 },
  { date: '2024-04-06', revenue: 301, expense: 340 },
  { date: '2024-04-07', revenue: 245, expense: 180 },
  { date: '2024-04-08', revenue: 409, expense: 320 },
  { date: '2024-04-09', revenue: 59, expense: 110 },
  { date: '2024-04-10', revenue: 261, expense: 190 },
  { date: '2024-04-11', revenue: 327, expense: 350 },
  { date: '2024-04-12', revenue: 292, expense: 210 },
  { date: '2024-04-13', revenue: 342, expense: 380 },
  { date: '2024-04-14', revenue: 137, expense: 220 },
  { date: '2024-04-15', revenue: 120, expense: 170 },
  { date: '2024-04-16', revenue: 138, expense: 190 },
  { date: '2024-04-17', revenue: 446, expense: 360 },
  { date: '2024-04-18', revenue: 364, expense: 410 },
  { date: '2024-04-19', revenue: 243, expense: 180 },
  { date: '2024-04-20', revenue: 89, expense: 150 },
  { date: '2024-04-21', revenue: 137, expense: 200 },
  { date: '2024-04-22', revenue: 224, expense: 170 },
  { date: '2024-04-23', revenue: 138, expense: 230 },
  { date: '2024-04-24', revenue: 387, expense: 290 },
  { date: '2024-04-25', revenue: 215, expense: 250 },
  { date: '2024-04-26', revenue: 75, expense: 130 },
  { date: '2024-04-27', revenue: 383, expense: 420 },
  { date: '2024-04-28', revenue: 122, expense: 180 },
  { date: '2024-04-29', revenue: 315, expense: 240 },
  { date: '2024-04-30', revenue: 454, expense: 380 },
  { date: '2024-05-01', revenue: 165, expense: 220 },
  { date: '2024-05-02', revenue: 293, expense: 310 },
  { date: '2024-05-03', revenue: 247, expense: 190 },
  { date: '2024-05-04', revenue: 385, expense: 420 },
  { date: '2024-05-05', revenue: 481, expense: 390 },
  { date: '2024-05-06', revenue: 498, expense: 520 },
  { date: '2024-05-07', revenue: 388, expense: 300 },
  { date: '2024-05-08', revenue: 149, expense: 210 },
  { date: '2024-05-09', revenue: 227, expense: 180 },
  { date: '2024-05-10', revenue: 293, expense: 330 },
  { date: '2024-05-11', revenue: 335, expense: 270 },
  { date: '2024-05-12', revenue: 197, expense: 240 },
  { date: '2024-05-13', revenue: 197, expense: 160 },
  { date: '2024-05-14', revenue: 448, expense: 490 },
  { date: '2024-05-15', revenue: 473, expense: 380 },
  { date: '2024-05-16', revenue: 338, expense: 400 },
  { date: '2024-05-17', revenue: 499, expense: 420 },
  { date: '2024-05-18', revenue: 315, expense: 350 },
  { date: '2024-05-19', revenue: 235, expense: 180 },
  { date: '2024-05-20', revenue: 177, expense: 230 },
  { date: '2024-05-21', revenue: 82, expense: 140 },
  { date: '2024-05-22', revenue: 81, expense: 120 },
  { date: '2024-05-23', revenue: 252, expense: 290 },
  { date: '2024-05-24', revenue: 294, expense: 220 },
  { date: '2024-05-25', revenue: 201, expense: 250 },
  { date: '2024-05-26', revenue: 213, expense: 170 },
  { date: '2024-05-27', revenue: 420, expense: 460 },
  { date: '2024-05-28', revenue: 233, expense: 190 },
  { date: '2024-05-29', revenue: 78, expense: 130 },
  { date: '2024-05-30', revenue: 340, expense: 280 },
  { date: '2024-05-31', revenue: 178, expense: 230 },
  { date: '2024-06-01', revenue: 178, expense: 200 },
  { date: '2024-06-02', revenue: 470, expense: 410 },
  { date: '2024-06-03', revenue: 103, expense: 160 },
  { date: '2024-06-04', revenue: 439, expense: 380 },
  { date: '2024-06-05', revenue: 88, expense: 140 },
  { date: '2024-06-06', revenue: 294, expense: 250 },
  { date: '2024-06-07', revenue: 323, expense: 370 },
  { date: '2024-06-08', revenue: 385, expense: 320 },
  { date: '2024-06-09', revenue: 438, expense: 480 },
  { date: '2024-06-10', revenue: 155, expense: 200 },
  { date: '2024-06-11', revenue: 92, expense: 150 },
  { date: '2024-06-12', revenue: 492, expense: 420 },
  { date: '2024-06-13', revenue: 81, expense: 130 },
  { date: '2024-06-14', revenue: 426, expense: 380 },
  { date: '2024-06-15', revenue: 307, expense: 350 },
  { date: '2024-06-16', revenue: 371, expense: 310 },
  { date: '2024-06-17', revenue: 475, expense: 520 },
  { date: '2024-06-18', revenue: 107, expense: 170 },
  { date: '2024-06-19', revenue: 341, expense: 290 },
  { date: '2024-06-20', revenue: 408, expense: 450 },
  { date: '2024-06-21', revenue: 169, expense: 210 },
  { date: '2024-06-22', revenue: 317, expense: 270 },
  { date: '2024-06-23', revenue: 480, expense: 530 },
  { date: '2024-06-24', revenue: 132, expense: 180 },
  { date: '2024-06-25', revenue: 141, expense: 190 },
  { date: '2024-06-26', revenue: 434, expense: 380 },
  { date: '2024-06-27', revenue: 448, expense: 490 },
  { date: '2024-06-28', revenue: 149, expense: 200 },
  { date: '2024-06-29', revenue: 103, expense: 160 },
  { date: '2024-06-30', revenue: 446, expense: 400 },
];

type ChartConfig = {
  [key: string]: {
    label: string;
    color?: string;
  };
};

const chartConfig: ChartConfig = {
  income: {
    label: 'Revenue',
  },
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  expense: {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))',
  },
};

const RevenueUpdatesChart: React.FC = () => {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>('revenue');

  const total = useMemo(
    () => ({
      revenue: chartItems.reduce((acc, curr) => acc + curr.revenue, 0),
      expense: chartItems.reduce((acc, curr) => acc + curr.expense, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Revenue Updates - Interactive</CardTitle>
          <CardDescription>Showing total revenue for the last 3 months</CardDescription>
        </div>
        <div className="flex">
          {(['revenue', 'expense'] as (keyof typeof chartConfig)[]).map(key => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                type="button"
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[key]?.label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartItems}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="income"
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueUpdatesChart;
