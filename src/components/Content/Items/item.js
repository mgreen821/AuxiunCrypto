import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
const ipfsUrl = "http://127.0.0.1:5001/api/v0/";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300,
    margin: 10
  },
  media: {
    height: 0,
    paddingTop: "90%"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    //backgroundColor: red[500],
  },
  cardContainer: {
    height: "500px"
  }
}));

export default function Item(props) {
  //const {item} = props.items;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [imgUrl, setImgUrl] = useState("");

  useEffect(async () => {
    //Fetch image from IPFS
    fetch(`${ipfsUrl}cat/${props.items.image}`, {
      method: "POST",
      mode: "cors"
    })
      // The following ReadableStream function was adapted from the example at:
      // developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
      .then((res) => {
        const reader = res.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into stream
                controller.enqueue(value);
                return pump();
              });
            }
          }
        });
      })
      .then((stream) => new Response(stream))
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob))
      .then((url) => setImgUrl(url))
      .catch((err) => console.error(err));

    return function cleanup() {
      URL.revokeObjectURL(imgUrl);
    };
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={classes.cardContainer}>
      <Card className={classes.root}>
        <CardHeader title={props.items.name} subheader={props.items.game} />
        <CardMedia
          className={classes.media}
          image={imgUrl}
          title={props.items.description}
        />
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
      </Card>
      <img className={classes.media} src={imgUrl}></img>
    </div>
  );
}
