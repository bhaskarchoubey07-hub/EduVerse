// ==============================================================================
// EDUVERSE AI — AI USAGE RATE LIMITER & PROTECTION
// Enforces configurable daily limits (Section 25 & 27)
// ==============================================================================

import { AIRateLimitStatus } from "./ai-types";

// Configurable daily limit (defaults to 20 messages per student per day for free-tier sustainability)
export const DEFAULT_DAILY_MESSAGE_LIMIT = parseInt(
  process.env.AI_DAILY_MESSAGE_LIMIT || "20",
  10
);

// In-memory fallback tracking for local development / demo sessions
const inMemoryUsageMap = new Map<string, { count: number; date: string }>();

export class AIRateLimiter {
  /**
   * Evaluates if the authenticated user has remaining AI credits for the day
   */
  public static async checkLimit(
    userId: string,
    dailyLimit: number = DEFAULT_DAILY_MESSAGE_LIMIT
  ): Promise<AIRateLimitStatus> {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    const resetTimeIso = tomorrow.toISOString();

    // Check memory store
    const userUsage = inMemoryUsageMap.get(userId);

    if (!userUsage || userUsage.date !== today) {
      return {
        allowed: true,
        remainingToday: dailyLimit,
        dailyLimit,
        resetTimeIso,
      };
    }

    const remaining = Math.max(0, dailyLimit - userUsage.count);
    const allowed = remaining > 0;

    return {
      allowed,
      remainingToday: remaining,
      dailyLimit,
      resetTimeIso,
      reason: allowed
        ? undefined
        : `You've reached today's free AI limit (${dailyLimit}/${dailyLimit} messages). Your limit will reset at midnight UTC.`,
    };
  }

  /**
   * Increments the daily message count for the user
   */
  public static async incrementUsage(userId: string): Promise<number> {
    const today = new Date().toISOString().split("T")[0];
    const userUsage = inMemoryUsageMap.get(userId);

    if (!userUsage || userUsage.date !== today) {
      inMemoryUsageMap.set(userId, { count: 1, date: today });
      return 1;
    }

    userUsage.count += 1;
    inMemoryUsageMap.set(userId, userUsage);
    return userUsage.count;
  }
}
