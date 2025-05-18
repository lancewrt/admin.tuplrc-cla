import React from 'react';
import { Pie } from 'react-chartjs-2'; // Import Pie chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MostLeastChart = ({ chartData }) => {
  // Initialize an empty object to hold course counts
  const bookCounts = {};

  // Iterate over chartData to count occurrences of each course
  chartData.forEach((entry) => {
    const title = entry.resource_title;

    bookCounts[title] = entry.borrowed_times
    
  });

  // Extract the courses (labels) and their corresponding counts (data)
  const books = Object.keys(bookCounts);
  const data = Object.values(bookCounts);

  const dataForCollege = {
    labels: books,
    datasets: [
      {
        label: 'Borrowed Books',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%', 
      height: '500px', 
      margin: 'auto' 
    }}>
      <Pie
        data={dataForCollege}
        options={options}
        width={200}
        height={200}
      />
    </div>
  );
};

export default MostLeastChart;
