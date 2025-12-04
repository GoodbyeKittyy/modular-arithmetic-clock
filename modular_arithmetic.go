package main

import (
	"fmt"
	"math"
	"strings"
)

// ModAdd performs modular addition: (a + b) mod m
func ModAdd(a, b, m int) int {
	return ((a + b) % m + m) % m
}

// ModSubtract performs modular subtraction: (a - b) mod m
func ModSubtract(a, b, m int) int {
	return ((a - b) % m + m) % m
}

// ModMultiply performs modular multiplication: (a * b) mod m
func ModMultiply(a, b, m int) int {
	return ((a * b) % m + m) % m
}

// ModPower performs modular exponentiation: base^exp mod m
func ModPower(base, exp, m int) int {
	result := 1
	base = base % m
	for exp > 0 {
		if exp%2 == 1 {
			result = (result * base) % m
		}
		exp = exp / 2
		base = (base * base) % m
	}
	return result
}

// GCD calculates the greatest common divisor using Euclidean algorithm
func GCD(a, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}

// ExtendedGCD returns gcd, x, y where gcd = ax + by
func ExtendedGCD(a, b int) (int, int, int) {
	if b == 0 {
		return a, 1, 0
	}
	gcd, x1, y1 := ExtendedGCD(b, a%b)
	x := y1
	y := x1 - (a/b)*y1
	return gcd, x, y
}

// ModInverse finds the modular multiplicative inverse of a modulo m
func ModInverse(a, m int) (int, error) {
	gcd, x, _ := ExtendedGCD(a, m)
	if gcd != 1 {
		return 0, fmt.Errorf("modular inverse does not exist")
	}
	return ((x % m) + m) % m, nil
}

// IsPrime checks if n is a prime number using trial division
func IsPrime(n int) bool {
	if n < 2 {
		return false
	}
	if n == 2 {
		return true
	}
	if n%2 == 0 {
		return false
	}
	sqrtN := int(math.Sqrt(float64(n)))
	for i := 3; i <= sqrtN; i += 2 {
		if n%i == 0 {
			return false
		}
	}
	return true
}

// CaesarCipher encrypts or decrypts text using Caesar cipher
func CaesarCipher(text string, shift int, decrypt bool) string {
	s := shift
	if decrypt {
		s = (26 - shift) % 26
	}
	
	result := strings.Builder{}
	for _, char := range strings.ToUpper(text) {
		if char >= 'A' && char <= 'Z' {
			newChar := rune(((int(char-'A') + s) % 26) + 'A')
			result.WriteRune(newChar)
		} else {
			result.WriteRune(char)
		}
	}
	return result.String()
}

// VigenereCipher encrypts or decrypts text using Vigenère cipher
func VigenereCipher(text string, key string, decrypt bool) string {
	keyUpper := strings.ToUpper(key)
	result := strings.Builder{}
	keyIndex := 0
	
	for _, char := range strings.ToUpper(text) {
		if char >= 'A' && char <= 'Z' {
			shift := int(keyUpper[keyIndex%len(keyUpper)] - 'A')
			if decrypt {
				shift = -shift
			}
			newChar := rune(((int(char-'A')+shift)%26+26)%26 + 'A')
			result.WriteRune(newChar)
			keyIndex++
		} else {
			result.WriteRune(char)
		}
	}
	return result.String()
}

// RSAKeys represents RSA public and private keys
type RSAKeys struct {
	N   int // Modulus
	E   int // Public exponent
	D   int // Private exponent
	Phi int // Euler's totient function
}

// GenerateRSAKeys generates RSA keys from primes p and q
func GenerateRSAKeys(p, q int) (*RSAKeys, error) {
	if !IsPrime(p) || !IsPrime(q) {
		return nil, fmt.Errorf("both p and q must be prime")
	}
	
	n := p * q
	phi := (p - 1) * (q - 1)
	
	// Choose e (commonly 65537)
	e := 65537
	if e >= phi {
		e = 3
	}
	
	for GCD(e, phi) != 1 {
		e += 2
	}
	
	d, err := ModInverse(e, phi)
	if err != nil {
		return nil, err
	}
	
	return &RSAKeys{
		N:   n,
		E:   e,
		D:   d,
		Phi: phi,
	}, nil
}

// RSAEncrypt encrypts a message using RSA public key
func RSAEncrypt(message int, keys *RSAKeys) int {
	return ModPower(message, keys.E, keys.N)
}

// RSADecrypt decrypts a ciphertext using RSA private key
func RSADecrypt(ciphertext int, keys *RSAKeys) int {
	return ModPower(ciphertext, keys.D, keys.N)
}

// ChineseRemainderTheorem solves system of congruences
func ChineseRemainderTheorem(remainders, moduli []int) (int, error) {
	if len(remainders) != len(moduli) {
		return 0, fmt.Errorf("remainders and moduli must have same length")
	}
	
	M := 1
	for _, m := range moduli {
		M *= m
	}
	
	x := 0
	for i := 0; i < len(moduli); i++ {
		Mi := M / moduli[i]
		yi, err := ModInverse(Mi, moduli[i])
		if err != nil {
			return 0, err
		}
		x += remainders[i] * Mi * yi
	}
	
	return ((x % M) + M) % M, nil
}

