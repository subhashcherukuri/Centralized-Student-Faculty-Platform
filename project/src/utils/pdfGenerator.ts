
import jsPDF from 'jspdf';
import { Activity, User } from '../types';

// Helper to get academic data from localStorage
function getAcademicData(userId: string) {
  try {
    const data = localStorage.getItem(`academics_${userId}`);
    if (data) return JSON.parse(data);
  } catch {}
  return null;
}

// Helper to get profile links from localStorage
function getProfileLinks(userId: string) {
  try {
    const data = localStorage.getItem(`profile_links_${userId}`);
    if (data) return JSON.parse(data);
  } catch {}
  return {};
}


export const generatePortfolioPDF = async (user: User, activities: Activity[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Header (Name, Email, Department)
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(user.name, 18, 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(user.email, 18, 28);
  if (user.department) doc.text(user.department, pageWidth - 70, 28);

  // Section Divider Helper
  function sectionDivider(yPos: number) {
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.8);
    doc.line(18, yPos, pageWidth - 18, yPos);
  }

  // Personal Details Box
  let y = 40;
  doc.setFillColor(232, 240, 254);
  doc.roundedRect(15, y, pageWidth - 30, 28, 3, 3, 'F');
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Personal Details', 18, y + 8);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  let yDetails = y + 15;
  doc.text(`Student ID: ${user.studentId || 'N/A'}`, 18, yDetails);
  doc.text(`Semester: ${user.semester || 'N/A'}`, 70, yDetails);
  if (user.mobile) doc.text(`Mobile: ${user.mobile}`, 120, yDetails);
  yDetails += 7;
  doc.text(`Joined: ${new Date(user.createdAt).toLocaleDateString()}`, 18, yDetails);
  y += 32;

  // Professional Links Box
  const links = getProfileLinks(user.id);
  const linkArr = [];
  if (links.github) linkArr.push(`GitHub: ${links.github}`);
  if (links.linkedin) linkArr.push(`LinkedIn: ${links.linkedin}`);
  if (links.twitter) linkArr.push(`Twitter: ${links.twitter}`);
  if (links.website) linkArr.push(`Website: ${links.website}`);
  if (linkArr.length > 0) {
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, y, pageWidth - 30, 14 + linkArr.length * 6, 3, 3, 'F');
    doc.setTextColor(59, 130, 246);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Professional Links', 18, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(0, 0, 0);
    let yLinks = y + 13;
    linkArr.forEach(link => {
      doc.text(link, 22, yLinks);
      yLinks += 6;
    });
    y += 16 + linkArr.length * 6;
  }

  // Academic Performance Section
  sectionDivider(y);
  y += 6;
  const academic = getAcademicData(user.id);
  if (academic) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(59, 130, 246);
    doc.text('Academic Performance', 18, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    // Table header
    doc.setFillColor(220, 230, 250);
    doc.roundedRect(18, y, pageWidth - 36, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Semester', 22, y + 6);
    doc.text('SGPA', 60, y + 6);
    doc.text('Attendance', 90, y + 6);
    y += 12;
    doc.setFont('helvetica', 'normal');
    academic.records.forEach((rec: any) => {
      doc.text(`${rec.semester}`, 22, y);
      doc.text(`${rec.sgpa.toFixed(2)}`, 60, y);
      doc.text(`${rec.attendance.toFixed(1)}%`, 90, y);
      y += 7;
    });
    y += 2;
    // CGPA, Backlogs, Awards, Remarks in a summary box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(18, y, pageWidth - 36, 18, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(59, 130, 246);
    doc.text(`CGPA:`, 22, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`${academic.cgpa?.toFixed(2) || 'N/A'}`, 38, y + 7);
    let x = 60;
    if (academic.extraDetails) {
      if (academic.extraDetails.backlogs !== undefined) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('Backlogs:', x, y + 7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`${academic.extraDetails.backlogs}`, x + 18, y + 7);
        x += 35;
      }
      if (academic.extraDetails.awards) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('Awards:', x, y + 7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`${academic.extraDetails.awards}`, x + 16, y + 7);
        x += 45;
      }
      if (academic.extraDetails.remarks) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('Remarks:', 22, y + 14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`${academic.extraDetails.remarks}`, 40, y + 14);
      }
    }
    y += 22;
  }

  // Activities Section
  sectionDivider(y);
  y += 6;
  const approvedActivities = activities.filter(a => a.status === 'approved');
  const totalCredits = approvedActivities.reduce((sum, a) => sum + a.credits, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(59, 130, 246);
  doc.text('Activities', 18, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  // Summary box
  doc.setFillColor(232, 240, 254);
  doc.roundedRect(18, y, pageWidth - 36, 13, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('Total Approved Activities:', 22, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`${approvedActivities.length}`, 70, y + 8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('Total Credits:', 100, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`${totalCredits}`, 130, y + 8);
  y += 18;

  // Activities List
  approvedActivities.forEach((activity, idx) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
      sectionDivider(y);
      y += 6;
    }
    // Activity Card
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(18, y, pageWidth - 36, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(59, 130, 246);
    doc.text(`${idx + 1}. ${activity.title}`, 22, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`Category: ${activity.category} | Credits: ${activity.credits} | Semester: ${activity.semester}`, 22, y + 12);
    y += 18;
    if (activity.description) {
      const descLines = doc.splitTextToSize(activity.description, pageWidth - 44);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(descLines, 26, y);
      y += descLines.length * 5.5 + 2;
    }
    y += 2;
  });

  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 18, pageHeight - 12);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 38, pageHeight - 12);
  }

  return doc;
};