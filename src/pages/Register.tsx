import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {IconButton, InputAdornment, Stack, ThemeProvider} from '@mui/material';
import {HowToReg, Visibility, VisibilityOff} from "@mui/icons-material";
import axios from "axios";
import {styled} from '@mui/material/styles';
import {isLoggedIn, login, uploadUserImage} from "../services/UserServices";
import {theme} from "../themes/theme";

export function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => setShowPassword(showPassword => !showPassword);

    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const handleToggleRetypePassword = () => setShowRetypePassword(showRetypePassword => !showRetypePassword);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [dbError, setDbError]=useState("");
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState("/broken-image.jpg")

    const Input = styled('input')({
        display: 'none',
    });
    useEffect( () => {
        if (isLoggedIn()) {
            window.open("/logout-existing", "_self");
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(errorChecks()){
            const signUpResponse = await signUp(firstName, lastName, email, password);

            if (signUpResponse !== 201 ) {

                setDbError("Email already in use");
                return;
            }
            const loginResponse = await login(email, password)
            if (loginResponse !== 200) {
                setDbError("An error occurred")

                return
            }

            if (image!==null){

                const imageResponse = await uploadUserImage(image);
                if (imageResponse!==201 && imageResponse!== 200){
                    setDbError("Error Uploading Image")

                    return
                }
            }

            window.open("/auctions", "_self");
        }else{
            setDbError("Please check all required fields")
        }
    };

    const signUp = async (firstName: string, lastName: string, email: string, password: string) => {
        return await axios.post(`http://localhost:4941/api/v1/users/register`, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }).then((response) => {
                return response.status;
            })
            .catch((error) => {
                return error.response.status;
            });
    }

    const errorChecks = () => {
        const emailCheck = () => {
            if (email == "") {
                setEmailError("Please enter an email");

            } else if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9])+$/.test(email)) {
                setEmailError("Invalid email");
            } else {
                setEmailError("")
                return true;
            }
            return false;
        }
        const pwCheck = () => {
            if (password == "") {
                setPasswordError("Please enter a password");
            } else if (password.length < 6) {
                setPasswordError("Password must be at least 6 characters long");
            } else {
                if (password == retypePassword){
                    setPasswordError("");
                    return true;
                }
                setPasswordError("Passwords do not match");
            }
            return false;
        }

        const firstNameCheck = () => {
            if (firstName.replace(/\s+/g,"").length<1) {
                setFirstNameError("Please enter a name")
            } else {
                return true;
            }
            return false;
        }

        const lastNameCheck = () => {
            if (lastName.replace(/\s+/g,"").length<1) {
                setLastNameError("Please enter a name")
            } else {
                return true;
            }
            return false;
        }
        if (!emailCheck() || !pwCheck() || !firstNameCheck() || !lastNameCheck()){
            return false
        }
        return true
    }

    const fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

    const selectImage = async (e: any) => {
        const imageFile = e.target.files[0]
        setImage(imageFile);
        console.log(imageFile)
        if (imageFile == undefined || !fileTypes.includes(imageFile.type)) {
            setDbError("Invalid image")
            return
        }
        const imageSrc = URL.createObjectURL(imageFile);

        setPreview(imageSrc)
    }
    if(!isLoggedIn()){
        return(
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary' }}>
                            <HowToReg/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Register
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <Typography>{dbError}</Typography>
                                <Stack direction="row"  alignItems="center" spacing={2}>
                                    <Avatar sx={{display: 'flex', width:200, height:200}} src={preview} variant="square"></Avatar>
                                    <label htmlFor="contained-button-file">
                                        <Input accept=".jpeg,.jpg,.png,.gif" id="contained-button-file" onChange={async (e) => await selectImage(e)} type="file" />
                                        <Button variant="contained" component="span">
                                            Upload
                                        </Button>
                                    </label>
                                </Stack>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="First name"
                                name="firstName"
                                value={firstName}
                                autoFocus
                                helperText={firstNameError}
                                onChange={(event) => {
                                    setFirstName(event.target.value);
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="lastName"
                                label="Last name"
                                name="lastName"
                                value={lastName}
                                helperText={lastNameError}
                                autoFocus
                                onChange={(event) => {
                                    setLastName(event.target.value);
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                value={email}
                                helperText={emailError}
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
                                helperText={passwordError}
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
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

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="Retype password"
                                value={retypePassword}
                                label="Retype password"
                                type={showRetypePassword ? 'text' : 'password'}
                                id="Retype password"
                                autoComplete="current-password"
                                onChange={(event) => {
                                    setRetypePassword(event.target.value);
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleToggleRetypePassword}
                                                edge="end"
                                            >
                                                {showRetypePassword ? <Visibility /> : <VisibilityOff />}
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
                                Sign Up
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        {"Already have an account? Login"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>)
    }
    return (
        <div></div>
    );
}