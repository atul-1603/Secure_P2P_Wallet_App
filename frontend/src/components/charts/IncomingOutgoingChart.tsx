import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'

type IncomingOutgoingChartProps = {
  incoming: number
  outgoing: number
}

const colors = ['#10b981', '#f43f5e']

export function IncomingOutgoingChart({ incoming, outgoing }: IncomingOutgoingChartProps) {
  const data = [
    { name: 'Incoming', value: incoming },
    { name: 'Outgoing', value: outgoing },
  ]

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={6}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => Number(value).toLocaleString()} />
      </PieChart>
    </ResponsiveContainer>
  )
}
