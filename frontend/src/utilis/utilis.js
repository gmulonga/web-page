import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

export function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 20; i--) {
        years.push(i);
    }
    return years.map((year) => (
        <option key={year} value={year}>
            {year}
        </option>
    ));
}


// utils/modalUtils.js

export function openModal(setModalVisible) {
    setModalVisible(true);
}

export function closeModal(setModalVisible) {
    setModalVisible(false);
}
