import { Line } from "@ant-design/plots";
import { Select } from "antd";

const SalesChart = () => {
  const data = [
    { x: "5k", y: 20 },
    { x: "10k", y: 45 },
    { x: "15k", y: 35 },
    { x: "20k", y: 85 },
    { x: "25k", y: 45 },
    { x: "30k", y: 55 },
    { x: "35k", y: 25 },
    { x: "40k", y: 45 },
    { x: "45k", y: 70 },
    { x: "50k", y: 55 },
    { x: "55k", y: 45 },
    { x: "60k", y: 50 },
  ];

  const config = {
    data,
    xField: "x",
    yField: "y",
    smooth: true,
    line: {
      color: "#4A0404",
      size: 2,
    },
    point: {
      size: 4,
      color: "#4A0404",
      style: {
        fill: "#4A0404",
      },
    },
    label: {
      formatter: (datum) => {
        return datum.y === 85 ? "64,3664.77" : "";
      },
      style: {
        fill: "#4A0404",
        fontSize: 12,
      },
    },
    xAxis: {
      label: {
        style: {
          fill: "#666",
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}%`,
        style: {
          fill: "#666",
          fontSize: 12,
        },
      },
      min: 0,
      max: 100,
    },
    tooltip: {
      showMarkers: false,
    },
    area: {
      style: {
        fill: "l(270) 0:#fff 1:#f7e8e8",
      },
    },
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm mt-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-800">Sales Details</h2>
        <Select
          defaultValue="October"
          className="w-32"
          options={[
            { value: "October", label: "October" },
            { value: "November", label: "November" },
            { value: "December", label: "December" },
          ]}
        />
      </div>
      <div className="h-[400px] w-full pt-4">
        <Line {...config} />
      </div>
    </div>
  );
};

export default SalesChart;
