// Create a new file StudentDetailsPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadIcon, EyeIcon, FileIcon, PrinterIcon } from 'lucide-react';

type Student = {
  id: string;
  name_en: string;
  name_ar: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  place_of_birth: string;
  religion: string;
  currentClass: string;
  nextClass: string;
  status: 'pending' | 'verified' | 'rejected';
  registrationDate: string;
  isNewRegistration?: boolean;
  guardian?: {
    name_en: string;
    name_ar: string;
    phone: string;
    relationship: string;
    national_id: string;
  };
  documents?: Array<{
    type: string;
    file: string;
  }>;
};

export default function StudentDetailsPage() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch student data based on ID
 const fetchStudent = async () => {
  setLoading(true);

  try {
    const token = localStorage.getItem("accessToken"); // adjust this if stored differently

   const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/students/get-studentdetails-all/?is_verified_registration_officer=false`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch student data");
    }

    const result = await response.json();

    if (!result.status || !Array.isArray(result.data)) {
      throw new Error("Invalid API response format: data is not an array");
    }

    const students: Student[] = result.data.map((student: any) => ({
      id: student.id,
      name_en: `${student.en_first_name} ${student.en_middle_name ?? ""} ${student.en_last_name}`.trim(),
      name_ar: `${student.ar_first_name} ${student.ar_middle_name ?? ""} ${student.ar_last_name}`.trim(),
      date_of_birth: student.date_of_birth,
      gender: student.gender === "M" ? "Male" : "Female",
      nationality: student.nationality,
      place_of_birth: student.city,
      religion: student.religion,
      currentClass: student.admission_class?.department_name || "Unknown",
      nextClass: "Pending",
      status: student.is_verified_registration_officer ? "verified" : "pending",
      registrationDate: student.admission_date,
      isNewRegistration: true,
      guardian: student.guardian,
      documents: [], // Fill if your backend provides documents
    }));

    const foundStudent = students.find((s) => s.id === id);

    if (foundStudent) {
      setStudent(foundStudent);
    } else {
      console.error("Student not found");
    }
  } catch (error) {
    console.error("Error fetching student:", error);
  } finally {
    setLoading(false);
  }
};
    fetchStudent();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!student) {
    return <div className="flex justify-center p-8">Student not found</div>;
  }

const handleViewDocument = (fileUrl: string) => {
  window.open(fileUrl, '_blank');
};

const handlePrintDocument = async (fileUrl: string, docName: string) => {
  try {
    // Create an iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Wait for the iframe to load
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframe.src = fileUrl;
    });

    // Wait a bit longer to ensure content is fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Focus the iframe and print
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    
    // Clean up after printing
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  } catch (error) {
    console.error('Printing failed:', error);
    alert(`Failed to print document. Please try viewing it first. Error: ${error.message}`);
  }
};

const handleDownloadDocument = (fileUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName || 'document';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  return (
    
    <div className="p-6 space-y-6">

        
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Details</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">English Name</h3>
            <p>{student.name_en}</p>
          </div>
          <div>
            <h3 className="font-semibold">Arabic Name</h3>
            <p>{student.name_ar}</p>
          </div>
          <div>
            <h3 className="font-semibold">Date of Birth</h3>
            <p>{student.date_of_birth}</p>
          </div>
          <div>
            <h3 className="font-semibold">Gender</h3>
            <p>{student.gender}</p>
          </div>
          <div>
            <h3 className="font-semibold">Nationality</h3>
            <p>{student.nationality}</p>
          </div>
          <div>
            <h3 className="font-semibold">Religion</h3>
            <p>{student.religion}</p>
          </div>
          <div>
            <h3 className="font-semibold">Current Class</h3>
            <p>{student.currentClass}</p>
          </div>
          <div>
            <h3 className="font-semibold">Next Class</h3>
            <p>{student.nextClass}</p>
          </div>
          <div>
            <h3 className="font-semibold">Registration Status</h3>
            <p className="capitalize">{student.status}</p>
          </div>
          <div>
            <h3 className="font-semibold">Registration Date</h3>
            <p>{student.registrationDate}</p>
          </div>
        </CardContent>
      </Card>

      {student.guardian && (
        <Card>
          <CardHeader>
            <CardTitle>Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Name (English)</h3>
              <p>{student.guardian.name_en}</p>
            </div>
            <div>
              <h3 className="font-semibold">Name (Arabic)</h3>
              <p>{student.guardian.name_ar}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>{student.guardian.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold">Relationship</h3>
              <p>{student.guardian.relationship}</p>
            </div>
            <div>
              <h3 className="font-semibold">National ID</h3>
              <p>{student.guardian.national_id}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {student.documents && student.documents.length > 0 && (
    <Card>
  <CardHeader>
    <CardTitle>Documents</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {student.documents.map((doc, index) => (
        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <FileIcon className="h-5 w-5 text-gray-500" />
            <span className="font-medium">{doc.type}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewDocument(doc.file)}
              className="flex items-center gap-1"
            >
              <EyeIcon className="h-4 w-4" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePrintDocument(doc.file, doc.type)}
              className="flex items-center gap-1"
            >
              <PrinterIcon className="h-4 w-4" />
              Print
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownloadDocument(doc.file, doc.type)}
              className="flex items-center gap-1"
            >
              <DownloadIcon className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
      )}
    </div>
  );
}