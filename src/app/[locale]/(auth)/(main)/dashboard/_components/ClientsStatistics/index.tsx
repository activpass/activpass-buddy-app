'use client';

import type { ChartConfig } from '@paalan/react-ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from '@paalan/react-ui';
import { useMemo, useState } from 'react';
import { Label, Pie, PieChart, Sector } from 'recharts';
import type { PieSectorDataItem } from 'recharts/types/polar/Pie';

type DataItem = {
  category: string;
  value: number;
  fill: string;
};

type ViewBoxType = {
  cx?: number;
  cy?: number;
  activeIndex?: number;
};

const data: DataItem[] = [
  { category: 'men', value: 400, fill: 'var(--color-men)' },
  { category: 'women', value: 300, fill: 'var(--color-women)' },
  { category: 'others', value: 200, fill: 'var(--color-others)' },
];

const chartConfig: ChartConfig = {
  men: {
    label: 'Men',
    color: 'hsl(var(--chart-1))',
  },
  women: {
    label: 'Women',
    color: 'hsl(var(--chart-2))',
  },
  others: {
    label: 'Others',
    color: 'hsl(var(--chart-4))',
  },
};

const ActiveShape = ({ outerRadius = 0, ...props }: PieSectorDataItem) => (
  <g>
    <Sector {...props} outerRadius={outerRadius + 10} />
    <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
  </g>
);

const CustomLabel = ({ viewBox }: { viewBox: ViewBoxType }) => {
  const totalClients = data.reduce((sum, item) => sum + item.value, 0);

  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
    return (
      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
          {totalClients.toLocaleString()}
        </tspan>
        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
          Clients
        </tspan>
      </text>
    );
  }
  return null;
};

export const ClientsStatistics = () => {
  const id = 'pie-client-statistics';
  const [activeCategory, setActiveCategory] = useState(data[0]?.category);

  const activeIndex = useMemo(
    () => data.findIndex(item => item.category === activeCategory),
    [activeCategory]
  );
  const categories = useMemo(() => data.map(item => item.category), []);

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Clients Statistics</CardTitle>
          <CardDescription>Distribution by Gender and Others</CardDescription>
        </div>
        <SelectRoot value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a category"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {categories.map(key => {
              const config = chartConfig[key as keyof typeof chartConfig];

              if (!config) {
                return null;
              }

              return (
                <SelectItem key={key} value={key} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex size-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </SelectRoot>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={ActiveShape}
            >
              <Label content={<CustomLabel viewBox={{ activeIndex }} />} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
