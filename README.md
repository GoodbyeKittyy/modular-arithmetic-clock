# Modular Arithmetic Clock & Cipher Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4fc08d.svg)](https://vuejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776ab.svg)](https://www.python.org/)

A comprehensive cryptographic education platform that visualizes modular arithmetic through interactive clock systems. This project implements classical ciphers, RSA encryption, and number theory algorithms across multiple programming languages and frameworks.

## 🎯 Features

### Interactive Visualizations
- **Modular Arithmetic Clock**: Real-time visualization of clock arithmetic with adjustable modulus (4-24)
- **Visual Key Shifting**: See cipher transformations as they happen
- **Modern UI**: Sleek, thin-styled interface with dark mode aesthetics

### Cryptographic Algorithms
- **Caesar Cipher**: Classical substitution cipher with visual shift demonstration
- **Vigenère Cipher**: Polyalphabetic cipher with keyword encryption
- **RSA Encryption**: Prime factorization demonstration and key generation
- **Chinese Remainder Theorem**: System of congruences solver with step-by-step solutions
- **Fermat's Little Theorem**: Visual proof generation and verification

### Educational Tools
- Step-by-step algorithm visualization
- Real-time computation results
- Interactive controls for all parameters
- Educational explanations and mathematical notation

## 🚀 Quick Start

### Interactive Web Application (React)
```bash
# The React artifact can be viewed directly in Claude
# No installation required for the interactive demo
```

### Vue.js Implementation
```bash
npm install vue@3
# Include the modular-clock.vue component in your Vue project
```

### Julia Implementation
```julia
# Install Julia from https://julialang.org/
include("modular_arithmetic.jl")
using .ModularArithmetic

# Run the demo
demo_modular_arithmetic()
```

### Go Implementation
```bash
go run modular_arithmetic.go
```

### Swift Implementation
```bash
swift ModularArithmetic.swift
```

### Flask API
```bash
pip install flask
python app.py
# API available at http://localhost:5000
```

## 📁 Project Structure

```
modular-arithmetic-clock/
├── README.md                          # This file
├── interactive-clock.jsx              # React interactive artifact
├── modular-clock.vue                  # Vue.js component
├── modular_arithmetic.jl              # Julia implementation
├── modular_arithmetic.go              # Go implementation
├── ModularArithmetic.swift            # Swift implementation
└── app.py                             # Flask REST API
```

## 💻 Usage Examples

### Basic Modular Arithmetic (Julia)
```julia
using .ModularArithmetic

# Perform modular addition
result = mod_add(7, 8, 12)  # Returns 3

# Modular exponentiation
result = mod_power(3, 4, 12)  # Returns 9
```

### Caesar Cipher (Go)
```go
plaintext := "HELLO WORLD"
encrypted := CaesarCipher(plaintext, 3, false)
// Returns: "KHOOR ZRUOG"
```

### RSA Key Generation (Swift)
```swift
let keys = try RSA.generateKeys(p: 61, q: 53)
print("Public key: (e=\(keys.e), n=\(keys.n))")
print("Private key: (d=\(keys.d), n=\(keys.n))")
```

### Flask API Request
```bash
curl -X POST http://localhost:5000/api/cipher/caesar \
  -H "Content-Type: application/json" \
  -d '{"text": "HELLO", "shift": 3, "decrypt": false}'
```

## 🔧 API Endpoints (Flask)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/modular/operation` | POST | Perform modular arithmetic operations |
| `/api/cipher/caesar` | POST | Caesar cipher encryption/decryption |
| `/api/cipher/vigenere` | POST | Vigenère cipher encryption/decryption |
| `/api/rsa/generate` | POST | Generate RSA key pairs |
| `/api/rsa/encrypt` | POST | Encrypt message with RSA |
| `/api/rsa/decrypt` | POST | Decrypt ciphertext with RSA |
| `/api/crt/solve` | POST | Solve Chinese Remainder Theorem |
| `/api/fermat/verify` | POST | Verify Fermat's Little Theorem |
| `/api/isprime/<n>` | GET | Check if number is prime |

## 🎓 Educational Applications

