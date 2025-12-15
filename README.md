# ⚖️ Slice App

**The Decentralized Truth Oracle for the On-Chain World.**

Slice is a **neutral, on-chain dispute resolution protocol** that serves as a plug-and-play justice layer for any decentralized application (dApp) or smart contract. By leveraging random juror selection, crypto-economic incentives, and a privacy-preserving commit–reveal voting scheme, Slice delivers trustless rulings that external protocols can execute automatically.

-----

## 🔮 Vision

In a decentralized ecosystem, "code is law," but human subjectivity is often required to resolve ambiguity—whether in freelance contracts, e-commerce disputes, or insurance claims.

**Slice bridges this gap.** We act as a **truth oracle**, allowing any protocol to offload complex decision-making to a decentralized pool of economically incentivized jurors. Our goal is to create a fair, transparent, and scalable justice system where:

  * **Neutrality is guaranteed** by randomness and cryptography.
  * **Participation is gamified** to maintain an active, high-quality juror pool.
  * **Integration is seamless** for any external smart contract.

-----

## ✨ Core Features

### 1\. 🛡️ Neutral & Trustless Rulings

Slice uses **Verifiable Random Functions (VRF)** to select jurors from a staked pool, ensuring no single party can influence the jury composition. The result is a simple, binary ruling (`Party A` or `Party B`) that is mathematically verifiable.

### 2\. 🗳️ Private Commit–Reveal Voting

To prevent bribery, collusion, and "copycat" voting, Slice implements a robust two-stage voting process:

  * **Commit Phase:** Jurors submit a hash of their vote + a secret salt (`keccak256(vote + salt)`). The vote remains hidden on-chain.
  * **Reveal Phase:** Jurors reveal their vote and salt. Slice verifies the hash matches the commitment. Only revealed votes are tallied.

### 3\. 🪙 Configurable Staking & Incentives

Slice is token-agnostic. Each deployment can configure its own **staking token** (e.g., USDC, stablecoins, or governance tokens).

  * **Staking:** Jurors stake tokens to gain eligibility. Higher stake = higher selection probability.
  * **Rewards:** Jurors who vote with the majority are rewarded.
  * **Slashing:** Jurors who vote against the majority (incoherent) lose a portion of their stake, incentivizing honest consensus.

### 4\. 🎮 Gamified Juror Experience

The **Slice App** (off-chain layer) turns dispute resolution into an engaging strategy game. It handles:

  * **Matchmaking & Notifications:** Alerts for new cases and reveal deadlines.
  * **Reputation & XP:** Visualizing juror rank and performance.
  * **Seamless UX:** Abstracting complex crypto interactions (hashing, salting) behind a clean, intuitive interface.

-----

## 🏗️ Technical Architecture

Slice separates concerns to maximize security and usability.

### **On-Chain (The Core Protocol)**

Smart contracts (Solidity/EVM) handle the critical logic:

  * `createDispute(...)`: Entry point for external contracts.
  * `commitVote(...)` / `revealVote(...)`: Secure voting mechanism.
  * `executeRuling(...)`: Tallying votes and publishing the final result.
  * **Staking Manager:** Handles deposits, withdrawals, and slashing.

### **Off-Chain (The Interface)**

A modern **Next.js** application integrated with **Reown AppKit** and **Wagmi**:

  * **Wallet Connection:** Supports EVM wallets (via Reown/Wagmi) and embedded wallets (via XO Connect) for different environments.
  * **Local Storage:** Securely manages vote "salts" and secrets on the user's device until the reveal phase.
  * **IPFS Integration:** Fetches and renders rich dispute evidence (images, video, text) stored on decentralized storage.

-----

## 🚀 Getting Started

### Prerequisites

  * **Node.js** (v18+)
  * **pnpm** (recommended)
  * **WalletConnect Project ID** (from [Reown Dashboard](https://cloud.reown.com))

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-org/slice-protocol.git
    cd slice-protocol
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Configure Environment:**
    Rename `.env.example` to `.env.local` and add your keys:

    ```bash
    NEXT_PUBLIC_PROJECT_ID="YOUR_REOWN_PROJECT_ID"
    NEXT_PUBLIC_APP_ENV="development" # or 'production' for Mainnet

    # Pinata / IPFS Config
    NEXT_PUBLIC_PINATA_JWT="your_pinata_jwt"
    NEXT_PUBLIC_PINATA_GATEWAY_URL="your_gateway_url"
    ```

4.  **Run Development Server:**

    ```bash
    pnpm run dev
    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to launch the Slice App.

-----

## 🧩 Integration Guide (For Developers)

Integrating Slice into your protocol is as simple as 1-2-3:

1.  **Create a Dispute:**
    Call `slice.createDispute(defender, category, ipfsHash, jurorsRequired)` from your contract.
2.  **Wait for Ruling:**
    Slice handles the juror selection, voting, and consensus off-chain and on-chain.
3.  **Read the Verdict:**
    Once the dispute status is `Executed`, read the `winner` address from the `disputes` mapping and execute your logic (e.g., release escrow funds).

-----

## 🗺️ Roadmap

  * [x] **Phase 1: Foundation** (Core Contracts, Basic UI, Commit-Reveal)
  * [ ] **Phase 2: Expansion** (Arbitration Standards, Multiple Court Verticals)
  * [ ] **Phase 3: Decentralization** (DAO Governance, Permissionless Court Creation)
  * [ ] **Phase 4: Ecosystem** (SDKs for easy integration with major DeFi/Gig platforms)

-----
