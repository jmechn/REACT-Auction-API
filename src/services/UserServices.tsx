import axios from "axios";
import * as React from "react";
import Cookies from "js-cookie";

export const login = async (email:string , password: string) => {
    return await axios.post(`http://localhost:4941/api/v1/users/login`, {
        email: email, password: password
    }).then((response) => {
            Cookies.set('UserToken', response.data.token)
            Cookies.set('UserId', response.data.userId)
            return response.status;
        }).catch((error) => {
            return 401;
        })
}

export const isLoggedIn = (): boolean => {
    const user = Cookies.get("UserId");
    return user !== undefined && user !== null;
};
export const logout = async () => {
    const config = {
        headers: {
            "content-type": "application/json",
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }
    return await axios.post(`http://localhost:4941/api/v1/users/logout`, {}, config).then((response) => {
            Cookies.remove("UserId");
            Cookies.remove("UserToken");
            return response.status;
        }).catch((error) => {
            console.log("err" + error)
            return error.response.status;
        })
};

export const getUserId = (): number | undefined => {
    let userId = Cookies.get('UserId')
    if (userId !== undefined) return parseInt(userId)
    return userId
}


export const uploadUserImage = async (image:any) =>{
    if (!isLoggedIn()) return;
    console.log(image)
    const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;

    const config = {
        headers: {
            "content-type": image.type,
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    return await axios
        .put(`http://localhost:4941/api/v1/users/${userId}/image`, image, config)
        .then((response) => {
            return response.status;
        }).catch((error) => {
            console.log(error)
            console.log(`http://localhost:4941/api/v1/auctions/${userId}/image`)
            return error.response.status;
        });
};



export const deleteProfilePicture = async () => {
    const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;
    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };
    return await axios.delete(`http://localhost:4941/api/v1/users/${userId}/image`, config);
};

export const getImageStatus = async () => {
    const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;
    return await axios.get(`http://localhost:4941/api/v1/users/${userId}/image`)
        .then((response) => {
     return response.status}).catch((error) => {
            return error.response.status;
        });
};



export const getUser = async () => {
    const userId = parseInt(Cookies.get('UserId') as string || "") || undefined

    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    return await axios.get(`http://localhost:4941/api/v1/users/${userId}`, config)
}


export const patchUser = async (body:any) => {
    const userId = parseInt(Cookies.get('UserId') as string || "") || undefined
    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }
    return await axios.patch(`http://localhost:4941/api/v1/users/${userId}`, body, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            console.log(error.response.status + "setfirstname")
            return error.response.status;
        })
}