import { MESSAGE_MOCK_MAP } from '../mock/messages'
import type { ParsedMessage, ProductInfo } from '../types'

export function parseMockData(userMessage: string): ParsedMessage | null {
  // Find exact match first
  const exactMatch = MESSAGE_MOCK_MAP[userMessage]
  if (exactMatch) {
    return parseResponse(exactMatch.message.content, exactMatch.message.timestamp)
  }

  // Find partial match (case insensitive)
  const lowerUserMessage = userMessage.toLowerCase()
  for (const [key, response] of Object.entries(MESSAGE_MOCK_MAP)) {
    const lowerKey = key.toLowerCase()
    if (lowerUserMessage.includes(lowerKey) || lowerKey.includes(lowerUserMessage)) {
      return parseResponse(response.message.content, response.message.timestamp)
    }
  }

  return null
}

function parseResponse(content: string, timestamp: string): ParsedMessage {
  const products: ProductInfo[] = []
  let suggestedQuestion: string | undefined

  // Extract suggested question (usually at the end)
  const suggestedMatch = content.match(/Suggested Question: (.+)$/m)
  if (suggestedMatch) {
    suggestedQuestion = suggestedMatch[1]
    content = content.replace(/Suggested Question: .+$/m, '').trim()
  }

  // Parse products from the content
  const productBlocks = content.split(/\n\n(?=\d+\.)/)

  productBlocks.forEach((block) => {
    const product = parseProductBlock(block)
    if (product) {
      products.push(product)
    }
  })

  return {
    message: {
      role: 'assistant',
      content,
      timestamp
    },
    products: products.length > 0 ? products : undefined,
    suggestedQuestion
  }
}

function parseProductBlock(block: string): ProductInfo | null {
  const lines = block.split('\n').map(line => line.trim()).filter(line => line)

  if (lines.length === 0) return null

  // Extract product name (first line, remove numbering)
  const nameLine = lines[0]
  const nameMatch = nameLine.match(/^\d+\.\s*\*\*(.+?)\*\*/)
  if (!nameMatch) return null

  const name = nameMatch[1]

  // Parse other properties
  let price = ''
  let unitOfMeasure = ''
  let vendor = ''
  let brand = ''
  let productLink = ''
  let imageLink = ''

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('- Price:')) {
      price = line.replace('- Price:', '').trim()
    } else if (line.startsWith('- Unit of Measure:')) {
      unitOfMeasure = line.replace('- Unit of Measure:', '').trim()
    } else if (line.startsWith('- Vendor:')) {
      vendor = line.replace('- Vendor:', '').trim()
    } else if (line.startsWith('- Brand:')) {
      brand = line.replace('- Brand:', '').trim()
    } else if (line.startsWith('- [Product Link]')) {
      const linkMatch = line.match(/\[Product Link\]\((.+?)\)/)
      if (linkMatch) {
        productLink = linkMatch[1]
      }
    } else if (line.startsWith('- [Image Link]')) {
      const linkMatch = line.match(/\[Image Link\]\((.+?)\)/)
      if (linkMatch) {
        imageLink = linkMatch[1]
      }
    }
  }

  return {
    name,
    price,
    unitOfMeasure: unitOfMeasure || undefined,
    vendor,
    brand: brand || undefined,
    productLink: productLink || undefined,
    imageLink: imageLink || undefined
  }
}
