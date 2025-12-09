"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DisputeCard } from "./DisputeCard";
import { BarChartIcon } from "./icons/Icon";
import { FilterIcon } from "./icons/BadgeIcons";
import styles from "./DisputesList.module.css";
import { Gavel, Eye } from "lucide-react"; // Import new icons
import { useSliceContract } from "@/hooks/useSliceContract"; // Import contract hook

export interface Dispute {
  id: string;
  title: string;
  icon?: string;
  category: string;
  votesCount: number;
  totalVotes: number;
  prize: string;
  userVote?: "approve" | "reject";
  voters: Array<{
    name: string;
    avatar?: string;
    vote: "approve" | "reject";
  }>;
}

// Mock data - in production would come from the contract
const mockDisputes: Dispute[] = [
  {
    id: "1",
    title: "Stellar Community Fund",
    category: "Crowfunding",
    votesCount: 8,
    totalVotes: 10,
    prize: "$5,000",
    userVote: "reject",
    voters: [
      {
        name: "Julio Banegas",
        avatar: "/images/profiles-mockup/profile-1.png",
        vote: "reject",
      },
      {
        name: "Micaela Descotte",
        avatar: "/images/profiles-mockup/profile-2.png",
        vote: "approve",
      },
    ],
  },
  {
    id: "2",
    title: "Ethereum Fundation",
    category: "Crowfunding",
    votesCount: 8,
    totalVotes: 10,
    prize: "$5,000",
    userVote: "reject",
    voters: [
      {
        name: "Julio Banegas",
        avatar: "/images/profiles-mockup/profile-1.png",
        vote: "reject",
      },
      {
        name: "Micaela Descotte",
        avatar: "/images/profiles-mockup/profile-2.png",
        vote: "approve",
      },
    ],
  },
  {
    id: "3",
    title: "Lionstar",
    category: "Crowfunding",
    votesCount: 8,
    totalVotes: 10,
    prize: "$5,000",
    userVote: "reject",
    voters: [
      {
        name: "Julio Banegas",
        avatar: "/images/profiles-mockup/profile-1.png",
        vote: "reject",
      },
      {
        name: "Micaela Descotte",
        avatar: "/images/profiles-mockup/profile-2.png",
        vote: "approve",
      },
    ],
  },
];

export const DisputesList: React.FC = () => {
  const router = useRouter();
  const contract = useSliceContract();
  const [latestId, setLatestId] = useState<string>("1");

  // Fetch the latest dispute ID from the contract
  useEffect(() => {
    const fetchLatest = async () => {
      if (contract) {
        try {
          const count = await contract.disputeCount();
          // Assuming IDs are 1-based or 0-based, count represents the latest created
          if (Number(count) > 0) {
            setLatestId(count.toString());
          }
        } catch (error) {
          console.error("Failed to fetch dispute count", error);
        }
      }
    };
    void fetchLatest();
  }, [contract]);

  const handleJusticeClick = () => {
    router.push("/category-amount");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.icon}>
            <BarChartIcon />
          </div>
          <h2 className={styles.title}>My disputes:</h2>
        </div>

        {/* Action Buttons Container */}
        <div className="flex items-center gap-2">
          {/* Vote Button */}
          <button
            onClick={() => router.push(`/vote/${latestId}`)}
            className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-colors"
            title={`Vote on Dispute #${latestId}`}
          >
            <Gavel className="w-4 h-4 text-blue-600" />
          </button>

          {/* Reveal Button */}
          <button
            onClick={() => router.push(`/reveal/${latestId}`)}
            className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center hover:bg-purple-100 transition-colors"
            title={`Reveal Vote for Dispute #${latestId}`}
          >
            <Eye className="w-4 h-4 text-purple-600" />
          </button>

          <button className={styles.filterButton}>
            <span>Filter</span>
            <FilterIcon size={12} />
          </button>
        </div>
      </div>

      <div className={styles.disputesContainer}>
        {mockDisputes.map((dispute) => (
          <DisputeCard key={dispute.id} dispute={dispute} />
        ))}
      </div>

      <button className={styles.justiceButton} onClick={handleJusticeClick}>
        Make Justice
      </button>
    </div>
  );
};
