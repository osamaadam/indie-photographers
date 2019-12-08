import React, {useState} from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FBButton from "../FBButton";
import ProfileAvatar from "../ProfileAvatar";

export default function Login(props) {
	const {isLogged, setIsLogged, setUser, user} = props;

	const [show, setShow] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const handleClose = () => {
		setShow(false);
		setErrorMsg("");
	};

	const handleShow = () => {
		setShow(true);
		setErrorMsg("");
	};

	const emailChange = (event) => setEmail(event.target.value);
	const passwordChange = (event) => setPassword(event.target.value);
	const handleSubmit = (event) => {
		if (!email || !password) {
			setErrorMsg("Please enter all fields");
			event.preventDefault();
		} else {
			const user = {
				email,
				password
			};
			axios
				.post("/api/auth/", user)
				.then((res) => {
					const {token, user} = res.data;
					if (token) {
						localStorage.setItem("token", token);
						setEmail("");
						setPassword("");
						handleClose();
						setIsLogged(true);
					}
					if (user) {
						setUser(user);
					}
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
		<ProfileAvatar user={user} setIsLogged={setIsLogged} />
	);

	const loginError = errorMsg ? (
		<div className="alert alert-danger" role="alert">
			{errorMsg}
		</div>
	) : null;
	return (
		<>
			{loginButton}
			<Dialog
				open={show}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<form onSubmit={handleSubmit}>
					<DialogTitle id="form-dialog-title">Login</DialogTitle>

					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Email Address"
							type="email"
							fullWidth
							value={email}
							onChange={emailChange}
						/>
						<TextField
							autoFocus
							margin="dense"
							id="password"
							label="Password"
							type="password"
							fullWidth
							value={password}
							onChange={passwordChange}
						/>

						<div>
							<FBButton
								setUser={setUser}
								handleClose={handleClose}
								setIsLogged={setIsLogged}
							/>
						</div>
						{loginError}
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
}
