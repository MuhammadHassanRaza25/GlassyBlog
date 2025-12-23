"use client"
import { Pie } from "@ant-design/charts";

export default function PieChart ({ totalUsers, totalBlogs }) {
  const data = [
    { type: "Users", value: totalUsers },
    { type: "Blogs", value: totalBlogs },
  ];

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: { type: "inner", offset: "-30%", content: "{value}" },
    interactions: [{ type: "element-active" }],
      height: 400,
  };

  return <Pie {...config} />;
};
