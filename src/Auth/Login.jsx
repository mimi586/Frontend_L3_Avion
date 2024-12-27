import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Swal from 'sweetalert2';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [capsLockActive, setCapsLockActive] = useState(false);

    useEffect(() => {
        const handleKeyUp = (e) => {
            setCapsLockActive(e.getModifierState('CapsLock'));
        };

        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const validatePassword = (password) => {
        if (!password) {
            return '';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
            return 'Password must contain at least one digit, one lowercase and one uppercase letter';
        } else {
            return '';
        }
    };

    const handleChangePassword = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordError(validatePassword(newPassword));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordError) {
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email: email, Password: password }),
            });
    
            console.log('Response Status:', response.status);
    
            if (response.ok) {
                const data = await response.json();
    
                // Log the entire data object to ensure it contains the expected fields
                console.log('Login Response Data:', data);
    
                const { userId, token, role, email: userEmail } = data;
    
                // Log each extracted value to verify correctness
                console.log('Extracted Email:', userEmail);
                console.log('Extracted UserId:', userId);
                console.log('Extracted Token:', token);
                console.log('Extracted Role:', role);
    
                // Store the user information in local storage
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('userRole', role);
                localStorage.setItem('Email', userEmail); // Use email from the response
    
                navigate('/Dashboard');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to login. Please check your credentials and try again.',
                });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to login. Please try again later.',
            });
        }
    };
    
    
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={6} style={{ padding: 20, display: 'flex', marginTop: '30%', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" style={{ marginTop: '10px' }} className='text-center' variant="h5">
                    Sign In
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        name="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Box sx={{ position: 'relative' }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            name="Password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handleChangePassword}
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                        {password && passwordError && (
                            <ErrorOutlineIcon style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} color="error" />
                        )}
                    </Box>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" checked={showPassword} onChange={togglePassword} />}
                        label="Show Password"
                    />
                    {capsLockActive && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ErrorOutlineIcon color="error" sx={{ marginRight: 1 }} />
                            <Typography variant="body2" color="error">
                                Caps Lock is On
                            </Typography>
                        </Box>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, textTransform: "none"}}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item className='text-center' sx={{ marginLeft: '1%' }}>
                            <Typography sx={{ textDecoration: 'none' }}>
                                {"Don't have an account? Sign Up"} <span style={{ color: 'blue', cursor: "pointer" }} onClick={() => navigate("/Count")}>{"Here"}</span>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default Login;
