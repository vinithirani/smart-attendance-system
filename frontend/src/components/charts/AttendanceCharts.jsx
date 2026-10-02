import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default faculty subjects data
export const FACULTY_SUBJECTS = [
  { id: 'cloud', name: 'Cloud Computing & AI', code: 'MCA-201', attendance: 94.2, present: 5, absent: 1, total_lectures: 24, weekly: [90, 92, 95, 94, 96, 94.2] },
  { id: 'ml', name: 'Machine Learning', code: 'MCA-202', attendance: 91.5, present: 5, absent: 1, total_lectures: 22, weekly: [88, 90, 93, 89, 94, 91.5] },
  { id: 'dbms', name: 'Advanced DBMS', code: 'MCA-203', attendance: 88.0, present: 4, absent: 2, total_lectures: 20, weekly: [85, 87, 88, 90, 86, 88.0] },
  { id: 'web', name: 'Full Stack Web Dev', code: 'MCA-204', attendance: 96.0, present: 6, absent: 0, total_lectures: 26, weekly: [92, 95, 96, 98, 95, 96.0] },
  { id: 'sec', name: 'Information Security', code: 'MCA-205', attendance: 86.4, present: 4, absent: 2, total_lectures: 18, weekly: [82, 85, 87, 86, 88, 86.4] }
];

// All institution faculties with their respective subject breakdown for Admin
export const ADMIN_FACULTIES_DATA = [
  {
    id: 1,
    name: "Devanshi Patel",
    faculty_code: "FAC-MCA-001",
    department: "Computer Applications",
    course: "MCA - Master of Computer Applications",
    avg_attendance: 91.2,
    total_lectures: 110,
    students_count: 6,
    subjects: [
      { id: 'cloud', name: 'Cloud Computing & AI', code: 'MCA-201', attendance: 94.2, present: 5, absent: 1, total_lectures: 24, weekly: [90, 92, 95, 94, 96, 94.2] },
      { id: 'ml', name: 'Machine Learning', code: 'MCA-202', attendance: 91.5, present: 5, absent: 1, total_lectures: 22, weekly: [88, 90, 93, 89, 94, 91.5] },
      { id: 'dbms', name: 'Advanced DBMS', code: 'MCA-203', attendance: 88.0, present: 4, absent: 2, total_lectures: 20, weekly: [85, 87, 88, 90, 86, 88.0] },
      { id: 'web', name: 'Full Stack Web Dev', code: 'MCA-204', attendance: 96.0, present: 6, absent: 0, total_lectures: 26, weekly: [92, 95, 96, 98, 95, 96.0] },
      { id: 'sec', name: 'Information Security', code: 'MCA-205', attendance: 86.4, present: 4, absent: 2, total_lectures: 18, weekly: [82, 85, 87, 86, 88, 86.4] }
    ]
  },
  {
    id: 2,
    name: "Risha Tiwari",
    faculty_code: "FAC-BCA-002",
    department: "Computer Applications",
    course: "BCA - Bachelor of Computer Applications",
    avg_attendance: 89.5,
    total_lectures: 95,
    students_count: 3,
    subjects: [
      { id: 'java', name: 'OOP with Java', code: 'BCA-201', attendance: 92.0, present: 3, absent: 0, total_lectures: 25, weekly: [88, 90, 92, 94, 91, 92.0] },
      { id: 'dsa', name: 'Data Structures & Algorithms', code: 'BCA-202', attendance: 88.5, present: 2, absent: 1, total_lectures: 24, weekly: [85, 88, 86, 90, 89, 88.5] },
      { id: 'dbms_bca', name: 'Database Systems', code: 'BCA-203', attendance: 90.4, present: 3, absent: 0, total_lectures: 22, weekly: [87, 90, 89, 92, 91, 90.4] },
      { id: 'web_bca', name: 'Client Side Web Tech', code: 'BCA-204', attendance: 95.0, present: 3, absent: 0, total_lectures: 24, weekly: [92, 94, 95, 96, 95, 95.0] }
    ]
  },
  {
    id: 3,
    name: "Dhruv Patel",
    faculty_code: "FAC-BT-003",
    department: "Computer Engineering",
    course: "B.Tech - Computer Engineering",
    avg_attendance: 90.8,
    total_lectures: 102,
    students_count: 3,
    subjects: [
      { id: 'ai_robotics', name: 'AI & Robotics', code: 'BT-401', attendance: 93.4, present: 3, absent: 0, total_lectures: 28, weekly: [90, 92, 95, 94, 93, 93.4] },
      { id: 'dist_sys', name: 'Distributed Systems', code: 'BT-402', attendance: 89.0, present: 2, absent: 1, total_lectures: 24, weekly: [86, 88, 90, 87, 89, 89.0] },
      { id: 'cn', name: 'Computer Networks', code: 'BT-403', attendance: 91.2, present: 3, absent: 0, total_lectures: 26, weekly: [88, 90, 92, 93, 91, 91.2] },
      { id: 'os', name: 'Operating Systems Design', code: 'BT-404', attendance: 87.5, present: 2, absent: 1, total_lectures: 24, weekly: [84, 86, 88, 89, 87, 87.5] }
    ]
  },
  {
    id: 4,
    name: "Shyam Chavda",
    faculty_code: "FAC-MT-004",
    department: "Computer Engineering",
    course: "M.Tech - Advanced Computing",
    avg_attendance: 96.6,
    total_lectures: 82,
    students_count: 2,
    subjects: [
      { id: 'deep_learning', name: 'Advanced Deep Learning', code: 'MT-201', attendance: 97.0, present: 2, absent: 0, total_lectures: 22, weekly: [95, 96, 98, 97, 98, 97.0] },
      { id: 'hpc', name: 'High Performance Computing', code: 'MT-202', attendance: 95.5, present: 2, absent: 0, total_lectures: 20, weekly: [94, 95, 96, 95, 97, 95.5] },
      { id: 'microservices', name: 'Cloud Native Microservices', code: 'MT-203', attendance: 98.0, present: 2, absent: 0, total_lectures: 22, weekly: [96, 98, 99, 97, 98, 98.0] },
      { id: 'quantum', name: 'Quantum Computing', code: 'MT-204', attendance: 96.0, present: 2, absent: 0, total_lectures: 18, weekly: [94, 96, 95, 97, 96, 96.0] }
    ]
  }
];

