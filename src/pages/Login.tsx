import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {IconButton, InputAdornment} from '@mui/material';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {isLoggedIn, login} from "../services/UserServices";


export function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => setShowPassword(showPassword => !showPassword);
    const [loginError, setLoginError] = useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect( () => {
        if (isLoggedIn()) {
            window.open("/logout-existing", "_self");
        }
    }, []);


    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(errorCheck()){
            const loginResponse = await login(email, password);
            if (loginResponse == 200){
                window.open("/auctions", "_self");
            }
            else{
                setLoginError("Incorrect email/password")
            }
        }

    };

    const errorCheck = () =>{
        if(email==""){
            setEmailError("Please enter an email")
            return false
        }
        if(password==""){
            setPasswordError("Please enter a password");
            return false
        }
        setPasswordError("")
        setEmailError("")
        return true
        }
    if (!isLoggedIn()){
        return (        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#707496' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Typography variant="caption">{loginError}</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={email}
                        helperText ={emailError}
                        autoComplete="email"
                        autoFocus
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        value={password}
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        helperText ={passwordError}
                        id="password"
                        autoComplete="current-password"
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleTogglePassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )}}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>)
    }
    return (
    <div></div>
    );
}