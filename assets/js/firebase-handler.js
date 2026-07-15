import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * Firebase Auth Listener
 */
onAuthStateChanged(auth, (user) => {
    const authStatusElements = document.querySelectorAll('.auth-status');
    if (user) {
        console.log("CrownPrevail Auth: User signed in as", user.email);
        authStatusElements.forEach(el => el.textContent = `Signed in as ${user.email}`);
    } else {
        console.log("CrownPrevail Auth: No user signed in.");
        authStatusElements.forEach(el => el.textContent = 'Not signed in');
    }
});

/**
 * Generic Form Submission Handler for Firestore
 */
export async function handleFormSubmission(formId, collectionName, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn ? submitBtn.innerHTML : 'Submit';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            const label = submitBtn.querySelector('.button__label');
            if (label) label.innerText = 'Sending...';
            else submitBtn.innerText = 'Sending...';
        }

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            if (value) data[key] = value;
        });
        
        data.submittedAt = serverTimestamp();
        data.pageUrl = window.location.href;
        data.userAgent = navigator.userAgent;

        try {
            await addDoc(collection(db, collectionName), data);
            
            const successMsg = form.querySelector('.form-success-msg') || document.getElementById('form-success');
            if (successMsg) {
                successMsg.style.display = 'flex';
                form.reset();
                setTimeout(() => { successMsg.style.display = 'none'; }, 8000);
            } else {
                const msg = successMessage || 'Thank you! Your request has been sent successfully.';
                alert(msg);
                form.reset();
            }
        } catch (error) {
            console.error("Firebase Submission Error: ", error);
            alert('Oops! There was an error. Please check your connection and try again.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        }
    });
}

/**
 * Auth Functions
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Initialize all form handlers
 */
document.addEventListener('DOMContentLoaded', () => {
    handleFormSubmission('contact-form', 'contact_inquiries');
    handleFormSubmission('quote-form', 'quote_requests');
    handleFormSubmission('pricing-quote-form', 'quote_requests');
    handleFormSubmission('newsletter-form', 'newsletter_subscriptions', 'Thank you for subscribing!');
    handleFormSubmission('tracking-form', 'tracking_inquiries', 'Tracking inquiry received. We will respond shortly.');
    handleFormSubmission('comment-form', 'blog_comments', 'Thank you for your comment!');
});