// FermatLittleTheorem verifies Fermat's Little Theorem
type FermatResult struct {
	Result int
	Steps  []FermatStep
}

type FermatStep struct {
	Exponent int
	Result   int
}

// VerifyFermatLittleTheorem verifies a^(p-1) ≡ 1 (mod p)
func VerifyFermatLittleTheorem(a, p int) (*FermatResult, error) {
	if !IsPrime(p) {
		return nil, fmt.Errorf("p must be prime")
	}
	
	result := ModPower(a, p-1, p)
	
	steps := []FermatStep{}
	maxSteps := 10
	if p-1 < maxSteps {
		maxSteps = p - 1
	}
	
	for i := 1; i <= maxSteps; i++ {
		stepResult := ModPower(a, i, p)
		steps = append(steps, FermatStep{
			Exponent: i,
			Result:   stepResult,
		})
	}
	
	return &FermatResult{
		Result: result,
		Steps:  steps,
	}, nil
}

// DemoModularArithmetic demonstrates various operations
func DemoModularArithmetic() {
	fmt.Println("=== Modular Arithmetic Clock Demo ===\n")
	
	// Basic operations
	fmt.Println("1. Basic Modular Operations (mod 12):")
	fmt.Printf("   7 + 8 ≡ %d (mod 12)\n", ModAdd(7, 8, 12))
	fmt.Printf("   5 - 9 ≡ %d (mod 12)\n", ModSubtract(5, 9, 12))
	fmt.Printf("   4 × 7 ≡ %d (mod 12)\n", ModMultiply(4, 7, 12))
	fmt.Printf("   3^4 ≡ %d (mod 12)\n\n", ModPower(3, 4, 12))
	
	// Caesar cipher
	fmt.Println("2. Caesar Cipher (shift 3):")
	plaintext := "HELLO WORLD"
	encrypted := CaesarCipher(plaintext, 3, false)
	decrypted := CaesarCipher(encrypted, 3, true)
	fmt.Printf("   Plain: %s\n", plaintext)
	fmt.Printf("   Encrypted: %s\n", encrypted)
	fmt.Printf("   Decrypted: %s\n\n", decrypted)
	
	// Vigenère cipher
	fmt.Println("3. Vigenère Cipher (key: KEY):")
	encryptedVig := VigenereCipher("HELLO WORLD", "KEY", false)
	decryptedVig := VigenereCipher(encryptedVig, "KEY", true)
	fmt.Println("   Plain: HELLO WORLD")
	fmt.Printf("   Encrypted: %s\n", encryptedVig)
	fmt.Printf("   Decrypted: %s\n\n", decryptedVig)
	
	// RSA
	fmt.Println("4. RSA Key Generation (p=61, q=53):")
	keys, err := GenerateRSAKeys(61, 53)
	if err != nil {
		fmt.Printf("   Error: %v\n\n", err)
	} else {
		fmt.Printf("   n = %d\n", keys.N)
		fmt.Printf("   e = %d\n", keys.E)
		fmt.Printf("   d = %d\n", keys.D)
		fmt.Printf("   φ(n) = %d\n", keys.Phi)
		message := 42
		encryptedRSA := RSAEncrypt(message, keys)
		decryptedRSA := RSADecrypt(encryptedRSA, keys)
		fmt.Printf("   Message: %d\n", message)
		fmt.Printf("   Encrypted: %d\n", encryptedRSA)
		fmt.Printf("   Decrypted: %d\n\n", decryptedRSA)
	}
	
	// Chinese Remainder Theorem
	fmt.Println("5. Chinese Remainder Theorem:")
	remainders := []int{2, 3, 2}
	moduli := []int{3, 5, 7}
	solution, err := ChineseRemainderTheorem(remainders, moduli)
	if err != nil {
		fmt.Printf("   Error: %v\n\n", err)
	} else {
		fmt.Println("   x ≡ 2 (mod 3)")
		fmt.Println("   x ≡ 3 (mod 5)")
		fmt.Println("   x ≡ 2 (mod 7)")
		fmt.Printf("   Solution: x ≡ %d (mod 105)\n\n", solution)
	}
	
	// Fermat's Little Theorem
	fmt.Println("6. Fermat's Little Theorem (a=2, p=7):")
	fermatResult, err := VerifyFermatLittleTheorem(2, 7)
	if err != nil {
		fmt.Printf("   Error: %v\n\n", err)
	} else {
		fmt.Printf("   2^6 ≡ %d (mod 7)\n", fermatResult.Result)
		fmt.Println("   Steps:")
		for _, step := range fermatResult.Steps {
			fmt.Printf("   2^%d ≡ %d (mod 7)\n", step.Exponent, step.Result)
		}
	}
}

func main() {
	DemoModularArithmetic()
}