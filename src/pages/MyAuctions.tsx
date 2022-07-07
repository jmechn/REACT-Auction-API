import * as React from 'react';
import {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import axios from "axios";
import {Listing} from "../components/Listing";
import {InterfaceAuctionListing} from "../Interfaces/InterfaceAuctionListing";
import {InterfaceCategory} from "../Interfaces/InterfaceCategory";
import {getUserId, isLoggedIn} from "../services/UserServices";
import {fetchAuctions} from "../services/AuctionServices";

const theme = createTheme();
export const MyAuctions = () => {

    const [auctions, setAuctions] = useState<InterfaceAuctionListing[] | []>([])
    const [bidAuctions, setBidAuctions] =useState<InterfaceAuctionListing[] | []>([])
    const [categories, setCategories] = useState<InterfaceCategory[] | []>([])


    useEffect(() => {
        if(!isLoggedIn()){
            window.open("/login", "_self")
        }else{
            const getAuction = async () => {
                const response = await axios.get(`http://localhost:4941/api/v1/auctions`);
                setAuctions(response.data.auctions);
                let bidParams = {
                    bidderId: userId,
                };
                const bidResponse = await fetchAuctions(bidParams);
                setBidAuctions(bidResponse.data.auctions);
            }
            const getCategories = async () => {
                const response = await axios.get(`http://localhost:4941/api/v1/auctions/categories`);
                if (response.status !== 200) return [];
                setCategories(response.data);

            }

            getAuction();
            getCategories();
        }

    }, []);
    const userId = getUserId();
    let fetchSeller:InterfaceAuctionListing[] = auctions.filter(auc => auc.sellerId === userId);

    if(isLoggedIn()){
        return (
            <ThemeProvider theme={theme}>
                <Container sx={{ py: 8 }} maxWidth="md">
                        <Box sx={{ margin: "auto", pt:4 }}gridColumn="span 12">
                            <Typography variant="h5">YOUR AUCTIONS</Typography>
                        </Box>
                </Container>
                <Container maxWidth="xl">
                    <Grid container justifyContent="center" spacing={fetchSeller.length > 0? 4: 0 }>
                        {fetchSeller.length > 0? (
                            fetchSeller.map((auction: InterfaceAuctionListing) => {
                                return (
                                    <Grid key={auction.auctionId} item xs={12} md={6} lg={4} xl={3}  justifyContent='center'>
                                        <Listing id = {auction.auctionId}/>
                                    </Grid>
                                )

                            })
                        ) : <Typography align="center" variant="subtitle2">None</Typography>}
                    </Grid>
                </Container>
                    <Container sx={{ py: 8 }} maxWidth="md">
                        <Box sx={{ margin: "auto", pt:4}}gridColumn="span 12">
                            <Typography variant="h5">YOUR BIDDED AUCTIONS</Typography>
                        </Box>
                    </Container>
                    <Container maxWidth="xl">
                        <Grid container spacing={fetchSeller.length > 0? 4: 0} justifyContent="center">
                            {bidAuctions.length > 0? (
                                bidAuctions.map((auction: InterfaceAuctionListing) => {
                                    return (
                                        <Grid key={auction.auctionId} item xs={12} md={6} lg={4} xl={3} display='flex' justifyContent='center'>
                                            <Listing id = {auction.auctionId}/>
                                        </Grid>
                                    )
                                })
                            ) : <Typography align="center" variant="subtitle2">None</Typography>}

                        </Grid>
                    </Container>
            </ThemeProvider>
        );
    }
    return(<div></div>)
}

