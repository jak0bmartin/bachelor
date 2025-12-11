import { GameConfig, GAME_CONFIG, getTotalTestDurationMs } from './GameConfig';


export class PerformanceTracker {
    readonly maxPerformanceScore: number;
    readonly minPerformanceScore: number;
    readonly gameDurationMs: number;
    readonly winThresholdPercent: number;

    private currentPerformanceScoreSeconds: number; //Zeit die jenseits der >=51% verbracht wurde abzgl. der Zeit, die < 51 verbracht wurde

    constructor(private readonly config: GameConfig = GAME_CONFIG) {
        this.maxPerformanceScore = config.maxPerformanceScore;
        this.minPerformanceScore = config.minPerformanceScore;
        this.currentPerformanceScoreSeconds = config.initialPerformanceScore;
        this.gameDurationMs = getTotalTestDurationMs(config);
        this.winThresholdPercent = config.winScoreThresholdPercent;
    }

    public changePerformanceScore(timeClamped: number, currentScorePercent: number, currentQuestionTrackedMs: number): void {


        if (currentScorePercent > this.winThresholdPercent) {
            this.addTimeAbove(timeClamped);
        }

        else if (currentScorePercent <= this.winThresholdPercent) {
            this.removeTimeAbove(timeClamped);
        }

    }

    public getPerformanceScore(): number{
        return this.getTimeAboveThresholdFraction() * 100;
    }

    public getTimeAboveThresholdFraction(): number {
        const fullTestDurationMs = (getTotalTestDurationMs(this.config)) / 1000;
        if (fullTestDurationMs === 0) {
            return 0;
        }
        return Math.min(1, (this.currentPerformanceScoreSeconds / 1000) / fullTestDurationMs);
    }

    public getPerformanceScoreSeconds(): number {
        return this.currentPerformanceScoreSeconds;
    }

    public addTimeAbove(time: number): void {
       if( (this.getTimeAboveThresholdFraction() *100) < 60)
        this.currentPerformanceScoreSeconds += time /*/ this.gameDurationMs * 100*/;
        this.checkIfInvalidScore();
    }

    public removeTimeAbove(time: number): void {
        this.currentPerformanceScoreSeconds -= time /*/ this.gameDurationMs * 100*/;
        this.checkIfInvalidScore();
    }

    public reset(): void {
        this.currentPerformanceScoreSeconds = 0;
    }

    private checkIfInvalidScore(): void {
        if (this.currentPerformanceScoreSeconds < 0)
            this.currentPerformanceScoreSeconds = 0;
        else if(this.currentPerformanceScoreSeconds > getTotalTestDurationMs(this.config))
            this.currentPerformanceScoreSeconds = getTotalTestDurationMs(this.config);
        else if((this.getTimeAboveThresholdFraction() *100) > 60)
            this.currentPerformanceScoreSeconds = getTotalTestDurationMs(this.config) *0.6;
    }
}