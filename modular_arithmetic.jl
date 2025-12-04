module ModularArithmetic

export mod_add, mod_subtract, mod_multiply, mod_power, mod_inverse
export caesar_cipher, vigenere_cipher
export rsa_keygen, rsa_encrypt, rsa_decrypt
export chinese_remainder_theorem, extended_gcd
export fermat_little_theorem, is_prime

"""
    mod_add(a, b, m)

Perform modular addition: (a + b) mod m
"""
function mod_add(a::Integer, b::Integer, m::Integer)::Integer
    return mod(a + b, m)
end

"""
    mod_subtract(a, b, m)

Perform modular subtraction: (a - b) mod m
"""
function mod_subtract(a::Integer, b::Integer, m::Integer)::Integer
    return mod(a - b, m)
end

"""
    mod_multiply(a, b, m)

Perform modular multiplication: (a * b) mod m
"""
function mod_multiply(a::Integer, b::Integer, m::Integer)::Integer
    return mod(a * b, m)
end

"""
    mod_power(base, exp, m)

Perform modular exponentiation using fast exponentiation: base^exp mod m
"""
function mod_power(base::Integer, exp::Integer, m::Integer)::Integer
    result = 1
    base = mod(base, m)
    while exp > 0
        if mod(exp, 2) == 1
            result = mod(result * base, m)
        end
        exp = exp ÷ 2
        base = mod(base * base, m)
    end
    return result
end

"""
    extended_gcd(a, b)

Extended Euclidean algorithm. Returns (gcd, x, y) where gcd = ax + by
"""
function extended_gcd(a::Integer, b::Integer)
    if b == 0
        return (a, 1, 0)
    end
    gcd_val, x1, y1 = extended_gcd(b, mod(a, b))
    x = y1
    y = x1 - (a ÷ b) * y1
    return (gcd_val, x, y)
end

"""
    mod_inverse(a, m)

Find modular multiplicative inverse of a modulo m
"""
function mod_inverse(a::Integer, m::Integer)::Integer
    gcd_val, x, _ = extended_gcd(a, m)
    if gcd_val != 1
        throw(ArgumentError("Modular inverse does not exist"))
    end
    return mod(x, m)
end

"""
    is_prime(n)

Check if n is a prime number using trial division
"""
function is_prime(n::Integer)::Bool
    if n < 2
        return false
    end
    if n == 2
        return true
    end
    if mod(n, 2) == 0
        return false
    end
    for i in 3:2:isqrt(n)
        if mod(n, i) == 0
            return false
        end
    end
    return true
end

"""
    caesar_cipher(text, shift; decrypt=false)

Implement Caesar cipher encryption/decryption
"""
function caesar_cipher(text::String, shift::Integer; decrypt::Bool=false)::String
    s = decrypt ? mod(-shift, 26) : mod(shift, 26)
    result = []
    
    for char in uppercase(text)
        if 'A' <= char <= 'Z'
            new_char = Char(mod(Int(char) - Int('A') + s, 26) + Int('A'))
            push!(result, new_char)
        else
            push!(result, char)
        end
    end
    
    return join(result)
end

"""
    vigenere_cipher(text, key; decrypt=false)

Implement Vigenère cipher encryption/decryption
"""
function vigenere_cipher(text::String, key::String; decrypt::Bool=false)::String
    key_upper = uppercase(key)
    result = []
    key_index = 1
    
    for char in uppercase(text)
        if 'A' <= char <= 'Z'
            shift = Int(key_upper[mod(key_index - 1, length(key_upper)) + 1]) - Int('A')
            if decrypt
                shift = -shift
            end
            new_char = Char(mod(Int(char) - Int('A') + shift, 26) + Int('A'))
            push!(result, new_char)
            key_index += 1
        else
            push!(result, char)
        end
    end
    
    return join(result)
end

"""
    rsa_keygen(p, q)

Generate RSA public and private keys from primes p and q
Returns (n, e, d, φ) where n is modulus, e is public exponent, d is private exponent
"""
function rsa_keygen(p::Integer, q::Integer)
    if !is_prime(p) || !is_prime(q)
        throw(ArgumentError("Both p and q must be prime"))
    end
    
    n = p * q
    phi = (p - 1) * (q - 1)
    
    # Choose e (commonly 65537, but adjust if needed)
    e = 65537
    if e >= phi
        e = 3
    end
    
    while gcd(e, phi) != 1
        e += 2
    end
    
    d = mod_inverse(e, phi)
    
    return (n, e, d, phi)
end

"""
    rsa_encrypt(message, e, n)

Encrypt a message using RSA public key (e, n)
"""
function rsa_encrypt(message::Integer, e::Integer, n::Integer)::Integer
    return mod_power(message, e, n)
