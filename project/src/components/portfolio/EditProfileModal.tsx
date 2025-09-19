import React, { useState } from 'react';

interface EditProfileModalProps {
  name: string;
  email: string;
  studentId?: string;
  department?: string;
  semester?: number;
  mobile?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  onSave: (data: {
    name: string;
    email: string;
    studentId?: string;
    department?: string;
    semester?: number;
    mobile?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  }) => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  name,
  email,
  studentId = '',
  department = '',
  semester = 1,
  mobile = '',
  github = '',
  linkedin = '',
  twitter = '',
  website = '',
  onSave,
  onClose
}) => {
  const [nameValue, setNameValue] = useState(name);
  const [emailValue, setEmailValue] = useState(email);
  const [studentIdValue, setStudentIdValue] = useState(studentId);
  const [departmentValue, setDepartmentValue] = useState(department);
  const [semesterValue, setSemesterValue] = useState(semester);
  const [mobileValue, setMobileValue] = useState(mobile);
  const [githubValue, setGithubValue] = useState(github);
  const [linkedinValue, setLinkedinValue] = useState(linkedin);
  const [twitterValue, setTwitterValue] = useState(twitter);
  const [websiteValue, setWebsiteValue] = useState(website);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: nameValue,
      email: emailValue,
      studentId: studentIdValue,
      department: departmentValue,
      semester: semesterValue,
      mobile: mobileValue,
      github: githubValue,
      linkedin: linkedinValue,
      twitter: twitterValue,
      website: websiteValue
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={nameValue} onChange={e => setNameValue(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={emailValue} onChange={e => setEmailValue(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={studentIdValue} onChange={e => setStudentIdValue(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={departmentValue} onChange={e => setDepartmentValue(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <input type="number" min={1} className="w-full border border-gray-300 rounded-lg px-3 py-2" value={semesterValue} onChange={e => setSemesterValue(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={mobileValue} onChange={e => setMobileValue(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
            <input type="url" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={githubValue} onChange={e => setGithubValue(e.target.value)} placeholder="https://github.com/yourusername" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input type="url" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={linkedinValue} onChange={e => setLinkedinValue(e.target.value)} placeholder="https://linkedin.com/in/yourusername" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
            <input type="url" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={twitterValue} onChange={e => setTwitterValue(e.target.value)} placeholder="https://twitter.com/yourusername" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
            <input type="url" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={websiteValue} onChange={e => setWebsiteValue(e.target.value)} placeholder="https://yourwebsite.com" />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};
