
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Upload, Save } from "lucide-react";
import { toast } from "sonner";

const NewStudentRegistrationForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    studentNameEn: '',
    studentNameAr: '',
    dateOfBirth: '',
    nationality: '',
    gender: '',
    nationalId: '',
    passportNumber: '',
    
    // Guardian Information
    guardianNameEn: '',
    guardianNameAr: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianId: '',
    relationship: '',
    
    // Academic Information
    admissionClass: '',
    admissionSection: '',
    previousSchool: '',
    previousGrade: '',
    
    // Address Information
    address: '',
    city: '',
    postalCode: '',
    
    // Medical Information
    medicalConditions: '',
    allergies: '',
    
    // Documents
    birthCertificate: null,
    passportCopy: null,
    previousRecords: null,
    medicalRecords: null,
    guardianId: null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.studentNameEn || !formData.studentNameAr || !formData.dateOfBirth) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    console.log('New student registration:', formData);
    toast.success("Student registration submitted successfully!");
    
    // Reset form
    setFormData({
      studentNameEn: '',
      studentNameAr: '',
      dateOfBirth: '',
      nationality: '',
      gender: '',
      nationalId: '',
      passportNumber: '',
      guardianNameEn: '',
      guardianNameAr: '',
      guardianPhone: '',
      guardianEmail: '',
      guardianId: '',
      relationship: '',
      admissionClass: '',
      admissionSection: '',
      previousSchool: '',
      previousGrade: '',
      address: '',
      city: '',
      postalCode: '',
      medicalConditions: '',
      allergies: '',
      birthCertificate: null,
      passportCopy: null,
      previousRecords: null,
      medicalRecords: null
    });
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData({...formData, [field]: file});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          New Student Registration | تسجيل طالب جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information | المعلومات الشخصية</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentNameEn">Student Name (English) * | اسم الطالب (إنجليزي)</Label>
                <Input
                  id="studentNameEn"
                  value={formData.studentNameEn}
                  onChange={(e) => setFormData({...formData, studentNameEn: e.target.value})}
                  placeholder="Enter student name in English"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="studentNameAr">Student Name (Arabic) * | اسم الطالب (عربي)</Label>
                <Input
                  id="studentNameAr"
                  value={formData.studentNameAr}
                  onChange={(e) => setFormData({...formData, studentNameAr: e.target.value})}
                  placeholder="أدخل اسم الطالب بالعربية"
                  dir="rtl"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth * | تاريخ الميلاد</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender | الجنس</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male | ذكر</SelectItem>
                    <SelectItem value="female">Female | أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="nationality">Nationality | الجنسية</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  placeholder="Enter nationality"
                />
              </div>
              
              <div>
                <Label htmlFor="nationalId">National ID | الهوية الوطنية</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                  placeholder="Enter national ID"
                />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Guardian Information | معلومات ولي الأمر</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guardianNameEn">Guardian Name (English) | اسم ولي الأمر (إنجليزي)</Label>
                <Input
                  id="guardianNameEn"
                  value={formData.guardianNameEn}
                  onChange={(e) => setFormData({...formData, guardianNameEn: e.target.value})}
                  placeholder="Enter guardian name in English"
                />
              </div>
              
              <div>
                <Label htmlFor="guardianNameAr">Guardian Name (Arabic) | اسم ولي الأمر (عربي)</Label>
                <Input
                  id="guardianNameAr"
                  value={formData.guardianNameAr}
                  onChange={(e) => setFormData({...formData, guardianNameAr: e.target.value})}
                  placeholder="أدخل اسم ولي الأمر بالعربية"
                  dir="rtl"
                />
              </div>
              
              <div>
                <Label htmlFor="guardianPhone">Guardian Phone | هاتف ولي الأمر</Label>
                <Input
                  id="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                  placeholder="+966XXXXXXXXX"
                />
              </div>
              
              <div>
                <Label htmlFor="guardianEmail">Guardian Email | بريد ولي الأمر</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(e) => setFormData({...formData, guardianEmail: e.target.value})}
                  placeholder="guardian@email.com"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Academic Information | المعلومات الأكاديمية</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="admissionClass">Admission Class | صف القبول</Label>
                <Select value={formData.admissionClass} onValueChange={(value) => setFormData({...formData, admissionClass: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg1">KG1</SelectItem>
                    <SelectItem value="kg2">KG2</SelectItem>
                    <SelectItem value="grade1">Grade 1</SelectItem>
                    <SelectItem value="grade2">Grade 2</SelectItem>
                    <SelectItem value="grade3">Grade 3</SelectItem>
                    <SelectItem value="grade4">Grade 4</SelectItem>
                    <SelectItem value="grade5">Grade 5</SelectItem>
                    <SelectItem value="grade6">Grade 6</SelectItem>
                    <SelectItem value="grade7">Grade 7</SelectItem>
                    <SelectItem value="grade8">Grade 8</SelectItem>
                    <SelectItem value="grade9">Grade 9</SelectItem>
                    <SelectItem value="grade10">Grade 10</SelectItem>
                    <SelectItem value="grade11">Grade 11</SelectItem>
                    <SelectItem value="grade12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="previousSchool">Previous School | المدرسة السابقة</Label>
                <Input
                  id="previousSchool"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({...formData, previousSchool: e.target.value})}
                  placeholder="Enter previous school name"
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Required Documents | الوثائق المطلوبة</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthCertificate">Birth Certificate | شهادة الميلاد</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="birthCertificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('birthCertificate', e.target.files?.[0] || null)}
                  />
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="passportCopy">Passport Copy | صورة جواز السفر</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="passportCopy"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('passportCopy', e.target.files?.[0] || null)}
                  />
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="previousRecords">Previous School Records | سجلات المدرسة السابقة</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="previousRecords"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('previousRecords', e.target.files?.[0] || null)}
                  />
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="medicalRecords">Medical Records | السجلات الطبية</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="medicalRecords"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('medicalRecords', e.target.files?.[0] || null)}
                  />
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-5 w-5" />
            Register Student | تسجيل الطالب
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewStudentRegistrationForm;
