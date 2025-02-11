// component
import { get } from 'lodash';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export const getNavConfig = (userRole) => {

  const navConfig = [];

  if (userRole === 'superAdmin') {
    navConfig.push(
      {
        title: 'dashboard',
        path: '/dashboard/app', // Specific dashboard for super admin
        icon: getIcon('eva:home-fill'),
      },
      {
        title: 'Users',
        path: '#', // Dropdown for users
        icon: getIcon('eva:people-fill'),
        children: [
          {
            title: 'admin',
            path: '/dashboard/admin',
            icon: getIcon('eva:people-fill'),
          },
          {
            title: 'teacher',
            path: '/dashboard/teacher',
            icon: getIcon('eva:people-fill'),
          },
          {
            title: 'student',
            path: '/dashboard/student',
            icon: getIcon('eva:people-fill'),
          },
        ],
      },
      {
        title: 'profile',
        path: '/dashboard/profile',
        icon: getIcon('eva:person-fill'),
      }
    );
  } else if (userRole === 'admin') {
    navConfig.push(
      {
        title: 'dashboard',
        path: '/dashboard/adminapp', // Specific dashboard for admin
        icon: getIcon('eva:home-fill'),
      },
      {
        title: 'Users',
        path: '#', // Dropdown for users
        icon: getIcon('eva:people-fill'),
        children: [
          {
            title: 'teacher',
            path: '/dashboard/teacher',
            icon: getIcon('eva:people-fill'),
          },
          {
            title: 'student',
            path: '/dashboard/student',
            icon: getIcon('eva:people-fill'),
          },
        ],
      },
      {
        title: 'admin tracking',
        path: '/dashboard/admintracking',
        icon: getIcon('eva:done-all-fill'),
      },
      {
        title: 'timetable tracking',  
        path: '/dashboard/timetabletracking',
        icon: getIcon('eva:calendar-fill'),
      },
      {
        title: 'attendance tracking',
        path: '/dashboard/attendancetracking',
        icon: getIcon('eva:checkmark-circle-fill'),
      },
      {
        title: 'profile',
        path: '/dashboard/profile',
        icon: getIcon('eva:person-fill'),
      }
    );
  } else if (userRole === 'teacher') {
    navConfig.push(
      {
        title: 'dashboard',
        path: '/dashboard/teacherapp', // Specific dashboard for teacher
        icon: getIcon('eva:home-fill'),
      },
      {
        title: 'student',
        path: '/dashboard/student',
        icon: getIcon('eva:people-fill'),
      },
      {
        title: 'videos',
        path: '/dashboard/videos',
        icon: getIcon('eva:film-fill'),
        
      },
      {
        title: 'assessments',
        path: '/dashboard/assessment',
        icon: getIcon('eva:file-text-fill'),
      },
      {
        title: 'attendance',
        path: '/dashboard/attendance',
        icon: getIcon('eva:checkmark-circle-fill'),
      },
      {
        title: 'timetable',
        path: '/dashboard/timetable',
        icon: getIcon('eva:calendar-fill'),
      },
      
      {
        title: 'profile',
        path: '/dashboard/profile',
        icon: getIcon('eva:person-fill'),
      }

    );
  } else if (userRole === 'student') {
    navConfig.push(
      {
        title: 'dashboard',
        path: '/dashboard/studentapp',
        icon: getIcon('eva:home-fill'),
      },
      {
        title: 'timetable',
        path: '/dashboard/studenttimetable',
        icon: getIcon('eva:calendar-fill'),
      },
      {
        title: 'profile',
        path: '/dashboard/profile',
        icon: getIcon('eva:person-fill'),
      }
    );
  }

  return navConfig;
};
