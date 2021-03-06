import {
  Avatar,
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { AvatarGroup } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useWindowDimensions } from "..";

const useStyles = makeStyles((theme) => ({
  avGrp: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(2),
    maxWidth: theme.spacing(9),
    "&:hover": {
      cursor: "pointer",
    },
  },
  avatar: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  badge: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

interface Props {
  users: User[];
  liked: boolean;
  currentUser: User;
}

const Likes: React.FC<Props> = (props) => {
  const { users, liked, currentUser } = props;
  const [show, setShow] = useState(false);
  const { width } = useWindowDimensions();

  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();

  const entering = () => {
    handleShow();
  };

  const handleClose = () => {
    setShow(false);
    if (location.hash === "#likes") history.goBack();
  };

  useEffect(() => {
    if (location.hash !== "#likes") setShow(false);
  }, [location.hash]);

  const handleShow = () => {
    setShow(true);
    window.location.hash = "likes";
  };

  const likedUsers = users?.map((user) => {
    if (user && user._id !== currentUser._id) {
      return (
        <Link to={`/profile/${user._id}`} key={user._id} className="text-link">
          <ListItem alignItems="center">
            <ListItemAvatar>
              <Avatar alt={user.username} src={user.profilePicture} />
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary={user.admin ? `Admin` : `User`}
            />
          </ListItem>
        </Link>
      );
    } else if (user._id !== currentUser._id) {
      return (
        <ListItem alignItems="center" key="">
          <ListItemAvatar>
            <Avatar alt="Deleted User" src="" />
          </ListItemAvatar>
          <ListItemText primary="Deleted User" secondary="Deleted" />
        </ListItem>
      );
    }
  });
  let i = 0;

  const AvatarArray = () => (
    <>
      {liked && (
        <Avatar
          className={classes.avatar}
          alt={currentUser.username}
          src={currentUser.profilePicture}
        />
      )}
      {users.map((user) => {
        if (user._id !== currentUser._id && (liked ? i < 2 : i < 3)) {
          // this shouldn't work but it does
          i++;
          return (
            <Avatar
              key={user._id}
              className={classes.avatar}
              alt={user.username}
              src={user.profilePicture}
            />
          );
        }
        return null;
      })}
    </>
  );

  const likeGroup = users && (
    <Badge
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      badgeContent={users.length + (liked ? 1 : 0) > 3 ? users.length - 3 : 0}
      color="primary"
      max={99}
      onClick={handleShow}
      className={classes.badge}
    >
      <AvatarGroup className={classes.avGrp} onClick={handleShow}>
        <AvatarArray />
      </AvatarGroup>
    </Badge>
  );

  return (
    <>
      {likeGroup}
      <Dialog
        open={show}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth={true}
        fullScreen={width < 500}
        onEntering={entering}
        scroll="paper"
      >
        <DialogTitle
          id="form-dialog-title"
          style={{
            height: width > 500 ? "1rem" : "3.5rem",
          }}
        >
          <IconButton
            style={{
              marginRight: "1rem",
              display: width < 500 ? `` : `none`,
            }}
            onClick={handleClose}
          >
            <ArrowBackIosIcon />
          </IconButton>
          Liked by
        </DialogTitle>
        <DialogContent>
          <List>
            <Divider />
            {liked && (
              <ListItem alignItems="center">
                <ListItemAvatar>
                  <Avatar
                    alt={currentUser.username}
                    src={currentUser.profilePicture}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={currentUser.username}
                  secondary={currentUser.admin ? `Admin` : `User`}
                />
              </ListItem>
            )}
            {likedUsers}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Likes;
