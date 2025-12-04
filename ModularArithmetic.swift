import Foundation

// MARK: - Basic Modular Arithmetic Operations

func modAdd(_ a: Int, _ b: Int, _ m: Int) -> Int {
    return ((a + b) % m + m) % m
}

func modSubtract(_ a: Int, _ b: Int, _ m: Int) -> Int {
    return ((a - b) % m + m) % m
}

func modMultiply(_ a: Int, _ b: Int, _ m: Int) -> Int {
    return ((a * b) % m + m) % m
}

func modPower(_ base: Int, _ exp: Int, _ m: Int) -> Int {
    var result = 1
    var base = base % m
    var exp = exp
    
    while exp > 0 {
        if exp % 2 == 1 {
            result = (result * base) % m
        }
        exp = exp / 2
        base = (base * base) % m
    }
    
    return result
}

// MARK: - Number Theory Functions

func gcd(_ a: Int, _ b: Int) -> Int {
    var a = a
    var b = b
    while b != 0 {
        let temp = b
        b = a % b
        a = temp
    }
    return a
}

func extendedGCD(_ a: Int, _ b: Int) -> (gcd: Int, x: Int, y: Int) {
    if b == 0 {
        return (a, 1, 0)
    }
    
    let result = extendedGCD(b, a % b)
    let x = result.y
    let y = result.x - (a / b) * result.y
    
    return (result.gcd, x, y)
}

func modInverse(_ a: Int, _ m: Int) throws -> Int {
    let result = extendedGCD(a, m)
    
    guard result.gcd == 1 else {
        throw ArithmeticError.noModularInverse
    }
    
    return ((result.x % m) + m) % m
}

func isPrime(_ n: Int) -> Bool {
    if n < 2 {
        return false
    }
    if n == 2 {
        return true
    }
    if n % 2 == 0 {
        return false
    }
    
    let sqrtN = Int(sqrt(Double(n)))
    for i in stride(from: 3, through: sqrtN, by: 2) {
        if n % i == 0 {
            return false
        }
    }
    
    return true
}

// MARK: - Error Types

enum ArithmeticError: Error {
    case noModularInverse
    case notPrime
    case invalidInput
}

// MARK: - Cipher Implementations

class CaesarCipher {
    static func encrypt(_ text: String, shift: Int) -> String {
        return cipher(text, shift: shift, decrypt: false)
    }
    
    static func decrypt(_ text: String, shift: Int) -> String {
        return cipher(text, shift: shift, decrypt: true)
    }
    
    private static func cipher(_ text: String, shift: Int, decrypt: Bool) -> String {
        let s = decrypt ? (26 - shift) % 26 : shift % 26
        var result = ""
        
        for char in text.uppercased() {
            if let ascii = char.unicodeScalars.first?.value,
               ascii >= 65 && ascii <= 90 {
                let shifted = ((Int(ascii) - 65 + s) % 26) + 65
                result.append(Character(UnicodeScalar(UInt8(shifted))))
            } else {
                result.append(char)
            }
        }
        
        return result
    }
}

class VigenereCipher {
    static func encrypt(_ text: String, key: String) -> String {
        return cipher(text, key: key, decrypt: false)
    }
    
    static func decrypt(_ text: String, key: String) -> String {
        return cipher(text, key: key, decrypt: true)
    }
    
    private static func cipher(_ text: String, key: String, decrypt: Bool) -> String {
        let keyUpper = key.uppercased()
        var result = ""
        var keyIndex = 0
        
        for char in text.uppercased() {
            if let ascii = char.unicodeScalars.first?.value,
               ascii >= 65 && ascii <= 90 {
                let keyChar = keyUpper[keyUpper.index(keyUpper.startIndex, offsetBy: keyIndex % keyUpper.count)]
                guard let keyAscii = keyChar.unicodeScalars.first?.value else { continue }
                
                var shift = Int(keyAscii) - 65
                if decrypt {
                    shift = -shift
                }
                
                let shifted = ((Int(ascii) - 65 + shift) % 26 + 26) % 26 + 65
                result.append(Character(UnicodeScalar(UInt8(shifted))))
                keyIndex += 1
            } else {
                result.append(char)
            }
        }
        
        return result
    }
}

// MARK: - RSA Implementation

struct RSAKeys {
    let n: Int      // Modulus
    let e: Int      // Public exponent
    let d: Int      // Private exponent
    let phi: Int    // Euler's totient
}

class RSA {
    static func generateKeys(p: Int, q: Int) throws -> RSAKeys {
        guard isPrime(p) && isPrime(q) else {
            throw ArithmeticError.notPrime
        }
        
        let n = p * q
        let phi = (p - 1) * (q - 1)
        
        var e = 65537
        if e >= phi {
            e = 3
        }
        
        while gcd(e, phi) != 1 {
            e += 2
        }
        
        let d = try modInverse(e, phi)
        
        return RSAKeys(n: n, e: e, d: d, phi: phi)
    }
    
