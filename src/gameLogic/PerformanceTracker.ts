import { GameConfig, GAME_CONFIG, getTotalTestDurationMs } from '../data/GameConfig';


export class PerformanceTracker {
    readonly maxPerformanceScore: number;
    readonly minPerformanceScore: number;
    readonly gameDurationMs: number;
    readonly winThresholdPercent: number;
    readonly timePerQuestion: number;

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
        this.timePerQuestion = config.MsPerQuestion;
    }

    public changePerformanceScore(currentScore: number, deltaTime?: number, answerCorrect?: boolean) {
        let extraSecondsAboveThreshold = 0;
        if (deltaTime === undefined) {
            if (this.lastCallTime != 0) extraSecondsAboveThreshold = this.now() - this.lastCallTime;
        }
        else{
            extraSecondsAboveThreshold = deltaTime;
        }
        this.lastCallTime = this.now();
        if(answerCorrect !== undefined){
            if(!answerCorrect){this.removeTimeAbove(this.timePerQuestion); return;}
        }
        if (currentScore >= this.winThresholdPercent) this.addTimeAbove(extraSecondsAboveThreshold);
        else if (currentScore < this.winThresholdPercent) this.removeTimeAbove(extraSecondsAboveThreshold);
    }

    public getPerformanceScore(): number {
        return this.getTimeAboveThresholdFraction() * 100;
    }

    public getTimeAboveThresholdFraction(): number {
        const fullTestDurationMs = getTotalTestDurationMs(this.config);
        if (fullTestDurationMs === 0) {
            return 0;
        }
        return Math.min(1, this.currentPerformanceScoreMs / fullTestDurationMs);
    }

    public getPerformanceScoreMs(): number {
        return this.currentPerformanceScoreMs;
    }

    public addTimeAbove(time: number): void {
        //if ((this.getTimeAboveThresholdFraction() * 100) < 60) nur nötig bei max 60%
            this.currentPerformanceScoreMs += time;
        this.checkIfInvalidScore();

        console.log("this.currentPerformanceScoreMs: ", this.currentPerformanceScoreMs);
        console.log("time", time);
    }

    public removeTimeAbove(time: number): void {
        this.currentPerformanceScoreMs -= time;
        this.checkIfInvalidScore();
    }

    public reset(): void {
        this.lastCallTime = this.now();
    }

    private checkIfInvalidScore(): void {
        if (this.currentPerformanceScoreMs < 0)
            this.currentPerformanceScoreMs = 0;
        else if (this.currentPerformanceScoreMs > getTotalTestDurationMs(this.config))
            this.currentPerformanceScoreMs = getTotalTestDurationMs(this.config);
        /*else if ((this.getTimeAboveThresholdFraction() * 100) > 60)
            this.currentPerformanceScoreMs = getTotalTestDurationMs(this.config) * 0.6;*/
    }
}
