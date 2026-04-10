export interface PlatformTestMetric {
  benefit_code: string;
  label: string;
  usage_count: number;
}

export interface PlatformMetricsSnapshot {
  total_visitors: number;
  total_test_uses: number;
  tests: PlatformTestMetric[];
  updated_at: string | null;
}
