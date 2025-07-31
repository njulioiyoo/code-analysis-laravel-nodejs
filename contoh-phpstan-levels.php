<?php

namespace App\Examples;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * Contoh kode untuk mendemonstrasikan berbagai level PHPStan
 * File ini sengaja dibuat dengan berbagai error untuk testing
 */
class PHPStanLevelExample extends Model
{
    protected $fillable = ['name', 'email', 'age'];

    // LEVEL 0: Method yang tidak ada
    public function level0Example()
    {
        $user = new \stdClass();
        return $user->nonExistentMethod(); // Error: memanggil method yang tidak ada
    }

    // LEVEL 1: Variabel belum didefinisikan
    public function level1Example()
    {
        return $undefinedVariable; // Error: variabel belum didefinisikan
    }

    // LEVEL 2: Return value tidak sesuai deklarasi
    public function level2Example(): string
    {
        return 123; // Error: return int tapi deklarasi string
    }

    // LEVEL 3: Mengakses properti yang belum didefinisikan
    public function level3Example()
    {
        $obj = new \stdClass();
        return $obj->undefinedProperty; // Error: properti tidak didefinisikan
    }

    // LEVEL 4: Mengakses kunci array yang belum dijamin ada
    public function level4Example(array $data)
    {
        return $data['maybe_exists']; // Error: kunci mungkin tidak ada
    }

    // LEVEL 5: Fungsi bisa return null tapi tidak dihandle
    public function level5Example(): string
    {
        $result = $this->maybeReturnNull(); // Bisa return null
        return $result; // Error: bisa null tapi return string
    }

    private function maybeReturnNull(): ?string
    {
        return rand(0, 1) ? 'value' : null;
    }

    // LEVEL 6: Tipe properti berubah secara tidak konsisten
    public function level6Example()
    {
        $variable = 'string';
        if (rand(0, 1)) {
            $variable = 123; // Tipe berubah dari string ke int
        }
        return strlen($variable); // Error: mungkin int, strlen butuh string
    }

    // LEVEL 7: Salah dalam mendefinisikan tipe koleksi
    public function level7Example(): Collection
    {
        /** @var Collection<string> $collection */
        $collection = collect(['a', 'b', 'c']);
        $collection->push(123); // Error: push int ke Collection<string>
        return $collection;
    }

    // LEVEL 8: Pengecekan if/else yang tidak akan pernah terjadi
    public function level8Example(string $value)
    {
        if (is_string($value)) {
            // Logic here
        }
        
        if (is_int($value)) { // Error: $value sudah dipastikan string, kondisi ini tidak akan pernah true
            return 'never reached';
        }
        
        return $value;
    }

    // LEVEL 9: Harus selalu menulis anotasi tipe dan menangani semua edge case
    public function level9Example($mixedParam) // Error: tidak ada type hint
    {
        // Error: tidak ada PHPDoc untuk parameter
        $result = $this->processData($mixedParam);
        return $result; // Error: tidak jelas return type
    }

    private function processData($data) // Error: tidak ada type hint dan return type
    {
        return $data;
    }

    // LEVEL MAX: Contoh yang benar untuk level tertinggi
    /**
     * @param array<string, mixed> $userData
     * @return array{name: string, email: string, age: int}
     */
    public function levelMaxCorrectExample(array $userData): array
    {
        if (!isset($userData['name'], $userData['email'], $userData['age'])) {
            throw new \InvalidArgumentException('Missing required fields');
        }

        if (!is_string($userData['name']) || !is_string($userData['email']) || !is_int($userData['age'])) {
            throw new \InvalidArgumentException('Invalid field types');
        }

        return [
            'name' => $userData['name'],
            'email' => $userData['email'],
            'age' => $userData['age']
        ];
    }

    // Contoh lain untuk level tinggi
    public function strictArrayExample(): void
    {
        $data = ['key1' => 'value1'];
        
        // Level 4+ akan menangkap ini
        echo $data['nonexistent']; // Error: key mungkin tidak ada
        
        // Cara yang benar:
        if (array_key_exists('nonexistent', $data)) {
            echo $data['nonexistent'];
        }
        
        // Atau menggunakan null coalescing
        echo $data['nonexistent'] ?? 'default';
    }

    public function nullableHandlingExample(): string
    {
        $nullable = $this->maybeReturnNull();
        
        // Level 5+ akan menangkap ini
        return $nullable; // Error: bisa null
        
        // Cara yang benar:
        // return $nullable ?? 'default';
    }

    /**
     * Contoh generics yang ketat untuk level 7+
     * @param Collection<User> $users
     * @return Collection<string>
     */
    public function genericExample(Collection $users): Collection
    {
        return $users->map(function ($user) {
            // Level 7+ akan memastikan $user adalah instance User
            return $user->name; // Harus dipastikan User punya property name
        });
    }

    // Unused variable untuk level tertinggi
    public function unusedVariableExample(): void
    {
        $used = 'this is used';
        $unused = 'this is never used'; // Error di level tertinggi
        
        echo $used;
    }

    // Dead code untuk level tertinggi
    public function deadCodeExample(): string
    {
        return 'early return';
        
        echo 'this is dead code'; // Error: unreachable code
    }
}

// Class tambahan untuk testing
class User extends Model
{
    protected $fillable = ['name', 'email'];
    
    public function getName(): string
    {
        return $this->name;
    }
}