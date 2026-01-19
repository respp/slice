# FHEVM Hardhat Template

A Hardhat-based template for developing Fully Homomorphic Encryption (FHE) enabled Solidity smart contracts using the
FHEVM protocol by Zama.

## Quick Start

For detailed instructions see:
[FHEVM Hardhat Quick Start Tutorial](https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial)

---

## Prerequisites

* **Node.js**: Version 20 or higher
* **pnpm**: Package manager

Install pnpm if you don’t have it:

```bash
npm install -g pnpm
```

---

## Installation

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
pnpm hardhat vars set MNEMONIC

# Set your Infura API key for network access
pnpm hardhat vars set INFURA_API_KEY

# Optional: Set Etherscan API key for contract verification
pnpm hardhat vars set ETHERSCAN_API_KEY
```

### 3. Compile and test

```bash
pnpm run compile
pnpm run test
```

### 4. Deploy to local network

```bash
# Start a local FHEVM-ready node
pnpm hardhat node

# Deploy to local network
pnpm hardhat deploy --network localhost
```

### 5. Deploy to Sepolia Testnet

```bash
# Deploy to Sepolia
pnpm hardhat deploy --network sepolia

# Verify contract on Etherscan
pnpm hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### 6. Test on Sepolia Testnet

```bash
pnpm hardhat test --network sepolia
```

---

## 📁 Project Structure

```
fhevm-hardhat-template/
├── contracts/           # Smart contract source files
│   └── FHECounter.sol   # Example FHE counter contract
├── deploy/              # Deployment scripts
├── tasks/               # Hardhat custom tasks
├── test/                # Test files
├── hardhat.config.ts    # Hardhat configuration
└── package.json         # Dependencies and scripts
```

---

## 📜 Available Scripts

| Script              | Description              |
| ------------------- | ------------------------ |
| `pnpm run compile`  | Compile all contracts    |
| `pnpm run test`     | Run all tests            |
| `pnpm run coverage` | Generate coverage report |
| `pnpm run lint`     | Run linting checks       |
| `pnpm run clean`    | Clean build artifacts    |

---

## 📚 Documentation

* [FHEVM Documentation](https://docs.zama.ai/fhevm)
* [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
* [FHEVM Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)
* [FHEVM Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)

---

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

* **GitHub Issues**: [https://github.com/zama-ai/fhevm/issues](https://github.com/zama-ai/fhevm/issues)
* **Documentation**: [https://docs.zama.ai](https://docs.zama.ai)
* **Community**: [https://discord.gg/zama](https://discord.gg/zama)

---

**Built with ❤️ by the Zama team**
