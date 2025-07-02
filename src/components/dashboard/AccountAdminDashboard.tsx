
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Users, TrendingUp, FileText, Calendar, AlertTriangle } from "lucide-react";
import { useState } from "react";

const AccountAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'reports' | 'activities'>('overview');

  const stats = [
    { title: 'Total Revenue', titleAr: 'إجمالي الإيرادات', value: '2,450,000 KWD', icon: DollarSign, trend: '+12.5%' },
    { title: 'Active Students', titleAr: 'الطلاب النشطون', value: '1,245', icon: Users, trend: '+3.2%' },
    { title: 'Collection Rate', titleAr: 'معدل التحصيل', value: '89.5%', icon: TrendingUp, trend: '+5.1%' },
    { title: 'Outstanding Dues', titleAr: 'المستحقات المعلقة', value: '285,000 KWD', icon: AlertTriangle, trend: '-8.3%' }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 180000, expenses: 45000 },
    { month: 'Feb', revenue: 195000, expenses: 48000 },
    { month: 'Mar', revenue: 210000, expenses: 52000 },
    { month: 'Apr', revenue: 205000, expenses: 50000 },
    { month: 'May', revenue: 225000, expenses: 55000 },
    { month: 'Jun', revenue: 240000, expenses: 58000 },
  ];

  const paymentStatusData = [
    { name: 'Fully Paid', value: 65, color: '#10B981' },
    { name: 'Partially Paid', value: 20, color: '#F59E0B' },
    { name: 'Pending', value: 15, color: '#EF4444' },
  ];

  const recentActivities = [
    { id: 1, activity: 'Payment received from Ahmad Al-Rashid', time: '2 hours ago', type: 'payment' },
    { id: 2, activity: 'New student registration: Fatima Al-Zahra', time: '4 hours ago', type: 'registration' },
    { id: 3, activity: 'Financial agreement signed by Omar Al-Mansouri', time: '6 hours ago', type: 'agreement' },
    { id: 4, activity: 'Monthly report generated', time: '1 day ago', type: 'report' },
    { id: 5, activity: 'Overdue payment alert sent to 15 parents', time: '1 day ago', type: 'alert' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'registration': return <Users className="h-4 w-4 text-blue-600" />;
      case 'agreement': return <FileText className="h-4 w-4 text-purple-600" />;
      case 'report': return <TrendingUp className="h-4 w-4 text-indigo-600" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Admin Dashboard</h1>
          <p className="text-gray-600" dir="rtl">لوحة تحكم مدير الحسابات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Generate Report | إنشاء تقرير
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <TrendingUp className="mr-2 h-4 w-4" />
            Financial Summary | الملخص المالي
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-500 mt-1" dir="rtl">{stat.titleAr}</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend} from last month
                  </p>
                </div>
                <stat.icon className="h-12 w-12 text-red-600 opacity-80" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Action Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'overview' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp className="inline mr-2 h-4 w-4" />
          Overview | نظرة عامة
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'payments' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('payments')}
        >
          <DollarSign className="inline mr-2 h-4 w-4" />
          Payment Analytics | تحليل المدفوعات
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'reports' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText className="inline mr-2 h-4 w-4" />
          Reports | التقارير
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'activities' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('activities')}
        >
          <Users className="inline mr-2 h-4 w-4" />
          Activities | الأنشطة
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue & Expenses | الإيرادات والمصروفات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#DC2626" name="Revenue" />
                    <Bar dataKey="expenses" fill="#FCA5A5" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status Distribution | توزيع حالة المدفوعات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'payments' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Analytics | تحليل المدفوعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Detailed Payment Analytics</h3>
                <p className="text-gray-500 mb-6">Comprehensive analysis of all payment activities</p>
                <Button className="bg-red-600 hover:bg-red-700">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Detailed Analytics | عرض التحليل المفصل
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports | التقارير المالية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Comprehensive Reporting</h3>
                <p className="text-gray-500 mb-6">Generate detailed financial and operational reports</p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Monthly Report | التقرير الشهري
                  </Button>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Custom Report | تقرير مخصص
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'activities' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities | الأنشطة الحديثة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.activity}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AccountAdminDashboard;
