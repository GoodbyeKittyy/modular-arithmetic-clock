import React, { useState, useEffect } from 'react';
import { RotateCcw, Lock, Unlock, Calculator, BookOpen } from 'lucide-react';

const ModularArithmeticClock = () => {
  const [clockValue, setClockValue] = useState(0);
  const [modulus, setModulus] = useState(12);
  const [operation, setOperation] = useState('add');
  const [operand, setOperand] = useState(1);
  const [cipherText, setCipherText] = useState('');
  const [cipherKey, setCipherKey] = useState(3);
  const [cipherResult, setCipherResult] = useState('');
  const [cipherMode, setCipherMode] = useState('caesar');
  const [vigenereKey, setVigenereKey] = useState('KEY');
  const [rsaP, setRsaP] = useState(61);
  const [rsaQ, setRsaQ] = useState(53);
  const [rsaResult, setRsaResult] = useState('');
  const [crtM1, setCrtM1] = useState(3);
  const [crtA1, setCrtA1] = useState(2);
  const [crtM2, setCrtM2] = useState(5);
  const [crtA2, setCrtA2] = useState(3);
  const [crtM3, setCrtM3] = useState(7);
  const [crtA3, setCrtA3] = useState(2);
  const [crtResult, setCrtResult] = useState('');
  const [activeTab, setActiveTab] = useState('clock');
  const [fermatBase, setFermatBase] = useState(2);
  const [fermatPrime, setFermatPrime] = useState(7);
  const [fermatResult, setFermatResult] = useState('');

  const modAdd = (a, b, m) => ((a + b) % m + m) % m;
  const modSub = (a, b, m) => ((a - b) % m + m) % m;
  const modMul = (a, b, m) => ((a * b) % m + m) % m;
  const modPow = (base, exp, mod) => {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % mod;
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  };

  const executeOperation = () => {
    let result;
    switch (operation) {
      case 'add':
        result = modAdd(clockValue, operand, modulus);
        break;
      case 'subtract':
        result = modSub(clockValue, operand, modulus);
        break;
      case 'multiply':
        result = modMul(clockValue, operand, modulus);
        break;
      case 'power':
        result = modPow(clockValue, operand, modulus);
        break;
      default:
        result = clockValue;
    }
    setClockValue(result);
  };

  const resetClock = () => {
    setClockValue(0);
  };

  const caesarCipher = (text, shift, decrypt = false) => {
    const s = decrypt ? (26 - shift) % 26 : shift;
    return text.toUpperCase().split('').map(char => {
      if (char.match(/[A-Z]/)) {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + s) % 26) + 65);
      }
      return char;
    }).join('');
  };

  const vigenereCipher = (text, key, decrypt = false) => {
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
  };

  const executeCipher = (decrypt = false) => {
    if (cipherMode === 'caesar') {
      setCipherResult(caesarCipher(cipherText, cipherKey, decrypt));
    } else {
      setCipherResult(vigenereCipher(cipherText, vigenereKey, decrypt));
    }
  };

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  };

  const modInverse = (a, m) => {
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) return x;
    }
    return 1;
  };

  const executeRSA = () => {
    if (!isPrime(rsaP) || !isPrime(rsaQ)) {
      setRsaResult('Error: Both numbers must be prime');
      return;
    }
    const n = rsaP * rsaQ;
    const phi = (rsaP - 1) * (rsaQ - 1);
    let e = 65537;
    if (e >= phi) e = 3;
    while (gcd(e, phi) !== 1) e += 2;
    const d = modInverse(e, phi);
    setRsaResult(`n: ${n}, e: ${e}, d: ${d}, φ(n): ${phi}`);
  };

  const executeCRT = () => {
    const m = [crtM1, crtM2, crtM3];
    const a = [crtA1, crtA2, crtA3];
    const M = m.reduce((acc, val) => acc * val, 1);
    let x = 0;
    for (let i = 0; i < 3; i++) {
      const Mi = M / m[i];
      const yi = modInverse(Mi, m[i]);
      x += a[i] * Mi * yi;
    }
    x = x % M;
    setCrtResult(`x ≡ ${x} (mod ${M})`);
  };

  const executeFermat = () => {
    if (!isPrime(fermatPrime)) {
      setFermatResult('Error: Must be prime');
      return;
    }
    const result = modPow(fermatBase, fermatPrime - 1, fermatPrime);
    const steps = [];
    for (let i = 1; i <= fermatPrime - 1; i++) {
      steps.push(`${fermatBase}^${i} ≡ ${modPow(fermatBase, i, fermatPrime)} (mod ${fermatPrime})`);
    }
    setFermatResult(`${fermatBase}^${fermatPrime - 1} ≡ ${result} (mod ${fermatPrime})\n${steps.slice(-5).join('\n')}`);
  };

  const renderClockNumbers = () => {
    const numbers = [];
    const radius = 140;
    const centerX = 160;
    const centerY = 160;
    
    for (let i = 0; i < modulus; i++) {
      const angle = (i * 2 * Math.PI / modulus) - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const isActive = i === clockValue;
      
      numbers.push(
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r={isActive ? 20 : 16}
            fill={isActive ? '#3b82f6' : '#1f2937'}
            stroke={isActive ? '#60a5fa' : '#374151'}
            strokeWidth={isActive ? 3 : 2}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isActive ? 'white' : '#9ca3af'}
            fontSize={isActive ? '18' : '14'}
            fontWeight={isActive ? 'bold' : 'normal'}
          >
            {i}
          </text>
        </g>
      );
    }
    return numbers;
  };

  const renderClockHand = () => {
    const angle = (clockValue * 2 * Math.PI / modulus) - Math.PI / 2;
    const x = 160 + 100 * Math.cos(angle);
    const y = 160 + 100 * Math.sin(angle);
    
    return (
      <line
        x1={160}
        y1={160}
        x2={x}
        y2={y}
        stroke="#3b82f6"
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-thin text-center mb-2 tracking-wide">Modular Arithmetic Clock & Cipher Tool</h1>
        <p className="text-center text-slate-400 text-sm mb-6 font-light">Cryptographic Education Platform</p>
        
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {['clock', 'cipher', 'rsa', 'crt', 'fermat'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-light transition-all ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'clock' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-thin mb-4">Clock Visualization</h2>
              <svg width="320" height="320" className="mx-auto">
                <circle cx="160" cy="160" r="155" fill="none" stroke="#374151" strokeWidth="1"/>
                <circle cx="160" cy="160" r="10" fill="#3b82f6"/>
                {renderClockNumbers()}
                {renderClockHand()}
              </svg>
              <div className="text-center mt-4">
                <div className="text-4xl font-light text-blue-400">{clockValue}</div>
                <div className="text-sm text-slate-400">mod {modulus}</div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-thin mb-4">Control Panel</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-light">Modulus</label>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    value={modulus}
                    onChange={(e) => setModulus(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-right text-sm text-slate-400">{modulus}</div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-light">Operation</label>
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                  >
                    <option value="add">Addition (+)</option>
                    <option value="subtract">Subtraction (−)</option>
                    <option value="multiply">Multiplication (×)</option>
                    <option value="power">Exponentiation (^)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-light">Operand</label>
                  <input
                    type="number"
                    value={operand}
                    onChange={(e) => setOperand(parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={executeOperation}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-light transition-all"
                  >
                    Execute
                  </button>
                  <button
                    onClick={resetClock}
                    className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg transition-all"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cipher' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-thin mb-4">Cipher Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-light">Cipher Type</label>
                  <select
                    value={cipherMode}
                    onChange={(e) => setCipherMode(e.target.value)}
                    className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                  >
                    <option value="caesar">Caesar Cipher</option>
                    <option value="vigenere">Vigenère Cipher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-light">Plain Text</label>
                  <textarea
                    value={cipherText}
                    onChange={(e) => setCipherText(e.target.value)}
                    className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light h-24"
                    placeholder="Enter text to encrypt..."
                  />
                </div>

                {cipherMode === 'caesar' ? (
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-light">Shift Key</label>
                    <input
                      type="number"
                      value={cipherKey}
                      onChange={(e) => setCipherKey(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-light">Keyword</label>
                    <input
                      type="text"
                      value={vigenereKey}
                      onChange={(e) => setVigenereKey(e.target.value)}
                      className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => executeCipher(false)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-light transition-all flex items-center justify-center gap-2"
                  >
                    <Lock size={18} />
                    Encrypt
                  </button>
                  <button
                    onClick={() => executeCipher(true)}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 px-6 py-3 rounded-lg font-light transition-all flex items-center justify-center gap-2"
                  >
                    <Unlock size={18} />
                    Decrypt
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-thin mb-4">Result</h2>
              <div className="bg-gray-900 border border-slate-600 rounded-lg p-4 min-h-[200px] font-mono text-sm">
                {cipherResult || 'Cipher result will appear here...'}
              </div>
              
              <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                <h3 className="text-sm font-light text-slate-400 mb-2">Visual Key Shift</h3>
                <div className="flex gap-1 flex-wrap">
                  {Array.from({length: 26}, (_, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-slate-500">{String.fromCharCode(65 + i)}</div>
                      <div className="text-xs text-blue-400">
                        {String.fromCharCode(65 + ((i + (cipherMode === 'caesar' ? cipherKey : 0)) % 26))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rsa' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-thin mb-4">RSA Key Generation</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-light">Prime p</label>
                  <input
                    type="number"
                    value={rsaP}
                    onChange={(e) => setRsaP(parseInt(e.target.value) || 2)}
                    className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {isPrime(rsaP) ? '✓ Prime' : '✗ Not prime'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-light">Prime q</label>
                  <input
                    type="number"
                    value={rsaQ}
                    onChange={(e) => setRsaQ(parseInt(e.target.value) || 2)}
                    className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {isPrime(rsaQ) ? '✓ Prime' : '✗ Not prime'}
                  </div>
                </div>

                <button
                  onClick={executeRSA}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-light transition-all"
                >
                  Generate Keys
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-thin mb-4">Key Details</h2>
              <div className="bg-gray-900 border border-slate-600 rounded-lg p-4 min-h-[200px] font-mono text-sm">
                {rsaResult || 'RSA keys will appear here...'}
              </div>
              
              <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                <h3 className="text-sm font-light text-slate-400 mb-2">Prime Factorization</h3>
                <p className="text-xs text-slate-500">
                  n = p × q<br/>
                  φ(n) = (p-1) × (q-1)<br/>
                  gcd(e, φ(n)) = 1<br/>
                  d × e ≡ 1 (mod φ(n))
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crt' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-thin mb-4">Chinese Remainder Theorem</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-light">x ≡ a₁</label>
                    <input
                      type="number"
                      value={crtA1}
                      onChange={(e) => setCrtA1(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-light">(mod m₁)</label>
                    <input
                      type="number"
                      value={crtM1}
                      onChange={(e) => setCrtM1(parseInt(e.target.value) || 1)}
                      className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-light">x ≡ a₂</label>
                    <input
                      type="number"
                      value={crtA2}
                      onChange={(e) => setCrtA2(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-light">(mod m₂)</label>
                    <input
                      type="number"
                      value={crtM2}
                      onChange={(e) => setCrtM2(parseInt(e.target.value) || 1)}
                      className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-light">x ≡ a₃</label>
                    <input
                      type="number"
                      value={crtA3}
                      onChange={(e) => setCrtA3(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-light">(mod m₃)</label>
                    <input
                      type="number"
                      value={crtM3}
                      onChange={(e) => setCrtM3(parseInt(e.target.value) || 1)}
                      className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                    />
                  </div>
                </div>

                <button
                  onClick={executeCRT}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-light transition-all"
                >
                  Solve System
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-thin mb-4">Solution</h2>
              <div className="bg-gray-900 border border-slate-600 rounded-lg p-4 min-h-[200px] font-mono text-sm">
                {crtResult || 'Solution will appear here...'}
              </div>
              
              <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                <h3 className="text-sm font-light text-slate-400 mb-2">Algorithm</h3>
                <p className="text-xs text-slate-500">
                  M = m₁ × m₂ × m₃<br/>
                  Mᵢ = M / mᵢ<br/>
                  yᵢ × Mᵢ ≡ 1 (mod mᵢ)<br/>
                  x = Σ(aᵢ × Mᵢ × yᵢ) mod M
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fermat' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-thin mb-4">Fermat's Little Theorem</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-light">Base (a)</label>
                  <input
                    type="number"
                    value={fermatBase}
                    onChange={(e) => setFermatBase(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-light">Prime (p)</label>
                  <input
                    type="number"
                    value={fermatPrime}
                    onChange={(e) => setFermatPrime(parseInt(e.target.value) || 2)}
                    className="w-full bg-gray-900 border border-slate-600 rounded-lg px-4 py-2 font-light"
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {isPrime(fermatPrime) ? '✓ Prime' : '✗ Not prime'}
                  </div>
                </div>

                <button
                  onClick={executeFermat}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-light transition-all"
                >
                  Verify Theorem
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-thin mb-4">Proof Steps</h2>
              <div className="bg-gray-900 border border-slate-600 rounded-lg p-4 min-h-[200px] font-mono text-xs whitespace-pre-wrap">
                {fermatResult || 'Proof will appear here...'}
              </div>
              
              <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                <h3 className="text-sm font-light text-slate-400 mb-2">Theorem</h3>
                <p className="text-xs text-slate-500">
                  If p is prime and gcd(a, p) = 1:<br/>
                  a^(p-1) ≡ 1 (mod p)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModularArithmeticClock;