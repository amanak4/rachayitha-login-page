import React, { useState } from 'react';
import './login.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import moment from 'moment'; // Ensure moment is imported
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material'; // Import Material-UI components
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from "../assets/rachayitha_logo_500.svg";
import img from "../assets/loginbg10.jpg";
const Login = () => {
    const { control, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm();
    const [page, setPage] = useState(0);
    const [showVerificationCard, setShowVerificationCard] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handlePasswordChange = (password) => {
        const confirmPassword = getValues('confirmPassword');
        setPasswordMatch(password === confirmPassword);
    };

    const handleConfirmPasswordChange = (confirmPassword) => {
        const password = getValues('password');
        setPasswordMatch(confirmPassword === password);
    };



const onSubmitLogin = async (data) => {
    try {
        const response = await axios.post('https://api.rachayitha.com/api/v1/login/', {
            user: {
                email: data.email,
                password: data.password
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': undefined
            }
        });
        console.log(response);
        if (response.data.user.is_active) {
            toast.success(`Login successful: ${response.data.user.username}`);
            window.location.replace("/");
        } else {
            toast.error(`Login failed: ${response.data.msg}`);
        }
    } catch (error) {
        console.log(error);
        if (error.response && error.response.data && error.response.data.user.msg) {
            toast.error(`Login failed: ${error.response.data.user.msg}`);
        }
        else if(error.response && error.response.data && error.response.data.user.error){
            toast.error(`Login failed: ${error.response.data.user.error}`);
        }
         else {
            toast.error('Login failed: An unexpected error occurred.');
        }
    }
};

const onSubmitSignup = async (data) => {
    try {
        const response = await axios.post('https://api.rachayitha.com/api/v1/register/', {
            user: {
                username: data.username,
                email: data.email,
                password: data.password,
                bio: data.bio,
                full_name: data.fullName,
                birth_date: moment(data.birthDate).format('YYYY-MM-DD'),
                gender: data.gender
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': undefined
            }
        });

        console.log(response);
        if (!response.data.user.is_active) {
            setShowVerificationCard(true);
        } else {
            toast.error(`Signup failed: ${response.data.error}`);
        }
    } catch (error) {
        console.log(error);
        if (error.response && error.response.data && error.response.data.errors) {
            const errors = error.response.data.errors;
            const firstErrorKey = Object.keys(errors)[0];
            const firstErrorMessage = errors[firstErrorKey][0];
            toast.error(`Signup failed: ${firstErrorMessage}`);
        } else {
            toast.error('Signup failed: An unexpected error occurred.');
        }
    }
};


    const resendEmail = async () => {
        try {
            const response = await axios.post('https://api.rachayitha.com/api/v1/resend-verification/', {
                email: getValues('email')
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': undefined
                }
            });
            toast.success('Verification email resent successfully.');
        } catch (error) {
            toast.error(`Error resending verification email: ${ error.response.data.user.msg}`);
        }
    };

    const checkVerificationStatus = async () => {
        try {
            const response = await axios.get('https://api.rachayitha.com/api/v1/check-verification/', {
                params: { email: getValues('email') },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': undefined
                }
            });
            if (response.data.is_verified) {
                toast.success('Email verified successfully.');
                window.location.replace("/");
            } else {
                toast.info('Email not verified yet.');
            }
        } catch (error) {
            toast.error(`Error checking verification status: ${error.response.data.user.msg}`);
        }
    };

    const animationsignIn = () => {
        document.querySelector('.wrapper').classList.add('animate-signIn');
        document.querySelector('.wrapper').classList.remove('animate-signUp');
        document.querySelector('.wrapper').classList.remove('animate-forgotPassword');
    };

    const animationsignUp = () => {
        document.querySelector('.wrapper').classList.add('animate-signUp');
        document.querySelector('.wrapper').classList.remove('animate-signIn');
        document.querySelector('.wrapper').classList.remove('animate-forgotPassword');
    };

    const animationForgotPassword = () => {
        document.querySelector('.wrapper').classList.add('animate-forgotPassword');
        document.querySelector('.wrapper').classList.remove('animate-signIn');
        document.querySelector('.wrapper').classList.remove('animate-signUp');
    };

    return (
        <div className="login-page">
            <img src={img} alt="logo" className="left-side"/>
        <div className='right-side'>
            <div className="wrapper">
                {showVerificationCard && (
                    <>
                        <div className="blurred-background"></div>
                        <Card className="verification-card">
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    <img src={logo}   
                                    
                                    alt="logo" className="logo"/>
                                </Typography>
                                <Typography variant="body1" 
                                
                                gutterBottom

                                sx={{ textAlign: 'center' ,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',}}

                                paragraph>
                                    Verify your email to unlock the full experience.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Welcome aboard,<b style={{color: '#1104a1ab'}}> {getValues('fullName')}!</b> Your Rachayitha journey starts with verifying your email. Just click the link in the email we sent to <b style={{color: '#1104a1ab'}}>{getValues('email')}</b> and you'll be all set! Thanks for joining us!
                                </Typography>
                                <Box mt={4} display="flex" justifyContent="space-around">
                                    <Button variant="contained" sx={{ width: 'auto', fontSize: '0.4rem' ,}} onClick={resendEmail} className="btn">Resend Email</Button>
                                    <Button variant="contained" sx={{ width: 'auto', fontSize: '0.4rem' ,}} onClick={checkVerificationStatus} className="btn">Check Verification Status</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </>
                )}
                <div className="form-wrapper sign-up">
                    <form onSubmit={handleSubmit(onSubmitSignup)}>
                        <Typography variant="h4" component="h1" sx={{ margin: '0rem', textDecoration:'underline' }} align="center" fontWeight="bold" color="#1104a1ab"  fontSize="2rem" >Sign Up</Typography>
                        {page === 0 && (
                            <>
                                <Controller
                                    name="username"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField {...field} label="Username" variant="outlined"  sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    height: '1.5rem',
                                                    marginX:'0.8rem',
                                                    borderBottom: '2px solid #1976d2',
                                                    borderRadius: '0px',
                                                },
                                            }} fullWidth margin="normal" required />
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField {...field} label="Email Address" variant="outlined"  sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    height: '1.5rem',
                                                    marginX:'0.8rem',
                                                    borderBottom: '2px solid #1976d2',
                                                    borderRadius: '0px',
                                                },
                                            }} fullWidth margin="normal" required />
                                    )}
                                />
                               <Controller
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type={showPassword ? 'text' : 'password'}
                                            label="Password"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            required
                                            onChange={(e) => {
                                                handlePasswordChange(e.target.value);
                                                field.onChange(e);
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    height: '1.5rem',
                                                    marginX: '0.8rem',
                                                    borderBottom: '2px solid #1976d2',
                                                    borderRadius: '0px',
                                                },
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            label="Confirm Password"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            required
                                            onChange={(e) => {
                                                handleConfirmPasswordChange(e.target.value);
                                                field.onChange(e);
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton
                                                        aria-label="toggle confirm password visibility"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    height: '1.5rem',
                                                    marginX: '0.8rem',
                                                    borderBottom: '2px solid #1976d2',
                                                    borderRadius: '0px',
                                                },
                                            }}
                                        />
                                    )}
                                />
                                {!passwordMatch && <Typography color="error">Passwords do not match</Typography>}
                                
                                <Button variant="contained" type="button" onClick={() => setPage(1)} style={{ backgroundColor: '#1104a1ab', color: '#fff',
  borderRadius: '8px',width: '80%', fontWeight: 'bold',
  margin: '0.5rem 0',
  position: 'relative',
  top: '0',
  left: '4vw'}}>Next</Button>
                            </>
                        )}
                        {page === 1 && (
                            <>
                                <Controller
                                    name="fullName"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField {...field} label="Full Name" variant="outlined" fullWidth margin="normal" required   sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    height: '1.5rem',
                                                    marginX:'0.8rem',
                                                    borderBottom: '2px solid #1976d2',
                                                    borderRadius: '0px',
                                                },
                                            }} />
                                    )}
                                />
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="date"
                                            label="Birth Date"
                                            variant="outlined"
                                            fullWidth
                                               margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            required   sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    height: '1.5rem',
                                                    marginX:'0.8rem',
                                                    borderBottom: '2px solid #1976d2',
                                                    borderRadius: '0px',
                                                },
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    name="bio"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField {...field} label="Bio(optional)" variant="outlined" fullWidth margin="normal"  sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    height: '1.5rem',
                                                    marginX:'0.8rem',
                                                    borderBottom: '2px solid #1976d2',
                                                    borderRadius: '0px',
                                                },
                                            }} />
                                    )}
                                />
                                <Controller
                                    name="gender"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormControl component="fieldset" fullWidth margin="normal"  sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    height: '1.5rem',
                                                    marginX:'0.8rem',
                                                    borderBottom: '2px solid #1976d2',
                                                    borderRadius: '0px',
                                                },
                                            }}>
  <FormLabel component="legend">Gender</FormLabel>
  <RadioGroup
    row
    {...field}
    sx={{
      '& .MuiFormControlLabel-root': {
        marginX: '0.8rem',
        // marginBottom: '1rem',
      },
      '& .MuiRadio-root': {
        padding: '4px',
      },
    }}
  >
    <FormControlLabel
      value="male"
      control={<Radio />}
      label="Male"
      sx={{
        '& .MuiFormControlLabel-label': {
          paddingBottom: '4px',
        },
      }}
    />
    <FormControlLabel
      value="female"
      control={<Radio />}
      label="Female"
      sx={{
        '& .MuiFormControlLabel-label': {
          
          paddingBottom: '4px',
        },
      }}
    />
    <FormControlLabel
      value="other"
      control={<Radio />}
      label="Other"
      sx={{
        '& .MuiFormControlLabel-label': {
          paddingBottom: '4px',
        },
      }}
    />
  </RadioGroup>
