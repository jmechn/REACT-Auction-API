import * as React from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import {isLoggedIn} from "./UserServices";


export const getAllAuctions = () => {
    axios.get(`http://localhost:4941/api/v1/auctions/`).then(
        ( response) => {
            console.log(JSON.stringify(response));
            return response.data;
        }
    );
}


export const getAuction =  (id: number) => {
        axios.get(`http://localhost:4941/api/v1/auctions/${id}`)
        .then(
        (response) => {
            return response.data.description;
        }
    );
}

export const fetchAuctions = async (config: any) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions`, {params: config});
};

export const getAuctionDesc = (id:number) => {
    return getAuction(id)
}


export const uploadAuctionImage = async (image:any, auctionId:number) =>{
    console.log("type" + image.type)
    const config = {
        headers: {
            "content-type": image.type,
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    return await axios
        .put(`http://localhost:4941/api/v1/auctions/${auctionId}/image`, image, config).then((response) => {
            return response.status;
        }).catch((error) => {
            return error.response.status;
        });
};

export const submitAuction = async (body: any) => {
    if (!isLoggedIn()) return
    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }
    return await axios.post(`http://localhost:4941/api/v1/auctions`, body, config)
        .catch((error) => {
            return undefined
        })
}


export const patchAuction = async (body: any, auctionId: number) => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    return await axios.patch(`http://localhost:4941/api/v1/auctions/${auctionId}`, body, config);
};

export const deleteAuction = async (auctionId: number) => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };
    return await axios.delete(`http://localhost:4941/api/v1/auctions/${auctionId}`, config);
};


export const postBid = async (auctionId: number, bid: number) => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    return await axios.post(`http://localhost:4941/api/v1/auctions/${auctionId}/bids`,
        {amount: bid},
        config)
        .catch((error) => {
            console.log(error.data.response)
            return error.data.response
        })
};
