"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface ChartData {
  age: { [key: string]: number }
  location: { [key: string]: number }
  willVote: { [key: string]: number }
  winningParty: { [key: string]: number }
  confidence: { [key: string]: number }
}

interface ChartComponentProps {
  data: ChartData
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function ChartComponent({ data }: ChartComponentProps) {
  // 转换数据格式
  const ageData = Object.entries(data.age).map(([key, value]) => ({
    name: key === '18-30' ? '18-30 နှစ်' : 
          key === '31-45' ? '31-45 နှစ်' :
          key === '46-60' ? '46-60 နှစ်' : '60+ နှစ်',
    value
  }))

  const locationData = Object.entries(data.location).map(([key, value]) => ({
    name: key === 'urban' ? 'မြို့ပြ' : 'ကျေးလက်',
    value
  }))

  const willVoteData = Object.entries(data.willVote).map(([key, value]) => ({
    name: key === 'yes' ? 'ပေးမည်' : 'မပေးပါ',
    value
  }))

  const winningPartyData = Object.entries(data.winningParty).map(([key, value]) => ({
    name: key === 'military-backed' ? 'တပ်မတော်ထောက်ခံ' :
          key === 'ethnic' ? 'တိုင်းရင်းသား' :
          key === 'reform' ? 'ပြုပြင်ပြောင်းလဲရေး' : 'ခန့်မှန်းရခက်',
    value
  }))

  const confidenceData = Object.entries(data.confidence).map(([key, value]) => ({
    name: key === 'high' ? 'မြင့်မား' :
          key === 'medium' ? 'အလယ်အလတ်' : 'နိမ့်ကျ',
    value
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 年龄分布 */}
      <Card>
        <CardHeader>
          <CardTitle>အသက်အပိုင်းအခြားအလိုက် ဖြေဆိုသူများ</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 地区分布 */}
      <Card>
        <CardHeader>
          <CardTitle>နေထိုင်ရာဒေသအလိုက် ဖြေဆိုသူများ</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 投票意愿 */}
      <Card>
        <CardHeader>
          <CardTitle>မဲပေးရန်အစီစဉ်ရှိမှု</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={willVoteData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 预期获胜政党 */}
      <Card>
        <CardHeader>
          <CardTitle>အနိုင်ရမည့်ပါတီ ခန့်မှန်းချက်</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={winningPartyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {winningPartyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 信心程度 */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>ရွေးကောက်ပွဲအပေါ် ယုံကြည်မှုအဆင့်</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
} 