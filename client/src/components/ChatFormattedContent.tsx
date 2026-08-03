import type { ReactNode } from 'react'

type ChatFormattedContentProps = {
  content: string
  /** User bubbles stay plain text. */
  plain?: boolean
}

type TextBlock =
  | { type: 'p'; text: string }
  | { type: 'ol'; items: string[] }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; rows: string[][] }

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let last = 0
  let match: RegExpExecArray | null
  let i = 0
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }
    const bold = match[1]
    const italic = match[2]
    if (bold != null) {
      parts.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-text">
          {bold}
        </strong>,
      )
    } else if (italic != null) {
      parts.push(
        <em key={`${keyPrefix}-i-${i}`} className="italic">
          {italic}
        </em>,
      )
    }
    last = match.index + match[0].length
    i += 1
  }
  if (last < text.length) {
    parts.push(text.slice(last))
  }
  return parts.length ? parts : [text]
}

function isTableSep(line: string): boolean {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.includes('|')) return false
  if (isTableSep(trimmed)) return true
  const cells = trimmed.split('|').filter((_, idx, arr) => {
    if ((idx === 0 || idx === arr.length - 1) && arr[idx].trim() === '') return false
    return true
  })
  return cells.length >= 2
}

function splitCells(line: string): string[] {
  let trimmed = line.trim()
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1)
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1)
  return trimmed.split('|').map((c) => c.trim())
}

function isTipLine(text: string): boolean {
  return /^(tip|note|optional tip)\s*:/i.test(text.trim())
}

/**
 * Models often emit blank-line steps without 1/2/3. Promote consecutive
 * short paragraphs into a real ascending numbered list for the UI.
 */
function promoteStepParagraphs(blocks: TextBlock[]): TextBlock[] {
  const out: TextBlock[] = []
  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]
    if (block.type !== 'p') {
      out.push(block)
      i += 1
      continue
    }

    const run: Extract<TextBlock, { type: 'p' }>[] = []
    while (i < blocks.length && blocks[i].type === 'p') {
      run.push(blocks[i] as Extract<TextBlock, { type: 'p' }>)
      i += 1
    }

    const looksLikeIntro =
      run.length >= 4 &&
      (/^(yes|no|sure|ok|okay|absolutely|of course|here|you can|graph builder)\b/i.test(
        run[0].text,
      ) ||
        run[0].text.length < 160)

    if (looksLikeIntro) {
      const intro = run[0]
      const rest = run.slice(1)
      const tipStart = rest.findIndex((p) => isTipLine(p.text))
      const stepParas = tipStart >= 0 ? rest.slice(0, tipStart) : rest
      const after = tipStart >= 0 ? rest.slice(tipStart) : []
      const shortSteps = stepParas.every((p) => p.text.length <= 280)

      if (stepParas.length >= 3 && shortSteps) {
        out.push(intro)
        out.push({ type: 'ol', items: stepParas.map((p) => p.text) })
        out.push(...after)
        continue
      }
    }

    if (run.length >= 3 && run.every((p) => p.text.length <= 220 && !isTipLine(p.text))) {
      out.push({ type: 'ol', items: run.map((p) => p.text) })
      continue
    }

    out.push(...run)
  }
  return out
}

function parseBlocks(content: string): TextBlock[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: TextBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      i += 1
      continue
    }

    if (isTableRow(line)) {
      const rows: string[][] = []
      while (i < lines.length && isTableRow(lines[i])) {
        if (!isTableSep(lines[i])) {
          rows.push(splitCells(lines[i]))
        }
        i += 1
      }
      if (rows.length) blocks.push({ type: 'table', rows })
      continue
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''))
        i += 1
        while (
          i < lines.length &&
          lines[i].trim() &&
          !/^\s*\d+[.)]\s+/.test(lines[i]) &&
          !/^\s*[-*•]\s+/.test(lines[i]) &&
          !isTableRow(lines[i]) &&
          /^\s{2,}/.test(lines[i])
        ) {
          items[items.length - 1] += ` ${lines[i].trim()}`
          i += 1
        }
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    if (/^\s*[-*•]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*•]\s+/, ''))
        i += 1
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    // One visual paragraph per blank-line-separated chunk (keeps step-like replies intact)
    const paraLines: string[] = [line.trim()]
    i += 1
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*\d+[.)]\s+/.test(lines[i]) &&
      !/^\s*[-*•]\s+/.test(lines[i]) &&
      !isTableRow(lines[i])
    ) {
      // Soft-wrap continuation on the same paragraph only when indented or mid-sentence join
      if (/^\s{2,}/.test(lines[i]) || !paraLines[0]) {
        paraLines.push(lines[i].trim())
        i += 1
        continue
      }
      break
    }
    blocks.push({ type: 'p', text: paraLines.join(' ') })
  }

  return promoteStepParagraphs(blocks)
}

function renderBlocks(blocks: TextBlock[]): ReactNode[] {
  return blocks.map((block, blockKey) => {
    if (block.type === 'p') {
      return (
        <p key={`p-${blockKey}`} className="ask-chat-p">
          {renderInline(block.text, `p-${blockKey}`)}
        </p>
      )
    }
    if (block.type === 'ol') {
      return (
        <ol key={`ol-${blockKey}`} className="ask-chat-ol">
          {block.items.map((item, idx) => (
            <li key={idx} className="ask-chat-ol-item">
              <span className="ask-chat-ol-num" aria-hidden="true">
                {idx + 1}.
              </span>
              <span className="ask-chat-ol-text">{renderInline(item, `ol-${blockKey}-${idx}`)}</span>
            </li>
          ))}
        </ol>
      )
    }
    if (block.type === 'ul') {
      return (
        <ul key={`ul-${blockKey}`} className="ask-chat-ul">
          {block.items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ul-${blockKey}-${idx}`)}</li>
          ))}
        </ul>
      )
    }
    const colCount = Math.max(...block.rows.map((r) => r.length), 1)
    return (
      <div key={`t-${blockKey}`} className="ask-chat-table-wrap" role="table">
        {block.rows.map((row, ri) => (
          <div
            key={`tr-${ri}`}
            className={ri === 0 ? 'ask-chat-table-row ask-chat-table-head' : 'ask-chat-table-row'}
            role="row"
          >
            {Array.from({ length: colCount }, (_, ci) => (
              <div key={`td-${ri}-${ci}`} className="ask-chat-table-cell" role="cell">
                {renderInline(row[ci] ?? '', `t${blockKey}-${ri}-${ci}`)}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  })
}

/**
 * Light chat formatting: paragraphs, numbered/bulleted lists, bold/italic, and pipe tables → simple grid.
 * Numbered lists always render as ascending 1. 2. 3. in the UI.
 */
export function ChatFormattedContent({ content, plain = false }: ChatFormattedContentProps) {
  if (plain) {
    return <>{content}</>
  }
  return <div className="ask-chat-body">{renderBlocks(parseBlocks(content))}</div>
}