/**
 * Subject-Wise Attendance Bar Chart (Compares All Faculty Subjects)
 */
export function SubjectWiseAttendanceBarChart({ subjects = FACULTY_SUBJECTS, onSelectSubject, activeSubjectId }) {
  const labels = subjects.map(s => s.name);
  const attendanceData = subjects.map(s => s.attendance);

  const backgroundColors = subjects.map(s => 
    activeSubjectId && s.id === activeSubjectId 
      ? '#2563eb' 
      : s.attendance >= 90 
        ? 'rgba(16, 185, 129, 0.85)' 
        : s.attendance >= 80 
          ? 'rgba(37, 99, 235, 0.85)' 
          : 'rgba(245, 158, 11, 0.85)'
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Subject Attendance Rate (%)',
        data: attendanceData,
        backgroundColor: backgroundColors,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 32,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0 && onSelectSubject) {
        const index = elements[0].index;
        onSelectSubject(subjects[index]);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          title: (items) => subjects[items[0].dataIndex].name + ` (${subjects[items[0].dataIndex].code})`,
          label: (item) => ` Attendance: ${item.raw}% | Lectures: ${subjects[item.dataIndex].total_lectures}`,
          afterLabel: (item) => ` Status: ${item.raw >= 75 ? '✓ Exam Eligible (>=75%)' : '⚠️ Warning (<75%)'}`
        }
      }
    },
    scales: {
      y: {
        min: 60,
        max: 100,
        grid: { color: '#f1f5f9' },
        ticks: { 
          stepSize: 10,
          callback: (val) => `${val}%`,
          font: { family: 'Inter', size: 11, weight: '600' }
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', size: 11, weight: '500' },
          maxRotation: 25,
          minRotation: 0
        }
      }
    }
  };

  return <Bar data={data} options={options} height={240} />;
}

/**
 * Subject-Wise Attendance Trend Line Chart (Weekly Lecture Progress)
 */
export function SubjectWiseTrendLineChart({ subject = FACULTY_SUBJECTS[0] }) {
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6 (Current)'],
    datasets: [
      {
        label: `${subject.name} Attendance %`,
        data: subject.weekly || [88, 91, 93, 90, 95, subject.attendance],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Minimum Requirement (75%)',
        data: [75, 75, 75, 75, 75, 75],
        borderColor: 'rgba(239, 68, 68, 0.7)',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: { family: 'Inter', size: 12, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (item) => ` ${item.dataset.label}: ${item.raw}%`
        }
      }
    },
    scales: {
      y: {
        min: 60,
        max: 100,
        grid: { color: '#f1f5f9' },
        ticks: { 
          stepSize: 10,
          callback: (val) => `${val}%`,
          font: { family: 'Inter', size: 11 }
        }
      },
      x: { 
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 } }
      }
    }
  };

  return <Line data={data} options={options} height={240} />;
}

/**
 * Subject-Wise Attendance Ratio Doughnut Chart
 */
export function SubjectWiseDoughnutChart({ present = 5, absent = 1, subjectName = 'Cloud Computing & AI' }) {
  const total = present + absent;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  const data = {
    labels: ['Present Students', 'Absent Students'],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 14,
          font: { family: 'Inter', size: 12, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (item) => ` ${item.label}: ${item.raw} Students (${Math.round((item.raw / (total || 1)) * 100)}%)`
        }
      }
    },
    cutout: '72%'
  };

  return (
    <div style={{ position: 'relative', height: '200px' }}>
      <Doughnut data={data} options={options} />
      <div 
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
          {rate}%
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>
          Attendance
        </div>
      </div>
    </div>
  );
}

// Backward compatibility exports
export function DailyAttendanceLineChart() {
  return <SubjectWiseTrendLineChart subject={FACULTY_SUBJECTS[0]} />;
}

export function CourseAttendanceBarChart() {
  return <SubjectWiseAttendanceBarChart subjects={FACULTY_SUBJECTS} />;
}

export function AttendanceDoughnutChart({ present = 5, absent = 1 }) {
  return <SubjectWiseDoughnutChart present={present} absent={absent} />;
}

export function MonthlyAttendanceTrendChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Students %',
        data: [89.2, 91.4, 93.1, 90.5, 94.0, 92.8],
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        tension: 0.3,
      },
      {
        label: 'Faculty %',
        data: [98.0, 97.5, 99.0, 96.5, 98.5, 99.2],
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        tension: 0.3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { backgroundColor: '#0f172a', padding: 10, cornerRadius: 8 }
    },
    scales: {
      y: { min: 70, max: 100, grid: { color: '#f1f5f9' }, ticks: { callback: (v) => `${v}%` } },
      x: { grid: { display: false } }
    }
  };

  return <Line data={data} options={options} height={240} />;
}
