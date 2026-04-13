/**
 * Zod validation schemas for PROOFOF.ai MCP Server
 */

import { z } from 'zod';

// Content type validation
export const ContentTypeSchema = z.enum([
  'image',
  'video',
  'audio',
  'text',
  'document',
]);

// Verdict validation
export const VerdictSchema = z.enum(['authentic', 'manipulated', 'uncertain']);

// Risk level validation
export const RiskLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);

// Trust level validation
export const TrustLevelSchema = z.enum(['low', 'medium', 'high']);

// Detection method validation
export const DetectionMethodSchema = z.enum([
  'ai-voting-consensus',
  'forensic-analysis',
  'blockchain-anchor',
  'metadata-analysis',
  'behavioral-analysis',
  'combined',
]);

// Blockchain network validation
export const BlockchainNetworkSchema = z.enum(['ethereum', 'polygon', 'bitcoin']);

// Tool input schemas

export const VerifyContentSchema = z.object({
  contentUrl: z.string().url().optional(),
  contentDescription: z.string().min(10).max(10000),
  contentType: ContentTypeSchema,
  sourceContext: z.string().optional(),
  performBlockchainAnchor: z.boolean().default(false),
});

export const DeepfakeDetectSchema = z.object({
  contentDescription: z.string().min(10).max(10000),
  contentType: ContentTypeSchema,
  sourceContext: z.string().optional(),
  contentUrl: z.string().url().optional(),
  advancedAnalysis: z.boolean().default(false),
});

export const BlockchainAnchorSchema = z.object({
  verificationResultHash: z.string().min(64).max(64),
  contentHash: z.string().min(64).max(64),
  blockchainNetwork: BlockchainNetworkSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const CredentialIssueSchema = z.object({
  contentHash: z.string().min(64).max(64),
  verificationResultHash: z.string().min(64).max(64),
  recipientEmail: z.string().email().optional(),
  recipientName: z.string().optional(),
  publisherName: z.string().optional(),
  issueLinkedInBadge: z.boolean().default(false),
});

export const BatchVerifySchema = z.object({
  items: z
    .array(
      z.object({
        contentUrl: z.string().url().optional(),
        contentDescription: z.string().min(10).max(10000),
        contentType: ContentTypeSchema,
      })
    )
    .min(1)
    .max(100),
  performBlockchainAnchor: z.boolean().default(false),
  parallelProcessing: z.boolean().default(true),
});

export const TrustScoreSchema = z.object({
  sourceUrl: z.string().url().optional(),
  publisherName: z.string().min(3).max(255).optional(),
  includeReputation: z.boolean().default(true),
  includeHistory: z.boolean().default(true),
});

// Type exports for use in handlers
export type VerifyContentInput = z.infer<typeof VerifyContentSchema>;
export type DeepfakeDetectInput = z.infer<typeof DeepfakeDetectSchema>;
export type BlockchainAnchorInput = z.infer<typeof BlockchainAnchorSchema>;
export type CredentialIssueInput = z.infer<typeof CredentialIssueSchema>;
export type BatchVerifyInput = z.infer<typeof BatchVerifySchema>;
export type TrustScoreInput = z.infer<typeof TrustScoreSchema>;
