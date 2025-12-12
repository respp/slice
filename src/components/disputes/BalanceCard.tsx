"use client";

import React from "react";
import { DepositIcon, SendIcon } from "./icons/ActionIcons";
import styles from "./BalanceCard.module.css";
import { useXOContracts } from "@/providers/XOContractsProvider";
import { USDC_ADDRESS } from "@/config";
import { useTokenBalance } from "@/hooks/useTokenBalance";

export const BalanceCard: React.FC = () => {
  const { address } = useXOContracts();

  // Use the abstraction instead of direct wagmi
  const { formatted, isLoading } = useTokenBalance(USDC_ADDRESS);

  const displayBalance = React.useMemo(() => {
    if (!address) return "---";
    if (isLoading) return "Loading...";
    if (formatted === undefined || formatted === null) return "Error";

    // Format for display (2 decimals)
    const balance = parseFloat(formatted).toFixed(2);
    return `${balance} USDC`;
  }, [address, isLoading, formatted]);

  return (
    <div className={styles.card}>
      <div className={styles.leftSection}>
        <div className={styles.balanceSection}>
          <div className={styles.balanceLabel}>Balance</div>
          <div className={styles.balanceAmount}>{displayBalance}</div>
        </div>
        <button className={styles.billingButton}>Billing Profile</button>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.actionButton}>
          <DepositIcon className={styles.actionIcon} />
          <span className={styles.actionLabel}>Deposit</span>
        </button>

        <button className={styles.actionButton}>
          <SendIcon className={styles.actionIcon} />
          <span className={styles.actionLabel}>Send</span>
        </button>
      </div>
    </div>
  );
};
