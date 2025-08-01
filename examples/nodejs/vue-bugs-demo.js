/**
 * Vue.js Code Bugs Demo - untuk mendemonstrasikan ESLint detection
 * Similar dengan PHPStan bugs tapi untuk JavaScript/Vue ecosystem
 */

// ESLint akan mendeteksi banyak issues dalam file ini

import Vue from 'vue'; // Unused import
const axios = require('axios'); // Mixed import styles, unused

// BUG 1: Global variables (ESLint: no-implicit-globals)
globalVueApp = null; // Creating global without declaration

// BUG 2: Vue.js specific - Incorrect component definition
const BuggyComponent = {
    template: `
        <div>
            <h1>{{ title }}</h1>
            <p>{{ undefinedProperty }}</p>
            <button @click="nonExistentMethod">Click me</button>
        </div>
    `,
    data() {
        // BUG 3: Not returning object properly
        title: 'Hello World', // Missing return statement
        count: 0
    },
    methods: {
        // BUG 4: Method calls undefined function
        increment() {
            this.nonExistentMethod(); // Method doesn't exist
            this.count++; // This might work but previous line will error
        },
        
        // BUG 5: Async method without proper error handling
        async fetchData() {
            const response = fetch('/api/data'); // Missing await
            return response.json(); // Will fail
        },
        
        // BUG 6: Method with side effects and no return
        processData(data) {
            console.log('Processing:', data); // Console in production
            data.isProcessed = true; // Mutating parameter
            // Missing return statement
        }
    },
    
    // BUG 7: Wrong lifecycle hook name
    create() { // Should be 'created'
        this.loadData();
    },
    
    // BUG 8: Lifecycle hook with async but no await
    mounted() {
        this.fetchData(); // Not awaiting async method
        this.title = 'Mounted'; // This might run before fetchData completes
    },
    
    // BUG 9: Computed property as method
    computed: {
        fullTitle() {
            console.log('Computing title...'); // Side effect in computed
            return this.title + ' - ' + new Date().getTime(); // Non-pure computation
        }
    },
    
    // BUG 10: Watch with wrong syntax
    watch: {
        count(newVal, oldVal) {
            if (newVal = 10) { // Assignment instead of comparison
                this.handleMilestone(); // Method doesn't exist
            }
        }
    }
};

// BUG 11: Vue app creation issues
const app = new Vue({
    el: '#app',
    components: {
        'buggy-component': BuggyComponent
    },
    data: {
        // BUG 12: Function instead of function return
        message: 'Hello Vue',
        users: [], // Will be used incorrectly
        isLoading: false,
        apiError: null
    },
    methods: {
        // BUG 13: Method with multiple issues
        async loadUsers() {
            this.isLoading = true;
            
            try {
                // Type coercion and string concatenation
                const page = this.currentPage + ''; // Converting to string unnecessarily
                const url = 'http://localhost:8982/api/users?page=' + page; // String concat instead of template
                
                // Fetch without proper error handling
                const response = await fetch(url);
                const data = response.json(); // Missing await
                
                // Direct array mutation
                this.users.push(...data.users); // Might fail if data.users is undefined
                
                this.isLoading = false; // Should be in finally block
            } catch (error) {
                console.error(error); // Only console, no user feedback
                this.isLoading = false; // Duplicated code
            }
        },
        
        // BUG 14: Method with unused parameters
        handleUserClick(user, index, event, extraParam) {
            // Only using 'user', other parameters unused
            this.selectedUser = user;
            return user.id; // Inconsistent return
        },
        
        // BUG 15: Magic numbers and complex logic
        calculateUserScore(user) {
            let score = 0;
            
            if (user.posts > 10) { // Magic number
                score += 50; // Magic number
            }
            
            if (user.followers > 100) { // Magic number
                score += 25; // Magic number
            }
            
            // Deep nesting
            if (user.profile) {
                if (user.profile.verified) {
                    if (user.profile.premium) {
                        if (user.profile.premium.level > 2) { // Too deep
                            score += 100; // Magic number
                        }
                    }
                }
            }
            
            return score;
        }
    },
    
    computed: {
        // BUG 16: Computed with side effects
        processedUsers() {
            // Mutating data in computed property
            this.users.forEach(user => {
                user.processed = true; // Side effect
            });
            
            return this.users.filter(user => user.active == true); // Loose equality
        },
        
        // BUG 17: Computed accessing undefined properties
        userStats() {
            return {
                total: this.users.length,
                active: this.activeUsers.length, // activeUsers not defined
                premium: this.users.filter(u => u.premium.active).length // Might fail if premium is undefined
            };
        }
    },
    
    watch: {
        // BUG 18: Watcher with wrong parameters
        users: {
            handler(newUsers) {
                // Missing oldUsers parameter if needed
                console.log('Users updated:', newUsers.length);
                this.updateUserStats(); // Method doesn't exist
            },
            deep: true,
            immediate: true
        }
    },
    
    // BUG 19: Wrong lifecycle hook
    beforeCreate() {
        // Trying to access data before it's created
        console.log('Message:', this.message); // Will be undefined
        this.initializeApp(); // Method doesn't exist
    },
    
    created() {
        // BUG 20: Not handling async properly
        this.loadUsers(); // Not awaiting async method
        this.setupEventListeners(); // Method doesn't exist
    }
});

