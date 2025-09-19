import React, { useState } from 'react';

interface SemesterRecord {
  semester: number;
  sgpa: number;
  attendance: number;
}

interface AcademicsTabProps {
  records: SemesterRecord[];
  cgpa: number;
  extraDetails?: {
    backlogs?: number;
    awards?: string;
    remarks?: string;
  };
}

export const AcademicsTab: React.FC<AcademicsTabProps> = ({ records, cgpa, extraDetails }) => {
  const [selectedSemester, setSelectedSemester] = useState(records.length > 0 ? records[0].semester : 1);
  const selected = records.find(r => r.semester === selectedSemester) || records[0];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-2">Academic Performance</h2>
      {/* Semester Selector */}
      <div className="flex flex-wrap gap-3 mb-4">
        {records.map(r => (
          <button
            key={r.semester}
            className={`px-4 py-2 rounded-full border-2 font-semibold transition-all duration-150 ${selectedSemester === r.semester ? 'bg-blue-600 text-white border-blue-700 shadow' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
            onClick={() => setSelectedSemester(r.semester)}
          >
            Semester {r.semester}
          </button>
        ))}
      </div>

      {/* Selected Semester Details */}
      <div className="bg-blue-50 rounded-xl p-6 shadow border border-blue-100 max-w-md mx-auto">
        <div className="text-xl font-bold text-blue-800 mb-2">Semester {selected.semester} Details</div>
        <div className="flex flex-col gap-2 text-lg">
          <div><span className="font-semibold">SGPA:</span> <span className="text-blue-900">{selected.sgpa.toFixed(2)}</span></div>
          <div><span className="font-semibold">Attendance:</span> <span className="text-blue-900">{selected.attendance.toFixed(1)}%</span></div>
        </div>
      </div>

      {/* CGPA Card */}
      <div className="bg-white rounded-xl p-6 shadow border border-blue-100 max-w-md mx-auto flex items-center justify-between">
        <span className="font-semibold text-lg text-blue-800">Total CGPA</span>
        <span className="text-2xl font-bold text-blue-700">{cgpa.toFixed(2)}</span>
      </div>

      {/* Extra Academic Details */}
      {extraDetails && (
        <div className="bg-gray-50 rounded-xl p-4 shadow border border-gray-100 max-w-md mx-auto mt-2 space-y-1">
          {extraDetails.backlogs !== undefined && (
            <div><span className="font-semibold">Backlogs:</span> {extraDetails.backlogs}</div>
          )}
          {extraDetails.awards && (
            <div><span className="font-semibold">Awards:</span> {extraDetails.awards}</div>
          )}
          {extraDetails.remarks && (
            <div><span className="font-semibold">Remarks:</span> {extraDetails.remarks}</div>
          )}
        </div>
      )}
    </div>
  );
};
