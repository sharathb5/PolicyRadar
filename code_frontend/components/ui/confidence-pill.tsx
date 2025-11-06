interface ConfidencePillProps {
  confidence: number
}

export function ConfidencePill({ confidence }: ConfidencePillProps) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-xs"
      title={`Confidence: ${confidence.toFixed(2)}`}
    >
      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
      <span className="font-medium text-muted-foreground">{confidence.toFixed(2)}</span>
    </div>
  )
}
