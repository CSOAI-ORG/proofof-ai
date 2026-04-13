/**
 * Trust Score Engine
 * Calculate trust metrics for sources and publishers
 */

import { TrustScore } from './types.js';

interface SourceVerificationHistory {
  totalVerifications: number;
  authenticCount: number;
  manipulatedCount: number;
  uncertainCount: number;
}

// Simulated verification history database
const VERIFICATION_DATABASE: Record<string, SourceVerificationHistory> = {
  'major-news-outlet': {
    totalVerifications: 1500,
    authenticCount: 1425,
    manipulatedCount: 45,
    uncertainCount: 30,
  },
  'tech-blog': {
    totalVerifications: 450,
    authenticCount: 405,
    manipulatedCount: 30,
    uncertainCount: 15,
  },
  'social-media-user': {
    totalVerifications: 250,
    authenticCount: 125,
    manipulatedCount: 100,
    uncertainCount: 25,
  },
  'unknown-source': {
    totalVerifications: 0,
    authenticCount: 0,
    manipulatedCount: 0,
    uncertainCount: 0,
  },
};

export class TrustEngine {
  /**
   * Calculate trust score for a source or publisher
   */
  static calculateTrustScore(
    sourceUrl?: string,
    publisherName?: string,
    includeReputation: boolean = true,
    includeHistory: boolean = true
  ): TrustScore {
    const source = sourceUrl || publisherName || 'unknown-source';
    const normalizedSource = this.normalizeSourceName(source);

    // Get verification history
    const history =
      VERIFICATION_DATABASE[normalizedSource] ||
      VERIFICATION_DATABASE['unknown-source'];

    // Calculate authenticity rate
    const authenticityRate =
      history.totalVerifications > 0
        ? Math.round(
            (history.authenticCount / history.totalVerifications) * 100
          )
        : 0;

    // Calculate consistency score
    const consistencyScore = this.calculateConsistency(history);

    // Base trust score from authenticity rate
    let trustScore = Math.round(authenticityRate * 0.6 + consistencyScore * 0.4);

    // Apply reputation penalties if enabled
    if (includeReputation) {
      trustScore = this.applyReputationModifiers(trustScore, source);
    }

    // Apply historical modifiers if enabled
    if (includeHistory && history.totalVerifications > 0) {
      trustScore = this.applyHistoricalModifiers(trustScore, history);
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (trustScore >= 75) {
      riskLevel = 'low';
    } else if (trustScore >= 50) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }

    const trustScoreResult: TrustScore = {
      sourceUrl,
      publisherName: publisherName || source,
      trustScore: Math.min(Math.max(trustScore, 0), 100),
      reliabilityMetrics: {
        verificationHistory: {
          total: history.totalVerifications,
          authentic: history.authenticCount,
          manipulated: history.manipulatedCount,
          uncertain: history.uncertainCount,
        },
        authenticityRate,
        consistencyScore,
        reportedViolations: this.getReportedViolations(normalizedSource),
      },
      riskLevel,
      reputation: {
        endorsements: this.getEndorsements(normalizedSource),
        disputes: this.getDisputes(normalizedSource),
        correctionsMade: this.getCorrections(normalizedSource),
      },
      lastUpdated: new Date().toISOString(),
    };

    return trustScoreResult;
  }

  /**
   * Normalize source name for lookup
   */
  private static normalizeSourceName(source: string): string {
    const lower = source.toLowerCase();

    if (lower.includes('major') || lower.includes('news')) {
      return 'major-news-outlet';
    } else if (lower.includes('tech') || lower.includes('blog')) {
      return 'tech-blog';
    } else if (lower.includes('social') || lower.includes('user')) {
      return 'social-media-user';
    }

    return 'unknown-source';
  }

  /**
   * Calculate consistency score
   */
  private static calculateConsistency(history: SourceVerificationHistory): number {
    if (history.totalVerifications === 0) {
      return 50; // Unknown sources get neutral score
    }

    // Calculate variance in verdict distribution
    const total = history.totalVerifications;
    const authRatio = history.authenticCount / total;
    const manipRatio = history.manipulatedCount / total;
    const uncertRatio = history.uncertainCount / total;

    // Consistency is high when distribution is skewed toward one verdict
    const entropy = -(
      authRatio * Math.log2(authRatio + 0.001) +
      manipRatio * Math.log2(manipRatio + 0.001) +
      uncertRatio * Math.log2(uncertRatio + 0.001)
    );

    // Normalize entropy to 0-100 score
    const consistencyScore = Math.round((1 - entropy / 1.585) * 100);
    return Math.min(Math.max(consistencyScore, 0), 100);
  }

  /**
   * Apply reputation-based modifiers
   */
  private static applyReputationModifiers(
    baseScore: number,
    source: string
  ): number {
    const endorsements = this.getEndorsements(source);
    const disputes = this.getDisputes(source);

    // Each endorsement adds 2 points, each dispute removes 5 points
    let modifier = endorsements * 2 - disputes * 5;
    modifier = Math.max(modifier, -30); // Max -30 point penalty

    return Math.min(Math.max(baseScore + modifier, 0), 100);
  }

  /**
   * Apply historical modifiers based on verification volume
   */
  private static applyHistoricalModifiers(
    baseScore: number,
    history: SourceVerificationHistory
  ): number {
    // Sources with more verifications get slight boost (more data = more reliable)
    const volumeBoost = Math.min(
      (history.totalVerifications / 2000) * 10,
      10
    );

    // Corrections penalize heavily
    const corrections = this.getCorrections(
      this.normalizeSourceName('')
    );
    const correctionPenalty = corrections * 3;

    let modifier = volumeBoost - correctionPenalty;
    return Math.min(Math.max(baseScore + modifier, 0), 100);
  }

  /**
   * Get endorsement count (simulated)
   */
  private static getEndorsements(source: string): number {
    const normalized = this.normalizeSourceName(source);

    const endorsementMap: Record<string, number> = {
      'major-news-outlet': 45,
      'tech-blog': 12,
      'social-media-user': 2,
      'unknown-source': 0,
    };

    return endorsementMap[normalized] || 0;
  }

  /**
   * Get disputes count (simulated)
   */
  private static getDisputes(source: string): number {
    const normalized = this.normalizeSourceName(source);

    const disputeMap: Record<string, number> = {
      'major-news-outlet': 5,
      'tech-blog': 2,
      'social-media-user': 15,
      'unknown-source': 0,
    };

    return disputeMap[normalized] || 0;
  }

  /**
   * Get corrections made (simulated)
   */
  private static getCorrections(source: string): number {
    const normalized = this.normalizeSourceName(source);

    const correctionMap: Record<string, number> = {
      'major-news-outlet': 3,
      'tech-blog': 1,
      'social-media-user': 8,
      'unknown-source': 0,
    };

    return correctionMap[normalized] || 0;
  }

  /**
   * Get reported violations count (simulated)
   */
  private static getReportedViolations(source: string): number {
    const normalized = this.normalizeSourceName(source);

    const violationMap: Record<string, number> = {
      'major-news-outlet': 0,
      'tech-blog': 1,
      'social-media-user': 8,
      'unknown-source': 0,
    };

    return violationMap[normalized] || 0;
  }
}
