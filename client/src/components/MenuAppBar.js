import React, {useState} from "react";
import {withRouter, Link} from "react-router-dom";
import {
	makeStyles,
	AppBar,
	Toolbar,
	Typography,
	Avatar,
	useScrollTrigger,
	Slide
} from "@material-ui/core";
import logo from "../assets/logo.png";
import {useWindowDimensions, Login, LightSwitch, BottomBar} from ".";

const useStyles = makeStyles((theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		position: "relative",
		boxShadow: "0px 0px 0px 0px"
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
	},
	toolbar: theme.mixins.toolbar,
	bottomBar: {
		position: "sticky",
		top: 0,
		zIndex: theme.zIndex.appBar
	},
	"@media (max-width: 500px)": {
		bottomBar: {
			position: "fixed",
			top: "auto",
			bottom: 0,
			zIndex: theme.zIndex.appBar,
			width: "100vw"
		},
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			position: "sticky",
			boxShadow: "0px 1px 5px 1px rgba(0, 0, 0, .3)"
		}
	}
}));

function HideOnScroll(props) {
	const {children} = props;
	const trigger = useScrollTrigger();

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}

function MenuAppBar(props) {
	const {
		isLogged,
		setIsLogged,
		user,
		setUser,
		showBtn,
		handleClick,
		isLight,
		setIsLight
	} = props;
	const {width} = useWindowDimensions();

	const [show, setShow] = useState(false);

	const classes = useStyles();

	return (
		<>
			<HideOnScroll {...props}>
				<AppBar className={classes.appBar} color="inherit">
					<Toolbar className={classes.toolbar}>
						<Link to="/">
							<Avatar
								alt="indie photographers"
								src={logo}
								style={{
									marginRight: "1rem"
								}}
							/>
						</Link>
						<Typography variant="h5" className={classes.title}>
							Indie
						</Typography>
						{width > 500 && (
							<LightSwitch isLight={isLight} setIsLight={setIsLight} />
						)}
						<Login
							user={user}
							isLogged={isLogged}
							setIsLogged={setIsLogged}
							setUser={setUser}
							show={show}
							setShow={setShow}
							{...props}
						/>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<div className={classes.bottomBar}>
				<BottomBar user={user} showBtn={showBtn} handleClick={handleClick} />
			</div>
		</>
	);
}

export default withRouter(MenuAppBar);
