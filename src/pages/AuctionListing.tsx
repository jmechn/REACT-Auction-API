import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {useState} from "react";
import {
    Button,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    IconButtonProps,
    InputLabel,
    Select,
    Stack,
    TextField
} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import {alpha, styled} from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {InterfaceAuctionListing} from "../Interfaces/InterfaceAuctionListing";
import axios from "axios";
import {useParams} from "react-router-dom";
import {InterfaceCategory} from "../Interfaces/InterfaceCategory";
import {getDate, getDateFromDate, getRemainingTime} from "../services/DateServices";
import {InterfaceBids} from "../Interfaces/InterfaceBids";
import Menu, {MenuProps} from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {getUserId, isLoggedIn} from "../services/UserServices";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import {deleteAuction, patchAuction, postBid, uploadAuctionImage} from "../services/AuctionServices";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}
const buttonStatus: String = "";

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export const AuctionListing = () => {

    let { id } = useParams();
    const [expanded, setExpanded] = React.useState(false);
    const [categories, setCategories] = useState<InterfaceCategory[] | []>([])
    const [auction, setAuction] = useState<InterfaceAuctionListing | undefined>(undefined)
    const [image, setImage] = useState<string | undefined>(undefined)
    const [bids, setBids] = useState<InterfaceBids[] | []>([])
    const [auctions, setAuctions] = useState<InterfaceAuctionListing[] | []>([])
    const [loggedIn, setLoggedIn] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openOptions = Boolean(anchorEl);

    const [title, setTitle] = useState("");
    const [openTitle, setOpenTitle] = React.useState(false);
    const [titleError, setTitleError] = useState("");

    const [dbError, setDbError] = useState("")

    const [description, setDescription] = useState("");
    const [descError, setDescError] = useState("");
    const [openDesc, setOpenDesc] = React.useState(false);


    const [reserve, setReserve] = useState(0);
    const [openReserve, setOpenReserve] = React.useState(false);

    const [cat, setCat] = useState("");
    const [openCat, setOpenCat] = React.useState(false);

    const [minBid, setMinBid] = useState(1);
    const [bid, setBid] = useState(1);
    const [bidError, setBidError] = useState("");
    const [open, setOpen] = React.useState(false);

    const [openDate, setOpenDate] = React.useState(false);
    const [endDate, setEndDate] = React.useState<Date | null>(new Date());
    const [prevDate, setPrevDate] = React.useState(new Date())

    const [openDelete, setOpenDelete] = React.useState(false);

    const [isDisabled, setIsDisabled] = useState(true);


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



    // DELETE
    const handleDeleteOpen = () => {
        setOpenDelete(true);
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);

    };

    const handleDeleteChange = async (auctionId:number) => {
        const response = await deleteAuction(auctionId);
        if (response.status !== 200){
            return
        }
        window.open("/my-auctions", "_self")
    }
    // TITLE
    const handleTitleOpen = () => {
        setOpenTitle(true);
    };

    const handleTitleClose = (auctionTitle:string) => {
        setOpenTitle(false);
        setTitle(auctionTitle)
    };

    const handleTitleChange = async (auctionId:number, auctionTitle:string) => {
        const titleCheck = () => {
            if (title.replace(/\s+/g,"").length<1) {
                setTitleError("Please enter a title")
                return false;
            } else {
                setTitleError("")
                return true;
            }
        }
        if (titleCheck()) {
            const body ={
                title:title
            }
            const response = await patchAuction(body, auctionId);
            if (response == undefined){
                setDbError("An Error occurred")
                setTitle(auctionTitle);
                return
            }

            if (response.status !== 200){
                setDbError("Title already taken")
                setTitle(auctionTitle);
                return
            }
            setDbError("Title has been changed")

            setOpenTitle(false);

        }
    }

    // DESCRIPTION
    const handleDescOpen = () => {
        setOpenDesc(true);
    };

    const handleDescClose = (auctionDesc:string) => {
        setOpenDesc(false);
        setDescription(auctionDesc)
    };
    const handleDescChange = async (auctionId:number, auctionDesc:string) => {
        const descCheck = () => {
            if (description.replace(/\s+/g,"").length<1) {
                setDescError("Please enter a Description")
                return false;
            } else {
                setDescError("")
                return true;
            }
        }
        if (descCheck()) {
            const body ={
                description:description
            }
            const response = await patchAuction(body, auctionId);
            if (response == undefined){
                setDbError("An Error occurred")
                setDescription(auctionDesc);
                return
            }

            if (response.status !== 200){
                setDbError("Title already taken")
                setDescription(auctionDesc);
                return
            }
            setDbError("Title has been changed")
            setOpenDesc(false);

        }
    }


    // CATEGORY
    const handleCatOpen = () => {
        setOpenCat(true);
    };

    const handleCatClose = (category:string) => {
        setOpenCat(false);
        setCat(category)
    };

    const handleCategory = (event:any) =>{
        setCat(event.target.value)
    }
    const handleCatChange = async (auctionId:number, category:string) => {
            const index = categories.findIndex(x => x.name === cat)
            const body ={
                categoryId:categories[index].categoryId
            }
            const response = await patchAuction(body, auctionId);
            if (response == undefined){
                setDbError("An Error occurred")
                setCat(category);
                return
            }

            if (response.status !== 200){
                setCat(category);
                return
            }
            setDbError("Category has been changed")
            setOpenCat(false);
    }

    // DATE / TIME
    const handleDateOpen = () => {
        setOpenDate(true);
    };

    const handleDateClose = (date:Date) => {
        setOpenDate(false);

        setEndDate(date)
    };

    const handleDateChange = async (auctionId:number, date:Date) => {
        const formatDate = GetFormattedDate(endDate);
        const body ={
            endDate:formatDate
        }
        const response = await patchAuction(body, auctionId);
        if (response == undefined){
            setDbError("An Error occurred")
            setEndDate(date)
            return
        }

        if (response.status !== 200){
            setEndDate(date)
            return
        }
        setDbError("Date has been changed")
        setOpenDate(false);
    }

    // RESERVE
    const handleReserveOpen = () => {
        setOpenReserve(true);
    };

    const handleReserveClose = (prevReserve:number) => {
        setOpenReserve(false);
        setReserve(prevReserve)
    };

    const handleReserveChange = async (auctionId:number, prevReserve:number) => {
        const body ={
            reserve:reserve
        }
        const response = await patchAuction(body, auctionId);
        if (response == undefined){
            setDbError("An Error occurred")
            setReserve(prevReserve)
            return
        }

        if (response.status !== 200){
            setDbError("Error occurred")
            setReserve(prevReserve)
            return
        }
        setDbError("Reserve has been changed")

        setOpenReserve(false);

    }

    // other

    const handleClickOptions = (event: React.MouseEvent<HTMLElement>) => {
        setCat(categories[catIndex].name)
        setAnchorEl(event.currentTarget);
    };
    const handleCloseOptions = () => {
        setAnchorEl(null);
        setDbError("")
    };

    const handleFullscreenClose = () => {
        setAnchorEl(null);
        setDbError("")
        window.location.reload();
    };
    const handleEdit = () => {
        setOpen(true);
    }
    const handleEditClose = () => {
        setOpen(false);
    };

    // start use effect
    React.useEffect(() => {
        const getAuctions = async () => {
            const response = await axios.get(`http://localhost:4941/api/v1/auctions/`);
            setAuctions(response.data.auctions);

        }

        const getAuctionObject = async () =>{
            return await axios.get(`http://localhost:4941/api/v1/auctions/${id}`)
                .then((response) => {
                    return response;

                })
        }

        const getImage = async (): Promise<string> => {
            return await axios.get(`http://localhost:4941/api/v1/auctions/${id}/image`)
                .then((response) => {
                    return `http://localhost:4941/api/v1/auctions/${id}/image`
                })
        }

        const getBids = async () => {
            const response = await axios.get(`http://localhost:4941/api/v1/auctions/${id}/bids`);
            setBids(response.data);

        }
        const getCategories = async () => {
            const response = await axios.get(`http://localhost:4941/api/v1/auctions/categories`);
            setCategories(response.data);

        }

        const getAuction = async () => {
            const response = await getAuctionObject()
            const image = await getImage()
            setAuction(response.data);
            setTitle(response.data.title);
            setDescription(response.data.description);
            setImage(image);
            setReserve(response.data.reserve);
            const newDate = new Date(response.data.endDate);
            setPrevDate(newDate);
            if (response.data.highestBid>0){
                setMinBid(response.data.highestBid+1);
                setBid(response.data.highestBid+1);
            }


        }
        getAuctions();
        getAuction();
        getCategories();
        getBids();



        setBids(bids.sort((a, b) => a.amount + b.amount))
        if(isLoggedIn()){
            setBidError("")
            setLoggedIn(true)
            setIsDisabled(false)
            return
        }
        setBidError("Please Login/Register to bid.")

    }, []);

    //handle bid

    const handleBid = async (auctionId:number)=>{
        const response = await postBid(auctionId, bid);
        if (response.status!== 201){
            setBidError("An error Occurred")
        }
        window.location.reload();
    }
    // image upload
    const fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
    const selectImage = async (e: any, auctionId:number) => {
        const imageFile = e.target.files[0]
        if (imageFile == undefined || !fileTypes.includes(imageFile.type)) {
            setDbError("Invalid image")
        }
        const imageSrc = URL.createObjectURL(imageFile);
        setImage(imageSrc)

        const imageResponse = await uploadAuctionImage(imageFile,auctionId);
        if (imageResponse == 201 || imageResponse == 200){
            setDbError("Image uploaded")
            return
        }else{
            setDbError("An error occurred")
        }
    }

    const userId = getUserId()
    if (id == undefined || id == null) return (<></>);
    if (auction == undefined) return (<></>);
    const catIndex = categories.findIndex(x => x.categoryId === auction.categoryId)

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const Input = styled('input')({
        display: 'none',
    });

    let fetchSimilar:InterfaceAuctionListing[] = auctions.filter(auc => auc.auctionId !== auction.auctionId && (auc.categoryId === auction.categoryId || auc.sellerId === auction.sellerId));
    if (fetchSimilar.length>3) {
        fetchSimilar = fetchSimilar.slice(0, 3)
    }
    return (
        <Container sx={{py: 8}} maxWidth="xl">
            <Box sx={{
                width: 1
            }}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                    <Box gridColumn="span 12">
                        {/* Category */}
                        <Typography variant="body2" color="text.secondary" align="left">
                            Category: {categories[catIndex].name}
                        </Typography>
                    </Box>
                    <Box gridColumn="span 9">
                        {/* Image of Listing */}
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h4" component="div">
                                    {auction.title}
                                </Typography>
                                <CardMedia
                                    component="img"
                                    image={image}
                                    sx={{pl: 5, pr: 5}}
                                />
                            </CardContent>
                        </Card>
                    </Box>
                    <Box gridColumn="span 3">
                        {/* Right hand side of image */}

                        {loggedIn ?
                            userId === auction.sellerId?
                                (<div><Button
                                    id="demo-customized-button"
                                    aria-controls={openOptions ? 'demo-customized-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openOptions ? 'true' : undefined}
                                    variant="contained"
                                    disableElevation
                                    onClick={handleClickOptions}
                                    endIcon={<KeyboardArrowDownIcon/>}
                                >
                                    Options
                                </Button>
                                    <StyledMenu
                                        id="demo-customized-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'demo-customized-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={openOptions}
                                        onClose={handleCloseOptions}
                                    >
                                        <MenuItem onClick={handleEdit} disableRipple>
                                            <EditIcon/>
                                            Edit
                                        </MenuItem>

                                        <div>
                                            <Dialog
                                                fullScreen
                                                open={open}
                                                onClose={handleEditClose}
                                                TransitionComponent={Transition}
                                            >
                                                <AppBar sx={{position: 'relative'}}>
                                                    <Toolbar>
                                                        <IconButton
                                                            edge="start"
                                                            color="inherit"
                                                            onClick={handleFullscreenClose}
                                                            aria-label="close"
                                                        >
                                                            <CloseIcon/>
                                                        </IconButton>
                                                        <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                                                            Edit Auction
                                                        </Typography>
                                                    </Toolbar>
                                                </AppBar>
                                                <Typography variant="caption" component="div">
                                                    {dbError}
                                                </Typography>
                                                <List>
                                                    <ListItem>
                                                        <ListItemText primary="Image" secondary="Auction Image"/>
                                                    </ListItem>
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar
                                                            sx={{display: 'flex', width: 200, height: 200, ml: 5, pb: 3}}
                                                            src={image} variant="square"></Avatar>
                                                        <label htmlFor="contained-button-file">
                                                            <Input accept=".jpeg,.jpg,.png,.gif" id="contained-button-file"
                                                                   onChange={async (e) => await selectImage(e, auction.auctionId)}
                                                                   type="file"/>
                                                            <Button variant="contained" component="span">
                                                                Upload
                                                            </Button>
                                                        </label>
                                                    </Stack>
                                                    <Divider/>
                                                    <ListItem button onClick={handleTitleOpen}>
                                                        <ListItemText primary="Title" secondary={title}/>
                                                    </ListItem>
                                                    {/*Title Popup*/}
                                                    <div>
                                                        <Dialog open={openTitle} onClose={async (e) => await handleTitleClose(auction.title)} fullWidth>
                                                            <DialogTitle>Edit Title</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText>
                                                                   Please enter a title
                                                                </DialogContentText>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="New Title"
                                                                    type="text"
                                                                    fullWidth
                                                                    value={title}
                                                                    variant="standard"
                                                                    onChange={(e)=>setTitle(e.target.value)}
                                                                />
                                                                <Typography variant={"caption"}>{titleError}</Typography>

                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={async (e) => await handleTitleClose(auction.title)}>Cancel</Button>
                                                                <Button onClick={async (e) => await handleTitleChange(auction.auctionId, auction.title)}>Confirm</Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </div>

                                                    <Divider/>
                                                    <ListItem button onClick={handleDescOpen}>
                                                        <ListItemText
                                                            primary="Description"
                                                            secondary={description}
                                                        />
                                                    </ListItem>

                                                    {/* Desc Popup*/}
                                                    <div>
                                                        <Dialog open={openDesc} onClose={async (e) => await handleDescClose(auction.description)} fullWidth>
                                                            <DialogTitle>Edit Description</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText>
                                                                    Please enter a description
                                                                </DialogContentText>
                                                                <TextField
                                                                    autoFocus
                                                                    multiline
                                                                    rows={5}
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="New Description"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="standard"
                                                                    value={description}
                                                                    onChange={(e)=>setDescription(e.target.value)}
                                                                />
                                                                <Typography variant={"caption"}>{descError}</Typography>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={async (e) => await handleDescClose(auction.description)}>Cancel</Button>
                                                                <Button onClick={async (e) => await handleDescChange(auction.auctionId, auction.description)}>Confirm</Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </div>
                                                    <Divider/>

                                                    {/* cATEGORY */}
                                                    <ListItem button onClick={handleCatOpen}>
                                                        <ListItemText
                                                            primary="Category"
                                                            secondary={cat}
                                                        />
                                                    </ListItem>
                                                    {/* category Popup */}
                                                    <div>
                                                        <Dialog open={openCat} onClose={async (e) => await handleCatClose(categories[catIndex].name)} fullWidth>
                                                            <DialogTitle>Edit Category</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText>
                                                                    Please select a category
                                                                </DialogContentText>
                                                                <FormControl required variant="standard" sx={{ m: 1, width: 250 }}>
                                                                    <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-standard-label"
                                                                        id="demo-simple-select-standard"
                                                                        value={cat}
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
                                                                </FormControl>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={async (e) => await handleCatClose(categories[catIndex].name)}>Cancel</Button>
                                                                <Button onClick={async (e) => await handleCatChange(auction.auctionId, categories[catIndex].name)}>Confirm</Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </div>
                                                    <Divider/>

                                                    <ListItem button onClick={handleDateOpen}>
                                                        <ListItemText
                                                            primary="End date"
                                                            secondary={endDate!==null?getDateFromDate(endDate):" "}
                                                        />
                                                    </ListItem>

                                                    {/* end date Popup*/}
                                                    <div>
                                                        <Dialog open={openDate} onClose={async (e) => await handleDateClose(prevDate)} fullWidth>
                                                            <DialogTitle>Edit Date</DialogTitle>
                                                            <DialogContent>
                                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                    <Stack spacing={3}>
                                                                        <DateTimePicker
                                                                            renderInput={(params) => <TextField {...params} />}
                                                                            label="End date"
                                                                            value={endDate}
                                                                            onChange={(newValue) => {
                                                                                setEndDate(newValue);
                                                                            }}
                                                                            minDateTime={new Date()}
                                                                        />

                                                                    </Stack>
                                                                </LocalizationProvider>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={async (e) => await handleDateClose(prevDate)}>Cancel</Button>
                                                                <Button onClick={async (e) => await handleDateChange(auction.auctionId, prevDate)}>Confirm</Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </div>
                                                    <Divider/>

                                                    <ListItem button onClick={handleReserveOpen}>
                                                        <ListItemText
                                                            primary="Reserve"
                                                            secondary={reserve}
                                                        />
                                                    </ListItem>
                                                    {/* Reserve Popup*/}
                                                    <div>
                                                        <Dialog open={openReserve} onClose={async (e) => await handleReserveClose(auction.reserve)} fullWidth>
                                                            <DialogTitle>Edit Reserve price</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText>
                                                                    Please enter a reserve price
                                                                </DialogContentText>
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
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={async (e) => await handleReserveClose(auction.reserve)}>Cancel</Button>
                                                                <Button onClick={async (e) => await handleReserveChange(auction.auctionId, auction.reserve)}>Confirm</Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </div>
                                                </List>
                                            </Dialog>
                                        </div>
                                        <MenuItem onClick={handleDeleteOpen} disableRipple>
                                            <DeleteIcon/>
                                            Delete
                                        </MenuItem>
                                        {/* DELETE Popup*/}
                                        <div>
                                            <Dialog open={openDelete} onClose={handleDeleteClose} fullWidth>
                                                <DialogTitle>Delete Auction</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Are you sure you would like to delete this auction?
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleDeleteClose}>Cancel</Button>
                                                    <Button onClick={async (e) => await handleDeleteChange(auction.auctionId)}>Delete</Button>
                                                </DialogActions>
                                            </Dialog>
                                        </div>
                                    </StyledMenu></div>) : ""
                                :""}

                        <Card sx={{mt: 7}}>
                            <CardHeader
                                avatar={
                                    <Avatar src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}/>
                                }
                                title={`${auction.sellerFirstName} ${auction.sellerLastName}`}
                                subheader={`${getRemainingTime(auction.endDate)}`}
                                align="left"
                            />
                            <CardContent sx={{pb: 0}}>


                                <Typography variant="h5" color="text.secondary">
                                    {auction.highestBid > 0 ?
                                        ('Highest bid: $' + auction.highestBid)
                                        : "Starting bid: $0"}
                                    </Typography>
                                {auction.sellerId !== userId ?
                                    getRemainingTime(auction.endDate) !== "Closed" ?
                                        (
                                            <div>

                                                <form>
                                                    <TextField
                                                        disabled={isDisabled}
                                                        margin="normal"
                                                        id="bid"
                                                        helperText={bidError}
                                                        label="Bid"
                                                        name="bid"
                                                        value={bid}
                                                        autoFocus
                                                        type={"number"}
                                                        onChange={(event) => {
                                                            parseInt(event.target.value) < minBid ?
                                                                setBid(minBid)
                                                                :   event.target.value === "" ?
                                                                    setBid(minBid):
                                                                    setBid(parseInt(event.target.value))

                                                        }}
                                                    />
                                                </form>
                                                <Button disabled={isDisabled} variant="contained" onClick={(e)=>handleBid(auction.auctionId)}>Bid</Button>
                                            </div>) : <div></div>
                                    : <div></div>}


                                <Typography variant="subtitle1" color="text.secondary">
                                    {auction.highestBid >= auction.reserve ?
                                            ('Reserve met: $' + auction.reserve)
                                            : 'Reserve: $' + auction.reserve}

                                </Typography>

                                <Typography sx={{pt: 2, pb: 2}} variant="body2" color="text.secondary">
                                    {auction.description}
                                </Typography>
                                {auction.highestBid > 0 ?
                                    (<Card elevation={0}>
                                        {bids[0] !== undefined ?
                                            (<CardHeader
                                                    avatar={
                                                        <Avatar
                                                            src={`http://localhost:4941/api/v1/users/${bids[0].bidderId}/image`}
                                                            sx={{
                                                                width: 24,
                                                                height: 24
                                                            }}/>
                                                    }
                                                    title={`Last bidder - ${bids[0].firstName} ${bids[0].lastName}`}
                                                    subheader={`$${bids[0].amount} -- ${getDate(bids[0].timestamp)} `}
                                                    align="left"
                                                />
                                            ) : <div></div>}
                                    </Card>)
                                    : <div></div>}
                            </CardContent>
                            {auction.highestBid > 0 ?
                                (<Card elevation={0}>
                                    <CardActions disableSpacing sx={{pl: 3}}>
                                        {`Bidding History -- ${auction.numBids} bid(s)`}
                                        <ExpandMore
                                            expand={expanded}
                                            onClick={handleExpandClick}
                                            aria-expanded={expanded}
                                            aria-label="show more"
                                        >
                                            <ExpandMoreIcon/>
                                        </ExpandMore>
                                    </CardActions>
                                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                                        <CardContent>
                                            {bids.map((bid) => (
                                                <Card elevation={0}>
                                                    <CardHeader
                                                        avatar={
                                                            <Avatar
                                                                src={`http://localhost:4941/api/v1/users/${bid.bidderId}/image`}
                                                                sx={{
                                                                    width: 24,
                                                                    height: 24
                                                                }}/>
                                                        }
                                                        title={`${bid.firstName} ${bid.lastName}`}
                                                        subheader={`$${bid.amount} -- ${getDate(bid.timestamp)}`}
                                                        align="left"
                                                    />
                                                </Card>
                                            ))}
                                        </CardContent>
                                    </Collapse>
                                </Card>)
                                : <div></div>}
                        </Card>
                        <Card sx={{mt: 5}}>
                            <CardHeader
                                title={<Typography variant="subtitle1">Similar Auctions</Typography>}></CardHeader>
                            {fetchSimilar.length > 0 ? (
                                fetchSimilar.map((sim: InterfaceAuctionListing) => {
                                    return (
                                        <a href={`/auctions/${sim.auctionId}`} style={{textDecoration: "none"}}>

                                            <Card sx={{maxWidth: 345}}>
                                                <CardActionArea>
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={`http://localhost:4941/api/v1/auctions/${sim.auctionId}/image`}
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="subtitle2" component="div">
                                                            {sim.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {`Seller: ${sim.sellerFirstName} ${sim.sellerLastName}`}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </a>
                                    )
                                })
                            ) : ""}

                        </Card>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}