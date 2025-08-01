/**
 * KONFIGURASI APLIKASI DASHBOARD
 * 
 * File ini berisi semua konstanta dan konfigurasi yang digunakan
 * di seluruh aplikasi dashboard Vue.js
 */

// Konfigurasi utama aplikasi
window.AppConfig = {
    // URL API Laravel untuk mengambil data
    LARAVEL_API_BASE: 'http://localhost:8982/api',
    
    // URL alternatif jika menggunakan domain name
    LARAVEL_API_DOMAIN: 'http://laravel.codeanalysis.web.local/api',
    
    // Jumlah item per halaman untuk pagination
    ITEMS_PER_PAGE: 10,
    
    // Timeout untuk request API (dalam milidetik)
    API_TIMEOUT: 10000,
    
    // Interval untuk auto-refresh data (dalam milidetik)
    // Set ke 0 untuk disable auto-refresh
    AUTO_REFRESH_INTERVAL: 30000, // 30 detik
    
    // Konfigurasi debugging
    DEBUG: true,
    
    // Pesan-pesan yang akan ditampilkan ke user
    MESSAGES: {
        LOADING: '📊 Memuat data...',
        ERROR_NETWORK: '🌐 Gagal terhubung ke server. Periksa koneksi internet Anda.',
        ERROR_API: '⚠️ Terjadi kesalahan saat mengambil data dari server.',
        EMPTY_DATA: '📂 Tidak ada data yang ditemukan.',
        SUCCESS_REFRESH: '✅ Data berhasil diperbarui.',
        FILTER_APPLIED: '🔍 Filter telah diterapkan.',
        FILTER_CLEARED: '🧹 Filter telah dibersihkan.'
    },
    
    // Warna untuk status badge
    STATUS_COLORS: {
        completed: {
            background: '#d4edda',
            color: '#155724',
            border: '#c3e6cb'
        },
        pending: {
            background: '#fff3cd',
            color: '#856404', 
            border: '#ffeaa7'
        },
        failed: {
            background: '#f8d7da',
            color: '#721c24',
            border: '#f5c6cb'
        }
    },
    
    // Mapping bahasa pemrograman ke ikon/warna
    LANGUAGE_CONFIG: {
        php: {
            icon: '🐘',
            color: '#777bb4',
            displayName: 'PHP'
        },
        javascript: {
            icon: '⚡',
            color: '#f7df1e',
            displayName: 'JavaScript'
        },
        python: {
            icon: '🐍',
            color: '#3776ab',
            displayName: 'Python'
        },
        java: {
            icon: '☕',
            color: '#ed8b00',
            displayName: 'Java'
        },
        typescript: {
            icon: '📘',
            color: '#3178c6',
            displayName: 'TypeScript'
        }
    },
    
    // Konfigurasi untuk complexity score
    COMPLEXITY_LEVELS: {
        LOW: { max: 3, color: '#28a745', label: 'Rendah' },
        MEDIUM: { max: 7, color: '#ffc107', label: 'Sedang' },
        HIGH: { max: 10, color: '#fd7e14', label: 'Tinggi' },
        CRITICAL: { max: Infinity, color: '#dc3545', label: 'Kritis' }
    }
};

/**
 * Fungsi untuk mendapatkan konfigurasi bahasa
 * @param {string} language - Nama bahasa pemrograman
 * @returns {object} Objek konfigurasi bahasa
 */
window.getLanguageConfig = function(language) {
    const config = window.AppConfig.LANGUAGE_CONFIG[language?.toLowerCase()];
    return config || {
        icon: '📄',
        color: '#6c757d',
        displayName: language || 'Unknown'
    };
};

/**
 * Fungsi untuk mendapatkan level complexity
 * @param {number} score - Score complexity
 * @returns {object} Objek level complexity
 */
window.getComplexityLevel = function(score) {
    const levels = window.AppConfig.COMPLEXITY_LEVELS;
    
    if (score <= levels.LOW.max) return levels.LOW;
    if (score <= levels.MEDIUM.max) return levels.MEDIUM;
    if (score <= levels.HIGH.max) return levels.HIGH;
    return levels.CRITICAL;
};

/**
 * Fungsi untuk logging dengan debugging
 * @param {string} message - Pesan yang akan dilog
 * @param {any} data - Data tambahan (opsional)
 */
window.debugLog = function(message, data = null) {
    if (window.AppConfig.DEBUG) {
        console.log(`[Dashboard Debug] ${message}`, data || '');
    }
};

/**
 * Fungsi untuk format tanggal ke bahasa Indonesia
 * @param {string} dateString - String tanggal ISO
 * @returns {string} Tanggal yang sudah diformat
 */
window.formatDateIndonesian = function(dateString) {
    try {
        const date = new Date(dateString);
        
        // Format: "31 Juli 2025, 15:30"
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta' // WIB
        };
        
        return new Intl.DateTimeFormat('id-ID', options).format(date);
    } catch (error) {
        window.debugLog('Error formatting date:', error);
        return 'Tanggal tidak valid';
    }
};

/**
 * Fungsi untuk format angka dengan separator ribuan
 * @param {number} number - Angka yang akan diformat
 * @returns {string} Angka yang sudah diformat
 */
window.formatNumber = function(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return '0';
    }
    
    return new Intl.NumberFormat('id-ID').format(number);
};

// Export konfigurasi untuk environments yang mendukung modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.AppConfig;
}