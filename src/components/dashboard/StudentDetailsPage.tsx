// Create a new file StudentDetailsPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/students/${id}`);
        // const data = await response.json();
        
        // For now, we'll use mock data or localStorage data
        const storedRegistrations = localStorage.getItem('studentRegistrations');
        const localStorageStudents: Student[] = storedRegistrations 
          ? JSON.parse(storedRegistrations).map((reg: any, index: number) => ({
              id: `local-${index}`,
              ...reg.student,
              currentClass: 'Grade 1',
              nextClass: 'Grade 2',
              status: 'pending',
              registrationDate: new Date().toISOString().split('T')[0],
              isNewRegistration: true,
              guardian: reg.guardian,
              documents: reg.documents
            }))
          : [];

        // Combine with mock data (from your RegistrationDashboard)
        const mockStudents: Student[] = [
          { 
            id: '1', 
            name_en: 'Ahmed Mohamed',
            // ... other mock data
          },
          // ... other mock students
        ];

        const allStudents = [...localStorageStudents, ...mockStudents];
        const foundStudent = allStudents.find(s => s.id === id);

        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          console.error('Student not found');
        }
      } catch (error) {
        console.error('Error fetching student:', error);
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
            <div className="space-y-2">
              {student.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span>{doc.type}</span>
                  <Button variant="outline" size="sm">
                    View Document
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}