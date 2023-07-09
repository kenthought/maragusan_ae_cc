"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import TableRowsIcon from "@mui/icons-material/TableRows";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from "../axios";
import Container from "@mui/material/Container";
import Link from "next/link";
import Cookies from "js-cookie";

const drawerWidth = 240;

// ugly code
const setupTokens = (session) => {
  const splitToken = session.user.email.split(";");

  Cookies.set("access_token", splitToken[1], { expires: 7 });

  Cookies.set("refresh_token", splitToken[2], { expires: 7 });
};

export default function DashboardLayout({ children, window }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setupTokens(session);
    }
  });

  const logout = () => {
    // blacklist tokens in database and remove from local storage
    axiosInstance.post("users/logout/blacklist/", {
      refresh_token: Cookies.get("refresh_token"),
    });
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    axiosInstance.defaults.headers["Authorization"] = null;

    signOut({ callbackUrl: "http://localhost:3000/login" });
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuitems = [
    { id: 0, label: "Assets", path: "assets" },
    { id: 1, label: "Bank Account", path: "bank_account" },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ textAlign: "center", padding: "10px" }}>
          Maragusan A&E Credit Corporation
        </Typography>
      </Toolbar>
      <Divider />
      {/* change based on user's permission */}
      <List>
        <ListItem disablePadding>
          <ListItemButton href={"/dashboard/home"} LinkComponent={Link}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
        {menuitems.map((menu, index) => (
          <ListItem key={menu.id} disablePadding>
            <ListItemButton
              href={"/dashboard/" + menu.path}
              LinkComponent={Link}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={menu.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* components */}
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <TableRowsIcon />
          </ListItemIcon>
          <ListItemText primary="Components" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              href={"/dashboard/components/asset_types"}
              LinkComponent={Link}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Asset types" />
            </ListItemButton>
          </List>
          <List component="div" disablePadding>
            <ListItemButton
              href={"/dashboard/components/account_status"}
              LinkComponent={Link}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Account status" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  if (status === "loading")
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );

  if (status === "unauthenticated") return redirect("/api/auth/signin");

  if (status === "authenticated")
    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Lending System
            </Typography>
            <AccountCircle sx={{ marginRight: "10px" }} />
            <Typography>{session.user.name[0].toUpperCase()}</Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Box>
            <Fade in={true}>
              <Container component="main">
                <div>{children}</div>
              </Container>
            </Fade>
          </Box>
        </Box>
      </Box>
    );
}
