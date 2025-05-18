import React, { forwardRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceBarChart = forwardRef((props, ref) => {
  const { chartData } = props;
  
  // Move useEffect before any conditional returns
  useEffect(() => {
    if (ref && ref.current) {
      // Force chart update
      const chart = ref.current;
      if (chart && chart.chartInstance) {
        chart.chartInstance.update();
      }
    }
  }, [chartData, ref]);
  
  // Check if chartData exists and has items
  if (!chartData || chartData.length === 0) {
    return <div className="text-center p-4">No data available for chart</div>;
  }
  
  // Process data - group by course
  const courseCounts = {};
  
  chartData.forEach((entry) => {
    // Check if the entry has a course property - use course_name as fallback
    const course = entry.course || entry.course_name || 'Unknown';
    courseCounts[course] = (courseCounts[course] || 0) + 1;
  });
  
  const courses = Object.keys(courseCounts);
  const counts = Object.values(courseCounts);
  
  // Generate colors dynamically based on the number of courses
  const generateColors = (count) => {
    const backgroundColors = [];
    const borderColors = [];
    
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;
      backgroundColors.push(`hsla(${hue}, 70%, 60%, 0.2)`);
      borderColors.push(`hsla(${hue}, 70%, 50%, 1)`);
    }
    
    return { backgroundColors, borderColors };
  };
  
  const { backgroundColors, borderColors } = generateColors(courses.length);
  
  const chartDataForChart = {
    labels: courses,
    datasets: [
      {
        label: 'Attendance Count',
        data: counts,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Course Attendance Distribution',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            const total = counts.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Students'
        },
        ticks: {
          precision: 0 // Show only integer values
        }
      },
      x: {
        title: {
          display: true,
          text: 'Course'
        }
      }
    }
  };
  
  return (
    <div className="w-full">
      <Bar ref={ref} data={chartDataForChart} options={options} />
    </div>
  );
});

// Add display name for better debugging
AttendanceBarChart.displayName = 'AttendanceBarChart';

export { AttendanceBarChart };