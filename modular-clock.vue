<template>
  <div class="modular-clock-app">
    <header>
      <h1>Modular Arithmetic Clock & Cipher Tool</h1>
      <p>Vue.js Implementation</p>
    </header>

    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab.toUpperCase() }}
      </button>
    </nav>

    <div class="content">
      <section v-show="activeTab === 'clock'" class="clock-section">
        <div class="clock-container">
          <svg :width="clockSize" :height="clockSize" class="clock-svg">
            <circle
              :cx="clockCenter"
              :cy="clockCenter"
              :r="clockRadius + 5"
              fill="none"
              stroke="#374151"
              stroke-width="1"
            />
            <circle
              :cx="clockCenter"
              :cy="clockCenter"
              r="10"
              fill="#3b82f6"
            />
            <g v-for="i in modulus" :key="i">
              <circle
                :cx="getClockX(i - 1)"
                :cy="getClockY(i - 1)"
                :r="clockValue === i - 1 ? 20 : 16"
                :fill="clockValue === i - 1 ? '#3b82f6' : '#1f2937'"
                :stroke="clockValue === i - 1 ? '#60a5fa' : '#374151'"
                :stroke-width="clockValue === i - 1 ? 3 : 2"
              />
              <text
                :x="getClockX(i - 1)"
                :y="getClockY(i - 1)"
                text-anchor="middle"
                dominant-baseline="central"
                :fill="clockValue === i - 1 ? 'white' : '#9ca3af'"
                :font-size="clockValue === i - 1 ? 18 : 14"
                :font-weight="clockValue === i - 1 ? 'bold' : 'normal'"
              >
                {{ i - 1 }}
              </text>
            </g>
            <line
              :x1="clockCenter"
              :y1="clockCenter"
              :x2="getHandX()"
              :y2="getHandY()"
              stroke="#3b82f6"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
          <div class="clock-value">
            <div class="value">{{ clockValue }}</div>
            <div class="modulus">mod {{ modulus }}</div>
          </div>
        </div>

        <div class="controls">
          <div class="control-group">
            <label>Modulus: {{ modulus }}</label>
            <input
              type="range"
              v-model.number="modulus"
              min="4"
              max="24"
              class="slider"
            />
          </div>

          <div class="control-group">
            <label>Operation</label>
            <select v-model="operation" class="select">
              <option value="add">Addition (+)</option>
              <option value="subtract">Subtraction (−)</option>
              <option value="multiply">Multiplication (×)</option>
              <option value="power">Exponentiation (^)</option>
            </select>
          </div>

          <div class="control-group">
            <label>Operand</label>
            <input
              type="number"
              v-model.number="operand"
              class="input"
            />
          </div>

          <div class="button-group">
            <button @click="executeOperation" class="btn-primary">
              Execute
            </button>
            <button @click="resetClock" class="btn-secondary">
              Reset
            </button>
          </div>
        </div>
      </section>

      <section v-show="activeTab === 'cipher'" class="cipher-section">
        <div class="cipher-input">
          <div class="control-group">
            <label>Cipher Type</label>
            <select v-model="cipherMode" class="select">
              <option value="caesar">Caesar Cipher</option>
              <option value="vigenere">Vigenère Cipher</option>
            </select>
          </div>

          <div class="control-group">
            <label>Plain Text</label>
            <textarea
              v-model="cipherText"
              class="textarea"
              placeholder="Enter text to encrypt..."
            ></textarea>
          </div>

          <div v-if="cipherMode === 'caesar'" class="control-group">
            <label>Shift Key: {{ cipherKey }}</label>
            <input
              type="number"
              v-model.number="cipherKey"
              class="input"
            />
          </div>

          <div v-else class="control-group">
            <label>Keyword</label>
            <input
              type="text"
              v-model="vigenereKey"
              class="input"
            />
          </div>

          <div class="button-group">
            <button @click="executeCipher(false)" class="btn-primary">
              Encrypt
            </button>
            <button @click="executeCipher(true)" class="btn-secondary">
              Decrypt
            </button>
          </div>
        </div>

        <div class="cipher-output">
          <h3>Result</h3>
          <div class="result-box">
            {{ cipherResult || 'Result will appear here...' }}
          </div>
        </div>
      </section>

      <section v-show="activeTab === 'rsa'" class="rsa-section">
        <div class="rsa-input">
          <h3>RSA Key Generation</h3>
          <div class="control-group">
            <label>Prime p</label>
            <input
              type="number"
              v-model.number="rsaP"
              class="input"
            />
            <span class="validation">{{ isPrime(rsaP) ? '✓ Prime' : '✗ Not prime' }}</span>
          </div>

          <div class="control-group">
            <label>Prime q</label>
            <input
              type="number"
              v-model.number="rsaQ"
              class="input"
            />
            <span class="validation">{{ isPrime(rsaQ) ? '✓ Prime' : '✗ Not prime' }}</span>
          </div>

          <button @click="executeRSA" class="btn-primary">
            Generate Keys
          </button>
        </div>

        <div class="rsa-output">
          <h3>Key Details</h3>
          <div class="result-box">
            {{ rsaResult || 'RSA keys will appear here...' }}
          </div>
        </div>
      </section>

      <section v-show="activeTab === 'crt'" class="crt-section">
        <div class="crt-input">
          <h3>Chinese Remainder Theorem</h3>
          <div class="crt-row">
            <div class="control-group">
              <label>x ≡ a₁</label>
              <input type="number" v-model.number="crtA1" class="input" />
            </div>
            <div class="control-group">
              <label>(mod m₁)</label>
              <input type="number" v-model.number="crtM1" class="input" />
            </div>
          </div>

          <div class="crt-row">
            <div class="control-group">
              <label>x ≡ a₂</label>
              <input type="number" v-model.number="crtA2" class="input" />
            </div>
            <div class="control-group">
              <label>(mod m₂)</label>
              <input type="number" v-model.number="crtM2" class="input" />
            </div>
          </div>

          <div class="crt-row">
            <div class="control-group">
              <label>x ≡ a₃</label>
              <input type="number" v-model.number="crtA3" class="input" />
            </div>
            <div class="control-group">
              <label>(mod m₃)</label>
              <input type="number" v-model.number="crtM3" class="input" />
            </div>
          </div>

          <button @click="executeCRT" class="btn-primary">
            Solve System
          </button>
        </div>

        <div class="crt-output">
          <h3>Solution</h3>
          <div class="result-box">
            {{ crtResult || 'Solution will appear here...' }}
          </div>
        </div>
      </section>

      <section v-show="activeTab === 'fermat'" class="fermat-section">
        <div class="fermat-input">
          <h3>Fermat's Little Theorem</h3>
          <div class="control-group">
            <label>Base (a)</label>
            <input
              type="number"
              v-model.number="fermatBase"
              class="input"
            />
          </div>

          <div class="control-group">
            <label>Prime (p)</label>
            <input
              type="number"
              v-model.number="fermatPrime"
              class="input"
            />
            <span class="validation">{{ isPrime(fermatPrime) ? '✓ Prime' : '✗ Not prime' }}</span>
          </div>

          <button @click="executeFermat" class="btn-primary">
            Verify Theorem
          </button>
        </div>

        <div class="fermat-output">
          <h3>Proof Steps</h3>
          <div class="result-box">
            <pre>{{ fermatResult || 'Proof will appear here...' }}</pre>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModularArithmeticClock',
  data() {
    return {
      tabs: ['clock', 'cipher', 'rsa', 'crt', 'fermat'],
      activeTab: 'clock',
      clockValue: 0,
      modulus: 12,
      operation: 'add',
      operand: 1,
      clockSize: 320,
      clockCenter: 160,
      clockRadius: 140,
      cipherText: '',
      cipherKey: 3,
      cipherResult: '',
      cipherMode: 'caesar',
      vigenereKey: 'KEY',
      rsaP: 61,
      rsaQ: 53,
      rsaResult: '',
      crtM1: 3,
      crtA1: 2,
      crtM2: 5,
      crtA2: 3,
      crtM3: 7,
      crtA3: 2,
      crtResult: '',
      fermatBase: 2,
      fermatPrime: 7,
      fermatResult: ''
    };
  },
  methods: {
    modAdd(a, b, m) {
      return ((a + b) % m + m) % m;
    },
    modSub(a, b, m) {
      return ((a - b) % m + m) % m;
    },
    modMul(a, b, m) {
      return ((a * b) % m + m) % m;
    },
    modPow(base, exp, mod) {
      let result = 1;
      base = base % mod;
      while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % mod;
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
      }
      return result;
    },
    getClockX(i) {
      const angle = (i * 2 * Math.PI / this.modulus) - Math.PI / 2;
      return this.clockCenter + this.clockRadius * Math.cos(angle);
    },
    getClockY(i) {
      const angle = (i * 2 * Math.PI / this.modulus) - Math.PI / 2;
      return this.clockCenter + this.clockRadius * Math.sin(angle);
    },
    getHandX() {
      const angle = (this.clockValue * 2 * Math.PI / this.modulus) - Math.PI / 2;
      return this.clockCenter + 100 * Math.cos(angle);
    },
    getHandY() {
      const angle = (this.clockValue * 2 * Math.PI / this.modulus) - Math.PI / 2;
      return this.clockCenter + 100 * Math.sin(angle);
    },
    executeOperation() {
      let result;
      switch (this.operation) {
        case 'add':
          result = this.modAdd(this.clockValue, this.operand, this.modulus);
          break;
        case 'subtract':
          result = this.modSub(this.clockValue, this.operand, this.modulus);
          break;
        case 'multiply':
          result = this.modMul(this.clockValue, this.operand, this.modulus);
          break;
        case 'power':
          result = this.modPow(this.clockValue, this.operand, this.modulus);
          break;
        default:
          result = this.clockValue;
      }
      this.clockValue = result;
    },
    resetClock() {
      this.clockValue = 0;
    },
    caesarCipher(text, shift, decrypt = false) {
      const s = decrypt ? (26 - shift) % 26 : shift;
      return text.toUpperCase().split('').map(char => {
        if (char.match(/[A-Z]/)) {
          return String.fromCharCode(((char.charCodeAt(0) - 65 + s) % 26) + 65);
        }
        return char;
      }).join('');
    },
    vigenereCipher(text, key, decrypt = false) {
      const k = key.toUpperCase();
      let j = 0;
      return text.toUpperCase().split('').map(char => {
        if (char.match(/[A-Z]/)) {
          const shift = k.charCodeAt(j % k.length) - 65;
          const result = decrypt ? 
            String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65) :
            String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
          j++;
          return result;
        }
        return char;
      }).join('');
    },
    executeCipher(decrypt = false) {
      if (this.cipherMode === 'caesar') {
        this.cipherResult = this.caesarCipher(this.cipherText, this.cipherKey, decrypt);
      } else {
        this.cipherResult = this.vigenereCipher(this.cipherText, this.vigenereKey, decrypt);
      }
    },
    gcd(a, b) {
      return b === 0 ? a : this.gcd(b, a % b);
    },
    isPrime(n) {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
      }
      return true;
    },
    modInverse(a, m) {
      for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
      }
      return 1;
    },
    executeRSA() {
      if (!this.isPrime(this.rsaP) || !this.isPrime(this.rsaQ)) {
        this.rsaResult = 'Error: Both numbers must be prime';
        return;
      }
      const n = this.rsaP * this.rsaQ;
      const phi = (this.rsaP - 1) * (this.rsaQ - 1);
      let e = 65537;
      if (e >= phi) e = 3;
      while (this.gcd(e, phi) !== 1) e += 2;
      const d = this.modInverse(e, phi);
      this.rsaResult = `n: ${n}\ne: ${e}\nd: ${d}\nφ(n): ${phi}`;
    },
    executeCRT() {
      const m = [this.crtM1, this.crtM2, this.crtM3];
      const a = [this.crtA1, this.crtA2, this.crtA3];
      const M = m.reduce((acc, val) => acc * val, 1);
      let x = 0;
      for (let i = 0; i < 3; i++) {
        const Mi = M / m[i];
        const yi = this.modInverse(Mi, m[i]);
        x += a[i] * Mi * yi;
      }
      x = x % M;
      this.crtResult = `x ≡ ${x} (mod ${M})`;
    },
    executeFermat() {
      if (!this.isPrime(this.fermatPrime)) {
        this.fermatResult = 'Error: Must be prime';
        return;
      }
      const result = this.modPow(this.fermatBase, this.fermatPrime - 1, this.fermatPrime);
      const steps = [];
      for (let i = 1; i <= Math.min(5, this.fermatPrime - 1); i++) {
        steps.push(`${this.fermatBase}^${i} ≡ ${this.modPow(this.fermatBase, i, this.fermatPrime)} (mod ${this.fermatPrime})`);
      }
      this.fermatResult = `${this.fermatBase}^${this.fermatPrime - 1} ≡ ${result} (mod ${this.fermatPrime})\n\n${steps.join('\n')}`;
    }
  }
};
</script>

