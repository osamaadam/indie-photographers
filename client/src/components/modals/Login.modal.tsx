import React, {useState, useEffect} from "react";
import {useHistory, RouteComponentProps} from "react-router-dom";
import axios from "axios";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	makeStyles,
	Grid
} from "@material-ui/core";
import {FBButton, ProfileAvatar, GoogleBtn} from "..";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1)
		}
	},
	textField: {
		marginBottom: theme.spacing(1)
	}
}));

interface Props extends RouteComponentProps {
	isLogged: boolean;
	setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
	setUser: React.Dispatch<React.SetStateAction<User>>;
}

const Login: React.FC<Props> = (props) => {
	const {isLogged, setIsLogged, setUser} = props;

	const classes = useStyles();
	const history = useHistory();

	const [show, setShow] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");

	useEffect(() => {
		if (props.location.hash !== "#login-window") setShow(false);
	}, [props.location.hash]);

	const handleClose = () => {
		setShow(false);
		setErrorMsg("");
		if (props.location.hash === "#login-window") history.goBack();
	};

	const handleShow = () => {
		setShow(true);
		window.location.hash = "login-window";
		setErrorMsg("");
	};

	const emailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setEmail(event.target.value);
	const passwordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setPassword(event.target.value);
	const handleSubmit = (
		event:
			| React.MouseEvent<HTMLButtonElement, MouseEvent>
			| React.FormEvent<HTMLFormElement>
	) => {
		if (!email.trim() || !password.trim()) {
			setErrorMsg("Please enter all fields");
			event.preventDefault();
		} else {
			const user: SubUser = {
				email,
				password
			};
			axios
				.post("/api/auth/", user)
				.then((res) => {
					const token: string = res.data.token;
					const user: User = res.data.user;
					if (token) {
						localStorage.setItem("token", JSON.stringify(token));
						setEmail("");
						setPassword("");
						setIsLogged(true);
					}
					if (user) {
						setUser(user);
					}
					handleClose();

					setTimeout(() => {
						window.location.reload();
					}, 1000);
				})
				.catch((err) => {
					console.log(err);
					localStorage.removeItem("token");
					setIsLogged(false);
					setErrorMsg("Invalid credentials");
				});
		}
		event.preventDefault();
	};

	const loginButton = !isLogged ? (
		<Button color="inherit" onClick={handleShow}>
			Login
		</Button>
	) : (
		<ProfileAvatar setIsLogged={setIsLogged} />
	);

	return (
		<>
			{loginButton}
			<Dialog
				open={show}
				onClose={handleClose}
				transitionDuration={{
					enter: 0,
					exit: 0
				}}
				aria-labelledby="form-dialog-title"
			>
				<form onSubmit={handleSubmit} className={classes.root}>
					<DialogTitle id="form-dialog-title">Login</DialogTitle>

					<DialogContent>
						<TextField
							className={classes.textField}
							variant="outlined"
							id="name"
							label="Email Address"
							type="email"
							fullWidth
							value={email}
							onChange={emailChange}
						/>
						<TextField
							className={classes.textField}
							variant="outlined"
							id="password"
							label="Password"
							type="password"
							fullWidth
							value={password}
							onChange={passwordChange}
							error={errorMsg ? true : false}
							helperText={errorMsg}
						/>
						<Grid container direction="row" spacing={1}>
							<Grid item xs>
								<FBButton
									setUser={setUser}
									handleClose={handleClose}
									setIsLogged={setIsLogged}
								/>
							</Grid>
							<Grid item xs>
								<GoogleBtn
									setUser={setUser}
									handleClose={handleClose}
									setIsLogged={setIsLogged}
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleSubmit} color="primary">
							Login
						</Button>
						<Button onClick={handleClose}>Cancel</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
};

export default Login;