import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Users, TrendingUp, FileText, Calendar, AlertTriangle, List, FileSpreadsheet, Filter, Download } from "lucide-react";
import { useState } from "react";

const AccountAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'reports' | 'yearly'>('yearly');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const stats = [
    { title: 'Total Revenue', titleAr: 'إجمالي الإيرادات', value: '2,450,000 OMR', icon: () => <span className="font-bold text-green-600">OMR</span>, trend: '+12.5%' },
    { title: 'Active Students', titleAr: 'الطلاب النشطون', value: '1,245', icon: Users, trend: '+3.2%' },
    { title: 'Collection Rate', titleAr: 'معدل التحصيل', value: '89.5%', icon: TrendingUp, trend: '+5.1%' },
    { title: 'Outstanding Dues', titleAr: 'المستحقات المعلقة', value: '285,000 OMR', icon: AlertTriangle, trend: '-8.3%' }
  ];

  const yearlyData = [
    { year: '2023', students: 980, revenue: '1,850,000', paid: '1,650,000', outstanding: '200,000' },
    { year: '2022', students: 875, revenue: '1,620,000', paid: '1,450,000', outstanding: '170,000' },
    { year: '2021', students: 790, revenue: '1,450,000', paid: '1,300,000', outstanding: '150,000' },
  ];

  const studentList = [
    { id: 'S1001', name: 'Ahmed Al-Mansoori', grade: '10', status: 'Active', balance: '1,200 OMR' },
    { id: 'S1002', name: 'Fatima Al-Hashmi', grade: '9', status: 'Active', balance: '800 OMR' },
    { id: 'S1003', name: 'Yousef Al-Balushi', grade: '11', status: 'Active', balance: '1,500 OMR' },
    { id: 'S1004', name: 'Mariam Al-Siyabi', grade: '12', status: 'Graduated', balance: '0 OMR' },
    { id: 'S1005', name: 'Khalid Al-Rashidi', grade: '10', status: 'Active', balance: '2,000 OMR' },
  ];

  const paymentStatusData = [
    { name: 'Fully Paid', value: 65, color: '#10B981' },
    { name: 'Partially Paid', value: 20, color: '#F59E0B' },
    { name: 'Pending', value: 15, color: '#EF4444' },
  ];

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const generateBillsForSelected = () => {
    alert(`Generating bills for ${selectedStudents.length} selected students for year ${selectedYear}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Accountant </h1>
          <p className="text-gray-600" dir="rtl">محاسب</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-300">
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
          <Card key={index} className="hover:shadow-lg transition-shadow border-gray-200">
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

      {/* Main Action Tabs - Only 3 tabs now */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'payments' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('payments')}
        >
          <span className="inline mr-2">OMR</span>
          Payment Analytics | تحليل المدفوعات
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'yearly' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('yearly')}
        >
          <FileSpreadsheet className="inline mr-2 h-4 w-4" />
          Yearly Management | الإدارة السنوية
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'reports' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText className="inline mr-2 h-4 w-4" />
          Reports | التقارير
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'payments' && (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Payment Analytics | تحليل المدفوعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Status Distribution | توزيع حالة المدفوعات</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">Fully Paid | مدفوع بالكامل</h4>
                    <p className="text-2xl font-bold text-green-600">65%</p>
                    <p className="text-sm text-gray-500">1,245 students | 1,850,000 OMR</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">Partially Paid | مدفوع جزئياً</h4>
                    <p className="text-2xl font-bold text-yellow-600">20%</p>
                    <p className="text-sm text-gray-500">380 students | 285,000 OMR</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">Pending | معلقة</h4>
                    <p className="text-2xl font-bold text-red-600">15%</p>
                    <p className="text-sm text-gray-500">285 students | 200,000 OMR</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'yearly' && (
          <div className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Yearly Financial Sheets | السجلات المالية السنوية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Academic Year | اختر السنة الدراسية
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="2023">2023-2024</option>
                    <option value="2022">2022-2023</option>
                    <option value="2021">2021-2022</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year | السنة
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Students | الطلاب
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Revenue | إجمالي الإيرادات
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paid | المدفوع
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Outstanding | المتبقي
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions | إجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {yearlyData.map((year, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {year.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {year.students}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {year.revenue} OMR
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {year.paid} OMR
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                            {year.outstanding} OMR
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button variant="outline" size="sm" className="mr-2">
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                            <Button variant="outline" size="sm">
                              <List className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Student Billing for {selectedYear} | الفواتير الدراسية لسنة {selectedYear}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700"
                      disabled={selectedStudents.length === 0}
                      onClick={generateBillsForSelected}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Generate Bills ({selectedStudents.length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID | الرقم الجامعي
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name | الاسم
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade | الصف
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status | الحالة
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance | الرصيد
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentList.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => toggleStudentSelection(student.id)}
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.grade}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              student.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={student.balance === '0 OMR' ? 'text-green-600' : 'text-red-600'}>
                              {student.balance}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'reports' && (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Financial Reports | التقارير المالية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Standard Reports | التقارير القياسية</h3>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Monthly Financial Report | التقرير المالي الشهري
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Student Payment Status | حالة مدفوعات الطلاب
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Outstanding Dues Report | تقرير المستحقات المعلقة
                  </Button>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Custom Reports | تقارير مخصصة</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range | نطاق التاريخ</label>
                      <div className="flex space-x-2">
                        <input type="date" className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        <span className="self-center">to | إلى</span>
                        <input type="date" className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Report Type | نوع التقرير</label>
                      <select className="block w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option>Payment Collection | تحصيل المدفوعات</option>
                        <option>Expense Report | تقرير المصروفات</option>
                        <option>Student Balance | أرصدة الطلاب</option>
                      </select>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700 mt-4">
                      Generate Custom Report | إنشاء تقرير مخصص
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AccountAdminDashboard;