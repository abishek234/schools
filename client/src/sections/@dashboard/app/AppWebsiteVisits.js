import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import axios from 'axios';
import Select from 'react-select'; // Dropdown for selecting schools
// @mui
import { Card, CardHeader, Box, IconButton } from '@mui/material';
import { FileDownloadOutlined } from '@mui/icons-material';
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function AppWebsiteVisits({ title, subheader, ...other }) {
  const [schools, setSchools] = useState([]); // Dropdown options
  const [selectedSchool, setSelectedSchool] = useState(null); // Selected school
  const [chartData, setChartData] = useState([]); // Data for the chart
  const [chartLabels, setChartLabels] = useState([]); // Labels for the chart

  // Fetch schools when the component mounts
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/superAdmins/superAdmins/schools');
        const schoolOptions = response.data.map((school) => ({
          label: school.schoolname,
          value: school.schoolname,
        }));
        setSchools(schoolOptions);
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []);

  // Fetch data for the selected school
  const fetchSchoolData = async (schoolName) => {
    try {
      const response = await axios.get(`http://localhost:9000/api/superAdmins/superAdmins/school/${schoolName}`);
      const data = response.data;

      // Set the chart data and labels dynamically
      setChartLabels(['Total Students', 'Boys', 'Girls', 'Total Teachers', 'Male Teachers', 'Female Teachers']);
      setChartData([
        {
          name: 'Data',
          data: [
            data.totalStudents,
            data.boysCount,
            data.girlsCount,
            data.totalTeachers,
            data.maleTeachersCount,
            data.femaleTeachersCount,
          ],
        },
      ]);
    } catch (error) {
      console.error('Error fetching school data:', error);
    }
  };

  // Handle school selection
  const handleSchoolChange = (selectedOption) => {
    setSelectedSchool(selectedOption);
    fetchSchoolData(selectedOption.value);
  };

  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      id: 'websiteVisitsChart', // Assign an ID to the chart
    },
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: 'solid' },
    labels: chartLabels,
    xaxis: { categories: chartLabels },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} units`; // Change label to units for clarity
          }
          return y;
        },
      },
    },
  });

  const handleDownload = () => {
    ApexCharts.exec('websiteVisitsChart', 'dataURI')
      .then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'chart.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error during download:', error);
        alert('Failed to download the chart.');
      });
  };

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <IconButton onClick={handleDownload}>
            <FileDownloadOutlined />
          </IconButton>
        }
      />
      <Box sx={{ px: 3, pt: 2 }}>
        {/* School selection dropdown */}
        <Select
          options={schools}
          value={selectedSchool}
          onChange={handleSchoolChange}
          placeholder="Select a school"
          isClearable
        />
      </Box>
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="bar"
          series={chartData}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
