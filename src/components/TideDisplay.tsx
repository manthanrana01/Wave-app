import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TideEvent, getCurrentTideStatus, CoastLocation } from '@/lib/tideData';
import { format, formatDistanceToNow } from 'date-fns';
import { Waves, TrendingUp, TrendingDown, Clock, MapPin } from 'lucide-react';

interface TideDisplayProps {
  coast: CoastLocation;
  tides: TideEvent[];
}

export default function TideDisplay({ coast, tides }: TideDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tideStatus, setTideStatus] = useState(getCurrentTideStatus(tides));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setTideStatus(getCurrentTideStatus(tides));
    }, 1000);

    return () => clearInterval(timer);
  }, [tides]);

  const formatCountdown = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getTideProgress = (): number => {
    if (!tideStatus.nextTide) return 0;
    
    const now = currentTime.getTime();
    const nextTideTime = tideStatus.nextTide.time.getTime();
    
    // Find the previous tide
    const previousTide = tides
      .filter(tide => tide.time.getTime() < now)
      .sort((a, b) => b.time.getTime() - a.time.getTime())[0];
    
    if (!previousTide) return 0;
    
    const totalDuration = nextTideTime - previousTide.time.getTime();
    const elapsed = now - previousTide.time.getTime();
    
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  const upcomingTides = tides
    .filter(tide => tide.time.getTime() > currentTime.getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Current Location */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <MapPin className="h-5 w-5" />
            {coast.name}
          </CardTitle>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {coast.state}, {coast.country}
          </p>
        </CardHeader>
      </Card>

      {/* Current Tide Status */}
      {tideStatus.nextTide && (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
              <Waves className="h-5 w-5" />
              Current Tide Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {tideStatus.current === 'rising' ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                )}
                <span className="font-medium text-emerald-900 dark:text-emerald-100">
                  Tide is {tideStatus.current}
                </span>
              </div>
              <Badge variant={tideStatus.nextTide.type === 'high' ? 'default' : 'secondary'}>
                Next: {tideStatus.nextTide.type} tide
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-700 dark:text-emerald-300">Progress to next tide</span>
                <span className="font-mono text-emerald-900 dark:text-emerald-100">
                  {getTideProgress().toFixed(0)}%
                </span>
              </div>
              <Progress value={getTideProgress()} className="h-2" />
            </div>
            
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                  Next {tideStatus.nextTide.type} tide in:
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-emerald-800 dark:text-emerald-200">
                {formatCountdown(tideStatus.timeToNext)}
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">
                at {format(tideStatus.nextTide.time, 'h:mm a')} • Height: {tideStatus.nextTide.height.toFixed(1)}m
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Tides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5" />
            Upcoming Tides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingTides.map((tide, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {tide.type === 'high' ? (
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-orange-600" />
                  )}
                  <div>
                    <div className="font-medium capitalize">
                      {tide.type} Tide
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(tide.time, 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {tide.height.toFixed(1)}m
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(tide.time, { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}