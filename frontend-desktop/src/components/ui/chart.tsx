"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import React from "react"

interface BarChartProps {
  data: any[]
  options?: any
}

interface LineChartProps {
  data: any[]
  options?: any
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ChartContainer({
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div className={`w-full h-[350px] ${className}`} {...props}>
      {children}
    </div>
  )
}

export function BarChart({ data, options = {} }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data &&
          data.length > 0 &&
          Object.keys(data[0])
            .filter((key) => key !== "name")
            .map((key, index) => <Bar key={key} dataKey={key} fill={index === 0 ? "#8884d8" : "#82ca9d"} />)}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function LineChart({ data, options = {} }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data &&
          data.length > 0 &&
          Object.keys(data[0])
            .filter((key) => key !== "name")
            .map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={index === 0 ? "#8884d8" : "#82ca9d"} />
            ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
