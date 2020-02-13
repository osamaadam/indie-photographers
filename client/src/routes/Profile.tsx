import {
	Avatar,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	makeStyles,
	Paper,
	Typography
} from "@material-ui/core";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import axios from "axios";
import React, {useEffect, useRef, useState, lazy, Suspense} from "react";
import {useParams} from "react-router-dom";
import {PhotoPreview, PostSkeleton, SnackAlert} from "../components/index";
import "../css/profile.css";

const PostMedia = lazy(() => import("../components/PostMedia"));

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		maxWidth: 360,
		padding: theme.spacing(2)
	}
}));

interface Props {
	currentUser: User;
}

const Profile: React.FC<Props> = ({currentUser}) => {
	const [user, setUser] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [openError, setOpenError] = useState<boolean>(false);
	const [severity, setSeverity] = useState<Severity>(undefined);
	const [lastElement, setLastElement] = useState<HTMLDivElement | null>(null);

	const classes = useStyles();
	const params: {id?: string} = useParams();

	const handleDelete = (id: string) => {
		const token: string | null = localStorage.getItem("token");

		axios
			.delete(`/api/feed/delete/${id}`, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				setErrorMsg(res.data as string);
				setSeverity("success");
				setOpenError(true);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		setIsLoading(true);
		if (hasMore) {
			if (params.id) {
				let cachedData: Post[] = JSON.parse(
					localStorage.getItem(`${params.id}/page${page}`) as string
				);
				if (cachedData) {
					setPosts((prevPosts) =>
						[...prevPosts, ...cachedData].filter(
							(post) => post.user._id === params.id
						)
					);
					setIsLoading(false);
					setHasMore(cachedData.length === 10);
				} else {
					axios
						.get(`/api/feed/user/${params.id}/?page=${page}`)
						.then((res) => {
							const data: Post[] = res.data;

							setPosts((prevPosts) => [...prevPosts, ...data]);

							setHasMore(data.length === 10);
							localStorage.setItem(
								`${params.id}/page${page}`,
								JSON.stringify(
									data.filter((post) => post.user._id === params.id)
								)
							);
							setErrorMsg("");
							setOpenError(false);
							setIsLoading(false);
						})
						.catch((err) => {
							if (err) {
								if (cachedData) {
									setHasMore(cachedData.length === 0);
								} else {
									setHasMore(false);
								}
								if (err) {
									setErrorMsg("User not found");
									setSeverity("error");
									setOpenError(true);
								} else {
									setErrorMsg("Can't connect to the internet!");
									setSeverity("warning");
									setOpenError(true);
								}
								setIsLoading(false);
							}
						});
				}
			}
		} else setIsLoading(false);
	}, [page, params.id, hasMore]);

	useEffect(() => {
		if (params.id) {
			let cachedData: User = JSON.parse(
				localStorage.getItem(`${params.id}`) as string
			);
			if (cachedData) setUser(cachedData);

			axios
				.get(`/api/users/${params.id}`)
				.then((res) => {
					const data: User = res.data;
					setUser(data);
					localStorage.setItem(`${params.id}`, JSON.stringify(data));
				})
				.catch((err) => {
					if (err) {
						setErrorMsg("Can't find user");
						setSeverity("error");
						setOpenError(true);
					}
				});
		}
	}, [params.id]);

	const observer = useRef(
		new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
			if (entries[0].isIntersecting) {
				setPage((page) => page + 1);
			}
		})
	);

	useEffect(() => {
		const currentElement = lastElement;
		const currentObserver = observer.current;

		if (currentElement) currentObserver.observe(currentElement);

		return () => {
			if (currentElement) currentObserver.unobserve(currentElement);
		};
	}, [lastElement]);

	const postMedia = posts
		? posts.map((feedPost, i) => {
				if (posts.length === i + 1) {
					return (
						<div ref={setLastElement} key={feedPost._id}>
							<Suspense fallback={<PostSkeleton />}>
								<PostMedia
									feedPost={feedPost}
									currentUser={currentUser}
									handleDelete={handleDelete}
								/>
							</Suspense>
							{hasMore ? <PostSkeleton /> : null}
						</div>
					);
				} else {
					return (
						<div key={feedPost._id}>
							<Suspense fallback={<PostSkeleton />}>
								<PostMedia
									feedPost={feedPost}
									currentUser={currentUser}
									handleDelete={handleDelete}
								/>
							</Suspense>
						</div>
					);
				}
		  })
		: null;

	return (
		<div className="container">
			{user ? (
				<>
					<Paper className="main-block">
						<div className="cover-photo" />
						<PhotoPreview
							photo={user.profilePicture}
							alt={user.username}
							round={true}
						/>
						<div className="tagline">
							<Typography variant="h5">{user.username}</Typography>
							<Typography
								style={{
									fontStyle: "italic"
								}}
							>
								<span className="highlight">title</span>
							</Typography>
						</div>
						<div className="main-info">
							<Typography>
								Irure culpa sint tempor Lorem Lorem eu eu consequat in elit.
								Laborum id magna mollit pariatur. Incididunt velit mollit sit
								aliqua duis esse nisi velit esse ad occaecat voluptate aliqua
								esse. Adipisicing pariatur sint consequat ea et pariatur sint
								nisi anim.
							</Typography>
						</div>
					</Paper>
					<Paper className="details-block">
						<List className={classes.root}>
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<ImageIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary="Placeholder" secondary="Placeholder" />
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<WorkIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary="Placeholder" secondary="Placeholder" />
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<BeachAccessIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary="Placeholder" secondary="Placeholder" />
							</ListItem>
						</List>
					</Paper>
				</>
			) : null}

			<div className="post-block">
				{postMedia}
				{!hasMore && !isLoading ? (
					<DoneAllIcon
						style={{
							position: "relative",
							width: "100%",
							textAlign: "center"
						}}
					/>
				) : null}
			</div>
			<SnackAlert
				severity={severity}
				openError={openError}
				setOpenError={setOpenError}
				errorMsg={errorMsg}
			/>
		</div>
	);
};

export default Profile;