    static func encrypt(_ message: Int, keys: RSAKeys) -> Int {
        return modPower(message, keys.e, keys.n)
    }
    
    static func decrypt(_ ciphertext: Int, keys: RSAKeys) -> Int {
        return modPower(ciphertext, keys.d, keys.n)
    }
}

// MARK: - Chinese Remainder Theorem

class ChineseRemainderTheorem {
    static func solve(remainders: [Int], moduli: [Int]) throws -> Int {
        guard remainders.count == moduli.count else {
            throw ArithmeticError.invalidInput
        }
        
        let M = moduli.reduce(1, *)
        var x = 0
        
        for i in 0..<moduli.count {
            let Mi = M / moduli[i]
            let yi = try modInverse(Mi, moduli[i])
            x += remainders[i] * Mi * yi
        }
        
        return ((x % M) + M) % M
    }
}

// MARK: - Fermat's Little Theorem

struct FermatStep {
    let exponent: Int
    let result: Int
}

struct FermatResult {
    let finalResult: Int
    let steps: [FermatStep]
}

class FermatLittleTheorem {
    static func verify(base a: Int, prime p: Int) throws -> FermatResult {
        guard isPrime(p) else {
            throw ArithmeticError.notPrime
        }
        
        let result = modPower(a, p - 1, p)
        
        var steps: [FermatStep] = []
        let maxSteps = min(10, p - 1)
        
        for i in 1...maxSteps {
            let stepResult = modPower(a, i, p)
            steps.append(FermatStep(exponent: i, result: stepResult))
        }
        
        return FermatResult(finalResult: result, steps: steps)
    }
}

// MARK: - Demo Function

func demoModularArithmetic() {
    print("=== Modular Arithmetic Clock Demo ===\n")
    
    // Basic operations
    print("1. Basic Modular Operations (mod 12):")
    print("   7 + 8 ≡ \(modAdd(7, 8, 12)) (mod 12)")
    print("   5 - 9 ≡ \(modSubtract(5, 9, 12)) (mod 12)")
    print("   4 × 7 ≡ \(modMultiply(4, 7, 12)) (mod 12)")
    print("   3^4 ≡ \(modPower(3, 4, 12)) (mod 12)\n")
    
    // Caesar cipher
    print("2. Caesar Cipher (shift 3):")
    let plaintext = "HELLO WORLD"
    let encrypted = CaesarCipher.encrypt(plaintext, shift: 3)
    let decrypted = CaesarCipher.decrypt(encrypted, shift: 3)
    print("   Plain: \(plaintext)")
    print("   Encrypted: \(encrypted)")
    print("   Decrypted: \(decrypted)\n")
    
    // Vigenère cipher
    print("3. Vigenère Cipher (key: KEY):")
    let encryptedVig = VigenereCipher.encrypt("HELLO WORLD", key: "KEY")
    let decryptedVig = VigenereCipher.decrypt(encryptedVig, key: "KEY")
    print("   Plain: HELLO WORLD")
    print("   Encrypted: \(encryptedVig)")
    print("   Decrypted: \(decryptedVig)\n")
    
    // RSA
    print("4. RSA Key Generation (p=61, q=53):")
    do {
        let keys = try RSA.generateKeys(p: 61, q: 53)
        print("   n = \(keys.n)")
        print("   e = \(keys.e)")
        print("   d = \(keys.d)")
        print("   φ(n) = \(keys.phi)")
        
        let message = 42
        let encryptedRSA = RSA.encrypt(message, keys: keys)
        let decryptedRSA = RSA.decrypt(encryptedRSA, keys: keys)
        print("   Message: \(message)")
        print("   Encrypted: \(encryptedRSA)")
        print("   Decrypted: \(decryptedRSA)\n")
    } catch {
        print("   Error: \(error)\n")
    }
    
    // Chinese Remainder Theorem
    print("5. Chinese Remainder Theorem:")
    do {
        let solution = try ChineseRemainderTheorem.solve(
            remainders: [2, 3, 2],
            moduli: [3, 5, 7]
        )
        print("   x ≡ 2 (mod 3)")
        print("   x ≡ 3 (mod 5)")
        print("   x ≡ 2 (mod 7)")
        print("   Solution: x ≡ \(solution) (mod 105)\n")
    } catch {
        print("   Error: \(error)\n")
    }
    
    // Fermat's Little Theorem
    print("6. Fermat's Little Theorem (a=2, p=7):")
    do {
        let fermatResult = try FermatLittleTheorem.verify(base: 2, prime: 7)
        print("   2^6 ≡ \(fermatResult.finalResult) (mod 7)")
        print("   Steps:")
        for step in fermatResult.steps {
            print("   2^\(step.exponent) ≡ \(step.result) (mod 7)")
        }
    } catch {
        print("   Error: \(error)")
    }
}

// Run demo
demoModularArithmetic()