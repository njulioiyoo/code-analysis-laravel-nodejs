/**
 * SERVICE UNTUK KOMUNIKASI DENGAN API LARAVEL
 * 
 * File ini berisi semua fungsi untuk berkomunikasi dengan backend Laravel
 * Menggunakan modern fetch API dengan error handling yang baik
 */

/**
 * Class untuk mengelola komunikasi dengan API Laravel
 */
class ApiService {
    
    constructor() {
        // Mengambil konfigurasi dari file config.js
        this.baseUrl = window.AppConfig.LARAVEL_API_BASE;
        this.timeout = window.AppConfig.API_TIMEOUT;
        
        // Headers default untuk semua request
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        window.debugLog('ApiService initialized', { baseUrl: this.baseUrl });
    }
    
    /**
     * Fungsi helper untuk membuat HTTP request dengan timeout dan error handling
     * @param {string} url - URL endpoint
     * @param {object} options - Opsi untuk fetch API
     * @returns {Promise} Promise yang resolve dengan response data
     */
    async makeRequest(url, options = {}) {
        // Gabungkan headers default dengan headers yang diberikan
        const headers = {
            ...this.defaultHeaders,
            ...options.headers
        };
        
        // Konfigurasi request dengan timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            window.debugLog(`Making API request to: ${url}`, options);
            
            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal
            });
            
            // Clear timeout jika request berhasil
            clearTimeout(timeoutId);
            
            // Cek apakah response berhasil
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            window.debugLog('API response received:', data);
            
            return data;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            // Handle berbagai jenis error
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - Server tidak merespons dalam waktu yang ditentukan');
            } else if (error.name === 'TypeError') {
                throw new Error('Network error - Tidak dapat terhubung ke server');
            } else {
                throw error;
            }
        }
    }
    
    /**
     * Mengambil statistik analisis kode dari API
     * @returns {Promise} Promise yang resolve dengan data statistik
     */
    async getStatistics() {
        window.debugLog('Fetching statistics data...');
        
        try {
            const url = `${this.baseUrl}/code-analyses/statistics`;
            const data = await this.makeRequest(url);
            
            // Validasi struktur data yang diterima
            const validatedData = {
                total_analyses: data.total_analyses || 0,
                completed_analyses: data.completed_analyses || 0,
                pending_analyses: data.pending_analyses || 0,
                failed_analyses: data.failed_analyses || 0,
                completion_rate: data.completion_rate || 0,
                average_complexity: data.average_complexity || null,
                language_distribution: data.language_distribution || []
            };
            
            window.debugLog('Statistics data processed:', validatedData);
            return validatedData;
            
        } catch (error) {
            window.debugLog('Error fetching statistics:', error);
            throw new Error(`Gagal mengambil data statistik: ${error.message}`);
        }
    }
    
    /**
     * Mengambil daftar analisis dengan pagination dan filter
     * @param {object} params - Parameter untuk query (page, filters, dll)
     * @returns {Promise} Promise yang resolve dengan data analisis
     */
    async getAnalyses(params = {}) {
        window.debugLog('Fetching analyses data...', params);
        
        try {
            // Build query parameters dari objek params
            const queryParams = new URLSearchParams();
            
            // Pagination
            queryParams.append('page', params.page || 1);
            queryParams.append('per_page', params.per_page || window.AppConfig.ITEMS_PER_PAGE);
            
            // Filters
            if (params.status) queryParams.append('status', params.status);
            if (params.language) queryParams.append('language', params.language);
            if (params.project) queryParams.append('project', params.project);
            
            // Sorting (jika diperlukan)
            if (params.sort_by) queryParams.append('sort_by', params.sort_by);
            if (params.sort_order) queryParams.append('sort_order', params.sort_order);
            
            const url = `${this.baseUrl}/code-analyses?${queryParams.toString()}`;
            const data = await this.makeRequest(url);
            
            // Validasi struktur data pagination Laravel
            const validatedData = {
                data: data.data || [],
                current_page: data.current_page || 1,
                last_page: data.last_page || 1,
                per_page: data.per_page || window.AppConfig.ITEMS_PER_PAGE,
                total: data.total || 0,
                from: data.from || 0,
                to: data.to || 0
            };
            
            window.debugLog('Analyses data processed:', validatedData);
            return validatedData;
            
        } catch (error) {
            window.debugLog('Error fetching analyses:', error);
            throw new Error(`Gagal mengambil data analisis: ${error.message}`);
        }
    }
    
    /**
     * Mengambil detail satu analisis berdasarkan ID
     * @param {number} id - ID analisis
     * @returns {Promise} Promise yang resolve dengan detail analisis
     */
    async getAnalysisDetail(id) {
        window.debugLog(`Fetching analysis detail for ID: ${id}`);
        
        try {
            const url = `${this.baseUrl}/code-analyses/${id}`;
            const data = await this.makeRequest(url);
            
            window.debugLog('Analysis detail received:', data);
            return data;
            
        } catch (error) {
            window.debugLog('Error fetching analysis detail:', error);
            throw new Error(`Gagal mengambil detail analisis: ${error.message}`);
        }
    }
    
    /**
     * Membuat analisis baru
     * @param {object} analysisData - Data analisis yang akan dibuat
     * @returns {Promise} Promise yang resolve dengan data analisis yang dibuat
     */
    async createAnalysis(analysisData) {
        window.debugLog('Creating new analysis...', analysisData);
        
        try {
            const url = `${this.baseUrl}/code-analyses`;
            const data = await this.makeRequest(url, {
                method: 'POST',
                body: JSON.stringify(analysisData)
            });
            
            window.debugLog('Analysis created successfully:', data);
            return data;
            
        } catch (error) {
            window.debugLog('Error creating analysis:', error);
            throw new Error(`Gagal membuat analisis: ${error.message}`);
        }
    }
    
    /**
     * Update analisis yang sudah ada
     * @param {number} id - ID analisis
     * @param {object} analysisData - Data analisis yang akan diupdate
     * @returns {Promise} Promise yang resolve dengan data analisis yang diupdate
     */
    async updateAnalysis(id, analysisData) {
        window.debugLog(`Updating analysis ID: ${id}`, analysisData);
        
        try {
            const url = `${this.baseUrl}/code-analyses/${id}`;
            const data = await this.makeRequest(url, {
                method: 'PUT',
                body: JSON.stringify(analysisData)
            });
            
            window.debugLog('Analysis updated successfully:', data);
            return data;
            
        } catch (error) {
            window.debugLog('Error updating analysis:', error);
            throw new Error(`Gagal mengupdate analisis: ${error.message}`);
        }
    }
    
    /**
     * Menghapus analisis
     * @param {number} id - ID analisis yang akan dihapus
     * @returns {Promise} Promise yang resolve ketika berhasil dihapus
     */
    async deleteAnalysis(id) {
        window.debugLog(`Deleting analysis ID: ${id}`);
        
        try {
            const url = `${this.baseUrl}/code-analyses/${id}`;
            const data = await this.makeRequest(url, {
                method: 'DELETE'
            });
            
            window.debugLog('Analysis deleted successfully');
            return data;
            
        } catch (error) {
            window.debugLog('Error deleting analysis:', error);
            throw new Error(`Gagal menghapus analisis: ${error.message}`);
        }
    }
    
    /**
     * Test koneksi ke API Laravel
     * @returns {Promise} Promise yang resolve dengan status koneksi
     */
    async testConnection() {
        window.debugLog('Testing API connection...');
        
        try {
            const url = `${this.baseUrl}/health`;
            const data = await this.makeRequest(url);
            
            window.debugLog('API connection test successful:', data);
            return { success: true, data };
            
        } catch (error) {
            window.debugLog('API connection test failed:', error);
            return { success: false, error: error.message };
        }
    }
}

// Buat instance global ApiService yang bisa digunakan di seluruh aplikasi
window.apiService = new ApiService();

// Export untuk environments yang mendukung modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}