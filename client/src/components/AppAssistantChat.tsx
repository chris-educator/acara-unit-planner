import { useEffect, useRef, useState } from 'react'
import { sendAssistantMessage, type AssistantChatMessage } from '../api/client'
import { appstaxFlagAssistantReplyMailto } from '../constants/branding'
import { useBillingGate } from '../hooks/useBillingGate'
import { AppstaxMailtoLink } from './AppstaxMailtoLink'
import { SignInGatedButton } from './SignInGatedButton'
import { ChatFormattedContent } from './ChatFormattedContent'

type AppAssistantChatProps = {
  apiReady: boolean
  welcomeMessage?: string
  inputPlaceholder?: string
}

export function AppAssistantChat({
  apiReady,
  welcomeMessage = 'Ask about weeks, curriculum links, Refine, or export.',
  inputPlaceholder = 'e.g. How many weeks should I include for a revision unit?',
}: AppAssistantChatProps) {
  const { requiresSignIn, requiresEmailVerification, signInTo, emailVerifyTo } = useBillingGate()
  const [messages, setMessages] = useState<AssistantChatMessage[]>([
    { role: 'assistant', content: welcomeMessage },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: loading ? 'smooth' : 'auto', block: 'end' })
  }, [messages, loading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    setError('')
    setInput('')
    const prior = messages
    const nextMessages: AssistantChatMessage[] = [...prior, { role: 'user', content: text }]
    setMessages(nextMessages)
    setLoading(true)

    try {
      const { reply } = await sendAssistantMessage(nextMessages)
      setMessages([...nextMessages, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prior)
      setInput(text)
      setError(err instanceof Error ? err.message : 'Chat failed.')
      window.setTimeout(() => inputRef.current?.focus(), 0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={listRef}
        className="ask-assistant-thread min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1 pb-2"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}-${msg.content.slice(0, 24)}`}
            className={[
              'ask-assistant-bubble max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words',
              msg.role === 'user'
                ? 'ask-assistant-bubble--user ml-auto bg-blue text-btn-label shadow-sm'
                : 'ask-assistant-bubble--assistant border border-border border-l-4 border-l-blue bg-surface-raised text-text',
            ].join(' ')}
          >
            <ChatFormattedContent content={msg.content} plain={msg.role === 'user'} />
            {msg.role === 'assistant' && i > 0 && (
              <p className="mt-3 text-[11px] text-text-muted">
                <AppstaxMailtoLink
                  href={appstaxFlagAssistantReplyMailto({ assistantMessage: msg.content })}
                  className="underline-offset-2 hover:text-text hover:underline"
                >
                  Flag this reply
                </AppstaxMailtoLink>
              </p>
            )}
          </div>
        ))}
        {loading && (
          <div
            className="ask-assistant-bubble ask-assistant-bubble--assistant max-w-[92%] rounded-2xl border border-border bg-surface-raised px-4 py-3 text-sm text-text-muted"
            aria-label="Assistant is thinking"
          >
            <span className="ask-assistant-typing" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>
        )}
        <div ref={bottomRef} aria-hidden className="h-px shrink-0" />
      </div>

      {error && (
        <div className="mt-3 shrink-0 ui-callout-orange text-sm" role="alert">
          {error}
        </div>
      )}

      {!apiReady && (
        <div className="mt-3 shrink-0 ui-callout text-sm" role="status">
          Ask needs a Gemini or Anthropic API key on the server.
        </div>
      )}

      <div className="ask-assistant-composer mt-3 shrink-0 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="sr-only">Message for the assistant</span>
          <textarea
            ref={inputRef}
            data-ask-autofocus="true"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void handleSend()
              }
            }}
            rows={2}
            disabled={!apiReady || loading}
            placeholder={
              apiReady
                ? inputPlaceholder
                : 'Assistant unavailable. Configure API keys on the server.'
            }
            className="ui-input min-h-[4.5rem] flex-1 resize-none disabled:opacity-50"
          />
        </label>
        <SignInGatedButton
          type="button"
          className="ui-btn-primary min-h-11 w-full sm:min-w-[5.5rem] sm:w-auto sm:self-end"
          requiresSignIn={requiresSignIn}
          requiresEmailVerification={requiresEmailVerification}
          signInTo={signInTo}
          emailVerifyTo={emailVerifyTo}
          disabled={!apiReady || loading || !input.trim()}
          onAuthorizedClick={() => void handleSend()}
        >
          {loading ? 'Sending…' : 'Send'}
        </SignInGatedButton>
      </div>
    </div>
  )
}
