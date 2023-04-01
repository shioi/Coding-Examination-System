import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';


import { useHistory } from "react-router-dom";


const Register = (props) => {
  const history = useHistory();
  const handleLink = (role) => {

    props.setRole(role);
    history.push('/signup')
  }
  return (
    <Grid
      container
      spacing={8}
      direction="row"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <Card sx={{ maxWidth: 400, minHeight: 300 }}>
          <CardActionArea
            onClick={() => { handleLink(0) }}>
            <CardMedia
              component="img"
              height="300"
              image={require("./img/student.png")}
              alt="Student"

            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                I am a Student
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card sx={{ maxWidth: 400, minHeight: 300 }}>
          <CardActionArea onClick={() => { handleLink(1) }}>
            <CardMedia
              component="img"
              height="300"
              image={require("./img/teacher.png")}
              alt="Teacher"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                I am a Teacher
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid >
  )
}

export default Register
