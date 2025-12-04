from flask import Flask, request, jsonify, render_template_string
import math

app = Flask(__name__)

# =============================================================================
# Modular Arithmetic Functions
# =============================================================================

def mod_add(a, b, m):
    """Perform modular addition: (a + b) mod m"""
    return ((a + b) % m + m) % m

def mod_subtract(a, b, m):
    """Perform modular subtraction: (a - b) mod m"""
    return ((a - b) % m + m) % m

def mod_multiply(a, b, m):
    """Perform modular multiplication: (a * b) mod m"""
    return ((a * b) % m + m) % m

def mod_power(base, exp, m):
    """Perform modular exponentiation: base^exp mod m"""
    result = 1
    base = base % m
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % m
        exp = exp // 2
        base = (base * base) % m
    return result

def gcd(a, b):
    """Calculate greatest common divisor"""
    while b:
        a, b = b, a % b
    return a

def extended_gcd(a, b):
    """Extended Euclidean algorithm"""
    if b == 0:
        return a, 1, 0
    gcd_val, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return gcd_val, x, y

def mod_inverse(a, m):
    """Find modular multiplicative inverse"""
    gcd_val, x, _ = extended_gcd(a, m)
    if gcd_val != 1:
        raise ValueError("Modular inverse does not exist")
    return (x % m + m) % m

def is_prime(n):
    """Check if n is prime"""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for i in range(3, int(math.sqrt(n)) + 1, 2):
        if n % i == 0:
            return False
    return True

# =============================================================================
# Cipher Functions
# =============================================================================

def caesar_cipher(text, shift, decrypt=False):
    """Caesar cipher encryption/decryption"""
    s = (26 - shift) % 26 if decrypt else shift % 26
    result = []
    
    for char in text.upper():
        if 'A' <= char <= 'Z':
            new_char = chr(((ord(char) - 65 + s) % 26) + 65)
            result.append(new_char)
        else:
            result.append(char)
    
    return ''.join(result)

def vigenere_cipher(text, key, decrypt=False):
    """Vigenère cipher encryption/decryption"""
    key_upper = key.upper()
    result = []
    key_index = 0
    
    for char in text.upper():
        if 'A' <= char <= 'Z':
            shift = ord(key_upper[key_index % len(key_upper)]) - 65
            if decrypt:
                shift = -shift
            new_char = chr(((ord(char) - 65 + shift) % 26 + 26) % 26 + 65)
            result.append(new_char)
            key_index += 1
        else:
            result.append(char)
    
    return ''.join(result)

# =============================================================================
# RSA Functions
# =============================================================================

def generate_rsa_keys(p, q):
    """Generate RSA keys from primes p and q"""
    if not is_prime(p) or not is_prime(q):
        raise ValueError("Both p and q must be prime")
    
    n = p * q
    phi = (p - 1) * (q - 1)
    
    # Choose e
    e = 65537
    if e >= phi:
        e = 3
    
    while gcd(e, phi) != 1:
        e += 2
    
    d = mod_inverse(e, phi)
    
    return {
        'n': n,
        'e': e,
        'd': d,
        'phi': phi
    }

def rsa_encrypt(message, e, n):
    """Encrypt message using RSA"""
    return mod_power(message, e, n)

def rsa_decrypt(ciphertext, d, n):
    """Decrypt ciphertext using RSA"""
    return mod_power(ciphertext, d, n)

# =============================================================================
# Chinese Remainder Theorem
# =============================================================================

def chinese_remainder_theorem(remainders, moduli):
    """Solve system of congruences using CRT"""
    if len(remainders) != len(moduli):
        raise ValueError("Remainders and moduli must have same length")
    
    M = 1
    for m in moduli:
        M *= m
    
    x = 0
    for i in range(len(moduli)):
        Mi = M // moduli[i]
        yi = mod_inverse(Mi, moduli[i])
        x += remainders[i] * Mi * yi
    
    return x % M

# =============================================================================
# Fermat's Little Theorem
# =============================================================================

def fermat_little_theorem(a, p):
    """Verify Fermat's Little Theorem"""
    if not is_prime(p):
        raise ValueError("p must be prime")
    
    result = mod_power(a, p - 1, p)
    
    steps = []
    max_steps = min(10, p - 1)
    for i in range(1, max_steps + 1):
        step_result = mod_power(a, i, p)
        steps.append({'exponent': i, 'result': step_result})
    
    return {
        'result': result,
        'steps': steps
    }

# =============================================================================
# API Endpoints
# =============================================================================

