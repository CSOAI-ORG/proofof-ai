# PROOFOF.ai MCP Server - Quick Start Guide

## Installation (2 minutes)

```bash
# Navigate to the project directory
cd /sessions/brave-adoring-cerf/mcp-servers/proofof-ai

# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Start the server
npm start
```

The server will be running and ready for MCP client connections.

## Development Mode (Hot Reload)

```bash
npm run dev
```

This will run the server with TypeScript directly, enabling hot reload for development.

## Basic Usage Examples

### 1. Verify Image Authenticity

```json
{
  "name": "proofof_verify_content",
  "arguments": {
    "contentDescription": "Screenshot showing alleged text conversation between two people",
    "contentType": "image",
    "performBlockchainAnchor": true
  }
}
```

**Response**: Authenticity score (0-100), verdict (authentic/manipulated/uncertain), and detailed analysis.

### 2. Detect Deepfakes in Video

```json
{
  "name": "proofof_deepfake_detect",
  "arguments": {
    "contentDescription": "Video of person giving speech at podium",
    "contentType": "video",
    "advancedAnalysis": true
  }
}
```

**Response**: Deepfake probability, manipulation indicators, and risk level.

### 3. Verify Multiple Items (Batch)

```json
{
  "name": "proofof_batch_verify",
  "arguments": {
    "items": [
      {
        "contentDescription": "Photo from social media",
        "contentType": "image"
      },
      {
        "contentDescription": "Video clip from news",
        "contentType": "video"
      },
      {
        "contentDescription": "Audio recording",
        "contentType": "audio"
      }
    ],
    "parallelProcessing": true
  }
}
```

**Response**: Results for all items plus summary statistics.

### 4. Calculate Publisher Trust Score

```json
{
  "name": "proofof_trust_score",
  "arguments": {
    "publisherName": "Major News Network",
    "includeReputation": true
  }
}
```

**Response**: Trust score (0-100), risk level, verification history, and reputation metrics.

### 5. Anchor to Blockchain

```json
{
  "name": "proofof_blockchain_anchor",
  "arguments": {
    "verificationResultHash": "abc123def456...",
    "contentHash": "def456ghi789...",
    "blockchainNetwork": "ethereum"
  }
}
```

**Response**: Transaction ID, blockchain network, immutable record, and QR code.

### 6. Issue Verification Credential

```json
{
  "name": "proofof_credential_issue",
  "arguments": {
    "contentHash": "abc123...",
    "verificationResultHash": "def456...",
    "recipientEmail": "user@example.com",
    "publisherName": "News Agency",
    "issueLinkedInBadge": true
  }
}
```

**Response**: W3C Verifiable Credential with digital signature and QR code.

## Accessing Resources

The server provides three detailed resources:

### 1. Methodology Documentation
```
URI: proofof://methodology
```
Details about the 12-AI voting consensus system, all voter profiles, voting process, and scoring formulas.

### 2. Supported Formats
```
URI: proofof://supported-formats
```
Complete list of supported file formats, size limits, resolution requirements, and processing specifications.

### 3. API Reference
```
URI: proofof://api-reference
```
Complete API documentation with all tool definitions, parameters, responses, and examples.

## Understanding Results

### Authenticity Score (0-100)
- **90-100**: Very likely authentic
- **70-89**: Probably authentic
- **50-69**: Uncertain
- **30-49**: Probably manipulated
- **0-29**: Very likely manipulated

### Confidence Level (0-100)
- **90-100**: Very high confidence
- **70-89**: High confidence
- **50-69**: Medium confidence
- **Below 50**: Low confidence

### Deepfake Probability (0-100)
- **0-20**: Low risk (likely authentic)
- **21-40**: Low-medium risk
- **41-60**: Medium risk
- **61-80**: High risk
- **81-100**: Critical risk

### Trust Score (0-100)
- **80-100**: Highly trustworthy
- **60-79**: Generally trustworthy
- **40-59**: Moderately trustworthy
- **Below 40**: Low trustworthiness

## Common Scenarios

### Verify Social Media Image
```json
{
  "contentDescription": "Screenshot from Twitter showing news headline",
  "contentType": "image",
  "sourceContext": "Posted on social media, 50K shares"
}
```

### Check Viral Video
```json
{
  "contentDescription": "Video claiming to show recent event, going viral",
  "contentType": "video",
  "advancedAnalysis": true,
  "sourceContext": "Spreading rapidly on TikTok"
}
```

### Verify Audio Recording
```json
{
  "contentDescription": "Audio of public figure making statement",
  "contentType": "audio",
  "sourceContext": "Shared in news outlets"
}
```

### Batch Verify Campaign Materials
```json
{
  "items": [
    {"contentDescription": "Campaign poster", "contentType": "image"},
    {"contentDescription": "Campaign video", "contentType": "video"},
    {"contentDescription": "Audio message", "contentType": "audio"}
  ],
  "performBlockchainAnchor": true
}
```

### Research Publisher Credibility
```json
{
  "publisherName": "Online News Site",
  "includeReputation": true,
  "includeHistory": true
}
```

## Troubleshooting

### Server Won't Start
1. Check Node.js version: `node --version` (must be 18.0.0+)
2. Install dependencies: `npm install`
3. Rebuild: `npm run build`
4. Check for port conflicts

### Tool Not Responding
1. Check server logs for errors
2. Verify input JSON format
3. Check parameter types match schema
4. Ensure all required fields are present

### Unexpected Results
1. Provide more detailed content descriptions
2. Check content type matches actual content
3. Use advanced analysis for uncertain results
4. Cross-reference with trust score for source

## Performance Tips

1. **Batch Processing**: Use batch verify for multiple items (faster than individual calls)
2. **Parallel Processing**: Enable parallelProcessing for batches
3. **Content Description**: More detailed descriptions improve accuracy
4. **Blockchain Anchoring**: Only anchor critical verifications to save time

## Next Steps

1. **Explore Resources**: Read methodology and API reference
2. **Test Tools**: Try each tool with sample content
3. **Review Results**: Understand the analysis details
4. **Integrate**: Connect to your application
5. **Monitor**: Track verification results over time

## Project Files Reference

- `src/index.ts` - Main MCP server
- `src/types.ts` - Type definitions
- `src/schemas.ts` - Input validation
- `src/verification-engine.ts` - Core verification logic
- `src/voting-consensus.ts` - 12-AI voting system
- `src/blockchain-utils.ts` - Blockchain integration
- `src/trust-engine.ts` - Trust scoring
- `src/handlers.ts` - Tool handlers
- `src/resources.ts` - Documentation resources
- `README.md` - Complete documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical details

## Additional Resources

- Homepage: https://proofof.ai
- Authors: Samir Azizi, Ting Ma
- License: CC0-1.0 (Public Domain)

## Getting Help

Review the comprehensive README.md for detailed documentation on:
- Each tool's parameters and outputs
- Performance specifications
- Integration examples
- Best practices
- Compliance information

---

**Ready to verify content authenticity? Start by running `npm install && npm run build && npm start`!**
