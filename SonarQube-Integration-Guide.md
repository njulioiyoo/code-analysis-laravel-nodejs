# 🔍 SonarQube Integration Guide

## 📋 **Overview**

Integrasi SonarQube untuk comprehensive code analysis yang mencakup:
- 🐛 **Bug detection** - Logic errors, null pointers
- 🛡️ **Security vulnerabilities** - SQL injection, XSS, etc
- 📊 **Code quality metrics** - Complexity, maintainability
- 🔄 **Code duplication** analysis
- 📈 **Code coverage** tracking
- 💡 **Code smells** detection

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │    SonarQube     │    │  Code Analysis  │
│   Database      │◄───│     Server       │◄───│    Project      │
│                 │    │                  │    │                 │
│ Port: 5433      │    │ Port: 9000       │    │ Laravel+Node.js │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                         ┌──────────────────┐
                         │ GitHub Actions   │
                         │ CI/CD Pipeline   │
                         └──────────────────┘
```

## ⚙️ **Setup Instructions**

### **1. Start SonarQube Services**

```bash
# Start SonarQube dengan PostgreSQL
docker-compose -f docker-compose.sonarqube.yml up -d

# Verify services
docker ps | grep sonar
docker ps | grep postgres
```

**Services yang akan running:**
- `postgres-sonar` - PostgreSQL database (port 5433)
- `sonarqube-codeanalysis` - SonarQube server (port 9000)

### **2. Access SonarQube Dashboard**

```bash
# Wait for SonarQube to be ready
curl http://localhost:9000/api/system/status

# Default credentials
Username: admin
Password: admin
```

**First login:** http://localhost:9000
- Change default password saat first login
- Create project token untuk CI/CD

### **3. Run Analysis**

#### **Option A: Manual Analysis**
```bash
# Run comprehensive analysis
./scripts/sonar-analysis.sh

