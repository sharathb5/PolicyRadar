import { cn } from "@/lib/utils"

interface ImpactScoreProps {
  score: number
}

export function ImpactScore({ score }: ImpactScoreProps) {
  const getColor = (score: number) => {
    if (score >= 80) return "bg-red-500 text-white"
    if (score >= 60) return "bg-orange-500 text-white"
    return "bg-yellow-500 text-white"
  }

  return (
    <div
      data-testid="impact-score"
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 rounded font-semibold text-xs min-w-[3rem]",
        getColor(score),
      )}
      title={`Impact score: ${score}/100`}
    >
      {score}
    </div>
  )
}
