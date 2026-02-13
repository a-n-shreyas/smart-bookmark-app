# Testing Guide - Smart Bookmark App

## Manual Testing Checklist

### Authentication Tests

#### ✅ Google Sign In Flow
- [ ] Click "Sign in with Google" button
- [ ] Redirected to Google OAuth consent screen
- [ ] Select Google account
- [ ] Redirected back to app (authenticated)
- [ ] User email displayed in header

#### ✅ Sign Out Flow
- [ ] Click "Sign Out" button
- [ ] Redirected to sign-in page
- [ ] Cannot access bookmarks page
- [ ] Sign in again works correctly

#### ✅ Session Persistence
- [ ] Sign in successfully
- [ ] Refresh the page
- [ ] Still signed in (no redirect to login)
- [ ] Close browser and reopen
- [ ] Still signed in

### Bookmark Management Tests

#### ✅ Add Bookmark
- [ ] Fill in title field
- [ ] Fill in URL field (valid URL)
- [ ] Click "Add Bookmark"
- [ ] Bookmark appears in list immediately
- [ ] Form fields are cleared
- [ ] Can add multiple bookmarks
- [ ] Bookmarks ordered by newest first

#### ✅ Add Bookmark - Error Cases
- [ ] Try to add with empty title → Shows error
- [ ] Try to add with empty URL → Shows error
- [ ] Try to add with invalid URL → Browser validation catches it
- [ ] Button disabled while adding (prevents double-submit)

#### ✅ Delete Bookmark
- [ ] Click "Delete" on a bookmark
- [ ] Bookmark removed immediately
- [ ] No error messages
- [ ] Page doesn't refresh
- [ ] Delete multiple bookmarks in sequence

#### ✅ Bookmark Display
- [ ] Title displayed correctly
- [ ] URL displayed correctly (with link)
- [ ] Created date displayed
- [ ] URL is clickable and opens in new tab
- [ ] Long URLs are truncated properly
- [ ] Long titles are truncated properly

### Real-time Functionality Tests

#### ✅ Multi-Tab Real-time Updates
1. **Setup**: Open app in two browser tabs/windows
2. **Both tabs signed in** with same account
3. **Tab 1**: Add a bookmark
   - [ ] Bookmark appears in Tab 1 immediately
   - [ ] Bookmark appears in Tab 2 automatically (no refresh)
4. **Tab 2**: Add a different bookmark
   - [ ] Bookmark appears in Tab 2 immediately
   - [ ] Bookmark appears in Tab 1 automatically
5. **Tab 1**: Delete a bookmark
   - [ ] Bookmark removed from Tab 1 immediately
   - [ ] Bookmark removed from Tab 2 automatically
6. **Add 5 bookmarks rapidly** in Tab 1
   - [ ] All appear in Tab 2 in correct order

#### ✅ Cross-Browser Real-time
- [ ] Open app in Chrome (Tab 1)
- [ ] Open app in Firefox/Safari (Tab 2)
- [ ] Both signed in with same account
- [ ] Changes in Chrome appear in Firefox
- [ ] Changes in Firefox appear in Chrome

#### ✅ Real-time Edge Cases
- [ ] Open 3+ tabs simultaneously
- [ ] All tabs receive updates
- [ ] Close one tab, others still work
- [ ] Reopen closed tab, real-time still works
- [ ] Sign out in one tab, real-time stops in that tab
- [ ] Other tabs still receive updates

### Privacy & Security Tests

#### ✅ User Data Isolation
1. **User A Setup**:
   - [ ] Sign in as User A (Google Account 1)
   - [ ] Add 3 bookmarks
   - [ ] Note bookmark titles
   - [ ] Sign out

2. **User B Setup**:
   - [ ] Sign in as User B (Google Account 2)
   - [ ] Cannot see User A's bookmarks
   - [ ] Bookmark list is empty or shows only User B's bookmarks
   - [ ] Add 2 bookmarks as User B

3. **User A Verification**:
   - [ ] Sign in again as User A
   - [ ] Only User A's 3 bookmarks visible
   - [ ] User B's bookmarks NOT visible

#### ✅ Real-time Privacy
- [ ] Open Tab 1 with User A
- [ ] Open Tab 2 with User B (different browser/incognito)
- [ ] Add bookmark as User A
- [ ] Bookmark does NOT appear for User B
- [ ] Add bookmark as User B
- [ ] Bookmark does NOT appear for User A

#### ✅ Authorization Tests
Using browser DevTools:
- [ ] Try to access `/api/bookmarks` without auth → 401 error
- [ ] Try to access other user's data via API → Blocked by RLS
- [ ] Inspect network requests for auth tokens (should be httpOnly cookies)

### UI/UX Tests

