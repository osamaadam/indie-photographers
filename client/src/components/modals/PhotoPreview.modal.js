import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {Dialog} from "@material-ui/core";
import useWindowDimensions from "../utilities/WindowDimensions";

export default function PhotoPreview(props) {
	const {photo, username, show, setShow, maxHeight} = props;
	const {height} = useWindowDimensions();

	const [selfShow, setSelfShow] = useState(false);

	const history = useHistory();

	const handleShow = () => {
		setSelfShow(true);
		setShow(true);
		window.location.hash = "photo-preview";
	};

	const handleClose = () => {
		setSelfShow(false);
		if (props.location.hash === "#photo-preview") history.goBack();
	};

	const imagePreview = (
		<img
			src={photo}
			alt={`by, ${username}`}
			onClick={handleShow}
			style={{
				objectFit: "cover",
				objectPosition: "50% 50%",
				width: "100%",
				maxHeight: maxHeight
			}}
		/>
	);

	const fullImage = (
		<img
			src={photo}
			alt={`max width and height`}
			style={{
				objectFit: "contain",
				objectPosition: "50% 50%",
				maxWidth: "100%",
				maxHeight: `${0.9 * height}px`
			}}
		/>
	);

	return (
		<>
			{imagePreview}
			<Dialog
				open={show && selfShow}
				onClose={handleClose}
				fullWidth={true}
				maxWidth="xl"
				style={{
					display: "flex",
					justifyContent: "center"
				}}
			>
				{fullImage}
			</Dialog>
		</>
	);
}