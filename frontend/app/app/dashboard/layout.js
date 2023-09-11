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
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
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
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import BalanceIcon from "@mui/icons-material/Balance";
import axiosInstance from "../axios";
import Container from "@mui/material/Container";
import Link from "next/link";
import Cookies from "js-cookie";
import Loading from "../utils/loading";

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
  const [openComponents, setOpenComponents] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

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
    setOpenComponents(!openComponents);
    setOpenMenu(!openMenu);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuitems = [
    {
      id: 0,
      label: "Assets",
      path: "assets",
      icon: <BusinessCenterIcon />,
    },
    {
      id: 1,
      label: "Bank Account",
      path: "bank_account",
      icon: <AccountBalanceIcon />,
    },
    {
      id: 2,
      label: "Owners Equity",
      path: "owners_equity",
      icon: <BalanceIcon />,
      access: "admin",
    },
    {
      id: 3,
      label: "Expenses",
      path: "expenses",
      icon: <BalanceIcon />,
    },
    {
      id: 4,
      label: "Payables",
      path: "payables",
      icon: <AccountBalanceIcon />,
    },
    {
      id: 5,
      label: "Receivables",
      path: "receivables",
      icon: <AccountBalanceIcon />,
    },
  ];

  const componentItems = [
    {
      id: 1,
      label: "Asset Type",
      path: "asset_types",
      icon: <BalanceIcon />,
    },
    {
      id: 2,
      label: "Bank",
      path: "bank",
      icon: <AccountBalanceIcon />,
    },
    {
      id: 3,
      label: "Address",
      path: "address",
      icon: <AddLocationAltIcon />,
    },
    {
      id: 4,
      label: "Expenses Category",
      path: "expenses_category",
      icon: <AccountBalanceIcon />,
    },
    {
      id: 5,
      label: "Supplier",
      path: "supplier",
      icon: <AccountBalanceIcon />,
    },
    {
      id: 6,
      label: "Company",
      path: "company",
      icon: <AccountBalanceIcon />,
    },
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
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={"Home"}
              primaryTypographyProps={{
                fontSize: 15,
                fontWeight: "medium",
                lineHeight: "20px",
                mb: "2px",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => {
            setOpenMenu(!openMenu);
            if (openComponents) setOpenComponents(false);
          }}
        >
          <ListItemIcon>
            <TableRowsIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Menu"
            primaryTypographyProps={{
              fontSize: 15,
              fontWeight: "medium",
              lineHeight: "20px",
              mb: "2px",
            }}
          />
          {openMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu} timeout="auto" unmountOnExit>
          {menuitems.map((menu) => (
            <ListItem key={menu.id} disablePadding>
              <ListItemButton
                href={"/dashboard/" + menu.path}
                LinkComponent={Link}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText
                  primary={menu.label}
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                />
                {menu.access == "admin" && (
                  <Chip label="A" color="primary" size="small" />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton href={"/dashboard/approvals"} LinkComponent={Link}>
            <ListItemIcon>
              <LogoutIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={"Approvals"}
              primaryTypographyProps={{
                fontSize: 15,
                fontWeight: "medium",
                lineHeight: "20px",
                mb: "2px",
              }}
            />{" "}
            <Chip label="A" color="primary" size="small" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {/* components */}
        <ListItemButton
          onClick={() => {
            setOpenComponents(!openComponents);
            if (openMenu) setOpenMenu(false);
          }}
        >
          <ListItemIcon>
            <TableRowsIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Components"
            primaryTypographyProps={{
              fontSize: 15,
              fontWeight: "medium",
              lineHeight: "20px",
              mb: "2px",
            }}
          />
          {openComponents ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openComponents} timeout="auto" unmountOnExit>
          {componentItems.map((components) => (
            <List component="div" key={components.id} disablePadding>
              <ListItemButton
                href={"/dashboard/components/" + components.path}
                LinkComponent={Link}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>{components.icon}</ListItemIcon>
                <ListItemText
                  primary={components.label}
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                />
              </ListItemButton>
            </List>
          ))}
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={"Logout"}
              primaryTypographyProps={{
                fontSize: 15,
                fontWeight: "medium",
                lineHeight: "20px",
                mb: "2px",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  if (status === "loading") return <Loading />;

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
            <Typography variant="h6" noWrap component="h2" sx={{ flexGrow: 1 }}>
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
