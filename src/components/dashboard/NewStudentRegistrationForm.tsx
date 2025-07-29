import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Upload, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DOCUMENT_TYPES = [
  { value: "BIRTH_CERTIFICATE", label: "Birth Certificate | شهادة الميلاد" },
  { value: "PASSPORT", label: "Passport | جواز السفر" },
  { value: "STUDENT_PHOTO", label: "Student Photo | صورة الطالب" },
  { value: "FAMILY_CARD", label: "Family Card | بطاقة العائلة" },
  { value: "VACCINATION_RECORD", label: "Vaccination Record | سجل التطعيم" }
];

const NewStudentRegistrationForm = () => {
  const [formData, setFormData] = useState({
    // Student Information
    name_en: "",
    name_ar: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
    place_of_birth: "",
    religion: "",
    
    // Guardian Information
    guardian_name_en: "",
    guardian_name_ar: "",
    guardian_phone: "",
    guardian_relationship: "",
    guardian_national_id: "",
    
    // Documents
    documents: [] as Array<{
      type: string;
      file: string;
    }>
  });

  const [currentDocument, setCurrentDocument] = useState({
    type: "",
    file: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (
      !formData.name_en || 
      !formData.name_ar || 
      !formData.date_of_birth ||
      !formData.guardian_name_en ||
      !formData.guardian_name_ar ||
      !formData.guardian_phone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (formData.documents.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    // Prepare data for storage
    const registrationData = {
      student: {
        name_en: formData.name_en,
        name_ar: formData.name_ar,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        nationality: formData.nationality,
        place_of_birth: formData.place_of_birth,
        religion: formData.religion
      },
      guardian: {
        name_en: formData.guardian_name_en,
        name_ar: formData.guardian_name_ar,
        phone: formData.guardian_phone,
        relationship: formData.guardian_relationship,
        national_id: formData.guardian_national_id
      },
      documents: formData.documents
    };

    try {
      // Save to localStorage
      const registrations = JSON.parse(localStorage.getItem('studentRegistrations') || '[]');
      registrations.push(registrationData);
      localStorage.setItem('studentRegistrations', JSON.stringify(registrations));
      
      toast.success("Registration submitted successfully!");
      
      // Reset form
      setFormData({
        name_en: "",
        name_ar: "",
        date_of_birth: "",
        gender: "",
        nationality: "",
        place_of_birth: "",
        religion: "",
        guardian_name_en: "",
        guardian_name_ar: "",
        guardian_phone: "",
        guardian_relationship: "",
        guardian_national_id: "",
        documents: []
      });
    } catch (error) {
      toast.error("Failed to save registration");
      console.error(error);
    }
  };

  const handleFileUpload = () => {
    if (!currentDocument.type || !currentDocument.file) {
      toast.error("Please select document type and upload a file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newDocument = {
        type: currentDocument.type,
        file: reader.result as string
      };

      setFormData({
        ...formData,
        documents: [...formData.documents, newDocument]
      });

      setCurrentDocument({
        type: "",
        file: null
      });

      toast.success("Document uploaded successfully");
    };
    reader.readAsDataURL(currentDocument.file);
  };

  const removeDocument = (index: number) => {
    const updatedDocs = [...formData.documents];
    updatedDocs.splice(index, 1);
    setFormData({
      ...formData,
      documents: updatedDocs
    });
  };

  return (
    <Card className="max-w-3xl mx-auto mt-20 p-6 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          New Student Registration | تسجيل طالب جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Student Information | معلومات الطالب
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* English Name */}
              <div>
                <Label htmlFor="name_en">Name (English) * | الاسم (إنجليزي)</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                  placeholder="Student name in English"
                  required
                />
              </div>
              
              {/* Arabic Name */}
              <div>
                <Label htmlFor="name_ar">Name (Arabic) * | الاسم (عربي)</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                  placeholder="اسم الطالب بالعربية"
                  dir="rtl"
                  required
                />
              </div>
              
              {/* Date of Birth */}
              <div>
                <Label htmlFor="date_of_birth">Date of Birth * | تاريخ الميلاد</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  required
                />
              </div>
              
              {/* Gender */}
              <div>
                <Label htmlFor="gender">Gender | الجنس</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({...formData, gender: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male | ذكر</SelectItem>
                    <SelectItem value="FEMALE">Female | أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Nationality */}
              <div>
                <Label htmlFor="nationality">Nationality | الجنسية</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  placeholder="Nationality"
                />
              </div>
              
              {/* Place of Birth */}
              <div>
                <Label htmlFor="place_of_birth">Place of Birth | مكان الميلاد</Label>
                <Input
                  id="place_of_birth"
                  value={formData.place_of_birth}
                  onChange={(e) => setFormData({...formData, place_of_birth: e.target.value})}
                  placeholder="City, Country"
                />
              </div>
              
              {/* Religion */}
              <div>
                <Label htmlFor="religion">Religion | الديانة</Label>
                <Input
                  id="religion"
                  value={formData.religion}
                  onChange={(e) => setFormData({...formData, religion: e.target.value})}
                  placeholder="Religion"
                />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Guardian Information | معلومات ولي الأمر
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Guardian English Name */}
              <div>
                <Label htmlFor="guardian_name_en">Name (English) * | الاسم (إنجليزي)</Label>
                <Input
                  id="guardian_name_en"
                  value={formData.guardian_name_en}
                  onChange={(e) => setFormData({...formData, guardian_name_en: e.target.value})}
                  placeholder="Guardian name in English"
                  required
                />
              </div>
              
              {/* Guardian Arabic Name */}
              <div>
                <Label htmlFor="guardian_name_ar">Name (Arabic) * | الاسم (عربي)</Label>
                <Input
                  id="guardian_name_ar"
                  value={formData.guardian_name_ar}
                  onChange={(e) => setFormData({...formData, guardian_name_ar: e.target.value})}
                  placeholder="اسم ولي الأمر بالعربية"
                  dir="rtl"
                  required
                />
              </div>
              
              {/* Guardian Phone */}
              <div>
                <Label htmlFor="guardian_phone">Phone * | الهاتف</Label>
                <Input
                  id="guardian_phone"
                  value={formData.guardian_phone}
                  onChange={(e) => setFormData({...formData, guardian_phone: e.target.value})}
                  placeholder="+966XXXXXXXXX"
                  required
                />
              </div>
              
              {/* Relationship */}
              <div>
                <Label htmlFor="guardian_relationship">Relationship * | العلاقة</Label>
                <Select
                  value={formData.guardian_relationship}
                  onValueChange={(value) => setFormData({...formData, guardian_relationship: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FATHER">Father | الأب</SelectItem>
                    <SelectItem value="MOTHER">Mother | الأم</SelectItem>
                    <SelectItem value="GUARDIAN">Guardian | الوصي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* National ID */}
              <div>
                <Label htmlFor="guardian_national_id">National ID | الهوية الوطنية</Label>
                <Input
                  id="guardian_national_id"
                  value={formData.guardian_national_id}
                  onChange={(e) => setFormData({...formData, guardian_national_id: e.target.value})}
                  placeholder="National ID number"
                />
              </div>
            </div>
          </div>

          {/* Documents Upload */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Required Documents | الوثائق المطلوبة
            </h3>
            
            {/* Uploaded Documents List */}
            {formData.documents.length > 0 && (
              <div className="mb-4 space-y-2">
                <h4 className="font-medium">Uploaded Documents | الوثائق المرفوعة</h4>
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>
                      {DOCUMENT_TYPES.find(t => t.value === doc.type)?.label.split('|')[0].trim()}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Document Upload Form */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Document Type */}
                <div>
                  <Label htmlFor="document_type">Document Type | نوع الوثيقة</Label>
                  <Select
                    value={currentDocument.type}
                    onValueChange={(value) => setCurrentDocument({...currentDocument, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* File Upload */}
                <div>
                  <Label htmlFor="document_file">File | الملف</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="document_file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCurrentDocument({
                        ...currentDocument,
                        file: e.target.files?.[0] || null
                      })}
                    />
                    <Upload className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <Button
                type="button"
                onClick={handleFileUpload}
                variant="outline"
                className="w-full"
              >
                Add Document | إضافة وثيقة
              </Button>
            </div>
          </div>

          {/* Submit Button */}
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