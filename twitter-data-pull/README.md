# Challenge 1: Twitter Data Pull

## 1. Overview

Build a Flask API that fetches Twitter/X-style post data from a mock external provider (the `mock-data/` JSON files) and returns user summaries, posts, top posts by engagement, and engagement trends. All analytics must use the defined engagement score formula.

## 2. Problem Statement

You are integrating with a provider that exposes user and post data. Your API must expose four endpoints that aggregate and analyze this data. The provider data is supplied as static JSON in `mock-data/`; treat it as the source of truth for users and posts.

## 3. Requirements

- Read user and post data from `mock-data/users.json` and `mock-data/posts.json`.
- Implement the four required endpoints (see below).
- Use the engagement score formula: **engagement_score = likes + 2 * reposts + replies** for all analytics.
- Return JSON responses that match the types defined in `task.ts`.
- Handle the case when a user handle is not found (return an appropriate HTTP status and error payload).

## 4. Expected Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/twitter/users/:handle/summary` | User summary with total posts, total engagement, average engagement per post, and top hashtag. |
| GET | `/api/twitter/users/:handle/posts` | All posts for the user, ordered by `created_at` descending. |
| GET | `/api/twitter/users/:handle/top-posts` | Posts for the user ordered by engagement score descending. Include `engagement_score` on each post. |
| GET | `/api/twitter/users/:handle/engagement-trends` | Engagement over time (e.g. by month). Each point: period, engagement_score, post_count. |

## 5. Data Models

See `task.ts` for the canonical types:

- **TwitterPost:** id, handle, text, created_at, likes, replies, reposts, impressions, hashtags
- **TwitterUser:** handle, display_name, bio, followers_count, following_count, created_at
- **UserSummary:** handle, display_name, total_posts, total_engagement_score, average_engagement_per_post, top_hashtag
- **EngagementTrend:** handle, trend (array of period, engagement_score, post_count)

## 6. Expected Behavior

- **Summary:** Total engagement score is the sum of engagement_score across all posts for that user. Average = total / post count. Top hashtag is the most frequently used hashtag across all posts (if none, return null).
- **Posts:** Return full post objects, newest first.
- **Top posts:** Same post shape plus `engagement_score`, sorted by that value descending.
- **Engagement trends:** Group posts by time period (e.g. month "YYYY-MM"). For each period, sum engagement_score and count posts.

## 7. Suggested Project Structure and Local Commands

```
twitter-data-pull/
  app.py              # or main Flask entry
  requirements.txt
  mock-data/          # (provided)
  services/
    twitter_service.py   # load data, compute summary, trends
  routes/
    twitter_routes.py    # blueprint for /api/twitter/...
  tests/
    test_twitter_api.py
  frontend/           # React app that calls your Flask API
    package.json
    src/
      ...
```

After you implement this challenge, it should be possible to:

- **Run the backend locally** from `twitter-data-pull/` (example):
  - `python -m venv .venv && source .venv/bin/activate`
  - `pip install -r requirements.txt`
  - `flask run` (or an equivalent command you document here)
- **Run the frontend locally** from `twitter-data-pull/frontend/`:
  - `npm install`
  - `npm run dev`
- **Build the frontend** from `twitter-data-pull/frontend/`:
  - `npm run build`

Document the exact commands you support in this README once your implementation is in place.

## 8. Evaluation Criteria

- Correctness of engagement formula and aggregations.
- Correct handling of missing user (404 or 404-like).
- Response shape matches `task.ts` and `example-response.json`.
- Code organization and readability.
- Tests for at least summary and top-posts logic.

## 9. Example Response

See `example-response.json` for sample responses for the `dev_engineer` handle.

---

## 10. Follow-Up Interview Questions

*For the interviewer: use these after the candidate has completed the base implementation. Not part of the required task. Questions are ordered from easier to harder and probe backend judgment, API design, data modeling, reliability, and scale.*

1. How would you handle provider rate limits when the data source becomes a live API?
2. How would you add cursor-based pagination to the posts and top-posts endpoints?
3. How would you support multiple social providers (e.g. Twitter and LinkedIn) with a single set of endpoints?
4. How would you cache trending analytics to reduce load on the provider?
5. How would you design the system if post volume per user could be very large (e.g. millions of posts)?
6. How would you expose engagement trends for different time granularities (day, week, month) without duplicating logic?
7. How would you handle eventual consistency if the provider is eventually consistent?
8. How would you secure the API (auth, rate limiting, input validation)?
9. How would you monitor and alert on provider failures or latency?
10. How would you version the API if you need to change the engagement formula or add new fields?
11. How would you design a job pipeline to precompute summaries and trends asynchronously?
12. How would you support real-time updates (e.g. WebSockets) when new posts arrive?

---

## 11. Edge Cases to Discuss After Implementation

*For the interviewer: discussion prompts only. Not required in the base implementation. Ordered from easier to harder.*

1. **User not found:** How do you respond when `:handle` does not exist in the provider data?
2. **Missing hashtag arrays:** Some posts have `hashtags` missing or null. How do you treat them?
3. **Duplicate posts from provider:** The same post id appears twice. How do you deduplicate?
4. **Malformed timestamps:** `created_at` is invalid or in an unexpected format. How do you parse or reject?
5. **Posts with zero impressions:** How do you handle or surface them in analytics?
6. **Out-of-order post timestamps:** Posts arrive with non-monotonic `created_at`. How does this affect ordering and trends?
7. **Partial provider outages:** Only users or only posts are available. How do you degrade gracefully?
8. **Empty post list:** User exists but has no posts. What does summary and engagement-trends return?
9. **Very long text or huge hashtag lists:** How do you avoid abuse and enforce limits?
10. **Negative engagement counts:** Provider sends negative likes/replies/reposts. How do you validate and handle?
11. **Unicode and sanitization:** How do you handle non-UTF-8 or script injection in text and handle?
12. **Timezone and period boundaries:** How do you define "month" for engagement trends when timestamps are in different timezones?
