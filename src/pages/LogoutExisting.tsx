import * as React from 'react';
import {useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import {isLoggedIn, logout} from "../services/UserServices";

export function LogoutExisting() {

    useEffect( () => {
        if (!isLoggedIn()) {
            window.open("/login", "_self");
        }
    }, []);

    if(isLoggedIn()){
        const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!isLoggedIn()){
                window.open("/auctions", "_self");;
            }
            const logoutResponse = await logout();
            if (logoutResponse ==200){
                window.open("/auctions", "_self");;;
            }
        };
        return(
            <Container component="main" maxWidth="xs">
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
                        Logout
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Typography>You are already logged in. Would you like to logout?</Typography>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Container>
        )
    }
    else{
        window.open("/login", "_self")
    }

    return (
    <div></div>
    )
}