// BUG 21: Event listener issues
document.addEventListener('DOMContentLoaded', function() {
    // Trying to access Vue instance before it's ready
    app.message = 'DOM Ready'; // Might fail if app not mounted
    
    // Adding event listeners without cleanup
    window.addEventListener('resize', function() {
        app.handleResize(); // Method doesn't exist
    });
});

// BUG 22: Global function with issues
function updateGlobalState(newState) {
    // Accessing global Vue instance
    globalVueApp.state = newState; // globalVueApp might be null
    globalVueApp.$forceUpdate(); // Force update is generally bad practice
}

// BUG 23: Utility function with problems
function formatUserData(userData) {
    // Parameter mutation
    userData.formatted = true;
    userData.name = userData.name.toUpperCase(); // Might fail if name is undefined
    
    // Returning undefined implicitly
    if (userData.invalid) {
        return; // Inconsistent return
    }
    
    return userData;
}

// BUG 24: Export issues
module.exports = {
    BuggyComponent,
    app, // Exporting Vue instance (unusual)
    updateGlobalState,
    // Missing some functions that might be used elsewhere
};

// CORRECT VERSIONS: How they should be written in Vue.js

// ✅ CORRECT: Proper Vue component
const CorrectComponent = {
    template: `
        <div>
            <h1>{{ title }}</h1>
            <p v-if="error" class="error">{{ error }}</p>
            <button @click="increment" :disabled="loading">
                {{ loading ? 'Loading...' : 'Click me' }}
            </button>
        </div>
    `,
    data() {
        return {
            title: 'Hello World',
            count: 0,
            loading: false,
            error: null
        };
    },
    methods: {
        increment() {
            this.count += 1;
            this.$emit('count-changed', this.count);
        },
        
        async fetchData() {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await fetch('/api/data');
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                return await response.json();
            } catch (error) {
                this.error = 'Failed to fetch data';
                console.error('Fetch error:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },
    computed: {
        displayTitle() {
            return `${this.title} (${this.count})`;
        }
    },
    watch: {
        count: {
            handler(newVal, oldVal) {
                if (newVal === 10) { // Proper comparison
                    this.$emit('milestone-reached', newVal);
                }
            }
        }
    },
    created() {
        // Proper async handling in lifecycle
        this.initializeComponent();
    },
    async mounted() {
        try {
            await this.fetchData();
        } catch (error) {
            // Error already handled in fetchData
        }
    },
    methods: {
        async initializeComponent() {
            // Proper async initialization
            try {
                await this.loadInitialData();
            } catch (error) {
                this.error = 'Failed to initialize component';
            }
        }
    }
};

// ✅ CORRECT: Proper Vue app creation
const correctApp = new Vue({
    el: '#correct-app',
    components: {
        'correct-component': CorrectComponent
    },
    data() {
        return {
            message: 'Hello Vue',
            users: [],
            isLoading: false,
            error: null
        };
    },
    computed: {
        activeUsers() {
            return this.users.filter(user => user.active === true);
        },
        userCount() {
            return this.users.length;
        }
    },
    methods: {
        async loadUsers() {
            this.isLoading = true;
            this.error = null;
            
            try {
                const response = await fetch('http://localhost:8982/api/users');
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                this.users = data.users || [];
            } catch (error) {
                this.error = 'Failed to load users';
                console.error('Load users error:', error);
            } finally {
                this.isLoading = false;
            }
        }
    },
    async created() {
        await this.loadUsers();
    }
});