import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPage from "../components/HeaderPage";
import axios from "axios";
import MyEditor from "../components/MyEditor";
import { URL } from "../constants";

function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');

                if (accessToken) {
                    const response = await axios.get(`${URL}/check-auth`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });

                    if (response.data.isAuthenticated) {
                        setIsAuthenticated(true);
                    } else {
                        navigate('/login');
                    }
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Authentication failed");
            }
        };

        checkAuthentication();
    }, [navigate]);

    return (
        <div>
            {isAuthenticated ? (
                <div>
                    <HeaderPage
                        label="Administrator."
                        image="../images/beemer.jpeg"
                    />
                    <div className="space">
                        <MyEditor />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default AdminPage;
