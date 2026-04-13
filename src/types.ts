/**
 * Type definitions for PROOFOF.ai MCP Server
 */

export type ContentType = 'image' | 'video' | 'audio' | 'text' | 'document';

export type Verdict = 'authentic' | 'manipulated' | 'uncertain';

export type DetectionMethod =
  | 'ai-voting-consensus'
  | 'forensic-analysis'
  | 'blockchain-anchor'
  | 'metadata-analysis'
  | 'behavioral-analysis'
  | 'combined';

export interface VerificationResult {
  contentHash: string;
  authenticityScore: number; // 0-100
  confidenceLevel: number; // 0-100
  detectionMethod: DetectionMethod;
  blockchainVerificationHash?: string;
  verdict: Verdict;
  timestamp: string;
  analysisDetails: {
    manipulationIndicators: string[];
    aiVotingResults?: {
      consensusCount: number;
      totalVoters: number;
      agreementPercentage: number;
    };
    forensicFindings?: string[];
  };
}

export interface DeepfakeAnalysis {
  deepfakeProbability: number; // 0-100
  manipulationIndicators: string[];
  aiModelsDetected: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedActions: string[];
  timestamp: string;
  confidenceScore: number; // 0-100
}

export interface BlockchainAnchor {
  transactionId: string;
  blockchainNetwork: 'ethereum' | 'polygon' | 'bitcoin';
  timestamp: string;
  immutableRecord: {
    contentHash: string;
    verificationResult: VerificationResult;
    anchordTimestamp: string;
  };
  qrCodeData: string;
}

export interface VerifiableCredential {
  '@context': string[];
  type: string[];
  issuer: {
    id: string;
    name: string;
  };
  issuanceDate: string;
  credentialSubject: {
    id: string;
    contentHash: string;
    verificationResult: VerificationResult;
    publisher?: string;
  };
  proof: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    jws: string;
  };
  linkedInBadgeUrl?: string;
  qrCode: string;
}

export interface BatchVerificationItem {
  contentUrl?: string;
  contentDescription: string;
  contentType: ContentType;
}

export interface BatchVerificationResult {
  items: Array<{
    index: number;
    result: VerificationResult;
    status: 'success' | 'error';
    error?: string;
  }>;
  summary: {
    totalProcessed: number;
    successful: number;
    failed: number;
    averageAuthenticityScore: number;
    verdictDistribution: {
      authentic: number;
      manipulated: number;
      uncertain: number;
    };
  };
  timestamp: string;
}

export interface TrustScore {
  sourceUrl?: string;
  publisherName: string;
  trustScore: number; // 0-100
  reliabilityMetrics: {
    verificationHistory: {
      total: number;
      authentic: number;
      manipulated: number;
      uncertain: number;
    };
    authenticityRate: number; // percentage
    consistencyScore: number; // 0-100
    reportedViolations: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  reputation: {
    endorsements: number;
    disputes: number;
    correctionsMade: number;
  };
  lastUpdated: string;
}

export interface AIVoterProfile {
  voterId: string;
  votingModel: string;
  accuracy: number;
  specialization: ContentType[];
}

export interface VotingConsensusResult {
  voters: AIVoterProfile[];
  votingRound: number;
  consensusThreshold: number;
  votes: {
    authentic: number;
    manipulated: number;
    uncertain: number;
  };
  finalConsensus: Verdict;
  consensusStrength: number; // 0-100
}
