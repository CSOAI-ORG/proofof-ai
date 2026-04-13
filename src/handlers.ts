/**
 * MCP Tool Handlers
 * Handle all tool invocations
 */

import {
  VerifyContentInput,
  DeepfakeDetectInput,
  BlockchainAnchorInput,
  CredentialIssueInput,
  BatchVerifyInput,
  TrustScoreInput,
} from './schemas.js';
import {
  VerificationResult,
  DeepfakeAnalysis,
  BlockchainAnchor,
  VerifiableCredential,
  BatchVerificationResult,
  TrustScore,
} from './types.js';
import { VerificationEngine } from './verification-engine.js';
import { BlockchainUtils } from './blockchain-utils.js';
import { TrustEngine } from './trust-engine.js';

export class ToolHandlers {
  /**
   * Handle proofof_verify_content tool
   */
  static async handleVerifyContent(
    input: VerifyContentInput
  ): Promise<VerificationResult> {
    return VerificationEngine.verifyContent(
      input.contentDescription,
      input.contentType,
      input.performBlockchainAnchor
    );
  }

  /**
   * Handle proofof_deepfake_detect tool
   */
  static async handleDeepfakeDetect(
    input: DeepfakeDetectInput
  ): Promise<DeepfakeAnalysis> {
    return VerificationEngine.detectDeepfakes(
      input.contentDescription,
      input.contentType,
      input.advancedAnalysis
    );
  }

  /**
   * Handle proofof_blockchain_anchor tool
   */
  static async handleBlockchainAnchor(
    input: BlockchainAnchorInput
  ): Promise<BlockchainAnchor> {
    // For demo purposes, we create a verification result from the hash
    const mockVerificationResult: VerificationResult = {
      contentHash: input.contentHash,
      authenticityScore: 85,
      confidenceLevel: 90,
      detectionMethod: 'blockchain-anchor',
      verdict: 'authentic',
      timestamp: new Date().toISOString(),
      analysisDetails: {
        manipulationIndicators: [],
      },
    };

    return BlockchainUtils.anchorToBlockchain(
      input.contentHash,
      mockVerificationResult,
      input.blockchainNetwork || 'ethereum'
    );
  }

  /**
   * Handle proofof_credential_issue tool
   */
  static async handleCredentialIssue(
    input: CredentialIssueInput
  ): Promise<VerifiableCredential> {
    // Create verification result from hashes
    const mockVerificationResult: VerificationResult = {
      contentHash: input.contentHash,
      authenticityScore: 85,
      confidenceLevel: 90,
      detectionMethod: 'ai-voting-consensus',
      verdict: 'authentic',
      timestamp: new Date().toISOString(),
      analysisDetails: {
        manipulationIndicators: [],
      },
    };

    return BlockchainUtils.issueVerifiableCredential(
      input.contentHash,
      mockVerificationResult,
      input.recipientEmail,
      input.recipientName,
      input.publisherName,
      input.issueLinkedInBadge
    );
  }

  /**
   * Handle proofof_batch_verify tool
   */
  static async handleBatchVerify(
    input: BatchVerifyInput
  ): Promise<BatchVerificationResult> {
    const results = await Promise.all(
      input.items.map(async (item, index) => {
        try {
          const result = VerificationEngine.verifyContent(
            item.contentDescription,
            item.contentType,
            input.performBlockchainAnchor
          );

          return {
            index,
            result,
            status: 'success' as const,
          };
        } catch (error) {
          return {
            index,
            result: {} as VerificationResult,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    // Calculate summary statistics
    const successful = results.filter((r) => r.status === 'success').length;
    const failed = results.filter((r) => r.status === 'error').length;

    const successfulResults = results
      .filter((r) => r.status === 'success')
      .map((r) => r.result);

    const averageAuthenticityScore =
      successfulResults.length > 0
        ? Math.round(
            successfulResults.reduce(
              (sum, r) => sum + r.authenticityScore,
              0
            ) / successfulResults.length
          )
        : 0;

    const verdictCounts = {
      authentic: successfulResults.filter(
        (r) => r.verdict === 'authentic'
      ).length,
      manipulated: successfulResults.filter(
        (r) => r.verdict === 'manipulated'
      ).length,
      uncertain: successfulResults.filter(
        (r) => r.verdict === 'uncertain'
      ).length,
    };

    const batchResult: BatchVerificationResult = {
      items: results,
      summary: {
        totalProcessed: input.items.length,
        successful,
        failed,
        averageAuthenticityScore,
        verdictDistribution: verdictCounts,
      },
      timestamp: new Date().toISOString(),
    };

    return batchResult;
  }

  /**
   * Handle proofof_trust_score tool
   */
  static async handleTrustScore(input: TrustScoreInput): Promise<TrustScore> {
    return TrustEngine.calculateTrustScore(
      input.sourceUrl,
      input.publisherName,
      input.includeReputation,
      input.includeHistory
    );
  }
}
