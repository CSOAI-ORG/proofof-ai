/**
 * Blockchain Utilities
 * Handle blockchain anchoring and credential management
 */

import { createHash, randomBytes } from 'crypto';
import {
  BlockchainAnchor,
  VerifiableCredential,
  VerificationResult,
} from './types.js';

export class BlockchainUtils {
  /**
   * Generate simulated blockchain transaction
   */
  static anchorToBlockchain(
    contentHash: string,
    verificationResult: VerificationResult,
    network: 'ethereum' | 'polygon' | 'bitcoin' = 'ethereum'
  ): BlockchainAnchor {
    // Generate transaction ID (simulated)
    const txId = this.generateTransactionId(network);

    // Generate QR code data
    const qrCodeData = this.generateQRCodeData(txId, contentHash);

    const anchor: BlockchainAnchor = {
      transactionId: txId,
      blockchainNetwork: network,
      timestamp: new Date().toISOString(),
      immutableRecord: {
        contentHash,
        verificationResult,
        anchordTimestamp: new Date().toISOString(),
      },
      qrCodeData,
    };

    return anchor;
  }

  /**
   * Generate simulated blockchain transaction ID
   */
  private static generateTransactionId(network: string): string {
    const prefix = network === 'bitcoin' ? '0x' : '0x';
    const randomData = randomBytes(32).toString('hex');
    return prefix + randomData;
  }

  /**
   * Generate QR code data URL
   */
  private static generateQRCodeData(transactionId: string, contentHash: string): string {
    // In production, this would generate an actual QR code SVG or data URL
    // For now, we return a data representation suitable for QR encoding
    const qrContent = JSON.stringify({
      txId: transactionId,
      contentHash,
      timestamp: new Date().toISOString(),
      verificationUrl: `https://proofof.ai/verify/${transactionId}`,
    });

    // Return base64 encoded QR data (simplified)
    const base64 = Buffer.from(qrContent).toString('base64');
    return `data:application/json;base64,${base64}`;
  }

  /**
   * Issue W3C verifiable credential
   */
  static issueVerifiableCredential(
    contentHash: string,
    verificationResult: VerificationResult,
    recipientEmail?: string,
    _recipientName?: string,
    publisherName?: string,
    issueLinkedInBadge: boolean = false
  ): VerifiableCredential {
    const credentialId = this.generateCredentialId();
    const jws = this.generateJWS(credentialId, contentHash);
    const qrCode = this.generateQRCodeData(credentialId, contentHash);

    const credential: VerifiableCredential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1',
        'https://proofof.ai/credentials/v1',
      ],
      type: [
        'VerifiableCredential',
        'ContentVerificationCredential',
        'ProofOfAICredential',
      ],
      issuer: {
        id: 'https://proofof.ai',
        name: 'PROOFOF.ai - Content Verification Service',
      },
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: recipientEmail
          ? `mailto:${recipientEmail}`
          : `did:example:${credentialId}`,
        contentHash,
        verificationResult,
        publisher: publisherName,
      },
      proof: {
        type: 'RsaSignature2018',
        created: new Date().toISOString(),
        proofPurpose: 'assertionMethod',
        verificationMethod: 'https://proofof.ai/keys/2024-001',
        jws,
      },
      qrCode,
    };

    // Add LinkedIn badge if requested
    if (issueLinkedInBadge) {
      credential.linkedInBadgeUrl = this.generateLinkedInBadgeUrl(
        credentialId,
        contentHash
      );
    }

    return credential;
  }

  /**
   * Generate credential ID
   */
  private static generateCredentialId(): string {
    return 'urn:proofof:credential:' + randomBytes(16).toString('hex');
  }

  /**
   * Generate JSON Web Signature (simplified)
   */
  private static generateJWS(credentialId: string, contentHash: string): string {
    // Simplified JWS generation - in production, use proper JWT library
    const header = Buffer.from(
      JSON.stringify({ alg: 'RS256', typ: 'JWS' })
    ).toString('base64url');

    const payload = Buffer.from(
      JSON.stringify({
        credentialId,
        contentHash,
        iat: Math.floor(Date.now() / 1000),
      })
    ).toString('base64url');

    // Simplified signature (not cryptographically valid, for demo purposes)
    const signatureData = createHash('sha256')
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signatureData}`;
  }

  /**
   * Generate LinkedIn badge URL
   */
  private static generateLinkedInBadgeUrl(
    credentialId: string,
    contentHash: string
  ): string {
    const badgeId = Buffer.from(`${credentialId}:${contentHash}`).toString(
      'base64'
    );
    return `https://www.credly.com/badges/${badgeId}/public_url`;
  }

  /**
   * Verify blockchain anchor
   */
  static verifyBlockchainAnchor(anchor: BlockchainAnchor): {
    valid: boolean;
    message: string;
  } {
    // Verify transaction ID format
    if (!anchor.transactionId.startsWith('0x') || anchor.transactionId.length < 64) {
      return {
        valid: false,
        message: 'Invalid transaction ID format',
      };
    }

    // Verify content hash
    if (anchor.immutableRecord.contentHash.length !== 64) {
      return {
        valid: false,
        message: 'Invalid content hash format',
      };
    }

    // Verify timestamps
    const txTime = new Date(anchor.timestamp);
    const anchorTime = new Date(anchor.immutableRecord.anchordTimestamp);

    if (isNaN(txTime.getTime()) || isNaN(anchorTime.getTime())) {
      return {
        valid: false,
        message: 'Invalid timestamp format',
      };
    }

    if (txTime > anchorTime) {
      return {
        valid: false,
        message: 'Transaction timestamp cannot be after anchor timestamp',
      };
    }

    return {
      valid: true,
      message: `Valid blockchain anchor on ${anchor.blockchainNetwork}`,
    };
  }

  /**
   * Generate verification proof URL
   */
  static generateVerificationUrl(
    transactionId: string,
    contentHash: string
  ): string {
    return `https://proofof.ai/verify?tx=${transactionId}&hash=${contentHash}`;
  }
}
