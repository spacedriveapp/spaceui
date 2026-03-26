import { clsx } from 'clsx';
import { forwardRef, useState } from 'react';
import { Shield, ShieldCheck, WarningCircle, XCircle, CheckCircle } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Slider } from '@spaceui/primitives';

interface AutonomyLevel {
  level: 'manual' | 'assisted' | 'semi' | 'full';
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const autonomyLevels: AutonomyLevel[] = [
  {
    level: 'manual',
    label: 'Manual',
    description: 'All actions require explicit approval',
    icon: Shield,
  },
  {
    level: 'assisted',
    label: 'Assisted',
    description: 'Suggest actions, wait for approval on critical operations',
    icon: ShieldCheck,
  },
  {
    level: 'semi',
    label: 'Semi-Autonomous',
    description: 'Execute safe actions, ask for permission on destructive ones',
    icon: WarningCircle,
  },
  {
    level: 'full',
    label: 'Full Autonomy',
    description: 'Execute all actions independently',
    icon: WarningCircle,
  },
];

interface ApprovalRequest {
  id: string;
  action: string;
  reason: string;
  timestamp: string;
}

interface AutonomyPanelProps {
  currentLevel: AutonomyLevel['level'];
  onLevelChange?: (level: AutonomyLevel['level']) => void;
  pendingApprovals?: ApprovalRequest[];
  onApprove?: (requestId: string) => void;
  onDeny?: (requestId: string) => void;
  className?: string;
}

const AutonomyPanel = forwardRef<HTMLDivElement, AutonomyPanelProps>(
  ({ currentLevel, onLevelChange, pendingApprovals = [], onApprove, onDeny, className }, ref) => {
    const currentLevelIndex = autonomyLevels.findIndex((l) => l.level === currentLevel);
    const [selectedLevel, setSelectedLevel] = useState(currentLevelIndex);

    const handleLevelChange = (value: number[]) => {
      const nextLevel = value[0] ?? 0;
      setSelectedLevel(nextLevel);
      onLevelChange?.(autonomyLevels[nextLevel].level);
    };

    return (
      <div ref={ref} className={clsx('space-y-6', className)}>
        <Card>
          <CardHeader>
            <CardTitle>Autonomy Level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              value={[selectedLevel]}
              onValueChange={handleLevelChange}
              min={0}
              max={3}
              step={1}
              showMarks
            />

            <div className="grid grid-cols-4 gap-2 text-center">
              {autonomyLevels.map((level, i) => {
                const Icon = level.icon;
                const isSelected = i === selectedLevel;
                return (
                  <div
                    key={level.level}
                    className={clsx(
                      'p-2 rounded-lg border transition-colors',
                      isSelected
                        ? 'border-accent bg-accent/10'
                        : 'border-app-line bg-app-box'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'mx-auto size-5 mb-1',
                        isSelected ? 'text-accent' : 'text-ink-dull'
                      )}
                    />
                    <p
                      className={clsx(
                        'text-xs font-medium',
                        isSelected ? 'text-ink' : 'text-ink-dull'
                      )}
                    >
                      {level.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="text-sm text-ink-dull">
              {autonomyLevels[selectedLevel].description}
            </p>
          </CardContent>
        </Card>

        {pendingApprovals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pending Approvals
                <Badge variant="default">{pendingApprovals.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingApprovals.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start justify-between gap-4 p-3 rounded-lg border border-app-line bg-app-box"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-ink">{request.action}</p>
                    <p className="text-xs text-ink-faint mt-1">{request.reason}</p>
                    <p className="text-xs text-ink-faint mt-0.5">
                      {new Date(request.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {onDeny && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-status-error hover:text-status-error"
                        onClick={() => onDeny(request.id)}
                      >
                         <XCircle className="size-4" />
                      </Button>
                    )}
                    {onApprove && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-status-success hover:text-status-success"
                        onClick={() => onApprove(request.id)}
                      >
                         <CheckCircle className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

AutonomyPanel.displayName = 'AutonomyPanel';

export { AutonomyPanel, autonomyLevels };
export type { AutonomyPanelProps, AutonomyLevel, ApprovalRequest };
