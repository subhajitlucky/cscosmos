# Supporting CSCosmos

CSCosmos is free forever. Donations cover infrastructure — never feature access.

## The pledge

- Every topic, visualizer, and interview walkthrough stays free.
- Donations never unlock a feature, lesson, or download.
- No selling learner data, sponsored rankings, or fake urgency.
- Surplus funds new free modules and accessibility work.

## Current cost model

| Item | Current | Notes |
| :--- | :--- | :--- |
| Hosting | ₹0/month | Vercel free tier while traffic is low |
| Domain | ~₹85/month | ₹1,000/year; the first real bill |
| Database | ₹0/month | Free tier; only needed once accounts ship |
| Email | ₹0/month | Free tier for account and reminder features |
| AI tutor | ₹0/month | Bring-your-own key; CSCosmos never pays inference |
| **Total** | **₹0–85/month** | |

This page is the source of truth; update it when a bill appears.

## Where money goes, in order

1. Domain renewal.
2. Email for accounts and reminders.
3. Database free-tier overages, only if we outgrow it.
4. New free modules and accessibility work.

## Donation channels

Configure these in the deployment environment:

| Variable | Purpose |
| :--- | :--- |
| `NEXT_PUBLIC_GITHUB_SPONSORS` | GitHub Sponsors profile URL |
| `NEXT_PUBLIC_SUPPORT_UPI` | UPI ID for direct transfers |

The `/support` page renders GitHub Sponsors by default and shows the UPI option
only when `NEXT_PUBLIC_SUPPORT_UPI` is set.

## Transparency rules

- Publish the actual monthly cost when it changes.
- Never claim a cost that is not real.
- Never gate a feature behind a funding milestone.
- If a cost cannot be covered, reduce scope — do not add a paywall.

## What we will not do

- Paywall topics or interview questions.
- Charge for progress tracking, bookmarks, or flashcards.
- Sell or share learner data.
- Accept sponsorships that change rankings or recommendations.
