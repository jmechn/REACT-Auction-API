import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import {Auctions} from "./pages/Auctions";
import {AuctionListing} from "./pages/AuctionListing";
import {Register} from "./pages/Register";
import {Login} from "./pages/Login";
import {Logout} from "./pages/Logout";
import {LogoutExisting} from "./pages/LogoutExisting";
import {ThemeProvider} from '@mui/material/styles';
import {theme} from "./themes/theme";
import {CreateAuction} from "./pages/CreateAuction";
import {Footer} from "./components/Footer";
import {MyAuctions} from "./pages/MyAuctions";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Router>
                    <Navbar/>
                    <Routes>
                        <Route path="/" element={<Auctions/>}/>
                        <Route path="*" element={<NotFound/>}/>
                        <Route path="/auctions" element={<Auctions/>}/>
                        <Route path="/auctions/:id" element={<AuctionListing/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/logout" element={<Logout/>}/>
                        <Route path="/logout-existing" element={<LogoutExisting/>}/>
                        <Route path="/my-auctions" element={<MyAuctions/>}/>
                        <Route path ="/create-auction" element={<CreateAuction/>}/>
                    </Routes>
                </Router>
            </div>
            <Footer/>
        </ThemeProvider>
    );
}
export default App;