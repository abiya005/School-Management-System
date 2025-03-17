import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import { Grid, Paper, Box, Container, CircularProgress, Backdrop } from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import styled from 'styled-components';
import Popup from '../components/Popup';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const { status, currentUser, currentRole } = useSelector((state) => state.user);

  const navigateHandler = async (role) => {
    if (visitor === "guest") {
      const guestCredentials = {
        admin: { email: "yogendra@12", password: "zxc", role: "admin" },
        student: { rollNum: "1", studentName: "Dipesh Awasthi", password: "zxc", role: "student" },
        teacher: { email: "tony@12", password: "zxc", role: "teacher" },
      };

      if (!guestCredentials[role]) return;

      setLoader(true);
      try {
        await dispatch(loginUser(guestCredentials[role]));
      } catch (error) {
        setMessage("Guest login failed");
        setShowPopup(true);
        setLoader(false);
      }
    } else {
      navigate(`/${role}login`);
    }
  };

  useEffect(() => {
    if (status === 'success' && currentUser) {
      const dashboardRoutes = {
        admin: '/Admin/dashboard',
        student: '/Student/dashboard',
        teacher: '/Teacher/dashboard',
      };
      navigate(dashboardRoutes[currentRole] || '/');
    } else if (status === 'error') {
      setMessage("Login failed. Try again.");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          {["admin", "student", "teacher"].map((role) => (
            <Grid item xs={12} sm={6} md={4} key={role}>
              <StyledPaper elevation={3} onClick={() => navigateHandler(role)}>
                <Box mb={2}>
                  {role === "admin" ? <AccountCircle fontSize="large" /> : role === "student" ? <School fontSize="large" /> : <Group fontSize="large" />}
                </Box>
                <StyledTypography>{role.charAt(0).toUpperCase() + role.slice(1)}</StyledTypography>
                Login as a {role}.
              </StyledPaper>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
        <CircularProgress color="inherit" />
        Please Wait
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: linear-gradient(to bottom, #411d70, #19118b);
  height: 120vh;
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const StyledPaper = styled(Paper)`
  padding: 20px;
  text-align: center;
  background-color: #1f1f38;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;

  &:hover {
    background-color: #2c2c6c;
    color: white;
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 10px;
`;
