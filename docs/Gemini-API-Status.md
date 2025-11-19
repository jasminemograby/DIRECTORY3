# Gemini API Status and Configuration

## Overview

The Directory microservice uses Google's Gemini AI for:
1. **Profile Enrichment**: Generating employee bios and project summaries from LinkedIn/GitHub data
2. **AI Query Generation**: Dynamically generating SQL queries for the universal endpoint `/api/fill-content-metrics`

## Current Configuration

- **Model Used**: `gemini-1.5-flash` (for query generation) and `gemini-pro` (for profile enrichment)
- **API Key**: Configured via `GEMINI_API_KEY` environment variable
- **Location**: `backend/src/infrastructure/AIQueryGenerator.js` and `backend/src/infrastructure/GeminiService.js`

## Free Tier Availability

### Gemini 2.5 Pro (Experimental - Free)
- ✅ **25 requests per minute (RPM)**
- ✅ **250,000 tokens per minute (TPM)**
- ✅ **500 requests per day (RPD)**
- ✅ **Suitable for development and testing**
- ✅ **No payment required for free tier**

### Gemini 1.5 Flash (Free Tier)
- ✅ Available through Google AI Studio
- ✅ Free API key available at: https://aistudio.google.com/apikey
- ✅ Generous free tier limits for development

## Paid Tiers (If Needed)

### Gemini 2.5 Pro Paid
- **Input**: $0.005 per 1,000 tokens
- **Output**: $0.015 per 1,000 tokens
- Higher rate limits available

### Subscription Plans
- **Google AI Plus**: $2.99/month
- **Google AI Pro**: $19.99/month
- **Google AI Ultra**: $124.99/month

## How to Check if Payment is Required

1. **Check API Key Status**:
   - Visit https://aistudio.google.com/apikey
   - View your API key usage and limits
   - Check if you're on free tier or paid tier

2. **Monitor Usage**:
   - Google AI Studio dashboard shows current usage
   - Free tier limits are clearly displayed
   - Alerts when approaching limits

3. **Test API Calls**:
   - The system will log errors if API key is invalid or quota exceeded
   - Check Railway logs for Gemini API errors
   - Error messages will indicate if payment is required

## Current Implementation Status

### ✅ Implemented
- AI Query Generator for universal endpoint
- Profile enrichment with Gemini
- Error handling and fallback mechanisms
- Logging for API calls

### ⚠️ Potential Issues
- If `GEMINI_API_KEY` is not set, AI features will be disabled
- If free tier limits are exceeded, API calls will fail
- Need to monitor usage to avoid unexpected charges

## Testing Gemini Integration

### Test Profile Enrichment
1. Log in as an employee
2. Connect LinkedIn and GitHub
3. Check if bio and project summaries are generated
4. Check Railway logs for Gemini API calls

### Test AI Query Generation
1. Make a request to `/api/fill-content-metrics` from another microservice
2. Check if SQL query is generated correctly
3. Verify query execution and response mapping

## Recommendations

1. **For Development/Testing**:
   - Use free tier (no payment required)
   - Monitor usage in Google AI Studio
   - Free tier should be sufficient for testing

2. **For Production**:
   - Monitor API usage closely
   - Set up usage alerts
   - Consider paid tier if volume exceeds free limits
   - Implement rate limiting to prevent abuse

3. **Error Handling**:
   - System already has fallback mechanisms
   - If Gemini fails, system returns empty templates
   - Logs will indicate when Gemini is unavailable

## Next Steps

1. ✅ Verify `GEMINI_API_KEY` is set in Railway environment variables
2. ✅ Test profile enrichment flow
3. ✅ Test universal endpoint with AI query generation
4. ⚠️ Monitor API usage in Google AI Studio
5. ⚠️ Check if free tier limits are sufficient for your use case

## Support

- **Google AI Studio**: https://aistudio.google.com/
- **Gemini API Documentation**: https://ai.google.dev/docs
- **Pricing Information**: https://ai.google.dev/pricing

