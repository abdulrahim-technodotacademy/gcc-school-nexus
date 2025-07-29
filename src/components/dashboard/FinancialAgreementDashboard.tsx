import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, DollarSign, PenTool, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
  nameAr: string;
  grade: string;
  type: string;
  typeAr: string;
  registrationDate: string;
  status: string;
  statusAr: string;
  isNewRegistration?: boolean;
  rawData?: any;
}

interface FeeStructure {
  tuitionFee: string;
  registrationFee: string;
  booksFee: string;
  uniformFee: string;
  transportFee: string;
  examFee: string;
  extraActivities: string;
  total: string;
  paymentPlan?: string;
  discount?: number;
}

const FinancialAgreementDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'agreements' | 'esign'>('pending');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [completedStudents, setCompletedStudents] = useState<Student[]>([]);
  const [feeStructure, setFeeStructure] = useState<FeeStructure>({
    tuitionFee: '',
    registrationFee: '',
    booksFee: '',
    uniformFee: '',
    transportFee: '',
    examFee: '',
    extraActivities: '',
    total: ''
  });
  const [agreementDetails, setAgreementDetails] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load students from localStorage and mock data
  useEffect(() => {
    const loadStudents = () => {
      // 1. Load new registrations from localStorage (priority)
      const storedRegistrations = localStorage.getItem('studentRegistrations');
      const localStorageStudents: Student[] = storedRegistrations 
        ? JSON.parse(storedRegistrations).map((reg: any, index: number) => ({
            id: `new-reg-${index}`,
            name: reg.student.name_en,
            nameAr: reg.student.name_ar,
            grade: 'Grade 1', // Default or calculate from age
            type: 'New Admission',
            typeAr: 'قيد جديد',
            registrationDate: new Date().toISOString().split('T')[0],
            status: 'Pending Agreement',
            statusAr: 'بانتظار العقد',
            isNewRegistration: true,
            rawData: reg
          }))
        : [];

      // 2. Static mock data (secondary)
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Ahmed Al-Maamari',
          nameAr: 'أحمد المعمري',
          grade: 'Grade 5',
          type: 'New Admission',
          typeAr: 'قيد جديد',
          registrationDate: '2023-05-15',
          status: 'Pending Agreement',
          statusAr: 'بانتظار العقد'
        },
        {
          id: '2',
          name: 'Mariam Al-Hinai',
          nameAr: 'مريم الهنائي',
          grade: 'Grade 8',
          type: 'Re-registration',
          typeAr: 'إعادة تسجيل',
          registrationDate: '2023-05-10',
          status: 'Pending Agreement',
          statusAr: 'بانتظار العقد'
        }
      ];

      setPendingStudents([...localStorageStudents, ...mockStudents]);
    };

    loadStudents();
  }, []);

  const calculateTotal = () => {
    setFeeStructure(prev => {
      const subtotal = Object.keys(prev)
        .filter(key => !['total', 'paymentPlan', 'discount'].includes(key))
        .reduce((sum, key) => sum + (parseFloat(prev[key as keyof FeeStructure]) || 0), 0);
      
      const discount = prev.paymentPlan === '1' ? 5 : 0;
      const total = subtotal * (1 - discount/100);
      
      return {
        ...prev,
        total: total.toFixed(2),
        discount
      };
    });
  };

  const handleCreateAgreement = (student: Student) => {
    setSelectedStudent(student);
    
    // Pre-populate fees for new registrations
    if (student.isNewRegistration) {
      setFeeStructure({
        tuitionFee: '1000',
        registrationFee: '200',
        booksFee: '150',
        uniformFee: '100',
        transportFee: '300',
        examFee: '50',
        extraActivities: '75',
        total: '1875',
        paymentPlan: '1'
      });
    } else {
      setFeeStructure({
        tuitionFee: '',
        registrationFee: '',
        booksFee: '',
        uniformFee: '',
        transportFee: '',
        examFee: '',
        extraActivities: '',
        total: ''
      });
    }
    
    setActiveTab('agreements');
  };

  const handleSaveAgreement = () => {
    if (!selectedStudent || !agreementDetails) {
      alert('Please fill in all required fields.');
      return;
    }

    const newCompletedStudent: Student = {
      ...selectedStudent,
      status: 'Agreement Created',
      statusAr: 'تم إنشاء العقد',
      rawData: {
        ...(selectedStudent.rawData || {}),
        agreementDetails,
        fees: feeStructure
      }
    };

    // Update state
    setCompletedStudents([...completedStudents, newCompletedStudent]);
    setPendingStudents(pendingStudents.filter(student => student.id !== selectedStudent.id));

    // Remove from localStorage if it was a new registration
    if (selectedStudent.isNewRegistration) {
      const storedRegistrations = localStorage.getItem('studentRegistrations');
      if (storedRegistrations) {
        const registrations = JSON.parse(storedRegistrations);
        const updatedRegistrations = registrations.filter(
          (reg: any, index: number) => `new-reg-${index}` !== selectedStudent.id
        );
        localStorage.setItem('studentRegistrations', JSON.stringify(updatedRegistrations));
      }
    }

    // Reset form
    setSelectedStudent(null);
    setFeeStructure({
      tuitionFee: '',
      registrationFee: '',
      booksFee: '',
      uniformFee: '',
      transportFee: '',
      examFee: '',
      extraActivities: '',
      total: ''
    });
    setAgreementDetails('');
    alert('Agreement created successfully!');
    setActiveTab('pending');
  };

  const handleSendForESignature = () => {
    if (!selectedStudent) return;
    alert(`Sent agreement for ${selectedStudent.name} to e-signature.`);
  };

  const filteredStudents = pendingStudents.filter(student => 
    statusFilter === 'all' || student.status.includes(statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1))
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Agreement Officer</h1>
          <p className="text-gray-600" dir="rtl">موظف العقود المالية</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setActiveTab('agreements')}>
          <FileText className="mr-2 h-4 w-4" />
          New Agreement | اتفاقية جديدة
        </Button>
      </div>

      <div className="flex space-x-4 border-b">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'pending' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock className="inline mr-2 h-4 w-4" />
          Pending Students | الطلاب المعلقة
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

      <div className="space-y-6">
        {activeTab === 'pending' && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Students | الطلاب المعلقة</CardTitle>
              <div className="mt-4">
                <Label>Filter by Status | تصفية حسب الحالة</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All | الكل</SelectItem>
                    <SelectItem value="pending">Pending | معلق</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{student.name}</div>
                          <div className="text-gray-500" dir="rtl">{student.nameAr}</div>
                          {student.isNewRegistration && (
                            <span className="mt-1 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              New Registration
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>{student.type}</div>
                          <div className="text-gray-500" dir="rtl">{student.typeAr}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.registrationDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>{student.status}</div>
                          <div className="text-gray-500" dir="rtl">{student.statusAr}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button 
                            onClick={() => handleCreateAgreement(student)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Create Agreement
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'agreements' && (
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedStudent ? 'Create Financial Agreement' : 'Agreement Management'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStudent ? (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold">Student Details</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label>Name (English)</Label>
                        <Input value={selectedStudent.name} readOnly />
                      </div>
                      <div>
                        <Label>Name (Arabic)</Label>
                        <Input value={selectedStudent.nameAr} readOnly dir="rtl" />
                      </div>
                      <div>
                        <Label>Grade</Label>
                        <Input value={selectedStudent.grade} readOnly />
                      </div>
                      <div>
                        <Label>Registration Type</Label>
                        <Input value={selectedStudent.type} readOnly />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Fee Structure</h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {Object.keys(feeStructure)
                        .filter(key => !['total', 'paymentPlan', 'discount'].includes(key))
                        .map((key) => (
                          <div key={key}>
                            <Label>{key.split(/(?=[A-Z])/).join(' ')}</Label>
                            <Input
                              type="number"
                              value={feeStructure[key as keyof FeeStructure]}
                              onChange={(e) => {
                                setFeeStructure(prev => ({ 
                                  ...prev, 
                                  [key]: e.target.value 
                                }));
                                calculateTotal();
                              }}
                            />
                          </div>
                        ))}

                      <div>
                        <Label>Payment Plan</Label>
                        <Select
                          value={feeStructure.paymentPlan || '1'}
                          onValueChange={(value) => {
                            setFeeStructure(prev => ({ 
                              ...prev, 
                              paymentPlan: value,
                              discount: value === '1' ? 5 : 0
                            }));
                            calculateTotal();
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Full Payment (5% Discount)</SelectItem>
                            <SelectItem value="2">2 Installments</SelectItem>
                            <SelectItem value="3">3 Installments</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Total Amount</Label>
                        <Input 
                          value={feeStructure.total} 
                          readOnly 
                          className="font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Agreement Terms</Label>
                    <Textarea
                      value={agreementDetails}
                      onChange={(e) => setAgreementDetails(e.target.value)}
                      placeholder="Enter the terms and conditions of this agreement..."
                      rows={6}
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedStudent(null);
                        setActiveTab('pending');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleSaveAgreement}
                    >
                      Save Agreement
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSendForESignature}
                    >
                      Send for E-Signature
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No student selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a student from the Pending Students tab to create an agreement
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setActiveTab('pending')}
                  >
                    View Pending Students
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'esign' && (
          <Card>
            <CardHeader>
              <CardTitle>E-Signature Management</CardTitle>
            </CardHeader>
            <CardContent>
              {completedStudents.length > 0 ? (
                <div className="space-y-4">
                  {completedStudents.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.grade} • {student.type}</p>
                          <p className="mt-2 text-sm">
                            <span className="font-medium">Total Fees:</span> {student.rawData?.fees?.total || 'N/A'}
                          </p>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <PenTool className="mr-2 h-4 w-4" />
                          Manage Signature
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PenTool className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No agreements pending signature</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Agreements will appear here after they are created and sent for signature
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FinancialAgreementDashboard;