import React, {useState, useEffect} from "react";
import axios from "axios";
import {BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./routes/Home";
import Marketplace from "./routes/Marketplace";
import Profile from "./routes/Profile";
import Feed from "./routes/Feed";
import ExtProfile from "./routes/ExtProfile";
import MenuAppBar from "./components/MenuAppBar";

function App() {
	const [isLogged, setIsLogged] = useState(
		localStorage.getItem("token") ? true : false
	);
	const [user, setUser] = useState({admin: false});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (isLogged) {
			axios
				.get("/api/auth/user", {
					headers: {
						"x-auth-token": `${token}`
					}
				})
				.then((res) => {
					setUser(res.data);
					setIsLogged(true);
				})
				.catch((err) => {
					if (err) {
						setIsLogged(false);
					}
				});
		} else {
			localStorage.removeItem("token");
		}
	}, [isLogged]);

	return (
		<Router>
			<>
				<MenuAppBar
					isLogged={isLogged}
					setIsLogged={setIsLogged}
					user={user}
					setUser={setUser}
				/>
				<Route exact path="/" component={Home} />
				<Route
					path="/marketplace"
					render={(props) => (
						<Marketplace {...props} isLogged={isLogged} user={user} />
					)}
				/>
				<Route exact path={["/profile", `/profile/${user._id}`]}>
					<Profile user={user} setIsLogged={setIsLogged} />
				</Route>
				<Route
					path="/profile/:id"
					render={(props) => <ExtProfile {...props} user={user} />}
				/>
				<Route
					path="/feed"
					render={(props) => (
						<Feed {...props} isLogged={isLogged} user={user} />
					)}
				/>
			</>
		</Router>
	);
}

export default App;
