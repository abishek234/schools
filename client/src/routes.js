import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

import Login from './pages/Login';
import NotFound from './pages/Page404';
import Teacher from './pages/Teacher';
import Student from './pages/Student';
import Admin from './pages/Admin';
import Videos from './pages/Videos';
import ProfilePage from './pages/Profile';
import DashboardApp from './pages/DashboardApp';
import AdminDashboardApp from './pages/AdminDashboard';
import TeacherDashboardApp from './pages/TeacherDashboard';
import TimetableList from './pages/Timetable';
import TimeTableTracking from './pages/TimetableTracking';
import Assessment from './pages/Assessment';
import Attendance from './pages/Attendance';
import AttendanceTracking from './pages/AttendanceTracking';
import AdminTracking from './pages/AdminTracking';
import StudentTimeTable from './pages/StudentTimetable';
import StudentDashboardApp from './pages/StudentDashboard';
import MeetingRoom from './pages/MeetingRoom';
import CreateMeeting from './pages/CreateMeeting';
import ParentDashboardApp from './pages/ParentDashboard';


// ----------------------------------------------------------------------

export default function Router() {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is authenticated

  const handleDateChange = (date) => {
    console.log('Selected date:', date);
  }
  return useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        {path:'adminapp',element:<AdminDashboardApp />},
        {path:'teacherapp',element:<TeacherDashboardApp />},
        {path:'teacher',element:<Teacher/>},
        {path:'student',element:<Student/>},
        {path:'admin',element:<Admin/>},
        {path:'videos',element:<Videos/>},
        {path:'profile',element:<ProfilePage />},
        {path:'timetable',element:<TimetableList/>},
        {path:'timetabletracking',element:<TimeTableTracking/>},
        {path:'assessment',element:<Assessment/>},
        {path:'attendance',element:<Attendance/>},
        {path:'attendancetracking',element:<AttendanceTracking/>},
        {path:'admintracking',element:<AdminTracking/>},
        {path:'studenttimetable',element:<StudentTimeTable/>},
        {path:'studentapp',element:<StudentDashboardApp/>},
        {path:'parentapp',element:<ParentDashboardApp/>},
        {path:'meetingroom',element:<MeetingRoom/>},
        {path:'createmeeting',element:<CreateMeeting/>}

      
       


      ],
    },
    {
      path: 'login',
      element: !isAuthenticated ? <Login /> : <Navigate to="/dashboard/app" />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
