import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { ethers } from "ethers";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Mail as MailIcon,
  Info as InfoIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  ContactSupport as ContactIcon,
  InfoOutlined as AboutUsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Wallet from "./wallet";
import PatientData from "../../PatientData.json";
const drawerWidth = 240;

export default function Navbar() {
  const registerUser = async () => {
    if (typeof window !== undefined) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.REACT_APP_PUBLIC_ADDRESS_1,
        PatientData.abi,
        signer
      );
      try {
        const data = await contract.getUserData();
        await data.wait();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const getUserData = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const Provider = new ethers.BrowserProvider(window.ethereum);
    const account = await Provider.getSigner();
    const Address = await account.getAddress();
    const provider = new ethers.JsonRpcProvider(
      process.env.REACT_APP_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
      process.env.REACT_APP_PUBLIC_ADDRESS_1,
      PatientData.abi,
      provider
    );
    const UserInfo = contract.filters.UserRegistered(Address, null);
    let contractAddress = await contract.queryFilter(UserInfo);
    return contractAddress;
  };
  useEffect(() => {
    const func = async () => {
      if (localStorage.getItem("contractAddress") !== null) {
        return;
      }
      let contractAddress = await getUserData();
      if (contractAddress.length === 0) {
        await registerUser();
        contractAddress = await getUserData();
      }
      console.log("inside")
      console.log(contractAddress)
      localStorage.setItem("contractAddress", contractAddress[0].args[1]);
    };
    func();
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // const handleLogout = () => {
  //   // Perform logout logic here
  //   props.setLoggedIn(false);
  //   navigate("/login");
  // };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, link: "/" },
    { text: "Search Records", icon: <SearchIcon />, link: "/search-records" },
    { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
    { text: "Contact us", icon: <ContactIcon />, link: "/contactus" },
    { text: "About us", icon: <AboutUsIcon />, link: "/aboutus" },
  ];

  return (
    // <Box sx={{ flexGrow: 1, display: 'flex' }}>
    <Box>
      <AppBar
        position="static"
        sx={{
          width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`,
          ml: drawerOpen ? `${drawerWidth}px` : 0,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              style={{ fontWeight: "bold" }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                Decentralized Health Records
              </Link>
            </Typography>
            <Typography
              variant="h6"
              component="div"
              style={{ fontWeight: "bold" }}
            >
              {/* <Wallet/> */}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        <div>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.link}
                onClick={handleDrawerClose}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {/* <List>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List> */}
      </Drawer>
    </Box>
  );
}
