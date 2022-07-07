import * as React from 'react';
import {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {
    Autocomplete,
    FormControl,
    InputLabel,
    Pagination,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {Listing} from "../components/Listing";
import {InterfaceAuctionListing} from "../Interfaces/InterfaceAuctionListing";
import {InterfaceCategory} from "../Interfaces/InterfaceCategory";
import {InterfaceSort} from "../Interfaces/InterfaceSort";


const theme = createTheme();

export const Auctions = () => {

    const [auctions, setAuctions] = useState<InterfaceAuctionListing[] | []>([])
    const [categories, setCategories] = useState<InterfaceCategory[] | []>([])
    const [currentPage, setCurrentPage] = useState(1);
    const [auctionsPerPage, setPostsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<InterfaceCategory[] | []>([])
    const [button, setButton] = useState("ANY");
    const [sortBy, setSortBy] = useState("CLOSING_SOON");

    const sorts: InterfaceSort[] = [
        {desc: "Title Ascending", value: "ALPHABETICAL_ASC"},
        {desc: "Title Descending", value: "ALPHABETICAL_DESC"},
        {desc: "Highest Bid", value: "BIDS_DESC"},
        {desc: "Lowest Bid", value: "BIDS_ASC"},
        {desc: "Closing Soon", value: "CLOSING_SOON"},
        {desc: "Closing Last", value: "CLOSING_LAST"},
        {desc: "Highest Reserve", value: "RESERVE_DESC"},
        {desc: "Lowest Reserve", value: "RESERVE_ASC"}];


    useEffect(() => {
        const getAuction = async () => {
            const response = await axios.get(`http://localhost:4941/api/v1/auctions/`);
            setAuctions(response.data.auctions);
        }
        const getCategories = async () => {
            const response = await axios.get(`http://localhost:4941/api/v1/auctions/categories`);
            if (response.status !== 200) return [];
            setCategories(response.data);

        }
        getAuction();
        getCategories();

    }, []);

    // search
    useEffect( () => {
        const searchAuction = async (searchTerm:string) => {

        const response = await axios.get(`http://localhost:4941/api/v1/auctions?sortBy=${sortBy}&status=${button}&q=${searchTerm}${filters.map((filter) => `&categoryIds=${filter.categoryId}`)}`);
        setAuctions(response.data.auctions);
    }
        searchAuction(searchTerm);
    }, [searchTerm, filters, button, sortBy]);

    // Pagination constants
    const indexOfLastPost = currentPage * auctionsPerPage;
    const indexOfFirstPost = indexOfLastPost - auctionsPerPage;
    const currentPosts = auctions.slice(indexOfFirstPost, indexOfLastPost);

    const handlePaginate = (event: React.ChangeEvent<unknown>, pageNum: number) => {
        setCurrentPage(pageNum);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container sx={{ py: 8 }} maxWidth="md">
                <Box sx={{
                    width: 1
                }}>
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                        <Box gridColumn="span 12">
                            {/*Search bar*/}
                            <FormControl fullWidth >
                                <TextField onChange={ (event) =>
                                {setSearchTerm(event.target.value.toLowerCase());}} label="Search" variant="filled"/>
                            </FormControl>
                        </Box>
                        <Box gridColumn="span 8">
                            {/* Category filter */}
                            <Autocomplete
                                multiple
                                id="tags-standard"
                                onChange = {(event:any, newValue: any) =>setFilters([...newValue])}
                                options={categories}
                                noOptionsText = "No categories"
                                getOptionLabel={(categories) => categories.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Filter"
                                        placeholder=" Category"
                                    />
                                )}
                            />
                        </Box>
                        <Box gridColumn="span 4">
                            {/* Sort by select*/}
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                <InputLabel id="demo-simple-select-standard-label">Sort by</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    defaultValue ="Closing Soon"
                                    value={sortBy}
                                    onChange={(event:any) =>setSortBy(event.target.value)}
                                    label="sort-by"
                                >
                                    {sorts.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.desc}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{margin: "auto", pt:4}}gridColumn="span 12">
                            <ToggleButtonGroup
                                color="primary"
                                value={button}
                                exclusive
                                onChange={(event:any) =>{setButton(event.target.value);setCurrentPage(1)}}
                            >
                                <ToggleButton value="ANY">ALL</ToggleButton>
                                <ToggleButton value="OPEN">OPEN</ToggleButton>
                                <ToggleButton value="CLOSED">CLOSED</ToggleButton>

                            </ToggleButtonGroup>
                        </Box>
                        <Box sx={{margin: "auto", pt:4}}gridColumn="span 12">
                            {auctions.length > 0? (
                                <Pagination
                                    defaultPage={1}
                                    count={Math.ceil(auctions.length/auctionsPerPage)}
                                    size="large"
                                    page={currentPage}
                                    onChange={handlePaginate}
                                    variant="outlined"
                                    color="primary" />)
                                : <Typography variant="caption" color="text.secondary" component="div" sx={{pb:2}}>None</Typography>}
                        </Box>
                    </Box>
                </Box>
            </Container>
            <Container sx={{ py: 5 }} maxWidth="xl">
                    <Grid container spacing={4}>
                    {auctions.length > 0? (
                        currentPosts.map((auction: InterfaceAuctionListing) => {
                            return (
                                <Grid key={auction.auctionId} item xs={12} md={6} lg={4} xl={3} display='flex' justifyContent='center'>
                                    <Listing id = {auction.auctionId}/>
                                </Grid>
                            )
                        })
                    ) : ""}
                </Grid>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                    <Box sx={{margin: "auto", pt:4}}gridColumn="span 12">
                        {auctions.length > 0? (
                                <Pagination
                                    defaultPage={1}
                                    count={Math.ceil(auctions.length/auctionsPerPage)}
                                    size="large"
                                    page={currentPage}
                                    onChange={handlePaginate}
                                    variant="outlined"
                                    color="primary" />)
                            : <Typography variant="caption" color="text.secondary" component="div" sx={{pb:2}}>None</Typography>}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