#### ✅ Responsive Design
- [ ] Desktop view (>1024px): Layout looks good
- [ ] Tablet view (768px-1024px): Layout adjusts
- [ ] Mobile view (<768px): Vertical layout, readable
- [ ] All buttons clickable on mobile
- [ ] Forms usable on small screens

#### ✅ Loading States
- [ ] "Adding..." shows while bookmark is being added
- [ ] Button disabled during add operation
- [ ] No flash of unauthenticated content on page load
- [ ] Smooth transition after sign in

#### ✅ Empty States
- [ ] New user sees "No bookmarks yet" message
- [ ] Message is encouraging/helpful
- [ ] After adding first bookmark, message disappears

#### ✅ Accessibility
- [ ] Tab through form fields (keyboard navigation)
- [ ] Form labels are associated with inputs
- [ ] Buttons have clear text (not just icons)
- [ ] Sufficient color contrast
- [ ] Links open in new tabs (for external URLs)

### Performance Tests

#### ✅ Load Time
- [ ] Initial page load < 2 seconds
- [ ] Sign in redirect < 1 second
- [ ] Add bookmark < 500ms
- [ ] Delete bookmark < 500ms
- [ ] Real-time update appears < 1 second

#### ✅ Large Dataset
- [ ] Add 50+ bookmarks
- [ ] Page still loads quickly
- [ ] Scrolling is smooth
- [ ] No memory leaks (check DevTools Performance)
- [ ] Real-time still works with many bookmarks

#### ✅ Network Conditions
- [ ] Test on slow 3G (DevTools → Network throttling)
- [ ] App still usable
- [ ] Loading indicators appear
- [ ] No crashes or blank pages

## Automated Testing (Future Enhancement)

This project currently uses manual testing. Here's what you could add:

### Unit Tests (with Jest/Vitest)
```typescript
// Example: components/__tests__/BookmarkList.test.tsx
test('renders bookmark title', () => {
  // Test component rendering
})
```

### Integration Tests (with Playwright)
```typescript
// Example: tests/e2e/bookmark-flow.spec.ts
test('can add and delete bookmark', async ({ page }) => {
  // Test full user flow
})
```

### API Tests (with Supertest)
```typescript
// Example: tests/api/bookmarks.test.ts
test('GET /api/bookmarks requires auth', async () => {
  // Test API endpoints
})
```

## Test Data Cleanup

After testing, clean up test data:

```sql
-- Run in Supabase SQL Editor
DELETE FROM bookmarks WHERE title LIKE '%test%';
```

## Bug Reporting Template

If you find a bug during testing:

```markdown
**Bug Title**: [Short description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**: 

**Actual Behavior**: 

**Screenshots**: [If applicable]

**Environment**:
- Browser: 
- OS: 
- URL: 

**Console Errors**: [Browser DevTools → Console]
```

## Testing Sign-Off Checklist

Before considering the app production-ready:

- [ ] All authentication tests pass
- [ ] All bookmark management tests pass
- [ ] All real-time tests pass
- [ ] All privacy tests pass
- [ ] All UI/UX tests pass
- [ ] Performance is acceptable
- [ ] No console errors or warnings
- [ ] Works in Chrome, Firefox, Safari
- [ ] Works on mobile devices
- [ ] Test data cleaned up

## Continuous Testing

For ongoing development:

1. **Before Every Commit**: Test the feature you changed
2. **Before Deployment**: Run full test checklist
3. **After Deployment**: Smoke test critical paths
4. **Weekly**: Full regression test

## Performance Metrics to Track

Use browser DevTools:
- **Lighthouse Score**: Aim for >90 in all categories
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1

## Security Testing

### OWASP Top 10 Checklist
- [ ] Injection: Protected by Supabase parameterized queries
- [ ] Broken Authentication: Google OAuth + Supabase
- [ ] Sensitive Data Exposure: HTTPS only, httpOnly cookies
- [ ] XML External Entities: Not applicable (no XML)
- [ ] Broken Access Control: RLS policies enforce user isolation
- [ ] Security Misconfiguration: Environment vars, no sensitive data in git
- [ ] Cross-Site Scripting: React escapes by default
- [ ] Insecure Deserialization: Not applicable
- [ ] Using Components with Known Vulnerabilities: Run `npm audit`
- [ ] Insufficient Logging: Supabase provides logs

## User Acceptance Testing

Have real users test:
1. Share staging URL with 3-5 people
2. Ask them to:
   - Sign in
   - Add 5 bookmarks
   - Open two tabs
   - Try to "break" the app
3. Collect feedback
4. Fix issues before production launch

---

**Happy Testing!** 🧪

Remember: Testing is not just about finding bugs, it's about ensuring a great user experience!
