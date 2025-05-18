import React, { forwardRef, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceBarChart2 = forwardRef((props, ref) => {
  const { chartData } = props;

  useEffect(() => {
    if (ref && ref.current && ref.current.chartInstance) {
      ref.current.chartInstance.update();
    }
  }, [chartData, ref]);

  if (!chartData || chartData.length === 0) {
    return <div className="text-center p-4">No data available for chart</div>;
  }

  const collegeCount = {};
  chartData.forEach((entry) => {
    const college = entry.college || 'Unknown';
    collegeCount[college] = (collegeCount[college] || 0) + 1;
  });

  const colleges = Object.keys(collegeCount);
  const counts = Object.values(collegeCount);
  const total = counts.reduce((sum, count) => sum + count, 0);

  const generateColors = (count) => {
    const backgroundColors = [];
    const borderColors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;
      backgroundColors.push(`hsla(${hue}, 70%, 60%, 0.4)`);
      borderColors.push(`hsla(${hue}, 70%, 50%, 1)`);
    }
    return { backgroundColors, borderColors };
  };

  const { backgroundColors, borderColors } = generateColors(colleges.length);

  const chartDataForChart = {
    labels: colleges,
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
        text: 'College Attendance Distribution (Pie)',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = counts.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Analytics calculations
  const sortedColleges = [...colleges].sort((a, b) => collegeCount[b] - collegeCount[a]);
  const highestAttendance = sortedColleges[0];
  const lowestAttendance = sortedColleges[sortedColleges.length - 1];
  
  const highestCount = collegeCount[highestAttendance];
  const lowestCount = collegeCount[lowestAttendance];
  
  const highestPercentage = ((highestCount / total) * 100).toFixed(1);
  const lowestPercentage = ((lowestCount / total) * 100).toFixed(1);
  
  const averageAttendance = (total / colleges.length).toFixed(1);
  
  // Find colleges above and below average
  const collegesAboveAverage = colleges.filter(college => 
    collegeCount[college] > averageAttendance
  ).length;
  
  const collegesBelowAverage = colleges.filter(college => 
    collegeCount[college] < averageAttendance
  ).length;

  return (
    <div className="flex flex-col w-full">
      <div style={{ position: 'relative', width: '100%', height: '500px' }}>
        <Pie
          ref={ref}
          data={chartDataForChart}
          options={options}
        />
      </div>
      
      {/* Analytics Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h5 className="text-xl font-semibold text-gray-800">College Analytics</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded">
            <h6 className="font-medium text-gray-700 mb-2">Summary Statistics</h6>
            <ul className="space-y-2">
              <li>Total Colleges: <span className="font-semibold">{total}</span></li>
              <li>Number of Colleges: <span className="font-semibold">{colleges.length}</span></li>
            </ul>
          </div>
          
          {/* <div className="bg-white p-4 rounded">
            <h6 className="font-medium text-gray-700">Distribution Analysis</h6>
            <ul className="space-y-2">
              <li>Colleges Above Average: <span className="font-semibold">{collegesAboveAverage}</span></li>
              <li>Colleges Below Average: <span className="font-semibold">{collegesBelowAverage}</span></li>
            </ul>
          </div> */}
          
          <div className="bg-white p-4 rounded ">
            <h6 className="font-medium text-gray-700">Highest</h6>
            <ul className="space-y-2">
              <li>College: <span className="font-semibold">{highestAttendance}</span></li>
              <li>Count: <span className="font-semibold">{highestCount}</span></li>
              <li>Percentage: <span className="font-semibold">{highestPercentage}%</span></li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded ">
            <h6 className="font-medium text-gray-700">Lowest</h6>
            <ul className="space-y-2">
              <li>College: <span className="font-semibold">{lowestAttendance}</span></li>
              <li>Count: <span className="font-semibold">{lowestCount}</span></li>
              <li>Percentage: <span className="font-semibold">{lowestPercentage}%</span></li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded ">
          <h6 className="font-medium text-gray-700 mb-2">Top 3 Colleges</h6>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Rank</th>
                  <th className="py-2 px-4 text-left">College</th>
                  <th className="py-2 px-4 text-left">Count</th>
                  <th className="py-2 px-4 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {sortedColleges.slice(0, 3).map((college, index) => (
                  <tr key={college} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{college}</td>
                    <td className="py-2 px-4">{collegeCount[college]}</td>
                    <td className="py-2 px-4">{((collegeCount[college] / total) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

AttendanceBarChart2.displayName = 'AttendanceBarChart2';

export { AttendanceBarChart2 };