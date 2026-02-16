// Copy Protection for Poetry Website

(function() {
    'use strict';

    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable text selection via keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+A (Select All)
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            return false;
        }
        // Ctrl+C (Copy)
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            return false;
        }
        // Ctrl+X (Cut)
        if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
            return false;
        }
        // Ctrl+P (Print)
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            return false;
        }
        // Ctrl+S (Save)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (View Source) - note: may not work in all browsers
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        // F12 (Developer Tools) - note: may not work in all browsers
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
        }
    });

    // Disable copy event
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable cut event
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable selection via mouse
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Clear any selection that might occur
    document.addEventListener('mouseup', function() {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    });

    console.log('© All rights reserved. Content is protected.');
})();
