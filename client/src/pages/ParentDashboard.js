import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import axios from 'axios';
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

export default function ParentDashboardApp() {
  const theme = useTheme();


  return (
    <Page title="Dashboard">
        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 5 }}>
                Parent Dashboard
            </Typography>
        </Container>
    </Page>
  );
}
