import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import axios from 'axios';

// @mui
import { Box, Card, CardHeader, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { FileDownloadOutlined } from '@mui/icons-material';

// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppConversionRates.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function AppConversionRates({ title, subheader, ...other }) {
  const [schools, setSchools] = useState([]); // List of schools for dropdown
  const [selectedSchool, setSelectedSchool] = useState(''); // Currently selected school
  const [chartData, setChartData] = useState([]); // Data for the chart

  // Fetch school list on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/superAdmins/superAdmins/schools');
        setSchools(response.data);
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

      // Set chart data dynamically based on the selected school
      setChartData([
        { label: 'Total Students', value: data.totalStudents },
        { label: 'Boys', value: data.boysCount },
        { label: 'Girls', value: data.girlsCount },
        { label: 'Total Teachers', value: data.totalTeachers },
        { label: 'Male Teachers', value: data.maleTeachersCount },
        { label: 'Female Teachers', value: data.femaleTeachersCount },
      ]);
    } catch (error) {
      console.error('Error fetching school data:', error);
    }
  };

  // Handle school selection
  const handleSchoolChange = (event) => {
    const schoolName = event.target.value;
    setSelectedSchool(schoolName);
    fetchSchoolData(schoolName);
  };

  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      id: 'barchart', // Assign an ID to the chart
    },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 },
    },
    xaxis: {
      categories: chartLabels,
    },
  });

  const handleDownload = () => {
    ApexCharts.exec('barchart', 'dataURI')
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
        alert('Failed to download image.');
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
      <Box sx={{ mx: 3, my: 2 }}>
        {/* Dropdown for selecting a school */}
        <FormControl fullWidth>
          <InputLabel>Select School</InputLabel>
          <Select value={selectedSchool} onChange={handleSchoolChange} displayEmpty>
            {schools.map((school) => (
              <MenuItem key={school.schoolname} value={school.schoolname}>
                {school.schoolname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart
          type="bar"
          series={[{ data: chartSeries }]}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
