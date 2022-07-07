import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {FormControl, Input, InputLabel, MenuItem, Select, Stack, ThemeProvider} from '@mui/material';
import axios from "axios";
import {isLoggedIn} from "../services/UserServices";
import {theme} from "../themes/theme";
import GavelIcon from '@mui/icons-material/Gavel';
import {InterfaceCategory} from "../Interfaces/InterfaceCategory";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {styled} from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import {submitAuction, uploadAuctionImage} from "../services/AuctionServices";

export function CreateAuction() {
    const [categories, setCategories] = useState<InterfaceCategory[] | []>([])
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("");

    const [categoryName, setCategoryName] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState("");

    const [reserve, setReserve] = useState(1);

    const [dbError, setDbError]=useState("");


    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState("/broken-image.jpg")
    const [imageError, setImageError] = useState("");

    const fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

    const selectImage = async (e: any) => {
        const imageFile = e.target.files[0]
        setImage(imageFile);
        if (imageFile == undefined || !fileTypes.includes(imageFile.type)) {
            setImageError("Please upload an image")
            return
        }
        const imageSrc = URL.createObjectURL(imageFile);
        setImageError("")
        setPreview(imageSrc)
    }

    const [endDate, setEndDate] = React.useState<Date | null>(new Date());

    useEffect( () => {
        if (!isLoggedIn()) {
            window.open("/login", "_self");
        }
        const getCategories = async () => {
            const response = await axios.get(`http://localhost:4941/api/v1/auctions/categories`);
            setCategories(response.data);
        }
        getCategories()

    }, []);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        function GetFormattedDate(date: Date | null) {
            if (date!== null){
                var month = ("0" + (date.getMonth() + 1)).slice(-2);
                var day  = ("0" + (date.getDate())).slice(-2);
                var year = date.getFullYear();
                var hour =  ("0" + (date.getHours())).slice(-2);
                var min =  ("0" + (date.getMinutes())).slice(-2);
                var seg = ("0" + (date.getSeconds())).slice(-2);
                var mill = ("00" + (date.getMilliseconds())).slice(-3);
                return year + "-" + month + "-" + day + " " + hour + ":" +  min + ":" + seg + "." + mill;
            }
        }

        const formatDate = GetFormattedDate(endDate);
        let body;
        if(errorChecks()){
             body = {
                title: title,
                description: description,
                endDate: formatDate,
                categoryId: getCategoryId(),
                reserve: reserve
            }
            let tempId;
            const response = await submitAuction(body);

            if (response == undefined){
                setDbError("An Error occurred")
                return
            }

            if (response.status !== 201){
                setDbError("Title already taken")
                return
            }
            tempId = response.data.auctionId;
            const imageResponse = await uploadAuctionImage(image, tempId);
            if (imageResponse == 201 || imageResponse == 200){
                window.open(`/auctions/${tempId}`, "_self");
            }else{
                setDbError("Please check all required fields")
            }

        }else {
            setDbError("Please check all required fields");
        }
    };


    const getCategoryId = () =>{
        const catIndex = categories.findIndex(x => x.name === categoryName)
        if (categories[catIndex] !== undefined){
            return categories[catIndex].categoryId;
        }
    }

    const errorChecks = () => {
        const imageCheck = () =>{
            if (image === null){
                setDbError("Please upload an image")
                return false
            }
            return true
        }
        const titleCheck = () => {
            if (title.replace(/\s+/g,"").length<1) {
                setTitleError("Please enter a title")
                return false;
            } else {
                return true;
            }

        }

        const categoryCheck = () =>{
            if (categoryName == ""){
                setCategoryError("Please select a category")
                return false;
            }
            return true;
        }
        const descriptionCheck = () => {
            if (description.replace(/\s+/g,"").length<1) {
                setDescriptionError("Please enter a description")
                return false;
            }
            else {
                setDescriptionError("")
                return true;
            }

        }

        return !(!titleCheck() || !categoryCheck() || !descriptionCheck() || !imageCheck());

    }

    const Input = styled('input')({
        display: 'none',
    });

    if(isLoggedIn()){
        const handleCategory = (event:any) =>{
            setCategoryName(event.target.value)
        }
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
                            <GavelIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Create new Auction
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <Typography>{dbError}</Typography>
                            <Stack direction="row"  alignItems="center" spacing={2}>
                                <Avatar sx={{display: 'flex', width:200, height:200}} src={preview} variant="square"></Avatar>
                                <Typography variant={"caption"}>{imageError}</Typography>
                                <label htmlFor="contained-button-file">
                                    <Input accept=".jpeg,.jpg,.png,.gif" id="contained-button-file" onChange={async (e) => await selectImage(e)} type="file" />
                                    <Button variant="contained" component="span">
                                        Upload *
                                    </Button>
                                </label>
                            </Stack>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                label="Title"
                                name="title"
                                value={title}
                                autoFocus
                                helperText={titleError}
                                onChange={(event) => {
                                    setTitle(event.target.value);
                                }}
                            />
                            <FormControl required variant="standard" sx={{ m: 1, width: 250 }}>
                                <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={categoryName}
                                    onChange={handleCategory}
                                    label="Category"
                                >
                                    {categories.length > 0? (
                                        categories.map((category: InterfaceCategory) => {
                                            return (
                                                <MenuItem value={category.name}>{category.name}</MenuItem>
                                            )
                                        })
                                    ) :<MenuItem value=""><em>None</em></MenuItem>}
                                </Select>
                                <FormHelperText>{categoryError}</FormHelperText>
                            </FormControl>

                            <TextField
                                multiline
                                rows={5}
                                margin="normal"
                                required
                                fullWidth
                                id="description"
                                label="Description"
                                name="description"
                                value={description}
                                helperText={descriptionError}

                                autoFocus
                                onChange={(event) => {
                                    setDescription(event.target.value);
                                }}
                            />

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack spacing={3}>
                                    <DateTimePicker
                                        renderInput={(params) => <TextField {...params} />}
                                        label="End date *"
                                        value={endDate}
                                        onChange={(newValue) => {
                                            setEndDate(newValue);
                                        }}
                                        minDateTime={new Date()}
                                    />

                                </Stack>
                            </LocalizationProvider>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="reserve"
                                label="Reserve"
                                name="reserve"
                                value={reserve}
                                autoFocus
                                type={"number"}
                                onChange={(event) => {
                                    parseInt(event.target.value) < 0 ?
                                        setReserve(1)
                                        :   event.target.value === "" ?
                                            setReserve(1):
                                            setReserve(parseInt(event.target.value))
                                        }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}>
                                Create Auction
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>)
    }
    return (
        <div></div>
    );
}