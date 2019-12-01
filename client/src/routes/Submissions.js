import React, {useState, useEffect} from "react";
import axios from "axios";
import Loadingpage from "../components/Loadingpage";
import Submission from "../components/Submission";

export default function Marketplace() {
	const [subs, setSubs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		axios
			.get(`/api/submissions/`)
			.then((res) => {
				setSubs(res.data);
				setIsLoading(false);
			})
			.catch((err) => console.log(`Error: ${err}`));
	}, []);

	const subMedia = subs.map((sub, i) => <Submission sub={sub} key={i} />);

	if (isLoading) return <Loadingpage />;
	return <div className="container">{subMedia}</div>;
}