import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type TransactionStatusPoint = {
  name: string
  value: number
}

type TransactionStatusChartProps = {
  data: TransactionStatusPoint[]
}

const COLORS = ['#2563eb', '#f59e0b', '#ef4444', '#6b7280']

export function TransactionStatusChart({ data }: TransactionStatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}>
          {data.map((item, index) => (
            <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => Number(value).toLocaleString()} />
      </PieChart>
    </ResponsiveContainer>
  )
}