end

"""
    rsa_decrypt(ciphertext, d, n)

Decrypt a ciphertext using RSA private key (d, n)
"""
function rsa_decrypt(ciphertext::Integer, d::Integer, n::Integer)::Integer
    return mod_power(ciphertext, d, n)
end

"""
    chinese_remainder_theorem(remainders, moduli)

Solve system of congruences using Chinese Remainder Theorem
x ≡ a₁ (mod m₁), x ≡ a₂ (mod m₂), ..., x ≡ aₙ (mod mₙ)
"""
function chinese_remainder_theorem(remainders::Vector{<:Integer}, moduli::Vector{<:Integer})
    if length(remainders) != length(moduli)
        throw(ArgumentError("Remainders and moduli must have same length"))
    end
    
    M = prod(moduli)
    x = 0
    
    for i in 1:length(moduli)
        Mi = M ÷ moduli[i]
        yi = mod_inverse(Mi, moduli[i])
        x += remainders[i] * Mi * yi
    end
    
    return mod(x, M)
end

"""
    fermat_little_theorem(a, p)

Verify Fermat's Little Theorem: a^(p-1) ≡ 1 (mod p) for prime p
Returns the result of a^(p-1) mod p and intermediate steps
"""
function fermat_little_theorem(a::Integer, p::Integer)
    if !is_prime(p)
        throw(ArgumentError("p must be prime"))
    end
    
    result = mod_power(a, p - 1, p)
    
    # Generate proof steps
    steps = []
    for i in 1:min(10, p-1)
        step_result = mod_power(a, i, p)
        push!(steps, (i, step_result))
    end
    
    return (result, steps)
end

"""
    demo_modular_arithmetic()

Demonstrate various modular arithmetic operations
"""
function demo_modular_arithmetic()
    println("=== Modular Arithmetic Clock Demo ===\n")
    
    # Basic operations
    println("1. Basic Modular Operations (mod 12):")
    println("   7 + 8 ≡ $(mod_add(7, 8, 12)) (mod 12)")
    println("   5 - 9 ≡ $(mod_subtract(5, 9, 12)) (mod 12)")
    println("   4 × 7 ≡ $(mod_multiply(4, 7, 12)) (mod 12)")
    println("   3^4 ≡ $(mod_power(3, 4, 12)) (mod 12)\n")
    
    # Caesar cipher
    println("2. Caesar Cipher (shift 3):")
    plaintext = "HELLO WORLD"
    encrypted = caesar_cipher(plaintext, 3)
    decrypted = caesar_cipher(encrypted, 3, decrypt=true)
    println("   Plain: $plaintext")
    println("   Encrypted: $encrypted")
    println("   Decrypted: $decrypted\n")
    
    # Vigenère cipher
    println("3. Vigenère Cipher (key: KEY):")
    encrypted_vig = vigenere_cipher("HELLO WORLD", "KEY")
    decrypted_vig = vigenere_cipher(encrypted_vig, "KEY", decrypt=true)
    println("   Plain: HELLO WORLD")
    println("   Encrypted: $encrypted_vig")
    println("   Decrypted: $decrypted_vig\n")
    
    # RSA
    println("4. RSA Key Generation (p=61, q=53):")
    n, e, d, phi = rsa_keygen(61, 53)
    println("   n = $n")
    println("   e = $e")
    println("   d = $d")
    println("   φ(n) = $phi")
    message = 42
    encrypted_rsa = rsa_encrypt(message, e, n)
    decrypted_rsa = rsa_decrypt(encrypted_rsa, d, n)
    println("   Message: $message")
    println("   Encrypted: $encrypted_rsa")
    println("   Decrypted: $decrypted_rsa\n")
    
    # Chinese Remainder Theorem
    println("5. Chinese Remainder Theorem:")
    remainders = [2, 3, 2]
    moduli = [3, 5, 7]
    solution = chinese_remainder_theorem(remainders, moduli)
    println("   x ≡ 2 (mod 3)")
    println("   x ≡ 3 (mod 5)")
    println("   x ≡ 2 (mod 7)")
    println("   Solution: x ≡ $solution (mod $(prod(moduli)))\n")
    
    # Fermat's Little Theorem
    println("6. Fermat's Little Theorem (a=2, p=7):")
    result, steps = fermat_little_theorem(2, 7)
    println("   2^6 ≡ $result (mod 7)")
    println("   Steps:")
    for (exp, res) in steps
        println("   2^$exp ≡ $res (mod 7)")
    end
end

# Run demo if executed as main script
if abspath(PROGRAM_FILE) == @__FILE__
    demo_modular_arithmetic()
end

end # module