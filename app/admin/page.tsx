"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, LogOut, BarChart3, Users, FileText } from "lucide-react"
import { toast } from "sonner"

interface SurveyResponse {
  id: string
  age: string
  location: string
  cityName?: string
  occupation: string
  occupationOther?: string
  willVote: string
  votingFactors: string
  winningParty: string
  competitionLevel: string
  competitionOther?: string
  interests: string
  expectations: string
  expectationsOther?: string
  concerns: string
  concernsOther?: string
  confidence: string
  additionalComments?: string
  ipAddress?: string
  createdAt: string
}

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  })

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })

  // 检查登录状态
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        setIsLoggedIn(true)
        fetchData()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setIsLoggedIn(true)
        toast.success('အကောင့်ဝင်ရောက်မှု အောင်မြင်ပါသည်')
        fetchData()
      } else {
        toast.error(data.error || 'အကောင့်ဝင်ရောက်မှု မအောင်မြင်ပါ')
      }
    } catch (error) {
      toast.error('အကောင့်ဝင်ရောက်မှုတွင် အမှားရှိနေပါသည်')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsLoggedIn(false)
      setUser(null)
      setResponses([])
      toast.success('အကောင့်ထွက်မှု အောင်မြင်ပါသည်')
    } catch (error) {
      toast.error('အကောင့်ထွက်မှုတွင် အမှားရှိနေပါသည်')
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch('/api/survey')
      if (response.ok) {
        const data = await response.json()
        setResponses(data.responses || [])
        calculateStats(data.responses || [])
      }
    } catch (error) {
      toast.error('ဒေတာရယူရာတွင် အမှားရှိနေပါသည်')
    }
  }

  const calculateStats = (data: SurveyResponse[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getFullYear(), now.getMonth() - 1, now.getDate())

    const stats = {
      total: data.length,
      today: data.filter(r => new Date(r.createdAt) >= today).length,
      thisWeek: data.filter(r => new Date(r.createdAt) >= weekAgo).length,
      thisMonth: data.filter(r => new Date(r.createdAt) >= monthAgo).length
    }

    setStats(stats)
  }

  const exportData = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/survey/export?format=${format}`)
      
      if (format === 'csv') {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `myanmar-survey-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `myanmar-survey-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }

      toast.success('ဒေတာထုတ်ယူမှု အောင်မြင်ပါသည်')
    } catch (error) {
      toast.error('ဒေတာထုတ်ယူရာတွင် အမှားရှိနေပါသည်')
    }
  }

  const parseJsonField = (field: string) => {
    try {
      return JSON.parse(field)
    } catch {
      return field
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-amber-800">မြန်မာစစ်တမ်း CMS</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">အီးမေးလ်</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">စကားဝှက်</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'ဝင်ရောက်နေသည်...' : 'ဝင်ရောက်ရန်'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-800">မြန်မာစစ်တမ်း CMS</h1>
            <p className="text-gray-600">ကြိုဆိုပါသည်, {user?.name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            ထွက်ရန်
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">စုစုပေါင်း</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">ယနေ့</p>
                  <p className="text-2xl font-bold">{stats.today}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">ဒီအပတ်</p>
                  <p className="text-2xl font-bold">{stats.thisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">ဒီလ</p>
                  <p className="text-2xl font-bold">{stats.thisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-4 mb-8">
          <Button onClick={() => exportData('csv')} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            CSV ထုတ်ယူရန်
          </Button>
          <Button onClick={() => exportData('json')} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            JSON ထုတ်ယူရန်
          </Button>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>စစ်တမ်းအဖြေများ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>အသက်</TableHead>
                    <TableHead>နေရာ</TableHead>
                    <TableHead>အလုပ်အကိုင်</TableHead>
                    <TableHead>မဲပေးမည်</TableHead>
                    <TableHead>အနိုင်ရမည့်ပါတီ</TableHead>
                    <TableHead>ယုံကြည်မှု</TableHead>
                    <TableHead>ရက်စွဲ</TableHead>
                    <TableHead>လုပ်ဆောင်ချက်</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="font-mono text-xs">{response.id.slice(0, 8)}...</TableCell>
                      <TableCell>{response.age}</TableCell>
                      <TableCell>
                        <Badge variant={response.location === 'urban' ? 'default' : 'secondary'}>
                          {response.location === 'urban' ? 'မြို့ပြ' : 'ကျေးလက်'}
                        </Badge>
                      </TableCell>
                      <TableCell>{response.occupation}</TableCell>
                      <TableCell>
                        <Badge variant={response.willVote === 'yes' ? 'default' : 'destructive'}>
                          {response.willVote === 'yes' ? 'ပေးမည်' : 'မပေးပါ'}
                        </Badge>
                      </TableCell>
                      <TableCell>{response.winningParty}</TableCell>
                      <TableCell>{response.confidence}</TableCell>
                      <TableCell>{new Date(response.createdAt).toLocaleDateString('my-MM')}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 