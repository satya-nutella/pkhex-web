"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  analyzeLegality,
  LegalityResult,
  Severity,
} from "@/lib/pkhex-core/legality/LegalityAnalysis";
import { PK1 } from "@/lib/pkhex-core/pkm/PK1";
import { PK2 } from "@/lib/pkhex-core/pkm/PK2";
import { PK3 } from "@/lib/pkhex-core/pkm/PK3";

type Pokemon = PK1 | PK2 | PK3;

interface LegalityBadgeProps {
  pokemon: Pokemon;
  showDetails?: boolean;
}

export function LegalityBadge({
  pokemon,
  showDetails = false,
}: LegalityBadgeProps) {
  const result = analyzeLegality(pokemon);

  const getBadgeVariant = ():
    | "default"
    | "secondary"
    | "destructive"
    | "outline" => {
    if (result.valid) return "default";
    const hasInvalid = result.checks.some(
      (c) => c.severity === Severity.Invalid,
    );
    if (hasInvalid) return "destructive";
    return "secondary";
  };

  const getBadgeText = (): string => {
    if (result.valid) return "Legal";
    const hasInvalid = result.checks.some(
      (c) => c.severity === Severity.Invalid,
    );
    if (hasInvalid) return "Illegal";
    return "Fishy";
  };

  const getIssues = (): string[] => {
    return result.checks
      .filter((c) => c.severity !== Severity.Valid)
      .map((c) => c.comment);
  };

  const issues = getIssues();
  const badge = (
    <Badge variant={getBadgeVariant()} className="cursor-help">
      {getBadgeText()}
    </Badge>
  );

  if (!showDetails || issues.length === 0) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">Legality Issues:</p>
            <ul className="text-sm list-disc list-inside">
              {issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Full legality report component
 */
export function LegalityReport({ pokemon }: { pokemon: Pokemon }) {
  const result = analyzeLegality(pokemon);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="font-medium">Status:</span>
        <LegalityBadge pokemon={pokemon} />
      </div>

      <div className="space-y-1">
        <span className="font-medium text-sm">Check Results:</span>
        <div className="space-y-1 text-sm">
          {result.checks.map((check, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 ${
                check.severity === Severity.Invalid
                  ? "text-destructive"
                  : check.severity === Severity.Fishy
                    ? "text-yellow-600"
                    : "text-green-600"
              }`}
            >
              <span>
                {check.severity === Severity.Valid
                  ? "✓"
                  : check.severity === Severity.Invalid
                    ? "✗"
                    : "!"}
              </span>
              <span>{check.comment}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
