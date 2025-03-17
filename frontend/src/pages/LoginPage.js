import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Grid, Box, Typography, Paper, TextField, CssBaseline, CircularProgress, Backdrop } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Popup from '../components/Popup';

const defaultTheme = createTheme();

const LoginPage = ({ role }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    let fields = {};
    role = role.toLowerCase();

    if (role === "student") {
      fields = {
        rollNum: event.target.rollNumber.value.trim(),
        studentName: event.target.studentName.value.trim(),
        password: event.target.password.value.trim(),
        role,
      };
    } else {
      fields = {
        email: event.target.email.value.trim(),
        password: event.target.password.value.trim(),
        role,
      };
    }

    setLoader(true);

    try {
      const { data } = await axios.post("http://localhost:6000/api/auth/login", fields);
      const token = data.token || data.data?.token;
      if (!token) throw new Error("Token missing from response");

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate(`/${role}/dashboard`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
      setShowPopup(true);
      setLoader(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>{role} Login</Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>{loader ? <CircularProgress size={24} color="inherit" /> : "Login"}</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}><CircularProgress color="primary" />Please Wait</Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </ThemeProvider>
  );
};

export default LoginPage;
