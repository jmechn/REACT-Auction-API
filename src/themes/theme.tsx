import {createTheme} from '@mui/material/styles';
import "@fontsource/lato";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#393d48',
        },
        secondary: {
            main: '#b0bec5',
        },
        error: {
            main: '#bd4444',
        },
        success: {
            main: '#5ada65',
        },
    },
    typography: {
        fontFamily: 'Lato',
        h6: {
            fontFamily: 'Lato',
        },
    },
});