import * as React from 'react';
import {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import {NavLink} from "react-router-dom";
import {
    deleteProfilePicture,
    getImageStatus,
    getUser,
    getUserId,
    isLoggedIn,
    patchUser,
    uploadUserImage
} from "../services/UserServices";

import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import Divider from "@mui/material/Divider";
import {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    Stack,
    TextField
} from "@mui/material";
import {styled} from "@mui/material/styles";
import {InterfaceUser} from "../Interfaces/InterfaceUser";
import {Visibility, VisibilityOff} from "@mui/icons-material";


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



let settings = ['Register', 'Login'];

let pages = [{
    name: 'Auctions',
    link: '/auctions'}];


let userId: number | undefined;




const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [dbError, setDbError] = useState("");
    const [open, setOpen] = React.useState(false);
    const [image,setImage] = useState("/broken-image.jpg")
    const [isDisabled, setIsDisabled] = useState(false)
    const [user, setUser] = useState<InterfaceUser[] | undefined>(undefined)

    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => setShowPassword(showPassword => !showPassword);

    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const handleToggleRetypePassword = () => setShowRetypePassword(showRetypePassword => !showRetypePassword);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [firstNamePre, setFirstNamePre] = useState("");
    const [lastNamePre, setLastNamePre] = useState("");
    const [emailPre, setEmailPre] = useState("");


    const [openDelete, setOpenDelete] = React.useState(false);
    const handleDeleteOpen = () => {
        setOpenDelete(true);
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);

    };

    const [openFirstName, setOpenFirstName] = React.useState(false);
    const [firstNameError, setFirstNameError] = useState("");
    const handleFirstNameOpen = () => {
        setOpenFirstName(true);
    };

    const handleFirstNameClose = (prevFirstName:string) => {
        setFirstName(prevFirstName);
        setOpenFirstName(false);
    };


    const handleFirstNameChange = async (prevFirstName:string) => {
        const firstNameCheck = () => {
            if (firstName.replace(/\s+/g,"").length<1) {
                setFirstNameError("Please enter a valid name")
                return false;
            } else {
                setFirstNameError("")
                return true;
            }
        }
        if (firstNameCheck()) {
            const body ={
                firstName:firstName
            }
            const response = await patchUser(body);
            if (response !== 200){
                setDbError("Error occurred")
                setFirstName(prevFirstName);
                return
            }
            setFirstNamePre(firstName)
            setDbError("First name has been changed")
            setOpenFirstName(false);

        }
    }

    const [openEmail, setOpenEmail] = React.useState(false);
    const [emailError, setEmailError] = useState("")
    const handleEmailOpen = () => {
        setOpenEmail(true);
    };

    const handleEmailClose = (prevEmail:string) => {
        setEmail(prevEmail);
        setOpenEmail(false);
    };


    const handleEmailChange = async (prevEmail:string) => {
        const emailCheck = () => {
            if (email == "") {
                setEmailError("Please enter an email");

            } else if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9])+$/.test(email)) {
                setEmailError("Invalid email");
            } else {
                setEmailError("")
                return true;
            }
            return false;
        }

        if (emailCheck()) {
            const body ={
                email:email
            }
            const response = await patchUser(body);
            if (response !== 200){
                setDbError("Error occurred")
                setEmail(prevEmail);
                return
            }
            setDbError("Email has been changed")
            setEmailPre(email)
            setOpenEmail(false);

        }
    }

    const handleLastNameChange = async (prevLastName:string) => {
        const lastNameCheck = () => {
            if (lastName.replace(/\s+/g,"").length<1) {
                setLastNameError("Please enter a valid name")
                return false;
            } else {
                setLastNameError("")
                return true;
            }
        }
        if (lastNameCheck()) {
            const body ={
                lastName:lastName
            }
            const response = await patchUser(body);
            if (response !== 200){
                setDbError("Error occurred")
                setLastName(prevLastName);
                return
            }
            setDbError("Last name has been changed")
            setLastNamePre(lastName)
            setOpenLastName(false);

        }
    }

    const [openLastName, setOpenLastName] = React.useState(false);
    const [lastNameError, setLastNameError,] = useState("");
    const handleLastNameOpen = () => {
        setOpenLastName(true);
    };

    const handleLastNameClose = (prevLastName:string) => {
        setLastName(prevLastName);
        setOpenLastName(false);
    };

    useEffect(() => {

        if (isLoggedIn()) {
            pages = [{
                name: 'Auctions',
                link: '/auctions'
            },
                {
                    name: 'My Auctions',
                    link: '/my-auctions'
                },
                {
                    name: 'Create Auction',
                    link: '/create-auction'
                }
            ];
            settings = ['Profile', 'Logout'];
            userId = getUserId();
            const getStatus = async () => {
                const response = await getImageStatus();
                if (response !== 200) {
                    setIsDisabled(true)
                } else {
                    setIsDisabled(false)
                }
            }

            const getLogin = async () => {
                const response = await getUser()
                setUser(response.data)
                setFirstName(response.data.firstName)
                setLastName(response.data.lastName)
                setEmail(response.data.email)
                setFirstNamePre(response.data.firstName)
                setLastNamePre(response.data.lastName)
                setEmailPre(response.data.email)
            }
            getStatus()
            getUser()
            setImage(`http://localhost:4941/api/v1/users/${userId}/image`)
            getLogin()
        }

    }, [])


    const Input = styled('input')({
        display: 'none',
    });

    const handleClose = () => {
        window.location.reload()
        setOpen(false);
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (page:string) => {
        setAnchorElUser(null);
        if (page === "Register"){
            window.open("/register", "_self")
        }
        if (page === "Login"){
            window.open("/login", "_self")
        }
        if (page === "Logout"){
            window.open("/logout", "_self")
        }

        if (page === "Profile"){
            setOpen(true);
        }
    };

    function handleCloseNavMenu() {
        setAnchorElUser(null);
    }


    // image upload
    const fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
    const selectImage = async (e: any) => {
        const imageFile = e.target.files[0]
        if (imageFile == undefined || !fileTypes.includes(imageFile.type)) {
            setDbError("Invalid image")
        }
        const imageSrc = URL.createObjectURL(imageFile);
        setImage(imageSrc)

        const imageResponse = await uploadUserImage(imageFile);
        if (imageResponse == 201 || imageResponse == 200){
            setDbError("Profile picture uploaded")
            setIsDisabled(false)
            return
        }else{
            setDbError("An error occurred")
        }
    }

    const deleteImage = async (e:any) => {
        const response = await deleteProfilePicture()
        if (response.status == 200) {
            setImage(`/broken-image.jpg`)
            setDbError("Profile picture removed")
            setIsDisabled(true)
            setOpenDelete(false)
        }
        else{
                setDbError("An error occurred")
            }
    }

    const [currentPassword, setCurrentPassword] = useState("");
    const [openPw, setOpenPw] = React.useState(false);
    const [pwError, setPwError] = useState("");



    const handlePwOpen = () => {
        setOpenPw(true);
    };

    const handlePwClose = () => {
        setCurrentPassword("");
        setPassword("");
        setOpenPw(false);
    };


    const handlePwChange = async () => {
        const pwCheck = () => {
            if (password == "") {
                setPwError("Please enter a password");
            } else if (password.length < 6) {
                setPwError("Password must be at least 6 characters long");
            }else{
                return true
            }
            return false;
        }
        if (pwCheck()) {
            const body ={
                password: password,
                currentPassword: currentPassword
            }
            const response = await patchUser(body);
            if (response !== 200){
                setPwError("Incorrect password")
                return
            }
            setCurrentPassword("");
            setPassword("");
            setDbError("Password has been changed")
            setOpenPw(false);

        }
    }

    return (
        <AppBar position="static" style={{background: "primary"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        SENG365
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        {/* Responsive nav bar ( when window is small ) */}
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleOpenNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <NavLink className={page.name.replace(" ", "-")} to={page.link}>
                                    <MenuItem key={page.name}>
                                        <Typography textAlign="center">{page.name}</Typography>
                                    </MenuItem>
                                </NavLink>
                            ))}
                        </Menu>
                    </Box>
                    {/* LOGO ICON HERE */}
                    <CurrencyRubleIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',

                            textDecoration: 'none',
                        }}
                    >
                        JCH423
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <NavLink  style={{ textDecoration: 'none' }} className={page.name.replace(" ", "-")} to={page.link} >
                                <Button
                                    key={page.name}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.name}
                                </Button>
                            </NavLink>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                {userId !== undefined ? <Avatar src={`http://localhost:4941/api/v1/users/${userId}/image`}/>
                                    : <Avatar src={`/broken-image.jpg`}/>}

                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={async () => await handleCloseUserMenu(setting)}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>

                        <div>
                            <Dialog
                                fullScreen
                                open={open}
                                onClose={handleClose}
                                TransitionComponent={Transition}
                            >
                                <AppBar sx={{ position: 'relative' }}>
                                    <Toolbar>
                                        <IconButton
                                            edge="start"
                                            color="inherit"
                                            onClick={handleClose}
                                            aria-label="close"
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                            Your Profile
                                        </Typography>
                                    </Toolbar>
                                </AppBar>
                                <List>
                                    <Typography variant="caption" component="div">
                                        {dbError}
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText primary="Image" secondary="Your profile picture"/>
                                        </ListItem>
                                        <Stack sx={{pb:3}} direction="row" alignItems="center" spacing={2}>
                                            <Avatar
                                                sx={{display: 'flex', width: 200, height: 200, ml: 5, pb: 3}}
                                                src={image} variant="square"></Avatar>
                                            <label htmlFor="contained-button-file">
                                                <Input accept=".jpeg,.jpg,.png,.gif" id="contained-button-file"
                                                       onChange={async (e) => await selectImage(e)}
                                                       type="file"/>
                                                <Button variant="contained" component="span">
                                                    Upload
                                                </Button>
                                            </label>
                                            <Button disabled={isDisabled} onClick={handleDeleteOpen} variant="contained" component="span">
                                                Delete
                                            </Button>

                                            <div>
                                                <Dialog open={openDelete} onClose={handleDeleteClose} fullWidth>
                                                    <DialogTitle>Delete profile picture</DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText>
                                                            Are you sure you would like to delete your profile picture?
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleDeleteClose}>Cancel</Button>
                                                        <Button onClick={async (e: any) => await deleteImage(e)}>Delete</Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                        </Stack>
                                        <Divider />
                                        <ListItem button onClick={handleFirstNameOpen}>
                                            <ListItemText
                                                primary="First Name"
                                                secondary={firstName}
                                            />
                                        </ListItem>

                                        {/* firstName Popup*/}
                                        <div>
                                            <Dialog open={openFirstName} onClose={async (e) => await handleFirstNameClose(firstNamePre)} fullWidth>
                                                <DialogTitle>Edit first name</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Please enter a new last name
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus
                                                        margin="dense"
                                                        id="name"
                                                        label="New last name"
                                                        type="text"
                                                        fullWidth
                                                        variant="standard"
                                                        value={firstName}
                                                        onChange={(e)=>setFirstName(e.target.value)}
                                                    />
                                                    <Typography variant={"caption"}>{firstNameError}</Typography>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={async (e) => await handleFirstNameClose(firstNamePre)}>Cancel</Button>
                                                    <Button onClick={async (e) => await handleFirstNameChange(firstNamePre)}>Confirm</Button>
                                                </DialogActions>
                                            </Dialog>
                                        </div>
                                        <Divider/>


                                        <ListItem button onClick={handleLastNameOpen}>
                                            <ListItemText
                                                primary="Last Name"
                                                secondary={lastName}
                                            />
                                        </ListItem>

                                        {/* last name Popup*/}
                                        <div>
                                            <Dialog open={openLastName} onClose={async (e) => await handleLastNameOpen()} fullWidth>
                                                <DialogTitle>Edit last name</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Please enter a new name
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus
                                                        margin="dense"
                                                        id="name"
                                                        label="New name"
                                                        type="text"
                                                        fullWidth
                                                        variant="standard"
                                                        value={lastName}
                                                        onChange={(e)=>setLastName(e.target.value)}
                                                    />
                                                    <Typography variant={"caption"}>{lastNameError}</Typography>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={async () => await handleLastNameClose(lastNamePre)}>Cancel</Button>
                                                    <Button onClick={async () => await handleLastNameChange(lastNamePre)}>Confirm</Button>
                                                </DialogActions>
                                            </Dialog>
                                        </div>
                                        <Divider/>
                                        <ListItem button onClick={handleEmailOpen}>
                                            <ListItemText
                                                primary="Email"
                                                secondary={email}
                                            />
                                        </ListItem>

                                        {/* email Popup*/}
                                        <div>
                                            <Dialog open={openEmail} onClose={async (e) => await handleEmailOpen()} fullWidth>
                                                <DialogTitle>Edit email</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Please enter a new email
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus
                                                        margin="dense"
                                                        id="name"
                                                        label="New email"
                                                        type="text"
                                                        fullWidth
                                                        variant="standard"
                                                        value={email}
                                                        onChange={(e)=>setEmail(e.target.value)}
                                                    />
                                                    <Typography variant={"caption"}>{emailError}</Typography>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={async () => await handleEmailClose(emailPre)}>Cancel</Button>
                                                    <Button onClick={async () => await handleEmailChange(emailPre)}>Confirm</Button>
                                                </DialogActions>
                                            </Dialog>
                                        </div>
                                        <Divider/>
                                        <ListItem button onClick={handlePwOpen}>
                                            <ListItemText
                                                primary="Password"
                                                secondary="******"
                                            />
                                        </ListItem>

                                        {/* email Popup*/}
                                        <div>
                                            <Dialog open={openPw} onClose={async () => await handlePwOpen()} fullWidth>
                                                <DialogTitle>Edit email</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Please enter a new password
                                                    </DialogContentText>
                                                    <TextField
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        name="currentPw"
                                                        value={currentPassword}
                                                        helperText={pwError}
                                                        label="Curent password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="password"
                                                        autoComplete="current-password"
                                                        onChange={(event) => {
                                                            setCurrentPassword(event.target.value);
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={handleTogglePassword}
                                                                        edge="end"
                                                                    >
                                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )}}
                                                    />

                                                    <TextField
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        name="New password"
                                                        value={password}
                                                        label="New password"
                                                        type={showRetypePassword ? 'text' : 'password'}
                                                        id="Retype password"
                                                        autoComplete="current-password"
                                                        onChange={(event) => {
                                                            setPassword(event.target.value);
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={handleToggleRetypePassword}
                                                                        edge="end"
                                                                    >
                                                                        {showRetypePassword ? <Visibility /> : <VisibilityOff />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )}}
                                                    />
                                                    <Typography variant={"caption"}>{pwError}</Typography>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handlePwClose}>Cancel</Button>
                                                    <Button onClick={handlePwChange}>Confirm</Button>
                                                </DialogActions>
                                            </Dialog>
                                        </div>

                                    </List>
                                </List>
                            </Dialog>
                        </div>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>)
}
export default Navbar;