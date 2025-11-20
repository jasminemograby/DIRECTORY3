# Gemini Prompts Analysis and Issues

## Current Issues Identified

### Issue 1: Generic Bio Using "They"
**Problem**: All profiles show the same bio: "Alex Johnson is a Frontend Developer with expertise in software development and technology. They bring valuable experience..."

**Root Causes**:
1. **Gemini API might not be called** - Check Railway logs for:
   - `[GeminiAPIClient] Calling Gemini API with model: gemini-1.5-flash`
   - `[GeminiAPIClient] ✅ Bio generated successfully`
   - If you see `⚠️ MOCK BIO USED` instead, Gemini is failing and using fallback

2. **Prompt needs improvement** - Even if Gemini is called, the prompt might not be specific enough

### Issue 2: Same Project Summaries for All Repositories
**Problem**: All project summaries are identical

**Root Causes**:
1. **Gemini API might not be called** - Check Railway logs for:
   - `[GeminiAPIClient] Calling Gemini API with model: gemini-1.5-flash`
   - `[GeminiAPIClient] ✅ Parsed X project summaries`
   - If you see `⚠️ MOCK SUMMARIES USED` instead, Gemini is failing

2. **Prompt needs improvement** - The prompt needs to emphasize uniqueness per repository

## Solutions Implemented

### 1. Improved Bio Prompt
- **Pronoun Detection**: Determines he/she based on name patterns and LinkedIn data
- **Personalization**: Emphasizes using specific data from LinkedIn and GitHub
- **Length**: Increased to 3-5 sentences, 250 words max
- **Specificity**: Requires referencing actual technologies, projects, and experiences

### 2. Improved Project Summaries Prompt
- **Uniqueness Requirement**: Explicitly states each summary must be unique
- **Specificity**: Requires referencing repository name, description, language
- **Length**: Increased to 2-3 sentences, 200 words max
- **Detail**: Emphasizes using specific repository data

### 3. Extensive Logging
- Logs when Gemini API is called
- Logs when mock data is used (with warnings)
- Logs error details if Gemini fails
- Logs sample output to verify quality

## How to Verify Gemini is Working

### Check Railway Logs
Look for these log messages during enrichment:

**If Gemini is working:**
```
[EnrichProfileUseCase] Calling Gemini API to generate bio...
[GeminiAPIClient] Calling Gemini API with model: gemini-1.5-flash
[GeminiAPIClient] ✅ Bio generated successfully, length: XXX
[EnrichProfileUseCase] ✅ Bio generated successfully by Gemini: ...
```

**If Gemini is failing (using mock data):**
```
[EnrichProfileUseCase] ❌ Gemini API failed: ...
[EnrichProfileUseCase] ⚠️  Using mock bio as fallback
[EnrichProfileUseCase] ⚠️  MOCK BIO USED - This is generic and not personalized!
```

### Common Gemini API Failures

1. **API Key Missing**: 
   - Error: `Gemini API key not configured`
   - Solution: Set `GEMINI_API_KEY` in Railway environment variables

2. **API Key Invalid**:
   - Error: `401 Unauthorized` or `403 Forbidden`
   - Solution: Verify API key is correct in Google AI Studio

3. **Rate Limit Exceeded**:
   - Error: `429 Too Many Requests`
   - Solution: Wait and retry, or upgrade API plan

4. **Model Not Found**:
   - Error: `models/gemini-1.5-flash is not found`
   - Solution: Check model name is correct (should be `gemini-1.5-flash`)

5. **Timeout**:
   - Error: `timeout of 30000ms exceeded`
   - Solution: Increase timeout or check network connectivity

## Current Prompts

### Bio Generation Prompt Structure
1. **ROLE**: Defines AI as HR/career development assistant
2. **CONTEXT**: Employee name, current role, target role
3. **LINKEDIN DATA**: Full profile data including positions, summary, headline
4. **GITHUB DATA**: Profile data and top repositories with details
5. **TASK**: Synthesize information into professional bio
6. **OUTPUT REQUIREMENTS**: 
   - Use correct pronoun (he/she based on name patterns)
   - 3-5 sentences, 250 words max
   - Reference specific technologies and experiences
   - Unique to this person

### Project Summaries Prompt Structure
1. **ROLE**: Technical documentation assistant
2. **CONTEXT**: Purpose (showcase technical contributions)
3. **REPOSITORY DATA**: Detailed info for each repository (up to 20)
4. **TASK**: Create unique summary for each repository
5. **OUTPUT REQUIREMENTS**:
   - JSON array format
   - 2-3 sentences per summary
   - Unique per repository
   - Reference specific repository details

## Next Steps

1. **Check Railway Logs** - Verify Gemini is actually being called
2. **If Gemini is failing** - Fix the API key or error
3. **If Gemini is working but output is generic** - Further improve prompts
4. **Test with real data** - Enrich a profile and check the output quality

## Model Used

- **Model**: `gemini-1.5-flash`
- **Reason**: Free tier compatible, fast responses, good quality
- **Alternative**: `gemini-2.0-flash-exp` (if available) or `gemini-1.5-pro` (slower but better quality)