</FormControl>

                                    )}
                                />
                                <Button variant="contained" type="button"  style={{ backgroundColor: '#1104a1ab', color: '#fff',
  borderRadius: '8px',width: '80%', fontWeight: 'bold',
  margin: '0',
  position: 'relative',
  top: '0',
  left: '4vw'}} onClick={() => setPage(0)}>Back</Button>
                                <Button
  type="submit"
  variant="contained"
  style={{ backgroundColor: '#1104a1ab', color: '#fff',
  borderRadius: '8px',width: '80%', fontWeight: 'bold',
  margin: '0.5rem 0',
  position: 'relative',
  top: '0',
  left: '4vw'}}
  disabled={!passwordMatch}


>
  Sign Up
</Button>

                            </>
                        )}
                        <div className="sign-link">
                            <p>Already have an account? <a href="#" className="signIn-link" onClick={animationsignUp}>Sign In</a></p>
                        </div>
                    </form>
                </div>
                <div className="form-wrapper sign-in">
                    <form onSubmit={handleSubmit(onSubmitLogin)}>
                        <Typography variant="h4" component="h1" className="title"  sx={{ marginBottom: '1rem', textDecoration:'underline' }} align="center" fontWeight="bold" color="#1104a1ab"  fontSize="2rem">Login</Typography>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField {...field} label="Email Address" variant="outlined" fullWidth margin="normal" required  sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    height: '1.5rem',
                                                    marginX:'0.8rem',
                                                    borderBottom: '2px solid #1976d2',
                                                    borderRadius: '0px',
                                                },
                                            }}/>
                            )}
                        />
                         <Controller
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type={showPassword ? 'text' : 'password'}
                                            label="Password"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            required
                                            onChange={(e) => {
                                                handlePasswordChange(e.target.value);
                                                field.onChange(e);
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: 'none',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '8px',
                                                    height: '1.5rem',
                                                    marginX: '0.8rem',
                                                    marginBottom: '1rem',
                                                    borderBottom: '2px solid #1976d2',
                                                    borderRadius: '0px',
                                                },
                                            }}
                                        />
                                    )}
                                />
                        <div className="forgot-pass">
                            <a href="#" onClick={animationForgotPassword}  className='underline'>Forgot Password?</a>
                        </div>
                        <Button variant="contained" type="submit" style={{ backgroundColor: '#1104a1ab', color: '#fff',
  borderRadius: '8px',width: '80%', fontWeight: 'bold',
  margin: '0.5rem 0',
  position: 'relative',
  top: '0',
  left: '4vw'}}>Login</Button>
                        <div className="sign-link">
                            <p>Don't have an account? <a href="#" className="signUp-link" onClick={animationsignIn}>Sign Up</a></p>
                        </div>
                    </form>
                </div>
                <div className="form-wrapper forgot-password">
                    <form>
                        <Typography variant="h4" sx={{ marginBottom: '1rem', textDecoration:'underline' }} align="center" fontWeight="bold" color="#1104a1ab"  fontSize="2rem">Forgot Password</Typography>
                        <p>Try eating Almonds!!</p>
                        <Controller
                            name="forgotEmail"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField {...field} label="Email" variant="outlined" fullWidth margin="normal" required />
                            )}
                        />
                        <Button variant="contained" type="submit"  style={{ backgroundColor: '#1104a1ab', color: '#fff',
  borderRadius: '8px',width: '80%', fontWeight: 'bold',
  margin: '0.5rem 0',
  position: 'relative',
  top: '0',
  left: '4vw'}}>Reset Password</Button>
                        <div className="sign-link">
                            <p>Did it strike!? <a href="#" className="signIn-link" onClick={animationsignUp}>Sign In</a></p>
                        </div>
                    </form>
                </div>
                </div>
            </div>


        </div>
    );
};

export default Login;
