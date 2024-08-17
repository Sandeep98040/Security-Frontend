import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, IconButton, InputAdornment, OutlinedInput, Snackbar, Button } from '@mui/material';
import PasswordIcon from '@mui/icons-material/Password';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import userServices from '../../services/userService';
import { MySnackbar } from '../MySnackbar';
import { Loading } from '../Loading';
import sanitizeInput from '../../utils/sanitizationInput';
import sound from '../../assets/sound.wav';

export const ChangePassword = () => {
    const [snack, setSnack] = useState({ type: '', message: '' });
    const [open, setOpen] = useState(false);
    const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const navigate = useNavigate();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const play = () => new Audio(sound).play();

    const handleChangePassword = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            play();
            setSnack({
                type: 'error',
                message: 'Password and confirm password must be same',
            });
            setOpen(true);
            return;
        }

        const sanitizedOldPassword = sanitizeInput(oldPassword);
        const sanitizedNewPassword = sanitizeInput(newPassword);

        const passwords = {
            oldPassword: sanitizedOldPassword,
            newPassword: sanitizedNewPassword,
        };

        setShowLoading(true);

        userServices.changePassword(passwords)
            .then(res => {
                setShowLoading(false);
                play();
                setSnack({
                    type: 'success',
                    message: 'Password changed successfully',
                });
                setOpen(true);

                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');

                navigate('/login');
            })
            .catch(err => {
                setShowLoading(false);
                play();
                setSnack({
                    type: 'error',
                    message: `Error: ${err.response.data.error}`,
                });
                setOpen(true);
            });
    };

    return (
        <div style={{ backgroundColor: '#f0f4f8', color: 'black', minHeight: '100vh', padding: '20px' }}>
            {showLoading ? (
                <Loading />
            ) : (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="w-full max-w-[400px] mx-auto" align="center">
                        <div className="mx-auto pt-10">
                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    padding: '30px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                    margin: 'auto',
                                    maxWidth: '450px',
                                }}
                                className="rounded-lg mt-3 text-black p-5"
                                align="center"
                            >
                                <div className="text-3xl font-bold text-gray-800">
                                    Change Password
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    Note: Password will expire after 90 days
                                </div>
                                <div className="mt-5">
                                    <form onSubmit={handleChangePassword}>
                                        <div className="mt-3 mb-2 text-left text-gray-600">
                                            Old Password:
                                        </div>
                                        <OutlinedInput
                                            placeholder="Enter old password here..."
                                            className="input input-bordered w-full"
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <PasswordIcon />
                                                </InputAdornment>
                                            }
                                            type={isOldPasswordVisible ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setIsOldPasswordVisible(!isOldPasswordVisible)}>
                                                        {isOldPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            variant="outlined"
                                            required
                                            style={{ backgroundColor: '#f7f9fc', borderRadius: '8px' }}
                                        />
                                        <div className="mt-3 mb-2 text-left text-gray-600">
                                            New Password:
                                        </div>
                                        <OutlinedInput
                                            placeholder="Enter new password here..."
                                            className="input input-bordered w-full"
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <PasswordIcon />
                                                </InputAdornment>
                                            }
                                            type={isNewPasswordVisible ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
                                                        {isNewPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            variant="outlined"
                                            required
                                            style={{ backgroundColor: '#f7f9fc', borderRadius: '8px' }}
                                        />
                                        <div className="mt-3 mb-2 text-left text-gray-600">
                                            Confirm Password:
                                        </div>
                                        <OutlinedInput
                                            placeholder="Confirm new password here..."
                                            className="input input-bordered w-full"
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <PasswordIcon />
                                                </InputAdornment>
                                            }
                                            type={isConfirmPasswordVisible ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                                        {isConfirmPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            variant="outlined"
                                            required
                                            style={{ backgroundColor: '#f7f9fc', borderRadius: '8px' }}
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className="w-full font-bold mt-8 mb-8"
                                            style={{
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                padding: '10px 0',
                                                fontSize: '16px',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            Change Password
                                        </Button>
                                    </form>
                                    <MySnackbar open={open} handleClose={handleClose} type={snack.type} message={snack.message} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
