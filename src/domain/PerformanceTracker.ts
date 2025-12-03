import { GameConfig, GAME_CONFIG, getTotalTestDurationMs } from './GameConfig';


export class PerformanceTracker {
    readonly maxPerformanceScore: number;
    readonly minPerformanceScore: number;
    readonly gameDurationMs: number;
    readonly winThresholdPercent: number;

    private currentPerformanceScorePercent: number; //Zeit die jenseits der >=51% verbracht wurde abzgl. der Zeit, die < 51 verbracht wurde

    constructor(private readonly config: GameConfig = GAME_CONFIG) {
        this.maxPerformanceScore = config.maxPerformanceScore;
        this.minPerformanceScore = config.minPerformanceScore;
        this.currentPerformanceScorePercent = config.initialPerformanceScore;
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

    public addTimeAbove(time: number): void {
        this.currentPerformanceScorePercent += time / this.gameDurationMs * 100;
        this.checkIfInvalidScore();
    }

    public removeTimeAbove(time: number): void {
        this.currentPerformanceScorePercent -= time / this.gameDurationMs * 100;
        this.checkIfInvalidScore();
    }

    private checkIfInvalidScore(): void {
        if (this.currentPerformanceScorePercent < 0 || this.currentPerformanceScorePercent > 100) {
            if (this.currentPerformanceScorePercent > 100) this.currentPerformanceScorePercent = 100;
            else if (this.currentPerformanceScorePercent < 0) this.currentPerformanceScorePercent = 0;
        }
    }
}