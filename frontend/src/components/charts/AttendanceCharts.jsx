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

export function DailyAttendanceLineChart() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Attendance %',
        data: [88.5, 93.7, 91.6, 95.8, 89.5, 84.0],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#2563eb',
        pointRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        min: 60,
        max: 100,
        grid: { color: '#f1f5f9' },
        ticks: { callback: (val) => `${val}%` }
      },
      x: { grid: { display: false } }
    }
  };

  return <Line data={data} options={options} height={240} />;
}

export function CourseAttendanceBarChart() {
  const data = {
    labels: ['MCA', 'BCA', 'B.Tech', 'M.Tech'],
    datasets: [
      {
        label: 'Present %',
        data: [92.5, 88.0, 91.2, 96.0],
        backgroundColor: [
          'rgba(37, 99, 235, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(124, 58, 237, 0.85)',
          'rgba(245, 158, 11, 0.85)'
        ],
        borderRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: '#f1f5f9' },
        ticks: { callback: (val) => `${val}%` }
      },
      x: { grid: { display: false } }
    }
  };

  return <Bar data={data} options={options} height={240} />;
}

export function AttendanceDoughnutChart({ present = 14, absent = 2 }) {
  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 4
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
          padding: 15,
          font: { family: 'Inter', size: 12, weight: '600' }
        }
      }
    },
    cutout: '70%'
  };

  return <Doughnut data={data} options={options} height={200} />;
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
