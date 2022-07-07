import * as React from "react";
import {useState} from "react";
import {InterfaceAuctionListing} from "../Interfaces/InterfaceAuctionListing";
import axios from "axios";
import Card from "@mui/material/Card";
import {CardActionArea, CardHeader, Grid} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {getRemainingTime} from "../services/DateServices";
import {InterfaceCategory} from "../Interfaces/InterfaceCategory";


export function Listing({id}:any) {

    const [auction, setAuction] = useState<InterfaceAuctionListing | undefined>(undefined)
    const [image, setImage] = useState<string | undefined>(undefined)
    const [categories, setCategories] = useState<InterfaceCategory[] | []>([])
    React.useEffect(() => {

        const getAuctionObject = async (id: number) =>{
            return await axios.get(`http://localhost:4941/api/v1/auctions/${id}`)
                .then((response) => {
                    return response;
                })
        }

        const getImage = async (id: number): Promise<string> => {
            return await axios.get(`http://localhost:4941/api/v1/auctions/${id}/image`)
                .then((response) => {
                    return `http://localhost:4941/api/v1/auctions/${id}/image`
                })
        }

        const getAuction = async (id: number) => {
            const response = await getAuctionObject(id)
            const image = await getImage(response.data.auctionId)
            setAuction(response.data);
            // setDescription(response.data.description.substring(0, 300) + "...");
            setImage(image);

        }
        const getCategories = async () => {
            const response = await axios.get(`http://localhost:4941/api/v1/auctions/categories`);
            setCategories(response.data);

        }
        getAuction(id);
        getCategories();

    }, []);

    if (id == undefined || id == null) return (<></>);
    if (auction == undefined) return (<></>);
    const catIndex = categories.findIndex(x => x.categoryId === auction.categoryId)

    return(
        <Link to={`/auctions/${auction.auctionId}`} style={{ textDecoration: 'none' }}>
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>{}
                    <CardMedia
                        component="img"
                        height="270"
                        image={image}
                    />
                    <CardContent sx={{ height: 280 }}>
                        <Card elevation={0}>
                            <CardHeader sx={{ minHeight: 96, padding: 0 }}
                                title = {<Typography variant="h6" color="text.secondary">{ auction.title }</Typography>}
                            />

                        </Card>
                        <Card elevation={0}>
                            <CardHeader
                                avatar = {<Avatar src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}/>}
                                title = { `${auction.sellerFirstName} ${auction.sellerLastName}`}
                                subheader={ `${getRemainingTime(auction.endDate)}`}
                                align = "left"
                                sx={{ pt:0, pb: 0 }}
                            />
                            <Grid sx={{ pt:1 }} container spacing={2} columns={16}>
                                <Grid item xs={8}>
                                    <Typography align="left" variant="subtitle2">
                                        {auction.highestBid > 0 ?
                                            ('Highest bid: $'+ auction.highestBid)
                                            : "Starting bid: $0"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography align="right" variant="subtitle2">
                                        {auction.highestBid >= auction.reserve ?
                                            ('Reserve met: $'+ auction.reserve)
                                            : 'Reserve: $'+ auction.reserve}
                                        {categories[catIndex] !== undefined? <Typography variant="subtitle2">{categories[catIndex].name}</Typography> : <p>test</p>}
                                    </Typography>

                                </Grid>
                            </Grid>
                        </Card>

                            <Typography align="left" variant="body2" color="text.secondary">
                                {auction.description.length > 100 ?
                                    (auction.description.substring(0, 100) + "...")
                                : auction.description}
                            </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
    </Link>)
}