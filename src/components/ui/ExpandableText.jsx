import {useMemo, useState} from 'react'

export default function ExpandableText({
    text = '',
    maxLength = 260,
}) {
    const [expanded, setExpanded] = useState(false)

    const shouldTruncate = text.length > maxLength

    const displayedText = useMemo(() => {
        if (!shouldTruncate || expanded) {
            return text
        }
        return text.slice(0, maxLength).trim() + '...'
    }, [text, maxLength, shouldTruncate, expanded])

    if (!text) {
        return null
    }

    return (
      <div className="space-y-2">
          <p className="text-slate-700 whitespace-pre-line">
              {displayedText}
          </p>

          {shouldTruncate && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
                {expanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
      </div>
    )
}