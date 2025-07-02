
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, DollarSign, AlertCircle, CheckCircle, Search, Printer } from "lucide-react";
import { useState } from "react";

const AccountantDashboard = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'receipts' | 'reports'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const stats = [
    { title: 'Total Payments Today', titleAr: 'إجمالي المدفوعات اليوم', value: '45,250 KWD', icon: DollarSign },
    { title: 'Receipts Issued', titleAr: 'الإيصالات الصادرة', value: '28', icon: Receipt },
    { title: 'Pending Payments', titleAr: 'المدفوعات المعلقة', value: '156', icon: AlertCircle },
    { title: 'Fully Paid Students', titleAr: 'الطلاب المسددون بالكامل', value: '342', icon: CheckCircle }
  ];

  const classes = [
    'All Classes', 'KG1', 'KG2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 
    'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 
    'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const paymentStatuses = [
    { value: 'all', label: 'All Status | جميع الحالات' },
    { value: 'paid', label: 'Fully Paid | مدفوع بالكامل' },
    { value: 'partial', label: 'Partially Paid | مدفوع جزئياً' },
    { value: 'pending', label: 'Pending | معلق' },
    { value: 'overdue', label: 'Overdue | متأخر' }
  ];

  const mockPayments = [
    { id: 1, studentName: 'Ahmad Al-Rashid', studentNameAr: 'أحمد الراشد', class: 'Grade 5', section: 'A', totalFee: 2500, paid: 2500, status: 'paid', course: 'Regular Program' },
    { id: 2, studentName: 'Fatima Al-Zahra', studentNameAr: 'فاطمة الزهراء', class: 'Grade 3', section: 'B', totalFee: 2200, paid: 1100, status: 'partial', course: 'Regular Program' },
    { id: 3, studentName: 'Omar Al-Mansouri', studentNameAr: 'عمر المنصوري', class: 'Grade 7', section: 'A', totalFee: 2800, paid: 0, status: 'pending', course: 'Advanced Program' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-red-600 bg-red-100';
      case 'overdue': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Fully Paid | مدفوع بالكامل';
      case 'partial': return 'Partially Paid | مدفوع جزئياً';
      case 'pending': return 'Pending | معلق';
      case 'overdue': return 'Overdue | متأخر';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accountant Department</h1>
          <p className="text-gray-600" dir="rtl">قسم المحاسبة</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Receipt className="mr-2 h-4 w-4" />
          Issue Receipt | إصدار إيصال
        </Button>
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
                  <p className="text-3xl font-bold text-purple-600 mt-2">{stat.value}</p>
                </div>
                <stat.icon className="h-12 w-12 text-purple-600 opacity-80" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Action Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'payments' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('payments')}
        >
          <DollarSign className="inline mr-2 h-4 w-4" />
          Payment Tracking | تتبع المدفوعات
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'receipts' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('receipts')}
        >
          <Receipt className="inline mr-2 h-4 w-4" />
          Receipt Management | إدارة الإيصالات
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'payments' && (
          <Card>
            <CardHeader>
              <CardTitle>Student Payment Tracking | تتبع مدفوعات الطلاب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Search Student | البحث عن طالب</Label>
                  <Input
                    placeholder="Enter student name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Class | الصف</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Status | حالة الدفع</Label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search | بحث
                  </Button>
                </div>
              </div>

              {/* Payment Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left">Student Name | اسم الطالب</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Class | الصف</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Course | المسار</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Total Fee | الرسوم الإجمالية</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Paid | المدفوع</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Remaining | المتبقي</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Status | الحالة</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Actions | الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">
                          <div>
                            <p className="font-medium">{payment.studentName}</p>
                            <p className="text-sm text-gray-500" dir="rtl">{payment.studentNameAr}</p>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">{payment.class} - {payment.section}</td>
                        <td className="border border-gray-300 px-4 py-3">{payment.course}</td>
                        <td className="border border-gray-300 px-4 py-3">{payment.totalFee} KWD</td>
                        <td className="border border-gray-300 px-4 py-3">{payment.paid} KWD</td>
                        <td className="border border-gray-300 px-4 py-3">{payment.totalFee - payment.paid} KWD</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              <Receipt className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Printer className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'receipts' && (
          <Card>
            <CardHeader>
              <CardTitle>Receipt Management | إدارة الإيصالات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Receipt Management System</h3>
                <p className="text-gray-500 mb-6">Issue and manage payment receipts for students</p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Receipt className="mr-2 h-4 w-4" />
                    Issue New Receipt | إصدار إيصال جديد
                  </Button>
                  <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    Search Receipts | البحث في الإيصالات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AccountantDashboard;
