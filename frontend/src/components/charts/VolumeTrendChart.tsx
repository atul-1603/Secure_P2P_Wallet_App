import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type VolumeTrendPoint = {
  period: string
  incoming: number
  outgoing: number
}

type VolumeTrendChartProps = {
  data: VolumeTrendPoint[]
}

export function VolumeTrendChart({ data }: VolumeTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip formatter={(value) => Number(value).toLocaleString()} />
        <Legend />
        <Bar dataKey="incoming" fill="#10b981" radius={[8, 8, 0, 0]} />
        <Bar dataKey="outgoing" fill="#f43f5e" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
