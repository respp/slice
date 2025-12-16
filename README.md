# ⚖️ Slice Protocol Application

This project is the frontend implementation for **Slice**, a **neutral, on-chain dispute resolution protocol** built on Next.js and integrated with **Reown AppKit** and **Wagmi**.

---

## What is Slice?

**Slice** is a **decentralized dispute resolution protocol** for smart contracts and dApps. It acts as a **neutral truth oracle** that resolves disputes through **randomly selected jurors**, **private voting**, and **on-chain verification**.

Slice ensures a trustless, verifiable, and economically secure ruling (Party A or Party B) that external protocols can rely on and execute.

---

## Why Slice?

When **human judgment** is needed in decentralized applications—such as resolving conflicts, ambiguities, or subjective decisions—**Slice** provides a reliable and on-chain mechanism. It removes the need for centralized moderators and uses blockchain's transparency and cryptographic security.

---

## How Slice Works

1. **Create Dispute**: External contract calls `createDispute(...)` with the dispute details.
2. **Juror Selection**: Slice randomly selects jurors from a staked pool using **verifiable randomness (VRF)**.
3. **Private Voting**: Jurors commit votes privately using a hash (`hash(vote_option + secret)`).
4. **Reveal & Verification**: Jurors reveal their vote and secret to verify their commitment. Only revealed votes are counted.
5. **Final Ruling**: Slice aggregates votes and publishes the result on-chain.
6. **Execution**: External protocols execute based on the ruling.

---

## Core Features

* **Neutrality**: Provides objective, on-chain decisions.
* **Random Juror Selection**: Ensures fairness and unpredictability.
* **Private Commit–Reveal Voting**: Prevents bribery or manipulation.
* **Economic Security**: Jurors stake tokens, earning rewards for honesty and risking penalties for dishonesty.

---

## Deployed Contracts

The protocol is currently deployed on the following networks.

| Network | Slice Core | USDC Token |
| --- | --- | --- |
| **Base Sepolia** | `0xD8A10bD25e0E5dAD717372fA0C66d3a59a425e4D` | `0x5dEaC602762362FE5f135FA5904351916053cF70` |
| **Scroll Sepolia** | `0x095815CDcf46160E4A25127A797D33A9daF39Ec0` | `0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D` |
| **Base** | `0xD8A10bD25e0E5dAD717372fA0C66d3a59a425e4D` | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| **Scroll** | `0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4` | `0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4` |


## Environment & Connectivity

This application is configured to handle two primary environments and two distinct wallet connection methods based on the `NEXT_PUBLIC_APP_ENV` variable.

### Environment Mapping

The connection chain is determined by the explicit `APP_ENV` setting. If no environment variable is explicitly set, the connection mode defaults to **Web Mode**.

| Environment Variable (`NEXT_PUBLIC_APP_ENV`) | Environment | Chain Used | Connection Mode |
| :--- | :--- | :--- | :--- |
| `production` | Production | **Polygon Mainnet** | **Embedded (XO Connect)** |
| `staging` | Staging | Polygon Amoy (Testnet) | Web (Reown AppKit) |
| `development` (Default) | Development | Polygon Amoy (Testnet) | Web (Reown AppKit) |

### Wallet Connection Modes

| Mode | Triggered By | Wallet Used | Role |
| :--- | :--- | :--- | :--- |
| **Embedded Mode** | `NEXT_PUBLIC_APP_ENV=production` | **XO Connect** | Used when running as a mini-app inside a super-app/wallet container. |
| **Web Mode** | `NEXT_PUBLIC_APP_ENV` ≠ `production` | **Reown AppKit / Wagmi** | Used when running as a standard decentralized application (dApp) in a web browser. |

---

## ⚙️ Usage

1. Go to [Reown Dashboard](https://dashboard.reown.com) and create a new project.
2. Copy your `Project ID`.
3. Rename `.env.example` to `.env.local` and paste env variables.
```.env.local
  NEXT_PUBLIC_PROJECT_ID="YOUR_PROJECT_ID"
  # Set the environment (will default to development/Testnet if omitted)
  # NEXT_PUBLIC_APP_ENV=production 
```

4. Run `pnpm install` to install dependencies.
5. Run `pnpm run dev` to start the development server.

## Resources

- [Reown — Docs](https://docs.reown.com)
- [Next.js — Docs](https://nextjs.org/docs)