@app.route('/')
def index():
    """Serve the main application"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Modular Arithmetic Clock & Cipher Tool</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: white;
                min-height: 100vh;
                padding: 2rem;
            }
            .container { max-width: 1200px; margin: 0 auto; }
            h1 { text-align: center; font-weight: 300; margin-bottom: 1rem; }
            .subtitle { text-align: center; color: #94a3b8; margin-bottom: 2rem; }
            .api-docs {
                background: rgba(30, 41, 59, 0.5);
                border: 1px solid #334155;
                border-radius: 1rem;
                padding: 2rem;
                backdrop-filter: blur(10px);
            }
            .endpoint {
                margin-bottom: 2rem;
                padding: 1rem;
                background: #0f172a;
                border-radius: 0.5rem;
            }
            .method {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 0.25rem;
                font-weight: bold;
                margin-right: 0.5rem;
            }
            .post { background: #3b82f6; }
            .get { background: #10b981; }
            code {
                background: #1e293b;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.875rem;
            }
            pre {
                background: #1e293b;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin-top: 0.5rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Modular Arithmetic Clock & Cipher Tool</h1>
            <p class="subtitle">Flask REST API</p>
            
            <div class="api-docs">
                <h2>API Endpoints</h2>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <code>/api/modular/operation</code>
                    <p>Perform modular arithmetic operations</p>
                    <pre>{"a": 7, "b": 8, "m": 12, "operation": "add"}</pre>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <code>/api/cipher/caesar</code>
                    <p>Caesar cipher encryption/decryption</p>
                    <pre>{"text": "HELLO", "shift": 3, "decrypt": false}</pre>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <code>/api/cipher/vigenere</code>
                    <p>Vigenère cipher encryption/decryption</p>
                    <pre>{"text": "HELLO", "key": "KEY", "decrypt": false}</pre>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <code>/api/rsa/generate</code>
                    <p>Generate RSA keys</p>
                    <pre>{"p": 61, "q": 53}</pre>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <code>/api/rsa/encrypt</code>
                    <p>RSA encryption</p>
                    <pre>{"message": 42, "e": 17, "n": 3233}</pre>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <code>/api/crt/solve</code>
                    <p>Solve Chinese Remainder Theorem</p>
                    <pre>{"remainders": [2, 3, 2], "moduli": [3, 5, 7]}</pre>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <code>/api/fermat/verify</code>
                    <p>Verify Fermat's Little Theorem</p>
                    <pre>{"a": 2, "p": 7}</pre>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    return render_template_string(html)

@app.route('/api/modular/operation', methods=['POST'])
def modular_operation():
    """Perform modular arithmetic operation"""
    data = request.json
    a = data.get('a', 0)
    b = data.get('b', 0)
    m = data.get('m', 12)
    operation = data.get('operation', 'add')
    
    operations = {
        'add': mod_add,
        'subtract': mod_subtract,
        'multiply': mod_multiply,
        'power': mod_power
    }
    
    if operation not in operations:
        return jsonify({'error': 'Invalid operation'}), 400
    
    result = operations[operation](a, b, m)
    return jsonify({'result': result})

@app.route('/api/cipher/caesar', methods=['POST'])
def caesar():
    """Caesar cipher endpoint"""
    data = request.json
    text = data.get('text', '')
    shift = data.get('shift', 3)
    decrypt = data.get('decrypt', False)
    
    result = caesar_cipher(text, shift, decrypt)
    return jsonify({'result': result})

@app.route('/api/cipher/vigenere', methods=['POST'])
def vigenere():
    """Vigenère cipher endpoint"""
    data = request.json
    text = data.get('text', '')
    key = data.get('key', 'KEY')
    decrypt = data.get('decrypt', False)
    
    result = vigenere_cipher(text, key, decrypt)
    return jsonify({'result': result})

@app.route('/api/rsa/generate', methods=['POST'])
def rsa_generate():
    """RSA key generation endpoint"""
    data = request.json
    p = data.get('p', 61)
    q = data.get('q', 53)
    
    try:
        keys = generate_rsa_keys(p, q)
        return jsonify(keys)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/rsa/encrypt', methods=['POST'])
def rsa_encrypt_endpoint():
    """RSA encryption endpoint"""
    data = request.json
    message = data.get('message', 0)
    e = data.get('e', 0)
    n = data.get('n', 0)
    
    result = rsa_encrypt(message, e, n)
    return jsonify({'result': result})

@app.route('/api/rsa/decrypt', methods=['POST'])
def rsa_decrypt_endpoint():
    """RSA decryption endpoint"""
    data = request.json
    ciphertext = data.get('ciphertext', 0)
    d = data.get('d', 0)
    n = data.get('n', 0)
    
    result = rsa_decrypt(ciphertext, d, n)
    return jsonify({'result': result})

@app.route('/api/crt/solve', methods=['POST'])
def crt_solve():
    """Chinese Remainder Theorem endpoint"""
    data = request.json
    remainders = data.get('remainders', [])
    moduli = data.get('moduli', [])
    
    try:
        result = chinese_remainder_theorem(remainders, moduli)
        M = 1
        for m in moduli:
            M *= m
        return jsonify({'result': result, 'modulus': M})
    except (ValueError, ZeroDivisionError) as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/fermat/verify', methods=['POST'])
def fermat_verify():
    """Fermat's Little Theorem endpoint"""
    data = request.json
    a = data.get('a', 2)
    p = data.get('p', 7)
    
    try:
        result = fermat_little_theorem(a, p)
        return jsonify(result)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/isprime/<int:n>', methods=['GET'])
def check_prime(n):
    """Check if number is prime"""
    return jsonify({'n': n, 'isPrime': is_prime(n)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)