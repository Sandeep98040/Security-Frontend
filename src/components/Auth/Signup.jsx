import React, { useState } from 'react';
import { Grid, IconButton, InputAdornment, OutlinedInput, Box, Typography, Button } from '@mui/material';
import PasswordIcon from '@mui/icons-material/Password';
import sound from '../../assets/sound.wav';
import { MySnackbar } from '../MySnackbar';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MailLockIcon from '@mui/icons-material/MailLock';
import { useNavigate } from 'react-router-dom';
import { ResponsiveAppBarLandingPage } from '../AppBar/ResponsiveAppBarLandingPage';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { allLetter, isEmail } from '../../lib/input-validation';
import userServices from '../../services/userService';

const Signup = () => {
    const navigate = useNavigate();

    const [snack, setSnack] = useState({ type: '', message: '' });
    const [open, setOpen] = React.useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState({
        isLengthValid: false,
        isUppercaseValid: false,
        isLowercaseValid: false,
        isSpecialCharValid: false,
        isNumberValid: false,
    });

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const play = () => new Audio(sound).play();

    const handleSignup = (e) => {
        e.preventDefault();

        if (!validatePassword(newPassword).isLengthValid ||
            !validatePassword(newPassword).isLowercaseValid ||
            !validatePassword(newPassword).isUppercaseValid ||
            !validatePassword(newPassword).isNumberValid ||
            !validatePassword(newPassword).isSpecialCharValid) {
            play();
            setSnack({
                type: 'error',
                message: 'Please, follow password guidelines.',
            });
            setOpen(true);
            return;
        } else if (!allLetter(fullName)) {
            play();
            setSnack({
                type: 'error',
                message: 'Please, enter a valid name. Length must be greater than 5 and less than 25 characters.',
            });
            setOpen(true);
            return;
        } else if (!isEmail(email)) {
            play();
            setSnack({
                type: 'error',
                message: 'Please, enter a valid email.',
            });
            setOpen(true);
            return;
        } else if (newPassword !== confirmPassword) {
            play();
            setSnack({
                type: 'error',
                message: 'Password and confirm password must be the same.',
            });
            setOpen(true);
            return;
        } else {
            const newUser = {
                fullName: fullName,
                email: email,
                password: newPassword,
            };

            userServices.register(newUser)
                .then(res => {
                    play();
                    setSnack({ type: 'success', message: 'Signup successfully.' });
                    setOpen(true);

                    setFullName('');
                    setEmail('');
                    setNewPassword('');
                    setConfirmPassword('');

                    navigate('/login');
                })
                .catch(err => {
                    play();
                    setSnack({ type: 'error', message: err.response.data.error });
                    setOpen(true);
                });
        }
    };

    const validatePassword = (password) => {
        const isLengthValid = password.length >= 8;
        const isUppercaseValid = /[A-Z]/.test(password);
        const isLowercaseValid = /[a-z]/.test(password);
        const isNumberValid = /\d/.test(password);
        const isSpecialCharValid = /[!@#$%^&*()_+[\]{};':"<>?~]/.test(password);

        return { isLengthValid, isUppercaseValid, isLowercaseValid, isNumberValid, isSpecialCharValid };
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        const passwordValidations = validatePassword(password);
        setNewPassword(password);
        setIsPasswordValid(passwordValidations);
    };

    return (
        <Box sx={styles.pageContainer}>
            <ResponsiveAppBarLandingPage />
            <Box sx={styles.formContainer}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={styles.formBox}>
                            <Typography variant="h5" sx={styles.title}>
                                Create your account
                            </Typography>

                            <form onSubmit={handleSignup}>
                                <Box sx={styles.inputContainer}>
                                    <Typography sx={styles.inputLabel}>
                                        Full Name:
                                    </Typography>
                                    <OutlinedInput
                                        placeholder='Enter full name...'
                                        onChange={(e) => setFullName(e.target.value)}
                                        startAdornment={<InputAdornment position="start"><PersonIcon /></InputAdornment>}
                                        type="text"
                                        required
                                        fullWidth
                                        sx={styles.input}
                                    />
                                </Box>

                                <Box sx={styles.inputContainer}>
                                    <Typography sx={styles.inputLabel}>
                                        Email:
                                    </Typography>
                                    <OutlinedInput
                                        placeholder='Enter email...'
                                        onChange={(e) => setEmail(e.target.value)}
                                        startAdornment={<InputAdornment position="start"><MailLockIcon /></InputAdornment>}
                                        type="email"
                                        required
                                        fullWidth
                                        sx={styles.input}
                                    />
                                </Box>

                                <Box sx={styles.inputContainer}>
                                    <Typography sx={styles.inputLabel}>
                                        New Password:
                                    </Typography>
                                    <OutlinedInput
                                        placeholder='Enter new password...'
                                        onChange={handlePasswordChange}
                                        startAdornment={<InputAdornment position="start"><PasswordIcon /></InputAdornment>}
                                        type={isNewPasswordVisible ? 'text' : 'password'}
                                        endAdornment={
                                            <IconButton onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
                                                {isNewPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        }
                                        required
                                        fullWidth
                                        sx={styles.input}
                                    />
                                </Box>

                                <Box sx={styles.passwordStrength}>
                                    {validatePassword(newPassword).isLengthValid &&
                                    validatePassword(newPassword).isLowercaseValid &&
                                    validatePassword(newPassword).isUppercaseValid &&
                                    validatePassword(newPassword).isNumberValid &&
                                    validatePassword(newPassword).isSpecialCharValid ? (
                                        <Typography sx={styles.strongPassword}>Strong Password!</Typography>
                                    ) : (
                                        <Typography sx={styles.weakPassword}>Password Too Weak!</Typography>
                                    )}
                                </Box>

                                <Box sx={styles.inputContainer}>
                                    <Typography sx={styles.inputLabel}>
                                        Confirm Password:
                                    </Typography>
                                    <OutlinedInput
                                        placeholder='Enter password again...'
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        startAdornment={<InputAdornment position="start"><PasswordIcon /></InputAdornment>}
                                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                                        endAdornment={
                                            <IconButton onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                                {isConfirmPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        }
                                        required
                                        fullWidth
                                        sx={styles.input}
                                    />
                                </Box>

                                <Button type="submit" variant="contained" sx={styles.signupButton}>
                                    Signup
                                </Button>
                            </form>

                            <Typography sx={styles.loginRedirect}>
                                Already have an account?
                                <span onClick={() => navigate('/login')} style={styles.loginLink}> Login</span>
                            </Typography>

                            <MySnackbar open={open} handleClose={handleClose} type={snack.type} message={snack.message} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={styles.guidelinesBox}>
                            <Typography variant="h6" sx={styles.guidelinesTitle}>
                                Password Guidelines
                            </Typography>
                            <Box>
                                <Typography>
                                    <CheckIcon style={{ color: isPasswordValid.isLengthValid ? 'green' : 'red' }} /> Password must be at least 8 characters.
                                </Typography>
                                <Typography>
                                    <CheckIcon style={{ color: isPasswordValid.isUppercaseValid ? 'green' : 'red' }} /> Password must contain at least one uppercase letter.
                                </Typography>
                                <Typography>
                                    <CheckIcon style={{ color: isPasswordValid.isLowercaseValid ? 'green' : 'red' }} /> Password must contain at least one lowercase letter.
                                </Typography>
                                <Typography>
                                    <CheckIcon style={{ color: isPasswordValid.isNumberValid ? 'green' : 'red' }} /> Password must contain at least one number.
                                </Typography>
                                <Typography>
                                    <CheckIcon style={{ color: isPasswordValid.isSpecialCharValid ? 'green' : 'red' }} /> Password must contain at least one special character.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

const styles = {
    pageContainer: {
        bgcolor: '#E3F2FD',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    formContainer: {
        maxWidth: '1200px',
        width: '100%',
        padding: 4,
    },
    formBox: {
        padding: '30px',
        borderRadius: '24px',
        bgcolor: '#ffffff',
        boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'translateY(-10px)',
        },
    },
    guidelinesBox: {
        padding: '30px',
        borderRadius: '24px',
        bgcolor: '#f9f9f9',
        boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
    },
    title: {
        marginBottom: '25px',
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    inputLabel: {
        color: '#555',
        marginBottom: '5px',
        textAlign: 'left',
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
    },
    passwordStrength: {
        marginBottom: '15px',
        textAlign: 'left',
    },
    strongPassword: {
        color: 'green',
        fontWeight: 'bold',
    },
    weakPassword: {
        color: 'orange',
        fontWeight: 'bold',
    },
    signupButton: {
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderRadius: '24px',
        padding: '12px 0',
        width: '100%',
        marginTop: '20px',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#ff6f00',
        },
    },
    loginRedirect: {
        marginTop: '20px',
        textAlign: 'center',
    },
    loginLink: {
        cursor: 'pointer',
        color: '#ff6f00',
        textDecoration: 'underline',
        marginLeft: '5px',
    },
    guidelinesTitle: {
        marginBottom: '20px',
        fontWeight: 'bold',
        color: '#333',
    },
};

export default Signup;