This tool is designed for:
- **Cryptography Courses**: Hands-on learning of classical and modern ciphers
- **Number Theory**: Visual understanding of modular arithmetic
- **Blockchain Development**: Foundation for understanding cryptographic principles
- **Computer Science Education**: Algorithm implementation and optimization
- **Self-Study**: Interactive exploration of mathematical concepts

## 🧮 Algorithms Implemented

### Number Theory
- Extended Euclidean Algorithm
- Modular Inverse Calculation
- Prime Number Detection (Trial Division)
- Fast Modular Exponentiation

### Cryptography
- Caesar Cipher (Shift Cipher)
- Vigenère Cipher (Polyalphabetic Substitution)
- RSA Key Generation, Encryption, Decryption
- Chinese Remainder Theorem Solver
- Fermat's Little Theorem Verification

## 🎨 Design Philosophy

The interface follows modern web design principles:
- **Minimalist Clock Design**: Thin lines and subtle animations
- **Dark Mode First**: Reduces eye strain during extended use
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Color-Coded Actions**: Execution buttons in grey/black, results in blue
- **Progressive Disclosure**: Complex features revealed as needed

## 🔬 Technical Details

### Modular Arithmetic Clock
- Adjustable modulus from 4 to 24
- Support for addition, subtraction, multiplication, and exponentiation
- Real-time visual feedback with animated clock hand
- Numbered positions with active state highlighting

### Cipher Implementations
- Character-by-character transformation visualization
- Support for alphabetic characters (A-Z)
- Preservation of non-alphabetic characters
- Bidirectional encryption/decryption

### RSA Algorithm
- Prime validation for input values
- Automatic selection of public exponent (e)
- Extended Euclidean algorithm for private key calculation
- Support for small to medium-sized primes

### Optimization Techniques
- Fast modular exponentiation (O(log n))
- Efficient prime checking (O(√n))
- Extended GCD for modular inverse computation

## 🤝 Contributing

Contributions are welcome! This project can be extended with:
- Additional cipher implementations (Playfair, Hill, etc.)
- More number theory algorithms (Euler's theorem, Carmichael function)
- Performance optimizations for large numbers
- Additional language implementations
- Enhanced visualizations

## 📚 References

- **Number Theory**: Introduction to Modern Cryptography by Katz & Lindell
- **RSA Algorithm**: "A Method for Obtaining Digital Signatures and Public-Key Cryptosystems" - Rivest, Shamir, Adleman (1978)
- **Modular Arithmetic**: Concrete Mathematics - Graham, Knuth, Patashnik
- **Chinese Remainder Theorem**: Sun Tzu's Mathematical Manual (3rd century)

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Interactive UI | React 18 with Hooks |
| Frontend Framework | Vue.js 3 (Composition API) |
| Scientific Computing | Julia 1.x |
| Systems Programming | Go 1.x |
| iOS/macOS | Swift 5.x |
| Backend API | Flask (Python 3.8+) |
| Styling | Tailwind CSS, Custom CSS |
| Icons | Lucide React |

## 📊 Performance Characteristics

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Modular Addition | O(1) | O(1) |
| Modular Exponentiation | O(log n) | O(1) |
| Prime Check | O(√n) | O(1) |
| Caesar Cipher | O(n) | O(n) |
| Vigenère Cipher | O(n) | O(n) |
| RSA Key Generation | O(√p + √q) | O(1) |
| CRT Solver | O(k log M) | O(k) |

Where:
- n = text length
- p, q = prime numbers
- k = number of congruences
- M = product of moduli

## 🔐 Security Notes

This implementation is for **educational purposes only**. The RSA implementation:
- Uses small primes suitable for learning
- Does not include padding schemes (OAEP, PSS)
- Is not constant-time (vulnerable to timing attacks)
- Should NOT be used in production systems

For production cryptography, use established libraries like:
- OpenSSL
- libsodium
- Go's crypto package
- Python's cryptography library

## 📄 License

MIT License - feel free to use this project for educational purposes, personal projects, or as a foundation for more advanced implementations.

## 🌟 Acknowledgments

Built as a comprehensive educational tool demonstrating:
- Cross-language algorithm implementation
- Modern web development practices
- Mathematical visualization techniques
- API design patterns

Perfect for students, educators, and developers interested in cryptography, number theory, and algorithm design.

---

**Made with ❤️ for cryptography education and blockchain development**