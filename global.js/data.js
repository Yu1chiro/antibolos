import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, get, set, onChildAdded, onChildRemoved, remove} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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
const dataRef = ref(database, 'data-tambahan');

document.getElementById('tambah-data-mahasiswa').addEventListener('click', () => {
    const button = document.getElementById('tambah-data-mahasiswa');
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Menambahkan data...';
    button.disabled = true;
    const nama = document.getElementById('nama').value;
    const nim = document.getElementById('nim').value;
    const programStudi = document.getElementById('program-studi').value;
    const jabatan = document.getElementById('jabatan').value;
    const alasan = document.getElementById('alasan').value;
    let status = "";

    if (document.getElementById('Terlambat').checked) {
        status = "Terlambat";
    } else if (document.getElementById('Izin').checked) {
        status = "Izin";
    } else if (document.getElementById('Sakit').checked) {
        status = "Sakit";
    }

    // Validasi input
    if (!nama) {
        alert('Nama harus diisi!');
        return;
    }
    if (!nim) {
        alert('NIM harus diisi!');
        return;
    }
    if (!programStudi) {
        alert('Program Studi harus diisi!');
        return;
    }
    if (!jabatan) {
        alert('Jabatan harus diisi!');
        return;
    }
    if (!status) {
        alert('Status harus dipilih!');
        return;
    }

    const dataRef = ref(database, 'data-tambahan/' + nim);
    set(dataRef, {
        nama: nama,
        nim: nim,
        programStudi: programStudi,
        jabatan: jabatan,
        status: status,
        alasan: alasan
    }).then(() => {
        button.innerHTML = 'Tambah Data Mahasiswa';
        button.disabled = false;
        document.getElementById('nama').value = '';
        document.getElementById('nim').value = '';
        document.getElementById('program-studi').value = '';
        document.getElementById('jabatan').value = '';
        document.getElementById('alasan').value = '';
        document.getElementById('Terlambat').checked = false;
        document.getElementById('Izin').checked = false;
        document.getElementById('Sakit').checked = false;
        alert('Data berhasil terkirim!');
    }).catch((error) => {
        alert('Gagal mengirim data: ' + error);
    });

});
///// FETCHING
const extractTambahan = async () => {
    const dataRef = ref(database, '/data-tambahan');

    try {
        const snapshot = await get(dataRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const extractedData = [];

            Object.keys(data).forEach(key => {
                const item = data[key];
                extractedData.push({
                    NAMA: item.nama,
                    NIM: item.nim,
                    PRODI: item.programStudi,
                    JABATAN: item.jabatan,
                    KETERANGAN: item.status,
                    ALASAN: item.alasan
                    
                });
            });

            const worksheet = XLSX.utils.json_to_sheet(extractedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data-Tambahan");

            XLSX.writeFile(workbook, "Data-Tambahan-Panitia-UDAY2024.xlsx");
            alert("Data berhasil diekstrak dan diunduh.");
        } else {
            alert("Tidak ada data absensi yang tersedia untuk diekstrak.");
        }
    } catch (error) {
        console.error("Error extracting data from database", error);
        alert("Terjadi kesalahan saat mengekstrak data.");
    }
};
document.getElementById("extract-tambahan").addEventListener("click", extractTambahan);
// Ambil data dari Firebase dan tampilkan dalam tabel
onChildAdded(dataRef, (snapshot) => {
    const data = snapshot.val();
    const nim = snapshot.key;

    const row = document.createElement('tr');
    row.setAttribute('id', `row-${nim}`); // tambahkan id untuk setiap baris
    row.innerHTML = `
        <td class="text-center">${data.nama}</td>
        <td class="text-center">${nim}</td>
        <td class="text-center">${data.programStudi}</td>
        <td class="text-center">${data.jabatan}</td>
        <td class="text-center">${data.status}</td>
        <td class="text-start">${data.alasan}</td>
        <td class="text-center">
            <button class="btn btn-danger btn-sm" onclick="hapusData('${nim}')">Hapus</button>
        </td>
    `;

    document.getElementById('data-tambahan').appendChild(row);
});
// Tambahkan listener untuk event child_removed
onChildRemoved(dataRef, (snapshot) => {
    const nim = snapshot.key;
    const rowToRemove = document.getElementById(`row-${nim}`);
    if (rowToRemove) {
        rowToRemove.remove(); // hapus elemen HTML dari tabel
    }
});

// Fungsi untuk menghapus data berdasarkan nim
function hapusData(nim) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        remove(ref(database, `data-tambahan/${nim}`))
            .then(() => {
                alert('Data berhasil dihapus!');
            })
            .catch((error) => {
                alert('Gagal menghapus data: ' + error.message);
            });
    }
}
// Pastikan fungsi removeData tersedia di cakupan global
window.hapusData = hapusData;

