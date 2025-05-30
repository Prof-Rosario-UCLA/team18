import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";

interface HourlyTemperatureProps {
  data: ForecastData; // full forecast data from API
}

interface ChartData {
  time: string;       // formatted hour
  temp: number;       // actual temperature
  feels_like: number; // "feels like" temperature
}

// Tooltip renderer for chart hover display
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const temp = payload[0]?.value;
  const feelsLike = payload[1]?.value;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        {/* Actual temperature display */}
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Temperature
          </span>
          <span className="font-bold">{temp}°</span>
        </div>
        {/* Feels like display */}
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Feels Like
          </span>
          <span className="font-bold">{feelsLike}°</span>
        </div>
      </div>
    </div>
  );
};

// Main component for rendering hourly temperature chart
export const HourlyTemperature = memo(({ data }: HourlyTemperatureProps) => {
  // Take next 8 hours
  const chartData: ChartData[] = data.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"), // format timestamp
    temp: Math.round(item.main.temp),             
    feels_like: Math.round(item.main.feels_like), 
  }));

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Today's Temperature</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                stroke="#888"       
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="temp"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#64748b"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

HourlyTemperature.displayName = "HourlyTemperature";