# Or direct scanner command
docker-compose -f docker-compose.sonarqube.yml run --rm sonar-scanner
```

#### **Option B: GitHub Actions** 
```bash
# Automatic analysis pada PR/push
git push origin feature-branch
# Check GitHub Actions tab untuk results
```

## 📊 **Analysis Configuration**

### **Project Structure**
```yaml
# sonar-project.properties
sonar.projectKey=code-analysis-laravel-nodejs
sonar.sources=examples/laravel/app,examples/nodejs
sonar.exclusions=**/vendor/**,**/node_modules/**,**/storage/**

# Language detection
sonar.php.file.suffixes=php
sonar.javascript.file.suffixes=.js,.jsx
```

### **Quality Profiles**
SonarQube akan menggunakan:
- **PHP**: Sonar way (default)
- **JavaScript**: Sonar way (default)  
- **Security**: OWASP Top 10
- **Reliability**: Bug detection rules

## 🎯 **Quality Gates**

### **Default Metrics:**
| Metric | Threshold | Description |
|--------|-----------|-------------|
| **Coverage** | > 80% | Code coverage percentage |
| **Duplicated Lines** | < 3% | Code duplication ratio |
| **Maintainability** | A Rating | Technical debt ratio |
| **Reliability** | A Rating | Bug density |
| **Security** | A Rating | Vulnerability density |

### **Custom Quality Gate:**
```bash
# Akses SonarQube UI → Quality Gates → Create
- New Code Coverage: 85%
- Overall Code Coverage: 80%
- Duplicated Lines on New Code: < 5%
- Security Rating on New Code: A
- Reliability Rating on New Code: A
```

## 🔧 **Integration Points**

### **1. Pre-commit Integration**
```bash
# Add SonarQube check to pre-commit hook
echo "Running SonarQube quick analysis..."
docker-compose -f docker-compose.sonarqube.yml run --rm sonar-scanner \
    sonar-scanner -Dsonar.analysis.mode=preview
```

### **2. GitHub Actions Integration**
- ✅ **Automatic analysis** pada setiap PR
- ✅ **Quality gate enforcement** 
- ✅ **PR comments** dengan analysis results
- ✅ **Security scanning** untuk vulnerabilities

### **3. IDE Integration**
```bash
# SonarLint plugins tersedia untuk:
- VS Code: SonarLint extension
- PhpStorm: SonarLint plugin  
- IntelliJ: Built-in support
```

## 📈 **Monitoring & Reporting**

### **Dashboard Metrics:**
1. **Overview** - Project health summary
2. **Issues** - Bugs, vulnerabilities, code smells
3. **Measures** - Metrics trends over time
4. **Code** - File-level analysis results
5. **Activity** - Analysis history

### **Key Reports:**
- 🐛 **Bug Report** - Logic errors dan potential crashes
- 🛡️ **Security Report** - OWASP vulnerabilities
- 📊 **Complexity Report** - Cyclomatic complexity
- 🔄 **Duplication Report** - Copy-paste code detection

## 🚀 **Advanced Features**

### **1. Multi-branch Analysis**
```yaml
# Analyze multiple branches
sonar.branch.name=feature-branch
sonar.branch.target=main
```

### **2. External Reports Integration**
```yaml
# PHPStan integration
sonar.php.phpstan.reportPaths=storage/logs/phpstan.json

# ESLint integration  
sonar.eslint.reportPaths=eslint-report.json

# Coverage reports
sonar.php.coverage.reportPaths=coverage.xml
```

### **3. Custom Rules**
```bash
# Add custom PHP rules via SonarQube UI
Quality Profiles → PHP → Activate More Rules
- Select rules for Laravel-specific patterns
- Configure rule parameters
```

## 🛠️ **Troubleshooting**

### **Common Issues:**

#### **SonarQube tidak start:**
```bash
# Check logs
docker logs sonarqube-codeanalysis

# Common fixes
docker-compose -f docker-compose.sonarqube.yml down
docker volume prune
docker-compose -f docker-compose.sonarqube.yml up -d
```

#### **Database connection issues:**
```bash
# Verify PostgreSQL
docker exec -it postgres-sonar psql -U sonar -d sonarqube -c '\l'

# Reset database
docker-compose -f docker-compose.sonarqube.yml down -v
docker-compose -f docker-compose.sonarqube.yml up -d
```

#### **Analysis fails:**
```bash
# Check project structure
ls -la examples/laravel/app
ls -la examples/nodejs

# Verify exclusions
cat sonar-project.properties | grep exclusions
```

### **Performance Tuning:**
```yaml
# For large projects, increase memory
environment:
  SONAR_WEB_JAVAADDITIONALOPTS: "-XX:MaxRAMPercentage=75"
  SONAR_CE_JAVAADDITIONALOPTS: "-XX:MaxRAMPercentage=50"
```

## 🎯 **Best Practices**

### **Development Workflow:**
1. **Local analysis** sebelum commit
2. **Pre-commit hooks** untuk quick checks  
3. **PR analysis** untuk full review
4. **Quality gate** enforcement
5. **Regular monitoring** via dashboard

### **Team Adoption:**
1. **Start dengan default rules** 
2. **Gradually tighten** quality gates
3. **Custom rules** untuk project-specific needs
4. **Training** team pada SonarQube usage
5. **Regular reviews** quality metrics

### **CI/CD Integration:**
1. **Fail builds** jika quality gate tidak pass
2. **PR blocking** untuk critical issues
3. **Automated reporting** ke team channels
4. **Trend monitoring** untuk quality improvement

## 📊 **Success Metrics**

**Track these KPIs:**
- 📈 **Code coverage** trending upward
- 📉 **Bug density** decreasing over time  
- 🛡️ **Security vulnerabilities** = 0
- 🔄 **Code duplication** < 5%
- ⚡ **Technical debt** manageable
- 👥 **Team adoption** rate

**Target dashboard:**
```
🎯 Project Health: A+ Rating
├── 🐛 Bugs: 0 issues
├── 🛡️ Vulnerabilities: 0 issues  
├── 📊 Coverage: 85%
├── 🔄 Duplication: 2.1%
└── 💡 Code Smells: 12 minor issues
```

**SonarQube provides enterprise-grade code quality insights untuk continuous improvement! 🚀**