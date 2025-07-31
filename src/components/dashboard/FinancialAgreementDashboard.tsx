import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, DollarSign, PenTool, Clock, CheckCircle, XCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import SignaturePad from "react-signature-canvas";

interface Student {
  id: string;
  name: string;
  nameAr: string;
  grade: string;
  type: string;
  typeAr: string;
  registrationDate: string;
  status: 'pending' | 'agreement-created' | 'sent-for-signature' | 'signed' | 'rejected';
  statusAr: string;
  isNewRegistration?: boolean;
  rawData?: any;
  guardianEmail?: string;
}

interface FeeStructure {
  tuitionFee: number;
  registrationFee: number;
  booksFee: number;
  uniformFee: number;
  transportFee: number;
  examFee: number;
  extraActivities: number;
  total: number;
  paymentPlan?: string;
  discount?: number;
}

interface Agreement {
  id: string;
  studentId: string;
  terms: string;
  fees: FeeStructure;
  createdDate: string;
  sentDate?: string;
  signedDate?: string;
  signatureData?: string;
  rejectionReason?: string;
}

const FinancialAgreementDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'agreements' | 'esign'>('pending');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [feeStructure, setFeeStructure] = useState<FeeStructure>({
    tuitionFee: 0,
    registrationFee: 0,
    booksFee: 0,
    uniformFee: 0,
    transportFee: 0,
    examFee: 0,
    extraActivities: 0,
    total: 0
  });
  const [agreementDetails, setAgreementDetails] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [currentSigningAgreement, setCurrentSigningAgreement] = useState<Agreement | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      // Load pending students
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Ahmed Al-Maamari',
          nameAr: 'أحمد المعمري',
          grade: 'Grade 5',
          type: 'New Admission',
          typeAr: 'قيد جديد',
          registrationDate: '2023-05-15',
          status: 'pending',
          statusAr: 'بانتظار العقد',
          guardianEmail: 'parent1@example.com'
        },
        {
          id: '2',
          name: 'Mariam Al-Hinai',
          nameAr: 'مريم الهنائي',
          grade: 'Grade 8',
          type: 'Re-registration',
          typeAr: 'إعادة تسجيل',
          registrationDate: '2023-05-10',
          status: 'pending',
          statusAr: 'بانتظار العقد',
          guardianEmail: 'parent2@example.com'
        }
      ];
      setPendingStudents(mockStudents);

      // Load agreements (mock)
      const mockAgreements: Agreement[] = [
        {
          id: 'agr-1',
          studentId: '1',
          terms: 'Standard school terms and conditions apply...',
          fees: {
            tuitionFee: 1000,
            registrationFee: 200,
            booksFee: 150,
            uniformFee: 100,
            transportFee: 300,
            examFee: 50,
            extraActivities: 75,
            total: 1875,
            paymentPlan: '1',
            discount: 5
          },
          createdDate: '2023-06-01',
          sentDate: '2023-06-02',
          status: 'sent-for-signature'
        }
      ];
      setAgreements(mockAgreements);
    };

    loadData();
  }, []);

  const calculateTotal = () => {
    const subtotal = Object.entries(feeStructure)
      .filter(([key]) => !['total', 'paymentPlan', 'discount'].includes(key))
      .reduce((sum, [_, value]) => sum + (typeof value === 'number' ? value : 0), 0);
    
    const discount = feeStructure.paymentPlan === '1' ? 5 : 0;
    const total = subtotal * (1 - discount/100);
    
    setFeeStructure(prev => ({
      ...prev,
      total,
      discount
    }));
  };

  const handleCreateAgreement = (student: Student) => {
    setSelectedStudent(student);
    
    // Pre-populate fees
    setFeeStructure({
      tuitionFee: 1000,
      registrationFee: 200,
      booksFee: 150,
      uniformFee: 100,
      transportFee: 300,
      examFee: 50,
      extraActivities: 75,
      total: 1875,
      paymentPlan: '1'
    });
    
    setActiveTab('agreements');
  };

  const handleSaveAgreement = () => {
    if (!selectedStudent || !agreementDetails) {
      alert('Please fill in all required fields.');
      return;
    }

    const newAgreement: Agreement = {
      id: `agr-${Date.now()}`,
      studentId: selectedStudent.id,
      terms: agreementDetails,
      fees: feeStructure,
      createdDate: new Date().toISOString().split('T')[0]
    };

    // Update state
    setAgreements([...agreements, newAgreement]);
    setPendingStudents(pendingStudents.filter(s => s.id !== selectedStudent.id));
    
    // Reset form
    resetAgreementForm();
    alert('Agreement created successfully!');
    setActiveTab('pending');
  };

  const handleSendForESignature = (agreement: Agreement) => {
    // In a real app, this would send an email to the guardian
    const updatedAgreement = {
      ...agreement,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'sent-for-signature'
    };
    
    setAgreements(agreements.map(a => 
      a.id === agreement.id ? updatedAgreement : a
    ));
    alert(`Sent agreement to ${getStudent(agreement.studentId)?.guardianEmail}`);
  };

  const startSigningProcess = (agreement: Agreement) => {
    setCurrentSigningAgreement(agreement);
    setIsSigning(true);
  };

  const completeSigning = () => {
    if (!signaturePad || !currentSigningAgreement) return;
    
    const signatureData = signaturePad.toDataURL();
    const updatedAgreement = {
      ...currentSigningAgreement,
      signedDate: new Date().toISOString().split('T')[0],
      signatureData,
      status: 'signed'
    };
    
    setAgreements(agreements.map(a => 
      a.id === currentSigningAgreement.id ? updatedAgreement : a
    ));
    
    setIsSigning(false);
    setCurrentSigningAgreement(null);
    signaturePad.clear();
  };

  const rejectAgreement = (agreement: Agreement) => {
    if (!rejectionReason) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    const updatedAgreement = {
      ...agreement,
      rejectionReason,
      status: 'rejected'
    };
    
    setAgreements(agreements.map(a => 
      a.id === agreement.id ? updatedAgreement : a
    ));
    setRejectionReason('');
  };

  const resetAgreementForm = () => {
    setSelectedStudent(null);
    setFeeStructure({
      tuitionFee: 0,
      registrationFee: 0,
      booksFee: 0,
      uniformFee: 0,
      transportFee: 0,
      examFee: 0,
      extraActivities: 0,
      total: 0
    });
    setAgreementDetails('');
  };

  const getStudent = (studentId: string) => {
    return [...pendingStudents].find(s => s.id === studentId);
  };

  const filteredStudents = pendingStudents.filter(student => 
    statusFilter === 'all' || student.status === statusFilter
  );

  const filteredAgreements = agreements.filter(agreement => {
    if (activeTab === 'esign') return true;
    return agreement.status === 'agreement-created';
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Agreement Officer</h1>
          <p className="text-gray-600" dir="rtl">موظف العقود المالية</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700" 
          onClick={() => setActiveTab('agreements')}
        >
          <FileText className="mr-2 h-4 w-4" />
          New Agreement | اتفاقية جديدة
        </Button>
      </div>

      {/* Tabs */}
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

      {/* Content */}
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
                  {/* Student Details */}
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
                        <Label>Guardian Email</Label>
                        <Input value={selectedStudent.guardianEmail || 'N/A'} readOnly />
                      </div>
                    </div>
                  </div>

                  {/* Fee Structure */}
                  <div>
                    <h3 className="text-lg font-semibold">Fee Structure</h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {Object.entries(feeStructure)
                        .filter(([key]) => !['total', 'paymentPlan', 'discount'].includes(key))
                        .map(([key, value]) => (
                          <div key={key}>
                            <Label>{key.split(/(?=[A-Z])/).join(' ')}</Label>
                            <Input
                              type="number"
                              value={value}
                              onChange={(e) => {
                                setFeeStructure(prev => ({ 
                                  ...prev, 
                                  [key]: parseFloat(e.target.value) || 0
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
                          value={`${feeStructure.total.toFixed(2)} (${feeStructure.discount || 0}% discount)`} 
                          readOnly 
                          className="font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Agreement Terms */}
                  <div>
                    <Label>Agreement Terms</Label>
                    <Textarea
                      value={agreementDetails}
                      onChange={(e) => setAgreementDetails(e.target.value)}
                      placeholder="Enter the terms and conditions of this agreement..."
                      rows={6}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      variant="outline"
                      onClick={resetAgreementForm}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleSaveAgreement}
                    >
                      Save Agreement
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Created Agreements</h3>
                  {agreements.filter(a => a.status === 'agreement-created').length > 0 ? (
                    <div className="space-y-2">
                      {agreements.filter(a => a.status === 'agreement-created').map(agreement => {
                        const student = getStudent(agreement.studentId);
                        return (
                          <Card key={agreement.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{student?.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {student?.grade} • Total: ${agreement.fees.total.toFixed(2)}
                                </p>
                                <p className="text-sm mt-1 text-gray-500">
                                  Created: {agreement.createdDate}
                                </p>
                              </div>
                              <Button 
                                onClick={() => handleSendForESignature(agreement)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Send for E-Signature
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No agreements created</h3>
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
              {isSigning ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">
                    Sign Agreement for {getStudent(currentSigningAgreement?.studentId || '')?.name}
                  </h3>
                  
                  <div className="border rounded-lg p-4">
                    <Label>Signature</Label>
                    <div className="border-2 border-dashed rounded-lg h-48 w-full">
                      <SignaturePad 
                        canvasProps={{ className: 'w-full h-full' }}
                        ref={(ref) => setSignaturePad(ref)}
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => signaturePad?.clear()}
                        className="mr-2"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Agreement Terms</Label>
                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                      {currentSigningAgreement?.terms}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsSigning(false);
                        setCurrentSigningAgreement(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={completeSigning}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm Signature
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Pending Signatures */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pending Signatures</h3>
                    {agreements.filter(a => a.status === 'sent-for-signature').length > 0 ? (
                      <div className="space-y-2">
                        {agreements.filter(a => a.status === 'sent-for-signature').map(agreement => {
                          const student = getStudent(agreement.studentId);
                          return (
                            <Card key={agreement.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">{student?.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {student?.grade} • Total: ${agreement.fees.total.toFixed(2)}
                                    </p>
                                    <p className="text-sm mt-1 text-gray-500">
                                      Sent on: {agreement.sentDate}
                                    </p>
                                  </div>
                                  <Button 
                                    onClick={() => startSigningProcess(agreement)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <PenTool className="mr-2 h-4 w-4" />
                                    Sign Now
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-gray-600">No agreements pending signature</p>
                      </div>
                    )}
                  </div>

                  {/* Signed Agreements */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Completed Signatures</h3>
                    {agreements.filter(a => a.status === 'signed').length > 0 ? (
                      <div className="space-y-2">
                        {agreements.filter(a => a.status === 'signed').map(agreement => {
                          const student = getStudent(agreement.studentId);
                          return (
                            <Card key={agreement.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">{student?.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {student?.grade} • Signed on: {agreement.signedDate}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="text-green-600 flex items-center">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      <span>Signed</span>
                                    </div>
                                    <Button 
                                      variant="outline"
                                      onClick={() => {
                                        // View signature modal would go here
                                        alert('Showing signature details');
                                      }}
                                    >
                                      View
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-gray-600">No completed signatures yet</p>
                      </div>
                    )}
                  </div>

                  {/* Rejected Agreements */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Rejected Agreements</h3>
                    {agreements.filter(a => a.status === 'rejected').length > 0 ? (
                      <div className="space-y-2">
                        {agreements.filter(a => a.status === 'rejected').map(agreement => {
                          const student = getStudent(agreement.studentId);
                          return (
                            <Card key={agreement.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">{student?.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {student?.grade} • Rejected on: {agreement.sentDate}
                                    </p>
                                    <p className="text-sm mt-1 text-red-600">
                                      Reason: {agreement.rejectionReason}
                                    </p>
                                  </div>
                                  <div className="text-red-600 flex items-center">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    <span>Rejected</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-gray-600">No rejected agreements</p>
                      </div>
                    )}
                  </div>
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