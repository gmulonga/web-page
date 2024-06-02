import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCirclePlus, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import SendEmail from './SendingEmails';
import MiniDrawer from './DrawerFunction';
import CustomerRequests from './GetRequest';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import SpareRequests from './GetSparesRequest';


const MyEditor = () => {

    const [selectedMenuItem, setSelectedMenuItem] = useState(null);

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };


    function showSection(sectionId) {
        const sections = ['general-adm-page', 'adm-send-newsletter', 'admin-add-car'];

        for (const section of sections) {
            const element = document.getElementById(section);
            const button = document.getElementById(section + '-button');
            if (section === sectionId) {
                element.style.display = 'block';
                button.classList.add('selected');
                updateSliderPosition(button);
            } else {
                element.style.display = 'none';
                button.classList.remove('selected');
            }
        }
    }

    function updateSliderPosition(button) {
        const buttonContainer = document.querySelector('.button-container');
        const buttonSlider = document.querySelector('.button-slider');

        const selectedButtonIndex = Array.from(buttonContainer.children).indexOf(button);
        const buttonWidth = buttonContainer.offsetWidth / 3; // Assuming 3 buttons

        buttonSlider.style.left = `${selectedButtonIndex * buttonWidth}px`;
    }

    // Initially show the 'General' section and highlight its button
    window.onload = function () {
        showSection('general-adm-page');
        document.getElementById('general-adm-page-button').classList.add('selected');
    };


    return (
        <div className='adm-page container'>

            {/* tab buttons */}

            <div className='navigation-buttons'>
                <div className="button-container">
                    <button id='general-adm-page-button' onClick={() => showSection('general-adm-page')}>General <FontAwesomeIcon icon={faHouse} /></button>
                    <button id='adm-send-newsletter-button' onClick={() => showSection('adm-send-newsletter')}>Newsletter <FontAwesomeIcon icon={faEnvelope} /></button>
                    <button id='admin-add-car-button' onClick={() => showSection('admin-add-car')}>Customer Requests <FontAwesomeIcon icon={faCirclePlus} /></button>
                    <div className="button-slider"></div>
                </div>
            </div>


            {/* the general page */}

            <div className='general-adm-page' id='general-adm-page'>
                <MiniDrawer />
            </div>


            {/* the send email tab page */}

            <div className='adm-send-newsletter' id='adm-send-newsletter' style={{ display: 'none' }}>
                <SendEmail />
            </div>


            {/* adding of a car */}
            <div className='row'>
                <div className='container admin-add-car col-lg-4' id='admin-add-car' style={{ display: 'none' }}>
                    <Sidebar>
                        <Menu>
                            <MenuItem onClick={() => handleMenuItemClick("Car request")} className='car-name'>Car request</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick("Spare request")} className='car-name'>Spare request</MenuItem>
                        </Menu>
                    </Sidebar>
                </div>

                <div className="content-bar col-lg-8">
                    {selectedMenuItem && (
                        <div className="content-drawer">

                            {selectedMenuItem === "Car request" && (
                                <CustomerRequests />
                            )}
                            {selectedMenuItem === "Spare request" && (
                                <SpareRequests />
                            )}
                        </div>
                    )}
                </div>
            </div>

        </div>

    );
};

export default MyEditor;

