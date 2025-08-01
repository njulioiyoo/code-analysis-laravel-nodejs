# Mengapa PHPStan/Larastan Tidak Mendeteksi Unused Variables?

## TL;DR
**PHPStan tidak mendeteksi unused variables secara default**. Ini adalah limitasi yang disengaja karena PHPStan fokus pada **type analysis**, bukan **code style**.

## Mengapa Unused Variables Tidak Terdeteksi?

### 1. **PHPStan Philosophy**
PHPStan dirancang untuk:
- ✅ **Type checking** (wrong types, null pointer exceptions)
- ✅ **Static analysis** (unreachable code, wrong method calls)  
- ✅ **Logic errors** (contradictory conditions)
- ❌ **Code style issues** (unused variables, formatting)

### 2. **Technical Reasons**
- Unused variables bisa jadi **intentional** (untuk debugging, future use)
- Deteksi unused variables butuh **control flow analysis** yang kompleks
- PHPStan prioritaskan **bugs yang crash aplikasi**

## Contoh Kasus

```php
public function index(Request $request)
{
    $unused = CodeAnalysis::first(); // ❌ PHPStan TIDAK akan mendeteksi ini
    
    $query = CodeAnalysis::query();
    
    $wrongType = "string" + 123; // ✅ PHPStan AKAN mendeteksi ini
    
    return $query->paginate(15);
}
```

## Solusi untuk Mendeteksi Unused Variables

### 1. **PHP_CodeSniffer** ⭐ Recommended
```bash
composer require --dev squizlabs/php_codesniffer
./vendor/bin/phpcs --standard=Generic.CodeAnalysis.UnusedFunctionParameter app/
```

### 2. **PHPStan Strict Rules** (PHP 8.0+)
```bash
composer require --dev phpstan/phpstan-strict-rules
```

Tambahkan di `phpstan.neon`:
```yaml
includes:
    - vendor/phpstan/phpstan-strict-rules/rules.neon
```

### 3. **PHPMD (PHP Mess Detector)**
```bash
composer require --dev phpmd/phpmd
./vendor/bin/phpmd app/ text unusedcode
```

### 4. **PHP CS Fixer**
```bash
composer require --dev friendsofphp/php-cs-fixer
./vendor/bin/php-cs-fixer fix --rules=no_unused_imports
```

## Konfigurasi IDE

### PHPStorm/IntelliJ
- Settings → Editor → Inspections
- Enable "Unused declaration" untuk PHP

### VS Code
- Install extension "PHP Intelephense"  
- Enable unused variable warnings di settings

## Kombinasi Tool yang Optimal

```yaml
# phpstan.neon - untuk type analysis
level: max
paths: [app/]

# .php-cs-fixer.php - untuk unused imports
return PhpCsFixer\Config::create()
    ->setRules([
        'no_unused_imports' => true,
    ]);

# phpcs.xml - untuk unused variables  
<rule ref="Generic.CodeAnalysis.UnusedFunctionParameter"/>
```

## Testing

Untuk test apakah tool bekerja, buat file test:

```php
<?php
public function test() {
    $unused = "this should be detected"; // Target detection
    $used = "this is used";
    return $used;
}
```

## Kesimpulan

**PHPStan excellent untuk bugs**, tapi **tidak untuk code quality**. Gunakan kombinasi tools:

- 🔍 **PHPStan/Larastan**: Type errors, logic bugs
- 🧹 **PHP_CodeSniffer**: Code style, unused variables  
- 🎨 **PHP CS Fixer**: Auto-fix code style
- 🔎 **PHPMD**: Complex code smells

Ini normal dan expected behavior - bukan bug! 🎯