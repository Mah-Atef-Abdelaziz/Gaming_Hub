/**
 * Main JavaScript file for the Gaming Hub website
 * 
 * This file handles common functionality across the entire website,
 * including navigation, smooth scrolling, and UI enhancements.
 * 
 * Features:
 * - Smooth scrolling for anchor links
 * - Active navigation highlighting
 * - Page initialization
 */

/**
 * Initializes the website functionality when the DOM is fully loaded
 * Sets up event listeners and UI state
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('Gaming Hub website loaded!');

    /**
     * Implements smooth scrolling for anchor links
     * Prevents default jump behavior and adds smooth animation
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip empty anchors

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });

    /**
     * Highlights the current page in the navigation menu
     * Adds 'active' class to the current page link
     */
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== '#') {
            link.classList.add('active');
        }
    });
});