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
  const totalAttendance = counts.reduce((sum, count) => sum + count, 0);
  
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

  // Analytics calculations
  const sortedCourses = [...courses].sort((a, b) => courseCounts[b] - courseCounts[a]);
  const highestAttendance = sortedCourses[0];
  const lowestAttendance = sortedCourses[sortedCourses.length - 1];
  
  const highestCount = courseCounts[highestAttendance];
  const lowestCount = courseCounts[lowestAttendance];
  
  const highestPercentage = ((highestCount / totalAttendance) * 100).toFixed(1);
  const lowestPercentage = ((lowestCount / totalAttendance) * 100).toFixed(1);
  
  const averageAttendance = (totalAttendance / courses.length).toFixed(1);
  
  // Calculate standard deviation
  const variance = counts.reduce((sum, count) => {
    return sum + Math.pow(count - averageAttendance, 2);
  }, 0) / counts.length;
  
  const stdDeviation = Math.sqrt(variance).toFixed(1);
  
  // Find courses above and below average
  const coursesAboveAverage = courses.filter(course => 
    courseCounts[course] > averageAttendance
  ).length;
  
  const coursesBelowAverage = courses.filter(course => 
    courseCounts[course] < averageAttendance
  ).length;
  
  // Find median attendance
  const sortedCounts = [...counts].sort((a, b) => a - b);
  let medianAttendance;
  
  if (sortedCounts.length % 2 === 0) {
    // Even number of courses
    const midIndex = sortedCounts.length / 2;
    medianAttendance = ((sortedCounts[midIndex - 1] + sortedCounts[midIndex]) / 2).toFixed(1);
  } else {
    // Odd number of courses
    const midIndex = Math.floor(sortedCounts.length / 2);
    medianAttendance = sortedCounts[midIndex].toFixed(1);
  }
  
  return (
    <div className="flex flex-col w-full">
      <div style={{ position: 'relative', width: '100%', height: '500px' }}>
        <Bar ref={ref} data={chartDataForChart} options={options} />
      </div>

      {/* Analytics Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md ">
        <h5 className="text-xl font-semibold text-gray-800">Course Analytics</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded ">
            <h6 className="font-medium text-gray-700">Summary Statistics</h6>
            <ul className="space-y-2">
              <li>Total Courses: <span className="font-semibold">{totalAttendance}</span></li>
              <li>Number of Courses: <span className="font-semibold">{courses.length}</span></li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded ">
            <h6 className="font-medium text-gray-700">Highest</h6>
            <ul className="space-y-2">
              <li>Course: <span className="font-semibold">{highestAttendance}</span></li>
              <li>Count: <span className="font-semibold">{highestCount}</span> students</li>
              <li>Percentage: <span className="font-semibold">{highestPercentage}%</span> of total</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded ">
            <h6 className="font-medium text-gray-700">Lowest</h6>
            <ul className="space-y-2">
              <li>Course: <span className="font-semibold">{lowestAttendance}</span></li>
              <li>Count: <span className="font-semibold">{lowestCount}</span> students</li>
              <li>Percentage: <span className="font-semibold">{lowestPercentage}%</span> of total</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded ">
          <h6 className="font-medium text-gray-700">Top Courses</h6>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Rank</th>
                  <th className="py-2 px-4 text-left">Course</th>
                  <th className="py-2 px-4 text-left">Students</th>
                  <th className="py-2 px-4 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {sortedCourses.slice(0, 5).map((course, index) => {
                  const diffFromAvg = courseCounts[course] - averageAttendance;
                  const diffColor = diffFromAvg >= 0 ? "text-green-600" : "text-red-600";
                  
                  return (
                    <tr key={course} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4 font-medium">{course}</td>
                      <td className="py-2 px-4">{courseCounts[course]}</td>
                      <td className="py-2 px-4">{((courseCounts[course] / totalAttendance) * 100).toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

// Add display name for better debugging
AttendanceBarChart.displayName = 'AttendanceBarChart';

export { AttendanceBarChart };