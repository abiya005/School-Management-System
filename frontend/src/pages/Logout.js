import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { authLogout } from '../redux/userRelated/userSlice';
import styled from 'styled-components';

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                // Inform backend about logout (if API exists)
                await axios.post("http://localhost:6000/api/auth/logout");

                // Dispatch Redux logout action first
                dispatch(authLogout());

                // Clear local storage AFTER Redux state reset
                setTimeout(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    localStorage.clear();
                }, 100); // Small delay to ensure Redux state updates first

                // Redirect to login
                navigate('/login');
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

        handleLogout();
    }, [dispatch, navigate]);

    return (
        <LogoutContainer>
            <h1>Logging Out...</h1>
            <p>Please wait while we log you out.</p>
        </LogoutContainer>
    );
};

export default Logout;

const LogoutContainer = styled.div`
  text-align: center;
  margin-top: 50px;
  font-size: 20px;
`;
