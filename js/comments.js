/**
 * Comments functionality using Firebase Firestore
 * Shared Firebase project with crr-arts-website, using separate collection
 */

// Firebase configuration - Same as crr-arts-website
const firebaseConfig = {
    apiKey: "AIzaSyCmF3QReXBeZD-IxxgPPLZ8iF7_Tb2FKHU",
    authDomain: "crr-website-comments.firebaseapp.com",
    projectId: "crr-website-comments",
    storageBucket: "crr-website-comments.firebasestorage.app",
    messagingSenderId: "902796568529",
    appId: "1:902796568529:web:d39d1ce01dd490296da2f0"
};

// Collection name for this website (separate from crr-arts-website which uses 'comments')
const COLLECTION_NAME = 'poetry-comments';

// Set to true when using Firebase emulator for local testing
const USE_EMULATOR = false;
const EMULATOR_HOST = 'localhost';
const EMULATOR_PORT = 8080;

let db = null;

/**
 * Initialize Firebase
 */
function initFirebase() {
    try {
        // Initialize Firebase app
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // Get Firestore instance
        db = firebase.firestore();

        // Use emulator if in local development
        if (USE_EMULATOR) {
            db.useEmulator(EMULATOR_HOST, EMULATOR_PORT);
            console.log('Using Firestore emulator');
        }

        return true;
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        return false;
    }
}

/**
 * Load and display comments
 */
async function loadComments() {
    const commentsContainer = document.getElementById('comments-list');
    if (!commentsContainer || !db) return;

    commentsContainer.innerHTML = '<p class="loading-comments">Loading comments...</p>';

    try {
        const snapshot = await db.collection(COLLECTION_NAME)
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();

        if (snapshot.empty) {
            commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to leave one!</p>';
            return;
        }

        commentsContainer.innerHTML = '';

        snapshot.forEach(doc => {
            const comment = doc.data();
            const commentElement = createCommentElement(comment);
            commentsContainer.appendChild(commentElement);
        });

    } catch (error) {
        console.error('Error loading comments:', error);
        commentsContainer.innerHTML = '<p class="error-message">Failed to load comments. Please refresh the page.</p>';
    }
}

/**
 * Create a comment DOM element
 */
function createCommentElement(comment) {
    const article = document.createElement('article');
    article.className = 'comment';

    const date = comment.timestamp ?
        new Date(comment.timestamp.toDate()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'Just now';

    article.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${escapeHtml(comment.name)}</span>
            <span class="comment-date">${date}</span>
        </div>
        <p class="comment-text">${escapeHtml(comment.message)}</p>
    `;

    return article;
}

/**
 * Submit a new comment
 */
async function submitComment(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const nameInput = form.querySelector('#comment-name');
    const messageInput = form.querySelector('#comment-message');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        showFormMessage('Please fill in all fields.', 'error');
        return;
    }

    // Disable form while submitting
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';

    try {
        await db.collection(COLLECTION_NAME).add({
            name: name,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Clear form
        form.reset();
        showFormMessage('Comment posted successfully!', 'success');

        // Reload comments
        await loadComments();

    } catch (error) {
        console.error('Error posting comment:', error);
        showFormMessage('Failed to post comment. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Comment';
    }
}

/**
 * Show form feedback message
 */
function showFormMessage(message, type) {
    const existingMessage = document.querySelector('.form-feedback');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageElement = document.createElement('p');
    messageElement.className = `form-feedback form-feedback-${type}`;
    messageElement.textContent = message;

    const form = document.getElementById('comment-form');
    form.appendChild(messageElement);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize comments when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    const commentsSection = document.getElementById('comments-section');
    if (!commentsSection) return;

    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded');
        document.getElementById('comments-list').innerHTML =
            '<p class="error-message">Comments are temporarily unavailable.</p>';
        return;
    }

    // Initialize Firebase and load comments
    if (initFirebase()) {
        loadComments();

        // Set up form submission
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', submitComment);
        }
    }
});
