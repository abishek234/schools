import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import axios from 'axios';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function TeacherDashboardApp() {
  const theme = useTheme();
  const [stats, setStats] = useState({});
  const userId = localStorage.getItem('userId');
  // Fetch statistics from the backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/teachers/teacher/students/${userId}`); // Adjust URL as needed
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Teacher Dashboard
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Total Students"
              total={stats.totalStudents || 0}
              color="error"
              icon={'mdi:school'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Total Boys"
              total={stats.boysCount || 0}
              color="secondary"
              icon={'mdi:school'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Total Girls"
              total={stats.girlsCount || 0}
              color="warning"
              icon={'mdi:school'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Total Videos"
              total={stats.totalVideos  || 0}
              color="primary"
              icon={'mdi:teach'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Total Chapters"
              total={stats.totalChapters || 0}
              color="success"
              icon={'mdi:teach'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Total Completed Videos by Students"
              total={stats.totalCompletedVideos || 0}
              color="error"
              icon={'mdi:teach'}
            />
          </Grid>


{/* 
          <Grid item xs={12} md={6} lg={12}>
            <AppWebsiteVisits
              title="Data Statistics"
              subheader="Current data metrics"
              chartLabels={[
                'Total Students',
                'Total Boys',
                'Total Girls',
                'Total Videos',
                'Total Chapters',
                'Total Completed Videos by Students',

              ]}
              chartData={[
                {
                  name: 'Total Data',
                  type: 'bar', // Change to bar for better visualization of totals
                  fill: 'solid',
                  data: [
                    stats.totalStudents || 0,
                    stats.boysCount || 0,
                    stats.girlsCount || 0,
                    stats.totalVideos || 0,
                    stats.totalChapters || 0,
                    stats.totalCompletedVideos || 0,
                  ],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppCurrentVisits
              title="Data Statistics"
              subheader="Current data metrics"
              chartData={[
                { label: 'Total Students', value: stats.totalStudents || 0 }, 
                { label: 'Total Boys', value: stats.boysCount || 0 },
                { label: 'Total Girls', value: stats.girlsCount || 0 },
                { label: 'Total Videos', value: stats.totalVideos || 0 },
                { label: 'Total Chapters', value: stats.totalChapters || 0 },
                { label: 'Total Completed Videos by Students', value: stats.totalCompletedVideos || 0 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.red[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
                theme.palette.chart.green[0],
                theme.palette.chart.blue[0],
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <AppConversionRates
              title="Data Statistics"
              subheader="Overview of data Statistics"
              chartData={[
                { label: 'Total Students', value: stats.totalStudents || 0 }, 
                { label: 'Total Boys', value: stats.boysCount || 0 },
                { label: 'Total Girls', value: stats.girlsCount || 0 },
                { label: 'Total Videos', value: stats.totalVideos || 0 },
                { label: 'Total Chapters', value: stats.totalChapters || 0 },
                { label: 'Total Completed Videos by Students', value: stats.totalCompletedVideos || 0 },
              ]}
            />
          </Grid> */}

        </Grid>
      </Container>
    </Page>
  );
}
