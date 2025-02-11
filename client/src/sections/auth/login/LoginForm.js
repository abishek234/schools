import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

const AUTO_LOGOUT_TIME = 1000 * 60 * 1;

export default function LoginForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('email');
                localStorage.removeItem('role');
                navigate('/login'); // Redirect to login on logout
            }, AUTO_LOGOUT_TIME);
        };

        // Set up event listeners for user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);

        // Start timer on component mount
        resetTimer();

        // Clean up event listeners and timeout on unmount
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keypress', resetTimer);
        };
    }, [navigate]);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const defaultValues = {
        email: '',
        password: '',
        remember: true,
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = async (data) => {
        setError('');
        try {
            const response = await axios.post('http://localhost:9000/api/auth/login', data);
            if (response.status === 200 || response.status === 201) {
                const userData = response.data.responseData; // Access the responseData object
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', userData.id); 
                localStorage.setItem('userEmail', userData.email);
                localStorage.setItem('userRole', userData.role);
                if (userData.role === 'admin') {
                    localStorage.setItem('userschool', userData.schoolname);

                } else if (userData.role === 'teacher') {
                    localStorage.setItem('userschool', userData.schoolname);

                    localStorage.setItem('userhandlingclass', userData.handlingclass);
                    localStorage.setItem('userdesignation', userData.designation);

                } else if (userData.role === 'student') {
                    localStorage.setItem('userclassid', userData.classid);

                }
                console.log(response.data.id);
                toast.success('Logged in successfully');
                if (userData.role === 'superAdmin') {
                    navigate('/dashboard/app', { replace: true });
                }
                else if (userData.role === 'admin') {
                    navigate('/dashboard/adminapp', { replace: true });
                }
                else if (userData.role === 'teacher') {
                    navigate('/dashboard/teacherapp', { replace: true });
                }
                else if (userData.role === 'student') {
                    navigate('/dashboard/app', { replace: true });
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Invalid email or password');

        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFTextField name="email" label="Email address" />
                <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            <br />
            <br />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Login
            </LoadingButton>
        </FormProvider>
    );
}
