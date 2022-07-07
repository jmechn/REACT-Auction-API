import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";

export const Footer = () => {
    return(
        <Box sx={{bgcolor: 'background.paper', p: 6}} component="footer">
            <Typography
                variant="subtitle1"
                align="center"
                color="text.secondary"
                component="p"
            >
                May 2022: Jaymee Chen's Web Client for an Auction API.
            </Typography>
        </Box>
    )
}