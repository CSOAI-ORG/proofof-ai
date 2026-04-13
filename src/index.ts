#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * proofof-ai-mcp
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Copyright (c) 2026 CSGA Global. All rights reserved.
 * Part of the CSGA Global MCP Ecosystem.
 *
 * LEGAL NOTICE: This software is provided for informational and advisory
 * purposes only. It does not constitute legal, regulatory, or professional
 * compliance advice. Users should consult qualified legal counsel for
 * jurisdiction-specific compliance requirements.
 *
 * License: CC0-1.0 (Creative Commons Zero v1.0 Universal)
 * SPDX-License-Identifier: CC0-1.0
 *
 * Build Timestamp: 2026-02-26T05:59:00Z
 * Last Modified:   2026-02-26T05:59:00Z
 * ═══════════════════════════════════════════════════════════════════════════════
 */



/**
 * PROOFOF.ai MCP Server
 * Blockchain-verified AI content authentication and deepfake detection
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import {
  VerifyContentSchema,
  DeepfakeDetectSchema,
  BlockchainAnchorSchema,
  CredentialIssueSchema,
  BatchVerifySchema,
  TrustScoreSchema,
} from './schemas.js';
import { ToolHandlers } from './handlers.js';
import {
  METHODOLOGY_RESOURCE,
  SUPPORTED_FORMATS_RESOURCE,
  API_REFERENCE_RESOURCE,
} from './resources.js';

// Define MCP server
const server = new Server(
  {
    name: 'proofof-ai-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool definitions
const tools: Array<Tool> = [
  {
    name: 'proofof_verify_content',
    description:
      'Verify content authenticity using 12-AI democratic voting consensus. Analyzes digital content (images, videos, audio, text, documents) to determine if it is authentic, manipulated, or uncertain.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        contentUrl: {
          type: 'string',
          description: 'URL of the content to verify (optional)',
        },
        contentDescription: {
          type: 'string',
          description:
            'Detailed description of the content for analysis (10-10000 characters)',
        },
        contentType: {
          type: 'string',
          enum: ['image', 'video', 'audio', 'text', 'document'],
          description: 'Type of content being verified',
        },
        sourceContext: {
          type: 'string',
          description: 'Context about the content source or distribution',
        },
        performBlockchainAnchor: {
          type: 'boolean',
          description: 'Whether to anchor the verification to blockchain',
          default: false,
        },
      },
      required: ['contentDescription', 'contentType'],
    },
  },
  {
    name: 'proofof_deepfake_detect',
    description:
      'Detect deepfakes and AI-generated manipulation in content. Analyzes deepfake probability, manipulation indicators, and provides risk assessment.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        contentDescription: {
          type: 'string',
          description:
            'Detailed description of the content for deepfake analysis',
        },
        contentType: {
          type: 'string',
          enum: ['image', 'video', 'audio', 'text', 'document'],
          description: 'Type of content being analyzed',
        },
        sourceContext: {
          type: 'string',
          description: 'Source and distribution context',
        },
        contentUrl: {
          type: 'string',
          description: 'URL of the content',
        },
        advancedAnalysis: {
          type: 'boolean',
          description: 'Enable advanced forensic analysis',
          default: false,
        },
      },
      required: ['contentDescription', 'contentType'],
    },
  },
  {
    name: 'proofof_blockchain_anchor',
    description:
      'Anchor content verification results to blockchain for immutability. Creates an immutable verification record with transaction ID and QR code.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        verificationResultHash: {
          type: 'string',
          description: 'SHA-256 hash of the verification result',
        },
        contentHash: {
          type: 'string',
          description: 'SHA-256 hash of the original content',
        },
        blockchainNetwork: {
          type: 'string',
          enum: ['ethereum', 'polygon', 'bitcoin'],
          description: 'Blockchain network to use',
          default: 'ethereum',
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata to include in the anchor',
        },
      },
      required: ['verificationResultHash', 'contentHash'],
    },
  },
  {
    name: 'proofof_credential_issue',
    description:
      'Issue W3C verifiable credentials for content verification. Creates digitally signed credentials that can be shared and verified.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        contentHash: {
          type: 'string',
          description: 'SHA-256 hash of the verified content',
        },
        verificationResultHash: {
          type: 'string',
          description: 'SHA-256 hash of the verification result',
        },
        recipientEmail: {
          type: 'string',
          description: 'Email address of the credential recipient',
        },
        recipientName: {
          type: 'string',
          description: 'Name of the credential recipient',
        },
        publisherName: {
          type: 'string',
          description: 'Name of the content publisher',
        },
        issueLinkedInBadge: {
          type: 'boolean',
          description: 'Generate a LinkedIn badge for this credential',
          default: false,
        },
      },
      required: ['contentHash', 'verificationResultHash'],
    },
  },
  {
    name: 'proofof_batch_verify',
    description:
      'Verify multiple content items in a single batch request. Efficient for processing large numbers of items with summary statistics.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        items: {
          type: 'array',
          description: 'Array of content items to verify (1-100 items)',
          items: {
            type: 'object',
            properties: {
              contentUrl: {
                type: 'string',
                description: 'Content URL (optional)',
              },
              contentDescription: {
                type: 'string',
                description: 'Content description (required)',
              },
              contentType: {
                type: 'string',
                enum: ['image', 'video', 'audio', 'text', 'document'],
                description: 'Content type',
              },
            },
            required: ['contentDescription', 'contentType'],
          },
        },
        performBlockchainAnchor: {
          type: 'boolean',
          description: 'Anchor all results to blockchain',
          default: false,
        },
        parallelProcessing: {
          type: 'boolean',
          description: 'Process items in parallel',
          default: true,
        },
      },
      required: ['items'],
    },
  },
  {
    name: 'proofof_trust_score',
    description:
      'Calculate trust score for content sources and publishers. Analyzes verification history, consistency, and reliability metrics.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        sourceUrl: {
          type: 'string',
          description: 'URL of the source to evaluate',
        },
        publisherName: {
          type: 'string',
          description: 'Name of the publisher or source',
        },
        includeReputation: {
          type: 'boolean',
          description: 'Include reputation analysis',
          default: true,
        },
        includeHistory: {
          type: 'boolean',
          description: 'Include verification history',
          default: true,
        },
      },
    },
  },
];

// Resource definitions
interface TextResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  text: string;
}

const resources: Array<TextResource> = [
  {
    uri: 'proofof://methodology',
    name: '12-AI Voting Consensus Methodology',
    description:
      'Documentation of the 12-AI democratic voting consensus methodology used for content authentication',
    mimeType: 'text/markdown',
    text: METHODOLOGY_RESOURCE,
  },
  {
    uri: 'proofof://supported-formats',
    name: 'Supported Content Formats',
    description:
      'List of supported content formats, file sizes, and processing specifications',
    mimeType: 'text/markdown',
    text: SUPPORTED_FORMATS_RESOURCE,
  },
  {
    uri: 'proofof://api-reference',
    name: 'API Reference',
    description:
      'Complete API reference with tool definitions, parameters, and examples',
    mimeType: 'text/markdown',
    text: API_REFERENCE_RESOURCE,
  },
];

/**
 * Handle tool list requests
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'proofof_verify_content': {
        const input = VerifyContentSchema.parse(args);
        const result = await ToolHandlers.handleVerifyContent(input);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }

      case 'proofof_deepfake_detect': {
        const input = DeepfakeDetectSchema.parse(args);
        const result = await ToolHandlers.handleDeepfakeDetect(input);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }

      case 'proofof_blockchain_anchor': {
        const input = BlockchainAnchorSchema.parse(args);
        const result = await ToolHandlers.handleBlockchainAnchor(input);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }

      case 'proofof_credential_issue': {
        const input = CredentialIssueSchema.parse(args);
        const result = await ToolHandlers.handleCredentialIssue(input);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }

      case 'proofof_batch_verify': {
        const input = BatchVerifySchema.parse(args);
        const result = await ToolHandlers.handleBatchVerify(input);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }

      case 'proofof_trust_score': {
        const input = TrustScoreSchema.parse(args);
        const result = await ToolHandlers.handleTrustScore(input);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(message);
  }
});

/**
 * Handle resources/list requests
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources };
});

/**
 * Handle resources/read requests
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const resource = resources.find((r) => r.uri === uri);

  if (!resource) {
    throw new Error(`Unknown resource: ${uri}`);
  }

  return { contents: [{ uri, mimeType: resource.mimeType, text: resource.text }] };
});

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('PROOFOF.ai MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
