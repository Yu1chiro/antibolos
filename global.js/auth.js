import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC_1C4BvKMopvJAahJYm9e1H25fblmq0Ts",
    authDomain: "absensi-project-9c7da.firebaseapp.com",
    databaseURL: "https://absensi-project-9c7da-default-rtdb.firebaseio.com",
    projectId: "absensi-project-9c7da",
    storageBucket: "absensi-project-9c7da.appspot.com",
    messagingSenderId: "282577205215",
    appId: "1:282577205215:web:db4a5079f1e462e6a6f66a",
    measurementId: "G-YKGFS1JRHY"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Fungsi untuk cek user di database admin
const checkUserExists = (user) => {
    if (user) {
        const uid = user.uid;
        const usersRef = ref(database, `admin/${uid}`);
        return get(usersRef).then(snapshot => snapshot.exists());
    }
    return Promise.resolve(false);
};

// Mengecek status autentikasi user
onAuthStateChanged(auth, (user) => {
    const isAdminPage = window.location.href.includes("admin.html");
    const isLoginPage = window.location.href.includes("Login.html");

    if (user) {
        checkUserExists(user).then(isAdmin => {
            if (!isAdmin && isAdminPage) {
                // Redirect ke halaman login jika bukan admin dan mencoba mengakses admin page
                location.href = "http://127.0.0.1:5501/Login.html";
            } else if (isAdmin && !isAdminPage) {
                // Redirect ke admin page jika admin dan tidak sedang di admin page
                location.href = "http://127.0.0.1:5501/admin.html";
            }
        });
    } else if (!isLoginPage) {
        // Redirect ke halaman login jika tidak login dan bukan sedang di halaman login
        location.href = "http://127.0.0.1:5501/Login.html";
    }
});

// Logout
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        signOut(auth).then(() => {
            Swal.fire({
                title: 'Logout successful',
                icon: 'success',
                timer: 5000,
                showConfirmButton: false
            }).then(() => {
                location.href = "http://127.0.0.1:5501/Login.html";
            });
        }).catch(error => {
            console.error('Sign out error', error);
        });
    });
}
