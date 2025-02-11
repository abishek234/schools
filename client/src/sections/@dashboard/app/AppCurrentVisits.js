import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import Select from 'react-select';

// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, IconButton, Box } from '@mui/material';
import { FileDownloadOutlined } from '@mui/icons-material';

// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

AppCurrentVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
};

export default function AppCurrentVisits({ title, subheader, chartColors, ...other }) {
  const theme = useTheme();
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolData, setSchoolData] = useState(null);

  useEffect(() => {
    // Fetch schools list
    const fetchSchools = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/superAdmins/superAdmins/schools');
        const data = await response.json();
        setSchools(
          data.map((school) => ({
            label: school.schoolname,
            value: school.schoolname,
          }))
        );
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []);

  const handleSchoolChange = async (selectedOption) => {
    setSelectedSchool(selectedOption);
    try {
      const response = await fetch(`http://localhost:9000/api/superAdmins/superAdmins/school/${selectedOption.value}`);
      const data = await response.json();
      setSchoolData(data);
    } catch (error) {
      console.error('Error fetching school data:', error);
    }
  };

  const chartLabels = ['Total Students', 'Boys', 'Girls', 'Total Teachers', 'Male Teachers', 'Female Teachers'];
  const chartSeries = schoolData
    ? [
        schoolData.totalStudents,
        schoolData.boysCount,
        schoolData.girlsCount,
        schoolData.totalTeachers,
        schoolData.maleTeachersCount,
        schoolData.femaleTeachersCount,
      ]
    : [];

  const chartOptions = merge(BaseOptionChart(), {
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
    chart: {
      id: 'schoolPieChart',
    },
  });

  const handleDownload = () => {
    ApexCharts.exec('schoolPieChart', 'dataURI').then(({ imgURI }) => {
      const link = document.createElement('a');
      link.href = imgURI;
      link.download = 'schoolDataChart.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

      <Box sx={{ px: 3, py: 2 }}>
        <Select
          options={schools}
          value={selectedSchool}
          onChange={handleSchoolChange}
          placeholder="Select a School"
        />
      </Box>

      {schoolData ? (
        <ChartWrapperStyle dir="ltr">
          <ReactApexChart type="pie" series={chartSeries} options={chartOptions} height={280} />
        </ChartWrapperStyle>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>Select a school to view data.</Box>
      )}
    </Card>
  );
}