<style scoped>
.modular-clock-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2rem;
  font-weight: 300;
  margin: 0 0 0.5rem 0;
}

header p {
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 300;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tabs button {
  padding: 0.5rem 1.5rem;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 300;
  transition: all 0.3s;
}

.tabs button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.tabs button:hover {
  background: #334155;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.clock-section,
.cipher-section,
.rsa-section,
.crt-section,
.fermat-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.clock-container,
.controls,
.cipher-input,
.cipher-output,
.rsa-input,
.rsa-output,
.crt-input,
.crt-output,
.fermat-input,
.fermat-output {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 1.5rem;
}

.clock-svg {
  display: block;
  margin: 0 auto;
}

.clock-value {
  text-align: center;
  margin-top: 1rem;
}

.clock-value .value {
  font-size: 3rem;
  font-weight: 300;
  color: #3b82f6;
}

.clock-value .modulus {
  font-size: 0.875rem;
  color: #94a3b8;
}

.control-group {
  margin-bottom: 1rem;
}

.control-group label {
  display: block;
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  font-weight: 300;
}

.input,
.select,
.textarea {
  width: 100%;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  font-family: inherit;
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.slider {
  width: 100%;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 300;
  transition: all 0.3s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #1e293b;
  color: white;
  border: 1px solid #334155;
}

.btn-secondary:hover {
  background: #334155;
}

.result-box {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 1rem;
  min-height: 150px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.validation {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
  display: block;
}

.crt-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0 0 1rem 0;
}

@media (max-width: 768px) {
  .clock-section,
  .cipher-section,
  .rsa-section,
  .crt-section,
  .fermat-section {
    grid-template-columns: 1fr;
  }
}
</style>