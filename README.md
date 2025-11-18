# zK-67 TERMINAL

![Uploading Untitled design (2).png…]()



A Matrix-inspired cryptographic terminal that generates mathematical equations equaling 67, verified through zero-knowledge proofs (zk-SNARKs).

![Matrix Style Terminal](https://img.shields.io/badge/style-Matrix-00FF00?style=for-the-badge)
![zk-SNARKs](https://img.shields.io/badge/crypto-zk--SNARKs-brightgreen?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-OpenAI-412991?style=for-the-badge)

## 🎯 What is zK-67?

zK-67 Terminal is a unique web application that combines cryptography, AI, and cyberpunk aesthetics. It generates mathematical equations that always equal 67, then proves their correctness using zk-SNARK (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge) technology - all wrapped in a nostalgic Matrix-style green neon interface.

## ✨ Features

- **🤖 AI Equation Generation**: Powered by OpenAI's LLM to generate creative equations that equal 67
- **🔐 zk-SNARK Verification**: Cryptographic proof system that verifies equations without revealing computation details
- **🎨 Matrix Aesthetic**: Full Matrix movie theme with:
  - Neon green glowing terminal interface
  - Animated digital rain background (featuring only 6s and 7s)
  - Cyberpunk visual effects and animations
- **🔊 Sound Effects**: Celebratory audio on successful proof verification
- **🖼️ AI Meme Generation**: Creates unique, funny Matrix-themed memes of "67" on each successful verification
- **📝 Custom Equations**: Enter your own equations to verify if they equal 67
- **⚡ Real-time Processing**: Instant equation evaluation and proof generation

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for blazing-fast builds
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Lucide React** for icons

### Backend (Lovable Cloud)
- **Supabase Edge Functions** for serverless computing
- **OpenAI API** for equation generation
- **Lovable AI** (Gemini Flash Image) for meme generation

### Cryptography
- **snarkjs** for zk-SNARK proof generation and verification

## 🔬 How It Works

1. **Equation Generation**: 
   - User types "generate" or enters a custom equation
   - If generating, OpenAI LLM creates a mathematical expression that equals 67
   - Equation is evaluated using standard mathematical order of operations

2. **zk-SNARK Proof**:
   - A zero-knowledge proof is generated demonstrating the equation equals 67
   - The proof cryptographically verifies correctness without revealing computation steps
   - Implements pi_a, pi_b, pi_c components of the proof system

3. **Verification**:
   - Proof is verified against the expected result (67)
   - On success: plays audio effect and generates a unique AI meme
   - All verification happens with cryptographic certainty

4. **Meme Generation**:
   - Uses Lovable AI with Gemini Flash Image model
   - Creates Matrix-styled, humorous images featuring "67"
   - Different variation each time for maximum shareability

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Lovable Cloud account (for backend features)
- OpenAI API key (for equation generation)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zk-67-terminal.git
cd zk-67-terminal
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
- The project uses Lovable Cloud which auto-configures Supabase
- Add `OPENAI_API_KEY` secret through the Lovable Cloud interface

4. Run the development server:
```bash
npm run dev
# or
bun dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🎮 Usage

1. **Generate Equations**: Type `generate` in the terminal and press EXECUTE
2. **Custom Equations**: Enter your own mathematical expression (e.g., `60 + 7`, `10 * 6 + 7`)
3. **Watch the Magic**: See the equation evaluated, proof generated, verified, and meme created
4. **Share**: Follow [@zksixtyseven](https://x.com/zksixtyseven) on X for updates

### Example Equations
- `60 + 7`
- `10 * 6 + 7`
- `100 - 33`
- `134 / 2`
- `64 + 3`

## 🎨 Design Philosophy

The interface embraces the iconic Matrix aesthetic with:
- **Color Scheme**: Neon green (#00FF00) on dark backgrounds
- **Typography**: Monospace fonts for that terminal feel
- **Animation**: Flowing code rain, pulsing indicators, glowing effects
- **Easter Eggs**: Only 6s and 7s appear in the Matrix rain background

## 🔒 Zero-Knowledge Proofs

zk-SNARKs allow the system to prove that an equation equals 67 without revealing the computational steps. This demonstrates:
- **Privacy**: Computation details remain hidden
- **Efficiency**: Proofs are "succinct" - small and fast to verify
- **Security**: Mathematical guarantee of correctness

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Share your generated memes

## 📜 License

MIT License - feel free to use this project for learning and experimentation

## 🌟 Connect

- **X/Twitter**: [@zksixtyseven](https://x.com/zksixtyseven)
- **Built with**: [Lovable](https://lovable.dev) - AI-powered full-stack development

## 🙏 Acknowledgments

- Inspired by The Matrix movie franchise
- zk-SNARK technology and the snarkjs library
- OpenAI for equation generation capabilities
- The cyberpunk and cryptography communities

---

**Remember**: There is no spoon. There is only 67. 🟢
