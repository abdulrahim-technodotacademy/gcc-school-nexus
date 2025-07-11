
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, DollarSign, Users, Download, Eye, PenTool,  } from "lucide-react";
import { useState } from "react";


const FinancialAgreementDashboard = () => {
  const [activeTab, setActiveTab] = useState<'fees' | 'agreements' | 'esign'>('fees');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const stats = [
    { title: 'Fee Structures Created', titleAr: 'هياكل الرسوم المنشأة', value: '24', icon: () => <span className="font-bold text-green-600">OMR</span> },
    { title: 'Agreements Generated', titleAr: 'الاتفاقيات المولدة', value: '156', icon: FileText },
    { title: 'E-Signatures Pending', titleAr: 'التوقيعات الإلكترونية المعلقة', value: '12', icon: PenTool },
    { title: 'Completed Agreements', titleAr: 'الاتفاقيات المكتملة', value: '89', icon: Users }
  ];

  const classes = [
    'KG1', 'KG2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 
    'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 
    'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const courses = ['Regular Program', 'Advanced Program', 'International Program'];

  const [feeStructure, setFeeStructure] = useState({
    tuitionFee: '',
    registrationFee: '',
    booksFee: '',
    uniformFee: '',
    transportFee: '',
    examFee: '',
    extraActivities: '',
    total: ''
  });

  const calculateTotal = () => {
    const total = Object.entries(feeStructure)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [_, value]) => sum + (parseFloat(value) || 0), 0);
    
    setFeeStructure(prev => ({ ...prev, total: total.toString() }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Agreement Officer</h1>
          <p className="text-gray-600" dir="rtl">موظف العقود المالية</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <FileText className="mr-2 h-4 w-4" />
          New Agreement | اتفاقية جديدة
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
                  <p className="text-3xl font-bold text-green-600 mt-2">{stat.value}</p>
                </div>
                <stat.icon className="h-12 w-12 text-green-600 opacity-80" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Action Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'fees' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('fees')}
        >
          <span className="inline mr-2">OMR</span>
          Fee Structure | هيكل الرسوم
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'agreements' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('agreements')}
        >
          <FileText className="inline mr-2 h-4 w-4" />
          Agreements | الاتفاقيات
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'esign' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('esign')}
        >
          <PenTool className="inline mr-2 h-4 w-4" />
          E-Signature | التوقيع الإلكتروني
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'fees' && (
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure Setup | إعداد هيكل الرسوم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {/* <div>
                  <Label>Course | المسار</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tuition Fee | رسوم التعليم</Label>
                  <Input
                    type="number"
                    value={feeStructure.tuitionFee}
                    onChange={(e) => setFeeStructure(prev => ({...prev, tuitionFee: e.target.value}))}
                    onBlur={calculateTotal}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label>Registration Fee | رسوم التسجيل</Label>
                  <Input
                    type="number"
                    value={feeStructure.registrationFee}
                    onChange={(e) => setFeeStructure(prev => ({...prev, registrationFee: e.target.value}))}
                    onBlur={calculateTotal}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label>Books Fee | رسوم الكتب</Label>
                  <Input
                    type="number"
                    value={feeStructure.booksFee}
                    onChange={(e) => setFeeStructure(prev => ({...prev, booksFee: e.target.value}))}
                    onBlur={calculateTotal}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label>Uniform Fee | رسوم الزي المدرسي</Label>
                  <Input
                    type="number"
                    value={feeStructure.uniformFee}
                    onChange={(e) => setFeeStructure(prev => ({...prev, uniformFee: e.target.value}))}
                    onBlur={calculateTotal}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label>Transport Fee | رسوم النقل</Label>
                  <Input
                    type="number"
                    value={feeStructure.transportFee}
                    onChange={(e) => setFeeStructure(prev => ({...prev, transportFee: e.target.value}))}
                    onBlur={calculateTotal}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label>Exam Fee | رسوم الامتحانات</Label>
                  <Input
                    type="number"
                    value={feeStructure.examFee}
                    onChange={(e) => setFeeStructure(prev => ({...prev, examFee: e.target.value}))}
                    onBlur={calculateTotal}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Amount | المبلغ الإجمالي:</span>
                  <span className="text-green-600">{feeStructure.total} OMR</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Fee Structure | حفظ هيكل الرسوم
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Generate PDF | إنشاء PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'agreements' && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Agreements | الاتفاقيات المالية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Agreement Management</h3>
                <p className="text-gray-500 mb-6">Create and manage financial agreements for students</p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Create Agreement | إنشاء اتفاقية
                  </Button>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Agreements | عرض الاتفاقيات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'esign' && (
          <Card>
            <CardHeader>
              <CardTitle>E-Signature Management | إدارة التوقيع الإلكتروني</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <PenTool className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Digital Signatures</h3>
                <p className="text-gray-500 mb-6">Manage e-signatures for financial agreements</p>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800">Pending E-Signatures</h4>
                    <p className="text-yellow-700">12 agreements waiting for parent signatures</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <PenTool className="mr-2 h-4 w-4" />
                    Send for E-Signature | إرسال للتوقيع الإلكتروني
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

export default FinancialAgreementDashboard;
