import {
  Button,
  Chip,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PersonIcon from "@material-ui/icons/Person";
import DateRangeIcon from "@material-ui/icons/DateRange";
import LanguageIcon from "@material-ui/icons/Language";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import PhoneIcon from "@material-ui/icons/Phone";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import JobsApi from "../../../apis/JobsApi";
import useStyles from "./styles";
import Register from "../../Register/Register";
import ROLES from "../../../utils/roles";

const JobDetail = () => {
  const classes = useStyles();

  const { id } = useParams();
  const [jobDetail, setJobDetail] = useState([]);
  const user = JSON.parse(localStorage.getItem("profile")); // get logged in user

  let history = useHistory();

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const res = await JobsApi.get(`/${id}`);
        setJobDetail(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchJobDetail();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (window.confirm("Delete this job?")) {
        // Confirmation message
        await JobsApi.delete(`/${id}`);
        // redirect to home page
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // no such job (can be abstracted out to a 404 page)
  // if (jobDetail.length === 0) {
  //   return (
  //     <div>
  //       <h1>Job not found</h1>
  //       <div className="card-footer">
  //         <Link to="/">Return to Board</Link>
  //       </div>
  //     </div>
  //   );
  // }

  const isCreator = () =>
    (user?.result?.name === jobDetail.organizer ||
      user?.result?.role === ROLES.Admin) && (
      <Grid>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          component={Link}
          to={`/jobs/${jobDetail._id}/edit`}>
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<DeleteIcon />}
          onClick={handleDelete}>
          Delete
        </Button>
      </Grid>
    );

  const formatDate = () => {
    const start = new Date(jobDetail.startDate);
    const end = new Date(jobDetail.endDate);
    return `${start.getDay()}/${start.getMonth()}/${start.getFullYear()} - ${end.getDay()}/${end.getMonth()}/${end.getFullYear()}`;
  };

  return (
    <>
      <Container maxWidth="md">
        {jobDetail && (
          <Card className={classes.card}>
            <CardMedia
              className={classes.cardMedia}
              image={
                jobDetail.selectedFile || "https://source.unsplash.com/random"
              }
              title="Job Image"
            />
            <CardContent className={classes.cardContent}>
              <Typography variant="h4">
                <b>{jobDetail.title}</b>
              </Typography>
              <Typography gutterBottom variant="h6" color="textSecondary">
                By {jobDetail.organizer}
              </Typography>
              <hr />

              <Typography variant="h5">
                <b>About</b>
              </Typography>
              <Typography paragraph>{jobDetail.purpose}</Typography>

              <Typography variant="h5">
                <b>Skills Required</b>
              </Typography>
              <Typography paragraph>{jobDetail.skills}</Typography>

              <Typography variant="h5">
                <b>Dates and Duration</b>
              </Typography>
              <Grid container direction="row" alignItems="center">
                <DateRangeIcon />
                <Typography>&nbsp; {formatDate()}</Typography>
              </Grid>
              <Grid container direction="row" alignItems="center">
                <QueryBuilderIcon />
                <Typography>&nbsp; {jobDetail.hours} hours</Typography>
              </Grid>
              <br></br>
              <Typography variant="h5">
                <b>Causes</b>
              </Typography>
              <Grid>
                {jobDetail.categories &&
                  jobDetail.categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      clickable={true}
                      style={{ margin: 2 }}
                    />
                  ))}
              </Grid>
              <hr />

              <Typography gutterBottom variant="h5">
                <b>Contact Information</b>
              </Typography>
              <Grid container direction="row" alignItems="center">
                <PersonIcon />
                <Typography>&nbsp; {jobDetail.contactName}</Typography>
              </Grid>
              <Grid container direction="row" alignItems="center">
                <PhoneIcon />
                <Typography>&nbsp; {jobDetail.telephoneNum}</Typography>
              </Grid>
              <Grid container direction="row" alignItems="center">
                <PhoneAndroidIcon />
                <Typography>&nbsp; {jobDetail.mobileNum}</Typography>
              </Grid>
              <Grid container direction="row" alignItems="center">
                <MailOutlineIcon />
                <Typography display="inline" href={`mailto:${jobDetail.email}`}>
                  &nbsp; {jobDetail.email}
                </Typography>
              </Grid>
              <Grid container direction="row" alignItems="center">
                <LanguageIcon />
                <Typography
                  display="inline"
                  href={`https://${jobDetail.website}`}>
                  &nbsp; {jobDetail.website}
                </Typography>
              </Grid>

              <hr />
            </CardContent>
            <CardActions>
              <Grid>
                {isCreator()}
                <Button component={Link} to={`/`} color="primary">
                  Return to Board
                </Button>
              </Grid>
            </CardActions>
            <CardContent className={classes.cardContent}>
              <Typography color="textSecondary" variant="subtitle1">
                Last updated: {new Date(jobDetail.updatedAt).toDateString()}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
      {user && (
        <Container maxWidth="md">
          <Register
            jobId={id}
            isOrganizerOrAdmin={
              user?.result?.name === jobDetail.organizer ||
              user?.result?.role === ROLES.Admin
            }
          />
        </Container>
      )}
    </>
  );
};

export default JobDetail;
