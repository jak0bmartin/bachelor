import { GameConfig, GAME_CONFIG, getTotalTestDurationMs } from '../data/GameConfig';


export class PerformanceTracker {
    readonly maxPerformanceScore: number;
    readonly minPerformanceScore: number;
    readonly gameDurationMs: number;
    readonly winThresholdPercent: number;

    private lastCallTime = 0;
    private readonly now: () => number = () => Date.now();

    private currentPerformanceScoreMs: number; // Zeit in ms, die über der Schwelle verbracht wurde

    constructor(private readonly config: GameConfig = GAME_CONFIG) {
        this.maxPerformanceScore = config.maxPerformanceScore;
        this.minPerformanceScore = config.minPerformanceScore;
        this.currentPerformanceScoreMs = config.initialPerformanceScore;
        this.gameDurationMs = getTotalTestDurationMs(config);
        this.winThresholdPercent = config.winScoreThresholdPercent;
        this.lastCallTime = this.now();
    }

    public changePerformanceScore(currentScore: number){
        let extraSecondsAboveThreshold = 0;
        if(this.lastCallTime != 0) extraSecondsAboveThreshold = this.now() - this.lastCallTime;
        this.lastCallTime = this.now();
        //console.log("extraSecondsAboveThreshold:",extraSecondsAboveThreshold);
        if(currentScore >= this.winThresholdPercent) this.addTimeAbove(extraSecondsAboveThreshold);
    }

    /*public changePerformanceScore(timeClamped: number, currentScorePercent: number, currentQuestionTrackedMs: number): void {


        if (currentScorePercent > this.winThresholdPercent) {
            this.addTimeAbove(timeClamped);
        }

        else if (currentScorePercent <= this.winThresholdPercent) {
            this.removeTimeAbove(timeClamped);
        }

    }*/

    public getPerformanceScore(): number{
        return this.getTimeAboveThresholdFraction() * 100;
    }

    public getTimeAboveThresholdFraction(): number {
        const fullTestDurationMs = getTotalTestDurationMs(this.config);
        if (fullTestDurationMs === 0) {
            return 0;
        }
        console.log("ergebnis", Math.min(1, this.currentPerformanceScoreMs / fullTestDurationMs));
        return Math.min(1, this.currentPerformanceScoreMs / fullTestDurationMs);
    }

    public getPerformanceScoreMs(): number {
        return this.currentPerformanceScoreMs;
    }

    public addTimeAbove(time: number): void {
       if( (this.getTimeAboveThresholdFraction() *100) < 60)
        this.currentPerformanceScoreMs += time;
        this.checkIfInvalidScore();

        console.log("this.currentPerformanceScoreMs: ",this.currentPerformanceScoreMs);
        console.log("time", time);
    }

    public removeTimeAbove(time: number): void {
        this.currentPerformanceScoreMs -= time;
        this.checkIfInvalidScore();
    }

    public reset(): void {
        this.currentPerformanceScoreMs = 0;
        this.lastCallTime = this.now();
    }

    private checkIfInvalidScore(): void {
        if (this.currentPerformanceScoreMs < 0)
            this.currentPerformanceScoreMs = 0;
        else if(this.currentPerformanceScoreMs > getTotalTestDurationMs(this.config))
            this.currentPerformanceScoreMs = getTotalTestDurationMs(this.config);
        else if((this.getTimeAboveThresholdFraction() *100) > 60)
            this.currentPerformanceScoreMs = getTotalTestDurationMs(this.config) *0.6;
    }
}
