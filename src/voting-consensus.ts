/**
 * 12-AI Democratic Voting Consensus Engine
 * Core component for authentic content verification
 */

import { ContentType, Verdict, VotingConsensusResult, AIVoterProfile } from './types.js';

// Simulated AI voting profiles representing diverse detection models
const AI_VOTERS: AIVoterProfile[] = [
  {
    voterId: 'voter-001',
    votingModel: 'ResNet-50 Forensic',
    accuracy: 0.94,
    specialization: ['image', 'video'],
  },
  {
    voterId: 'voter-002',
    votingModel: 'XceptionNet Deepfake',
    accuracy: 0.92,
    specialization: ['video', 'audio'],
  },
  {
    voterId: 'voter-003',
    votingModel: 'FaceSwap Detection',
    accuracy: 0.96,
    specialization: ['image', 'video'],
  },
  {
    voterId: 'voter-004',
    votingModel: 'Audio Splicing Detector',
    accuracy: 0.91,
    specialization: ['audio'],
  },
  {
    voterId: 'voter-005',
    votingModel: 'Metadata Analyzer',
    accuracy: 0.88,
    specialization: ['image', 'document'],
  },
  {
    voterId: 'voter-006',
    votingModel: 'Behavioral Pattern Recognition',
    accuracy: 0.89,
    specialization: ['video', 'text'],
  },
  {
    voterId: 'voter-007',
    votingModel: 'Frequency Domain Analysis',
    accuracy: 0.93,
    specialization: ['image', 'audio'],
  },
  {
    voterId: 'voter-008',
    votingModel: 'Neural Texture Detection',
    accuracy: 0.95,
    specialization: ['image', 'video'],
  },
  {
    voterId: 'voter-009',
    votingModel: 'Optical Flow Analysis',
    accuracy: 0.90,
    specialization: ['video'],
  },
  {
    voterId: 'voter-010',
    votingModel: 'Compression Artifact Analysis',
    accuracy: 0.87,
    specialization: ['image', 'video'],
  },
  {
    voterId: 'voter-011',
    votingModel: 'GAN Detection Network',
    accuracy: 0.94,
    specialization: ['image', 'video'],
  },
  {
    voterId: 'voter-012',
    votingModel: 'Ensemble Classifier',
    accuracy: 0.96,
    specialization: ['image', 'video', 'audio', 'text'],
  },
];

export class VotingConsensusEngine {
  /**
   * Run democratic voting consensus on content
   */
  static conductVoting(
    _contentDescription: string,
    contentType: ContentType,
    manipulationIndicators: string[] = []
  ): VotingConsensusResult {
    // Select specialized voters for this content type
    const selectedVoters = AI_VOTERS.filter((voter) =>
      voter.specialization.includes(contentType)
    );

    // Simulate voting based on manipulation indicators and voter accuracy
    const votes = {
      authentic: 0,
      manipulated: 0,
      uncertain: 0,
    };

    const hasStrongIndicators = manipulationIndicators.length >= 3;
    const hasMildIndicators = manipulationIndicators.length >= 1;

    selectedVoters.forEach((voter) => {
      let decision: Verdict;

      // Weighted decision based on voter accuracy and indicators
      const rand = Math.random();
      const accuracyFactor = voter.accuracy;

      if (hasStrongIndicators) {
        // Strong likelihood of manipulation
        decision =
          rand < accuracyFactor * 0.95 ? 'manipulated' : 'uncertain';
      } else if (hasMildIndicators) {
        // Mild indicators present
        if (rand < accuracyFactor * 0.5) {
          decision = 'manipulated';
        } else if (rand < accuracyFactor * 0.8) {
          decision = 'uncertain';
        } else {
          decision = 'authentic';
        }
      } else {
        // No indicators, assume authentic with high confidence
        decision = rand < accuracyFactor ? 'authentic' : 'uncertain';
      }

      votes[decision]++;
    });

    // Calculate consensus
    const totalVotes = selectedVoters.length;
    const consensusThreshold = Math.ceil(totalVotes * 0.67); // 67% majority

    let finalConsensus: Verdict = 'uncertain';
    let consensusStrength = 0;

    if (votes.manipulated >= consensusThreshold) {
      finalConsensus = 'manipulated';
      consensusStrength = Math.round(
        (votes.manipulated / totalVotes) * 100
      );
    } else if (votes.authentic >= consensusThreshold) {
      finalConsensus = 'authentic';
      consensusStrength = Math.round((votes.authentic / totalVotes) * 100);
    } else {
      // No consensus reached
      finalConsensus = 'uncertain';
      consensusStrength = Math.round(
        (Math.max(votes.authentic, votes.manipulated) / totalVotes) * 100
      );
    }

    return {
      voters: selectedVoters,
      votingRound: 1,
      consensusThreshold,
      votes,
      finalConsensus,
      consensusStrength,
    };
  }

  /**
   * Calculate authenticity score based on voting results
   */
  static calculateAuthenticityScore(
    votingResult: VotingConsensusResult,
    manipulationIndicators: string[]
  ): number {
    const { votes, consensusStrength } = votingResult;
    const totalVotes = votes.authentic + votes.manipulated + votes.uncertain;

    // Base score from voting
    const votingScore = votes.authentic / totalVotes;

    // Adjustment based on consensus strength
    const consensusMultiplier = consensusStrength / 100;

    // Penalty for manipulation indicators
    const indicatorPenalty = Math.min(
      manipulationIndicators.length * 0.1,
      0.4
    );

    // Calculate final authenticity score (0-100)
    const rawScore = votingScore * consensusMultiplier * (1 - indicatorPenalty);
    return Math.round(Math.min(Math.max(rawScore * 100, 0), 100));
  }

  /**
   * Calculate confidence level based on voting agreement
   */
  static calculateConfidenceLevel(votingResult: VotingConsensusResult): number {
    const { votes, consensusStrength } = votingResult;
    const totalVotes = votes.authentic + votes.manipulated + votes.uncertain;

    // High confidence when there's strong consensus and few uncertain votes
    const uncertainPenalty =
      (votes.uncertain / totalVotes) * 30; // up to 30% penalty
    const confidenceScore = consensusStrength - uncertainPenalty;

    return Math.round(Math.min(Math.max(confidenceScore, 0), 100));
  }

  /**
   * Generate detailed voting analysis
   */
  static generateVotingAnalysis(votingResult: VotingConsensusResult): string[] {
    const { votes, consensusStrength, finalConsensus } = votingResult;
    const totalVotes = votes.authentic + votes.manipulated + votes.uncertain;

    const analysis: string[] = [];

    analysis.push(
      `Consensus Decision: ${finalConsensus.toUpperCase()} (${consensusStrength}% confidence)`
    );

    analysis.push(
      `Voting Distribution: ${votes.authentic}/${totalVotes} authentic, ${votes.manipulated}/${totalVotes} manipulated, ${votes.uncertain}/${totalVotes} uncertain`
    );

    if (consensusStrength >= 90) {
      analysis.push('Very strong consensus among AI voters');
    } else if (consensusStrength >= 75) {
      analysis.push('Strong consensus among AI voters');
    } else if (consensusStrength >= 67) {
      analysis.push('Consensus reached with moderate agreement');
    } else {
      analysis.push('Weak consensus - significant disagreement among voters');
    }

    return analysis;
  }
}
