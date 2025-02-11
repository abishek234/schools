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

export default function DashboardApp() {
  const theme = useTheme();
  const [stats, setStats] = useState({});

  // Fetch statistics from the backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/superAdmins/superAdmins/data'); // Adjust URL as needed
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
          Super Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Total Schools"
              total={stats.totalSchools || 0}
              color="info"
              icon={stats.totalSchools > 100 ? 'mdi:school' : 'mdi:home-city'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Total Admins"
              total={stats.totalAdmins || 0}
              color="success"
              icon={stats.totalAdmins > 50 ? 'mdi:account-cog' : 'mdi:account-group'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Total Teachers"
              total={stats.totalTeachers || 0}
              color="warning"
              icon={stats.totalTeachers > 100 ? 'mdi:account-tie' : 'mdi:teach'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Total Students"
              total={stats.totalStudents || 0}
              color="error"
              icon={stats.totalStudents > 1000 ? 'mdi:account-school' : 'mdi:school'}
            />
          </Grid>


          <Grid item xs={12} md={6} lg={12}>
            <AppWebsiteVisits
              title="Data Statistics"
              subheader="Current data metrics"
              chartLabels={[
                'Total Schools',
                'Total Admins',
                'Total Teachers',
                'Total Students',
                
              ]}
              chartData={[
                {
                  name: 'Total Data',
                  type: 'bar', // Change to bar for better visualization of totals
                  fill: 'solid',
                  data: [
                    stats.totalSchools || 0,
                    stats.totalAdmins || 0,
                    stats.totalTeachers || 0,
                    stats.totalStudents || 0,
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
                { label: 'Total Schools', value: stats.totalSchools || 0 },
                { label: 'Total Admins', value: stats.totalAdmins || 0 },
                { label: 'Total Teachers', value: stats.totalTeachers || 0 },
                { label: 'Total Students', value: stats.totalStudents || 0}, // Scale down "Total Yield"
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.red[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <AppConversionRates
              title="Data Statistics"
              subheader="Overview of data Statistics"
              chartData={[
                { label: 'Total Schools', value: stats.totalSchools || 0 },
                { label: 'Total Admins', value: stats.totalAdmins || 0 },
                { label: 'Total Teachers', value: stats.totalTeachers || 0 },
                { label: 'Total Students', value: stats.totalStudents || 0}, // Scale down "Total Yield"
              ]}
            />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
