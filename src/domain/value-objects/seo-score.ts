export class SEOscore {
  private _score: number;

  constructor(score: number) {
    if (typeof score !== 'number' || isNaN(score)) {
      throw new Error('SEO score must be a valid number');
    }

    if (score < 0 || score > 100) {
      throw new Error('SEO score must be between 0 and 100');
    }

    this._score = Math.round(score);
  }

  get value(): number {
    return this._score;
  }

  // Business logic methods
  isExcellent(): boolean {
    return this._score >= 90;
  }

  isGood(): boolean {
    return this._score >= 80 && this._score < 90;
  }

  isAverage(): boolean {
    return this._score >= 60 && this._score < 80;
  }

  isPoor(): boolean {
    return this._score >= 30 && this._score < 60;
  }

  isCritical(): boolean {
    return this._score < 30;
  }

  getGrade(): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (this.isExcellent()) return 'A';
    if (this.isGood()) return 'B';
    if (this.isAverage()) return 'C';
    if (this.isPoor()) return 'D';
    return 'F';
  }

  getDescription(): string {
    if (this.isExcellent()) return 'Excellent SEO optimization';
    if (this.isGood()) return 'Good SEO optimization';
    if (this.isAverage()) return 'Average SEO optimization';
    if (this.isPoor()) return 'Poor SEO optimization - needs improvement';
    return 'Critical SEO issues - immediate attention required';
  }

  getColor(): string {
    if (this.isExcellent()) return '#10B981'; // green-500
    if (this.isGood()) return '#3B82F6'; // blue-500
    if (this.isAverage()) return '#F59E0B'; // yellow-500
    if (this.isPoor()) return '#F97316'; // orange-500
    return '#EF4444'; // red-500
  }

  // Value object methods
  equals(other: SEOscore): boolean {
    return this._score === other._score;
  }

  toString(): string {
    return `${this._score}%`;
  }

  toJSON(): { score: number; grade: string; description: string } {
    return {
      score: this._score,
      grade: this.getGrade(),
      description: this.getDescription(),
    };
  }

  // Static factory methods
  static create(score: number): SEOscore {
    return new SEOscore(score);
  }

  static zero(): SEOscore {
    return new SEOscore(0);
  }

  static perfect(): SEOscore {
    return new SEOscore(100);
  }

  // Comparison methods
  isHigherThan(other: SEOscore): boolean {
    return this._score > other._score;
  }

  isLowerThan(other: SEOscore): boolean {
    return this._score < other._score;
  }

  difference(other: SEOscore): number {
    return this._score - other._score;
  }
}