"use client"
import { Line } from "@ant-design/charts";

export default function LineChart ({ usersOverTime, blogsOverTime }) {
  // transform data for dual line chart
  const dates = Array.from(
    new Set([...usersOverTime, ...blogsOverTime].map((d) => d.date))
  );
  const transformedData = [];
  dates.forEach((date) => {
    transformedData.push({
      date,
      type: "Users",
      count: usersOverTime.find((u) => u.date === date)?.count || 0,
    });
    transformedData.push({
      date,
      type: "Blogs",
      count: blogsOverTime.find((b) => b.date === date)?.count || 0,
    });
  });

  const config = {
    data: transformedData,
    xField: "date",
    yField: "count",
    seriesField: "type",
    smooth: true,
    animation: { appear: { animation: "path-in", duration: 500 } },
    height: 400,
  };

  return <Line {...config} />;
};
