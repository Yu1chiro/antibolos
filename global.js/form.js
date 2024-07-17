import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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
const database = getDatabase(app);

// Fungsi untuk mendapatkan lokasi pengguna
const getLocation = (callback, errorCallback) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback, errorCallback);
    } else {
        errorCallback(new Error("Geolokasi tidak didukung oleh browser ini."));
    }
};

// Fungsi untuk menentukan keterangan berdasarkan lokasi
const determineKeterangan = (latitude, longitude) => {
    const targetLatitude = -6.917464;  // Latitude lokasi yang ditentukan
    const targetLongitude = 107.619123; // Longitude lokasi yang ditentukan
    const tolerance = 0.01; // Toleransi jarak dalam derajat

    const isWithinLocation = Math.abs(latitude - targetLatitude) <= tolerance && Math.abs(longitude - targetLongitude) <= tolerance;
    return isWithinLocation ? "Hadir" : "Alpa";
};

// Event listener untuk tombol submit
document.getElementById("submit-data").addEventListener("click", () => {
    const name = document.getElementById("Name").value;
    const nim = document.getElementById("Nim").value;
    const prodi = document.getElementById("Prodi").value;
    const Jabatan = document.getElementById("Jabatan").value;
    const statusMessage = document.getElementById("status-message");

    if (!name || !nim || !prodi || !Jabatan) {
        statusMessage.textContent = "Harap isi form absensi dengan lengkap";
        statusMessage.className = "text-danger fw-bold";
        return;
    }

    getLocation((position) => {
        const { latitude, longitude } = position.coords;
        const keterangan = determineKeterangan(latitude, longitude);

        const newData = {
            name,
            nim,
            prodi,
            Jabatan,
            keterangan,
            location: {
                latitude,
                longitude
            },
            timestamp: Date.now()
        };

        const submitButton = document.getElementById("submit-data");
        submitButton.textContent = "...........";
        submitButton.disabled = true;

        // Menyimpan data ke Firebase
        const newDataRef = ref(database, 'data-absensi/' + nim);
        set(newDataRef, newData)
            .then(() => {
                statusMessage.textContent = "Terimakasih! Absensi Berhasil Dikirim!";
                statusMessage.className = "text-success fw-bold";
                // Reload halaman setelah data berhasil dikirim
                setTimeout(() => {
                    location.reload();
                }, 1000);
            })
            .catch((error) => {
                console.error("Error saving data to database", error);
                statusMessage.textContent = "";
                statusMessage.className = "";
                submitButton.textContent = "Kirim";
                submitButton.disabled = false;
            });
    }, (error) => {
        console.error("Error accessing location", error);
        statusMessage.textContent = "Absensi tidak dapat dikirim. Harap izinkan permission location terlebih dahulu";
        statusMessage.className = "text-danger";
    });
});