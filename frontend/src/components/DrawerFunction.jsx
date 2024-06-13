import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import AddCar from "../admin-components/AddCar";
import AddTestimony from "../admin-components/AddTestimony";
import Testimonials from "./GetTestimonies";
import CarList from "../admin-components/DeleteCar";
import AddSparePart from "../admin-components/AddSparePart";
import DeleteSparePart from "../admin-components/DeleteSparePart";
import { useNavigate } from 'react-router-dom';
import EmailConfiguration from "../email/EmailConfiguration";
import SetPassword from "../admin-components/SetPassword";
import UpdateCredentials from "../admin-components/UpdatePassword";
import UpdateEmail from "../email/UpdateEmailConfiguration";

function MiniDrawer() {
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/');
    };


    return (
        <div className="row drawer-row">
            <div className="side-bar col-lg-4">
                <div className="inner-bar">
                    <Sidebar>
                        <Menu>
                            <SubMenu className='car-name' label="Vehicle Management">
                                <MenuItem onClick={() => handleMenuItemClick("Add car")} className='car-name'>Add car</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick("DeleteCar")} className='car-name'>Delete Car</MenuItem>
                            </SubMenu>
                            <SubMenu className='car-name' label="Testimonies">
                                <MenuItem onClick={() => handleMenuItemClick("Add Testimony")} className='car-name'>Add Testimony</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick("Edit & Delete Testimony")} className='car-name'>Edit & Delete Testimony</MenuItem>
                            </SubMenu>
                            <SubMenu className='car-name' label="About Us">
                                <MenuItem onClick={() => handleMenuItemClick("Add About Us")} className='car-name'>Add About Us</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick("Edit & Delete About Us")} className='car-name'>Edit & Delete About Us</MenuItem>
                            </SubMenu>
                            <SubMenu className='car-name' label="Spare Parts">
                                <MenuItem onClick={() => handleMenuItemClick("Add Spare Part")} className='car-name'>Add Spares Part</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick("Delete Spare Part")} className='car-name'>Delete Spare part</MenuItem>
                            </SubMenu>
                            <SubMenu className='car-name' label="Footer Settings">
                                <MenuItem onClick={() => handleMenuItemClick("Add Social")} className='car-name'>Add Social Media Platforms</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick("Add Patner Icon")} className='car-name'>Add Patner Icon</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick("Delete Patner Icon")} className='car-name'>Delete Patner Icon</MenuItem>
                            </SubMenu>
                            <SubMenu className='car-name' label="Settings">
                                <MenuItem onClick={() => handleMenuItemClick("Email Configuration")} className='car-name'>Email Configuration</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick("Change Email Configuration")} className='car-name'>Change Email Configuration</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick("Set Password")} className='car-name'>Set Password</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick("Change Password")} className='car-name'>Change Password</MenuItem>
                            </SubMenu>
                            <MenuItem onClick={() => handleLogout("Logout")} className='car-name'>Logout</MenuItem>
                        </Menu>
                    </Sidebar>
                </div>

            </div>
            <div className="content-bar col-lg-8">
                {selectedMenuItem && (
                    <div className="content-drawer">
                        {selectedMenuItem === "Add car" && (
                            <AddCar />
                        )}

                        {selectedMenuItem === "DeleteCar" && (
                            <CarList />
                        )}
                        {selectedMenuItem === "Add Testimony" && (
                            <AddTestimony />
                        )}
                        {selectedMenuItem === "Edit & Delete Testimony" && (
                            <Testimonials />
                        )}

                        {selectedMenuItem === "Add Spare Part" && (
                            <AddSparePart />
                        )}
                        {selectedMenuItem === "Delete Spare Part" && (
                            <DeleteSparePart />
                        )}
                        {selectedMenuItem === "Email Configuration" && (
                           <EmailConfiguration />
                        )}
                        {selectedMenuItem === "Set Password" && (
                           <SetPassword />
                        )}
                        {selectedMenuItem === "Change Password" && (
                           <UpdateCredentials />
                        )}
                        {selectedMenuItem === "Change Email Configuration" && (
                           <UpdateEmail />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


export default MiniDrawer;
