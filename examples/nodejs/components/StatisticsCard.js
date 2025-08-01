/**
 * KOMPONEN STATISTICS CARD
 * 
 * Komponen Vue.js untuk menampilkan kartu statistik
 * Digunakan untuk menampilkan total analyses, completed, pending, dan failed
 */

// Definisi komponen StatisticsCard
window.StatisticsCard = {
    // Nama komponen untuk debugging
    name: 'StatisticsCard',
    
    // Template HTML untuk komponen
    template: `
        <div class="stat-card" :class="cardClass">
            <!-- Ikon dan judul statistik -->
            <div class="stat-header">
                <span class="stat-icon">{{ icon }}</span>
                <h3 class="stat-title">{{ title }}</h3>
            </div>
            
            <!-- Angka statistik utama -->
            <div class="stat-number" :style="{ color: color }">
                {{ formattedValue }}
            </div>
            
            <!-- Label keterangan -->
            <div class="stat-label">
                {{ label }}
            </div>
            
            <!-- Progress bar (opsional) -->
            <div v-if="showProgress" class="stat-progress">
                <div class="progress-bar">
                    <div 
                        class="progress-fill" 
                        :style="{ width: progressPercentage + '%', backgroundColor: color }"
                    ></div>
                </div>
                <span class="progress-text">{{ progressPercentage }}%</span>
            </div>
            
            <!-- Trend indicator (opsional) -->
            <div v-if="trend" class="stat-trend" :class="trendClass">
                <span class="trend-icon">{{ trendIcon }}</span>
                <span class="trend-text">{{ trend.text }}</span>
            </div>
        </div>
    `,
    
    // Props yang diterima dari parent component
    props: {
        // Judul kartu statistik
        title: {
            type: String,
            required: true
        },
        
        // Nilai/angka yang akan ditampilkan
        value: {
            type: [Number, String],
            default: 0
        },
        
        // Label keterangan di bawah angka
        label: {
            type: String,
            default: ''
        },
        
        // Ikon yang akan ditampilkan
        icon: {
            type: String,
            default: '📊'
        },
        
        // Warna utama untuk kartu
        color: {
            type: String,
            default: '#667eea'
        },
        
        // Tipe kartu untuk styling khusus
        type: {
            type: String,
            default: 'default',
            validator: (value) => ['default', 'success', 'warning', 'danger', 'info'].includes(value)
        },
        
        // Apakah menampilkan progress bar
        showProgress: {
            type: Boolean,
            default: false
        },
        
        // Persentase untuk progress bar
        progressPercentage: {
            type: Number,
            default: 0
        },
        
        // Data trend (naik/turun dari periode sebelumnya)
        trend: {
            type: Object,
            default: null
            // Format: { direction: 'up'|'down'|'stable', percentage: 5.2, text: 'dari bulan lalu' }
        },
        
        // Loading state
        loading: {
            type: Boolean,
            default: false
        }
    },
    
    // Computed properties untuk data yang diolah
    computed: {
        /**
         * Format nilai dengan separator ribuan
         */
        formattedValue() {
            if (this.loading) {
                return '...';
            }
            
            if (typeof this.value === 'number') {
                return window.formatNumber(this.value);
            }
            
            return this.value || '-';
        },
        
        /**
         * CSS class untuk kartu berdasarkan tipe
         */
        cardClass() {
            return {
                'stat-card--loading': this.loading,
                [`stat-card--${this.type}`]: this.type !== 'default'
            };
        },
        
        /**
         * CSS class untuk trend indicator
         */
        trendClass() {
            if (!this.trend) return '';
            
            return {
                'stat-trend--up': this.trend.direction === 'up',
                'stat-trend--down': this.trend.direction === 'down',
                'stat-trend--stable': this.trend.direction === 'stable'
            };
        },
        
        /**
         * Ikon untuk trend (naik/turun/stabil)
         */
        trendIcon() {
            if (!this.trend) return '';
            
            const icons = {
                up: '📈',
                down: '📉',
                stable: '➖'
            };
            
            return icons[this.trend.direction] || '';
        }
    },
    
    // Methods untuk aksi-aksi komponen
    methods: {
        /**
         * Handle click pada kartu statistik
         * Emit event ke parent component
         */
        handleCardClick() {
            this.$emit('card-clicked', {
                title: this.title,
                value: this.value,
                type: this.type
            });
            
            window.debugLog(`Statistics card clicked: ${this.title}`);
        },
        
        /**
         * Animate angka saat nilai berubah
         */
        animateValue() {
            // Implementasi animasi angka bisa ditambahkan di sini
            // Misalnya count-up animation
        }
    },
    
    // Lifecycle hooks
    mounted() {
        window.debugLog(`StatisticsCard mounted: ${this.title}`);
        
        // Animate nilai saat komponen pertama kali dimount
        this.animateValue();
    },
    
    // Watch untuk perubahan props
    watch: {
        // Animate ulang saat nilai berubah
        value(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.animateValue();
                window.debugLog(`StatisticsCard value changed: ${oldValue} -> ${newValue}`);
            }
        }
    }
};

// CSS tambahan khusus untuk komponen ini
const statisticsCardStyles = `
<style>
/* Styles khusus untuk StatisticsCard component */
.stat-card {
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--card-accent-color, #667eea);
}

.stat-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.stat-icon {
    font-size: 1.5rem;
    margin-right: 0.5rem;
}

.stat-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
}

.stat-card--loading .stat-number {
    opacity: 0.5;
    animation: loading-pulse 1.5s ease-in-out infinite;
}

.stat-card--success {
    --card-accent-color: #28a745;
}

.stat-card--warning {
    --card-accent-color: #ffc107;
}

.stat-card--danger {
    --card-accent-color: #dc3545;
}

.stat-card--info {
    --card-accent-color: #17a2b8;
}

.stat-progress {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.progress-bar {
    flex: 1;
    height: 4px;
    background: #e9ecef;
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 2px;
}

.progress-text {
    font-size: 0.8rem;
    color: #666;
    min-width: 35px;
    text-align: right;
}

.stat-trend {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8rem;
}

.stat-trend--up {
    color: #28a745;
}

.stat-trend--down {
    color: #dc3545;
}

.stat-trend--stable {
    color: #6c757d;
}

.trend-icon {
    font-size: 0.9rem;
}

@keyframes loading-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
}

/* Responsive design untuk kartu statistik */
@media (max-width: 768px) {
    .stat-header {
        margin-bottom: 0.5rem;
    }
    
    .stat-icon {
        font-size: 1.2rem;
    }
    
    .stat-title {
        font-size: 0.9rem;
    }
}
</style>
`;

// Inject styles ke head jika belum ada
if (!document.querySelector('#statistics-card-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'statistics-card-styles';
    styleElement.innerHTML = statisticsCardStyles;
    document.head.appendChild(styleElement);
}

// Export untuk environments yang mendukung modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.StatisticsCard;
}