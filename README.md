# Code Analysis Laravel & Node.js

Proyek ini menyediakan environment Docker untuk melakukan analisis kode pada aplikasi Laravel (PHP) dan Node.js menggunakan berbagai tools analisis seperti PHPStan, Pint, dan SonarQube.

## Instalasi dan Setup

### Prerequisites
- Docker
- Docker Compose
- Git

### Quick Start

1. Clone repository ini:
```bash
git clone https://github.com/njulioiyoo/code-analysis-laravel-nodejs.git
cd code-analysis-laravel-nodejs
```

2. Build dan jalankan container:
```bash
# Build semua services
docker-compose up -d

# Atau build secara terpisah
docker build -t codeanalysis-laravel -f dockerfiles/Dockerfile.laravel .
docker build -t examples-codeanalysis-nodejs -f dockerfiles/Dockerfile.nodejs .
```

3. Verifikasi instalasi:
```bash
# Test Laravel analysis
docker run --rm -v "$(pwd)/examples/laravel:/var/www/html" codeanalysis-laravel ./vendor/bin/phpstan analyse app/

# Test Node.js analysis
docker run --rm -v "$(pwd)/examples/nodejs:/usr/src/app" examples-codeanalysis-nodejs npm run lint:check
```

## Tools Analisis Kode

### 1. PHPStan (PHP Static Analysis Tool)

PHPStan adalah tool analisis statis untuk PHP yang membantu mendeteksi bug dan error sebelum kode dijalankan.

#### Fitur Utama:
- **Type checking**: Memvalidasi tipe data dan parameter
- **Dead code detection**: Menemukan kode yang tidak terpakai
- **Null pointer analysis**: Mendeteksi potensi null reference errors
- **Method/property existence**: Memastikan method dan property yang dipanggil ada

#### Cara Penggunaan:
```bash
# Analisis basic
./vendor/bin/phpstan analyse app/

# Analisis dengan level tertentu (0-9, semakin tinggi semakin strict)
./vendor/bin/phpstan analyse --level=5 app/

# Analisis file spesifik
./vendor/bin/phpstan analyse app/Models/User.php

# Dengan Docker
docker run --rm -v "$(pwd)/examples/laravel:/var/www/html" codeanalysis-laravel ./vendor/bin/phpstan analyse --no-progress --memory-limit=512M app/
```

#### Konfigurasi:
PHPStan dikonfigurasi melalui file `phpstan.neon` yang berisi:
- Level analisis
- Path yang akan dianalisis
- Rules yang akan diabaikan
- Extensions yang digunakan (seperti Larastan untuk Laravel)

### 2. Laravel Pint (Code Formatter)

Laravel Pint adalah tool formatting kode PHP yang dibangun di atas PHP-CS-Fixer, dirancang khusus untuk proyek Laravel.

#### Fitur Utama:
- **Automatic formatting**: Memformat kode sesuai standar Laravel
- **PSR compliance**: Mendukung PSR-1, PSR-2, PSR-12
- **Customizable rules**: Dapat dikustomisasi sesuai kebutuhan project
- **Fast execution**: Performa cepat untuk project besar

#### Cara Penggunaan:
```bash
# Format semua file
./vendor/bin/pint

# Dry run (cek tanpa mengubah file)
./vendor/bin/pint --test

# Format file spesifik
./vendor/bin/pint app/Models/User.php

# Dengan preset tertentu
./vendor/bin/pint --preset=laravel

# Dengan Docker
docker run --rm -v "$(pwd)/examples/laravel:/var/www/html" codeanalysis-laravel ./vendor/bin/pint --test app/
```

#### Preset yang Tersedia:
- `laravel` - Standar Laravel (default)
- `psr12` - PSR-12 coding standard
- `symfony` - Symfony coding standard

### 3. SonarQube (Comprehensive Code Analysis)

SonarQube adalah platform untuk continuous inspection yang menganalisis kualitas kode dan security vulnerabilities.

#### Fitur Utama:
- **Code quality metrics**: Complexity, duplications, maintainability
- **Security analysis**: Vulnerability detection, security hotspots
- **Bug detection**: Logic errors, potential runtime issues
- **Code coverage**: Integration dengan test coverage reports
- **Multi-language support**: PHP, JavaScript, TypeScript, dan lainnya

#### Setup SonarQube:
```bash
# Jalankan SonarQube server
./sonarqube-quickstart.sh

# Atau manual dengan Docker
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

#### Menjalankan Analysis:
```bash
# Setup SONAR_TOKEN terlebih dahulu
export SONAR_TOKEN=your_sonar_token_here

# Jalankan analisis
./scripts/sonar-analysis.sh

# Atau dengan token langsung
SONAR_TOKEN=your_token ./scripts/sonar-analysis.sh
```

#### Akses Dashboard:
- URL: http://localhost:9000
- Default login: admin/admin
- Ubah password saat first login

## Struktur Project

```
code-analysis-laravel-nodejs/
├── dockerfiles/
│   ├── Dockerfile.laravel      # Laravel analysis environment
│   └── Dockerfile.nodejs       # Node.js analysis environment
├── examples/
│   ├── laravel/               # Sample Laravel project
│   └── nodejs/                # Sample Node.js project
├── scripts/
│   └── sonar-analysis.sh      # SonarQube analysis script
├── sonar-project.properties   # SonarQube configuration
├── sonarqube-quickstart.sh    # SonarQube server setup
└── docker-compose.yml         # Services orchestration
```

## Workflow Analysis

1. **Development**: Tulis kode di examples/laravel atau examples/nodejs
2. **Static Analysis**: Jalankan PHPStan/ESLint untuk deteksi error awal
3. **Code Formatting**: Gunakan Pint/Prettier untuk standarisasi format
4. **Quality Gates**: SonarQube analysis untuk comprehensive quality check
5. **CI/CD Integration**: Integrate tools dalam pipeline untuk automated checks

## Tips dan Best Practices

- Jalankan PHPStan dengan level incrementally (mulai dari 0, naik bertahap)
- Gunakan Pint sebelum commit untuk konsistensi formatting
- Setup quality gates di SonarQube untuk mencegah code quality regression
- Integrate semua tools dalam Git hooks untuk automated checking

## Troubleshooting

### Docker Issues:
- Pastikan Docker daemon running
- Check port conflicts (9000 untuk SonarQube)
- Verify volume mounts path

### Analysis Issues:
- Memory issues: Increase `--memory-limit` parameter
- Permission issues: Check file ownership dan mounting
- Path issues: Pastikan menggunakan absolute paths

## Kontribusi

1. Fork repository
2. Buat feature branch
3. Jalankan semua analysis tools
4. Submit pull request dengan quality gates passed