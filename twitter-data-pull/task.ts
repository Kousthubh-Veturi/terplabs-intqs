/**
 * Twitter Data Pull — API contract and types
 *
 * Use these interfaces as the source of truth for request/response shapes.
 * Implement your Flask API to return data matching these types.
 */

/** A single post from the provider (Twitter/X-style). */
export interface TwitterPost {
  id: string;
  handle: string;
  text: string;
  created_at: string; // ISO 8601 datetime
  likes: number;
  replies: number;
  reposts: number;
  impressions: number;
  hashtags: string[];
}

/** User record from the provider (profile/summary data). */
export interface TwitterUser {
  handle: string;
  display_name: string;
  bio: string;
  followers_count: number;
  following_count: number;
  created_at: string; // ISO 8601
}

/** Response for GET /api/twitter/users/:handle/summary */
export interface UserSummary {
  handle: string;
  display_name: string;
  total_posts: number;
  total_engagement_score: number;
  average_engagement_per_post: number;
  top_hashtag: string | null; // most frequently used hashtag
}

/** Single data point for engagement over time. */
export interface EngagementTrendPoint {
  period: string; // e.g. "2024-01", "2024-W03"
  engagement_score: number;
  post_count: number;
}

/** Response for GET /api/twitter/users/:handle/engagement-trends */
export interface EngagementTrend {
  handle: string;
  trend: EngagementTrendPoint[];
}

/**
 * Engagement score formula (use consistently across endpoints):
 *   engagement_score = likes + 2 * reposts + replies
 */
