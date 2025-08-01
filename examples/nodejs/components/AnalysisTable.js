/**
 * KOMPONEN ANALYSIS TABLE
 * 
 * Komponen Vue.js untuk menampilkan tabel data analisis kode
 * Dilengkapi dengan sorting, filtering, dan pagination
 */

// Definisi komponen AnalysisTable
window.AnalysisTable = {
    // Nama komponen untuk debugging
    name: 'AnalysisTable',
    
    // Template HTML untuk komponen tabel
    template: `
        <div class="analysis-table-container">
            <!-- Loading state -->
            <div v-if="loading" class="table-loading">
                <div class="loading-spinner"></div>
                <p>{{ loadingMessage }}</p>
            </div>
            
            <!-- Error state -->
            <div v-else-if="error" class="table-error">
                <div class="error-icon">⚠️</div>
                <p>{{ error }}</p>
                <button class="btn btn-primary" @click="$emit('retry')">
                    Coba Lagi
                </button>
            </div>
            
            <!-- Empty state -->
            <div v-else-if="!analyses || analyses.length === 0" class="table-empty">
                <div class="empty-icon">📂</div>
                <h3>Tidak ada data analisis</h3>
                <p>{{ emptyMessage }}</p>
            </div>
            
            <!-- Table dengan data -->
            <div v-else class="table-wrapper">
                <table class="analysis-table">
                    <thead>
                        <tr>
                            <!-- Header yang bisa di-sort -->
                            <th 
                                v-for="column in columns" 
                                :key="column.key"
                                :class="{ 'sortable': column.sortable, 'sorted': sortBy === column.key }"
                                @click="column.sortable && handleSort(column.key)"
                            >
                                <div class="th-content">
                                    <span>{{ column.title }}</span>
                                    <span v-if="column.sortable" class="sort-indicator">
                                        <span v-if="sortBy === column.key">
                                            {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                        </span>
                                        <span v-else class="sort-default">↕</span>
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="analysis in analyses" 
                            :key="analysis.id"
                            class="table-row"
                            @click="handleRowClick(analysis)"
                        >
                            <!-- Project Name -->
                            <td class="project-cell">
                                <div class="project-info">
                                    <span class="project-name">{{ analysis.project_name || 'Tidak diketahui' }}</span>
                                    <span v-if="analysis.repository_url" class="project-url">
                                        🔗 {{ truncateUrl(analysis.repository_url) }}
                                    </span>
                                </div>
                            </td>
                            
                            <!-- Language -->
                            <td class="language-cell">
                                <div class="language-badge" :style="getLanguageStyle(analysis.language)">
                                    <span class="language-icon">{{ getLanguageIcon(analysis.language) }}</span>
                                    <span class="language-name">{{ getLanguageDisplayName(analysis.language) }}</span>
                                </div>
                            </td>
                            
                            <!-- Status -->
                            <td class="status-cell">
                                <span :class="'status-badge status-' + analysis.status">
                                    {{ getStatusText(analysis.status) }}
                                </span>
                            </td>
                            
                            <!-- Complexity Score -->
                            <td class="complexity-cell">
                                <div v-if="analysis.complexity_score !== null" class="complexity-info">
                                    <div class="complexity-score" :style="getComplexityStyle(analysis.complexity_score)">
                                        {{ analysis.complexity_score.toFixed(1) }}
                                    </div>
                                    <div class="complexity-level">
                                        {{ getComplexityLevel(analysis.complexity_score).label }}
                                    </div>
                                </div>
                                <div v-else class="complexity-na">
                                    <span>N/A</span>
                                </div>
                            </td>
                            
                            <!-- Issues Found -->
                            <td class="issues-cell">
                                <div class="issues-count" :class="getIssuesClass(analysis.issues_found)">
                                    <span class="issues-number">{{ analysis.issues_found || 0 }}</span>
                                    <span class="issues-label">{{ getIssuesLabel(analysis.issues_found) }}</span>
                                </div>
                            </td>
                            
                            <!-- Created Date -->
                            <td class="date-cell">
                                <div class="date-info">
                                    <div class="date-primary">{{ formatDate(analysis.created_at) }}</div>
                                    <div class="date-relative">{{ getRelativeTime(analysis.created_at) }}</div>
                                </div>
                            </td>
                            
                            <!-- Actions -->
                            <td class="actions-cell">
                                <div class="action-buttons">
                                    <button 
                                        class="action-btn btn-view" 
                                        @click.stop="handleView(analysis)"
                                        title="Lihat detail"
                                    >
                                        👁️
                                    </button>
                                    <button 
                                        class="action-btn btn-edit" 
                                        @click.stop="handleEdit(analysis)"
                                        title="Edit analisis"
                                        :disabled="analysis.status === 'pending'"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        class="action-btn btn-delete" 
                                        @click.stop="handleDelete(analysis)"
                                        title="Hapus analisis"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    
    // Props yang diterima dari parent component
    props: {
        // Data analisis yang akan ditampilkan
        analyses: {
            type: Array,
            default: () => []
        },
        
        // Loading state
        loading: {
            type: Boolean,
            default: false
        },
        
        // Error message
        error: {
            type: String,
            default: null
        },
        
        // Sorting configuration
        sortBy: {
            type: String,
            default: 'created_at'
        },
        
        sortOrder: {
            type: String,
            default: 'desc',
            validator: (value) => ['asc', 'desc'].includes(value)
        },
        
        // Custom messages
        loadingMessage: {
            type: String,
            default: 'Memuat data analisis...'
        },
        
        emptyMessage: {
            type: String,
            default: 'Belum ada analisis yang dibuat. Coba sesuaikan filter atau buat analisis baru.'
        }
    },
    
    // Data internal komponen
    data() {
        return {
            // Konfigurasi kolom tabel
            columns: [
                { key: 'project_name', title: 'Proyek', sortable: true },
                { key: 'language', title: 'Bahasa', sortable: true },
                { key: 'status', title: 'Status', sortable: true },
                { key: 'complexity_score', title: 'Kompleksitas', sortable: true },
                { key: 'issues_found', title: 'Issues', sortable: true },
                { key: 'created_at', title: 'Dibuat', sortable: true },
                { key: 'actions', title: 'Aksi', sortable: false }
            ]
        };
    },
    
    // Methods untuk aksi dan helper functions
    methods: {
        /**
         * Handle sorting kolom tabel
         */
        handleSort(columnKey) {
            window.debugLog(`Sorting table by: ${columnKey}`);
            
            let newOrder = 'asc';
            
            // Jika kolom yang sama diklik, toggle order
            if (this.sortBy === columnKey) {
                newOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            }
            
            // Emit event ke parent component
            this.$emit('sort-changed', {
                sortBy: columnKey,
                sortOrder: newOrder
            });
        },
        
        /**
         * Handle click pada row tabel
         */
        handleRowClick(analysis) {
            window.debugLog('Table row clicked:', analysis);
            this.$emit('row-clicked', analysis);
        },
        
        /**
         * Handle view action
         */
        handleView(analysis) {
            window.debugLog('View analysis:', analysis.id);
            this.$emit('view-analysis', analysis);
        },
        
        /**
         * Handle edit action
         */
        handleEdit(analysis) {
            window.debugLog('Edit analysis:', analysis.id);
            this.$emit('edit-analysis', analysis);
        },
        
        /**
         * Handle delete action
         */
        handleDelete(analysis) {
            window.debugLog('Delete analysis:', analysis.id);
            
            // Konfirmasi sebelum delete
            if (confirm(`Apakah Anda yakin ingin menghapus analisis "${analysis.project_name}"?`)) {
                this.$emit('delete-analysis', analysis);
            }
        },
        
        /**
         * Get icon untuk bahasa pemrograman
         */
        getLanguageIcon(language) {
            const config = window.getLanguageConfig(language);
            return config.icon;
        },
        
        /**
         * Get display name untuk bahasa pemrograman
         */
        getLanguageDisplayName(language) {
            const config = window.getLanguageConfig(language);
            return config.displayName;
        },
        
        /**
         * Get style untuk language badge
         */
        getLanguageStyle(language) {
            const config = window.getLanguageConfig(language);
            return {
                backgroundColor: config.color + '20',
                color: config.color,
                border: `1px solid ${config.color}40`
            };
        },
        
        /**
         * Get text untuk status
         */
        getStatusText(status) {
            const statusMap = {
                completed: 'Selesai',
                pending: 'Sedang Proses',
                failed: 'Gagal'
            };
            
            return statusMap[status] || status;
        },
        
        /**
         * Get level kompleksitas
         */
        getComplexityLevel(score) {
            return window.getComplexityLevel(score);
        },
        
        /**
         * Get style untuk complexity score
         */
        getComplexityStyle(score) {
            const level = this.getComplexityLevel(score);
            return {
                color: level.color,
                fontWeight: 'bold'
            };
        },
        
        /**
         * Get CSS class untuk issues count
         */
        getIssuesClass(issuesCount) {
            if (issuesCount === 0) return 'issues-none';
            if (issuesCount <= 5) return 'issues-low';
            if (issuesCount <= 15) return 'issues-medium';
            return 'issues-high';
        },
        
        /**
         * Get label untuk issues count
         */
        getIssuesLabel(issuesCount) {
            if (issuesCount === 0) return 'issue';
            if (issuesCount === 1) return 'issue';
            return 'issues';
        },
        
        /**
         * Format tanggal untuk tampilan
         */
        formatDate(dateString) {
            return window.formatDateIndonesian(dateString);
        },
        
        /**
         * Get relative time (berapa lama yang lalu)
         */
        getRelativeTime(dateString) {
            try {
                const date = new Date(dateString);
                const now = new Date();
                const diffMs = now - date;
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffHours / 24);
                
                if (diffHours < 1) return 'Baru saja';
                if (diffHours < 24) return `${diffHours} jam lalu`;
                if (diffDays < 7) return `${diffDays} hari lalu`;
                if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
                return `${Math.floor(diffDays / 30)} bulan lalu`;
                
            } catch (error) {
                return '';
            }
        },
        
        /**
         * Truncate URL untuk display
         */
        truncateUrl(url) {
            if (!url) return '';
            return url.length > 30 ? url.substring(0, 27) + '...' : url;
        }
    },
    
    // Lifecycle hooks
    mounted() {
        window.debugLog('AnalysisTable component mounted');
    }
};

// Export untuk environments yang mendukung modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.AnalysisTable;
}