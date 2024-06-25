
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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

// Fungsi untuk memformat timestamp menjadi format yang mudah dibaca
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
};

// Fungsi untuk menghapus data dari Firebase
const removeData = async (nim) => {
    const dataRef = ref(database, 'data-absensi/' + nim);
    try {
        await remove(dataRef);
        alert("Data berhasil dihapus.");
        fetchData(); // Refresh tabel setelah data dihapus
    } catch (error) {
        console.error("Error removing data from database", error);
        alert("Terjadi kesalahan saat menghapus data.");
    }
};

// Pastikan fungsi removeData tersedia di cakupan global
window.removeData = removeData;

// Fungsi untuk fetching data dari Firebase dan menampilkannya dalam tabel
const fetchData = async () => {
    const dataTable = document.getElementById("data-table");
    const dataRef = ref(database, 'data-absensi');

    try {
        const snapshot = await get(dataRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            dataTable.innerHTML = ""; // Kosongkan tabel sebelum mengisi data

            Object.keys(data).forEach(key => {
                const item = data[key];
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td class="text-center">${formatTimestamp(item.timestamp)}</td>
                    <td class="text-center">${item.name}</td>
                    <td class="text-center">${item.nim}</td>
                    <td class="text-center">${item.prodi}</td>
                    <td class="text-center"><a class="btn btn-success fw-bold" href="https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}" target="_blank">Lihat Lokasi</a></td>
                    <td class="text-center"><button class="btn btn-danger btn-sm" onclick="removeData('${item.nim}')">Remove</button></td>
                `;

                dataTable.appendChild(row);
            });
        } else {
            dataTable.innerHTML = "<tr><td colspan='6' class='text-center text-danger fw-bold'>Opps! Tidak ada data absensi yang tersedia</td></tr>";
        }
    } catch (error) {
        console.error("Error fetching data from database", error);
        dataTable.innerHTML = "<tr><td colspan='6' class='text-center'>Terjadi kesalahan saat mengambil data</td></tr>";
    }
};

// Panggil fungsi fetchData ketika halaman dimuat
fetchData();
