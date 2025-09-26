import { MESSAGE_MOCK_MAP } from "../mock/messages";
import type { ParsedMessage, ProductInfo } from "../types";

export function parseMockData(userMessage: string): ParsedMessage | null {
  // Exact match
  const exactMatch = MESSAGE_MOCK_MAP[userMessage];
  if (exactMatch) {
    return parseResponse(
      exactMatch.message.content,
      exactMatch.message.timestamp
    );
  }

  // Partial match
  const lowerUserMessage = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(MESSAGE_MOCK_MAP)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerUserMessage.includes(lowerKey) ||
      lowerKey.includes(lowerUserMessage)
    ) {
      return parseResponse(
        response.message.content,
        response.message.timestamp
      );
    }
  }

  return null;
}

function parseResponse(content: string, timestamp: string): ParsedMessage {
  const productBlocks = splitProductBlocks(content);

  const products = productBlocks
    .map(parseProductBlock)
    .filter((p): p is ProductInfo => p !== null);

  return {
    message: {
      role: "assistant",
      content: content.trim(),
      timestamp,
    },
    products: products.length ? products : undefined,
  };
}

function splitProductBlocks(content: string): string[] {
  return content
    .split(/\n\n(?=\d+\.)/)
    .map((b) => b.trim())
    .filter(Boolean);
}

function parseProductBlock(block: string): ProductInfo | null {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return null;

  // Product name
  const nameMatch = lines[0].match(/^\d+\.\s*\*\*(.+?)\*\*/);
  if (!nameMatch) return null;
  const name = nameMatch[1];

  // Other properties
  const info: Partial<ProductInfo> = { name };

  const propertyMap: Record<string, keyof ProductInfo> = {
    "- Price:": "price",
    "- Unit of Measure:": "unitOfMeasure",
    "- Vendor:": "vendor",
    "- Brand:": "brand",
  };

  for (const line of lines.slice(1)) {
    for (const [prefix, key] of Object.entries(propertyMap)) {
      if (line.startsWith(prefix)) {
        info[key] = line.replace(prefix, "").trim();
      }
    }

    if (line.startsWith("- [Product Link]")) {
      const match = line.match(/\[Product Link\]\((.+?)\)/);
      if (match) info.productLink = match[1];
    }

    if (line.startsWith("- [Image Link]")) {
      const match = line.match(/\[Image Link\]\((.+?)\)/);
      if (match) info.imageLink = match[1];
    }
  }

  return {
    name,
    price: info.price ?? "",
    unitOfMeasure: info.unitOfMeasure || undefined,
    vendor: info.vendor || undefined,
    brand: info.brand || undefined,
    productLink: info.productLink,
    imageLink: info.imageLink,
  };
}
