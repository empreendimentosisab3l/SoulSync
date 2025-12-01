# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SoulSync (Hypnozio MVP)** - A comprehensive Direct Response Marketing funnel for a hypnotherapy weight-loss program. The application features a 21-step personalized quiz, payment integration with LastLink, automated email delivery via Resend, and a protected members area with 8 hypnotherapy audio sessions.

This is a complete MVP combining:
- Quiz funnel for lead capture and qualification
- Payment processing and subscription management
- Token-based access control
- Email automation
- Content delivery platform
- **Analytics Dashboard**: Complete tracking and analytics system for quiz performance

## Analytics Dashboard

The project includes a comprehensive analytics dashboard for tracking quiz performance:

- **Admin Login**: `/admin` (username: `admin`, password: `admin123`)
- **Dashboard Overview**: `/dashboard` - General metrics, funnel, trends
- **Quizzes List**: `/dashboard/quizzes` - All quizzes with performance metrics
- **Quiz Details**: `/dashboard/quiz/[id]` - Detailed analysis per quiz
- **Compare**: `/dashboard/compare` - Side-by-side quiz comparison
- **Settings**: `/dashboard/settings` - Account and preferences

### Analytics Features
- Real-time tracking of quiz sessions
- Conversion funnel visualization
- Device and browser breakdown
- UTM source tracking
- Revenue and conversion rate metrics
- Card-by-card performance analysis (ready for implementation)

### Database (PostgreSQL + Prisma)
- `quizzes`: Quiz configurations
- `quiz_sessions`: User sessions with UTM and device data
- `quiz_events`: Individual user interactions (views, answers)
- `conversions`: Payment and conversion data
- `users`: Admin authentication

### Integration
See `INTEGRACAO-ANALYTICS.md` for step-by-step integration guide with the existing quiz.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **Database**: PostgreSQL (Supabase) + Prisma ORM 5.22
- **Authentication**: NextAuth 4.24 (for admin dashboard)
- **Email**: Resend API 6.4.0
- **Payment**: LastLink webhook integration
- **State Management**: React hooks + localStorage + SWR (for API data)
- **Access Control**: Token-based (members area) + Session-based (admin)
- **Audio**: HTML5 Audio API with custom player
- **Charts**: Recharts for data visualization
- **Validation**: Zod for API schemas

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run dev server with cleanup (recommended if having port/lock issues)
npm run dev:clean

# Clean up processes and lock files manually
npm run clean

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm lint

# Prisma / Database commands
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema changes to database (no migration)
npm run db:migrate       # Create and run migration
npm run db:seed          # Seed database (creates admin user)

# Quick start script (Windows)
# Double-click iniciar.bat or run from terminal
.\iniciar.bat
```

The development server runs on `http://localhost:3000` by default (or next available port like 3001).

## Project Structure

```
hypnozio-mvp/
├── app/
│   ├── layout.tsx                    # Root layout with SoulSync branding
│   ├── page.tsx                      # Landing page with hero CTA
│   ├── providers.tsx                 # SessionProvider wrapper
│   ├── globals.css                   # Global styles + Tailwind + custom colors
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth API route
│   │   ├── track/
│   │   │   └── route.ts              # POST /api/track (analytics tracking)
│   │   ├── dashboard/
│   │   │   ├── overview/
│   │   │   │   └── route.ts          # GET dashboard metrics
│   │   │   ├── quizzes/
│   │   │   │   └── route.ts          # GET all quizzes with stats
│   │   │   ├── quiz/
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET single quiz details
│   │   │   └── compare/
│   │   │       └── route.ts          # GET compare two quizzes
│   │   ├── validate-token/
│   │   │   └── route.ts              # GET /api/validate-token?token=xxx
│   │   └── webhook/
│   │       └── lastlink/
│   │           └── route.ts          # POST webhook for payment events
│   ├── admin/
│   │   └── page.tsx                  # Admin login page
│   ├── dashboard/
│   │   ├── layout.tsx                # Dashboard layout with Sidebar
│   │   ├── page.tsx                  # Dashboard overview
│   │   ├── quizzes/
│   │   │   └── page.tsx              # Quizzes list page
│   │   ├── quiz/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Quiz detail page
│   │   ├── compare/
│   │   │   └── page.tsx              # Compare quizzes page
│   │   └── settings/
│   │       └── page.tsx              # Settings page
│   ├── quiz/
│   │   ├── [step]/
│   │   │   └── page.tsx              # Dynamic quiz steps (1-21)
│   │   ├── email/
│   │   │   └── page.tsx              # Email/name capture page
│   │   ├── loading/
│   │   │   └── page.tsx              # Loading animation screen
│   │   ├── checkout/
│   │   │   └── page.tsx              # Payment/checkout page
│   │   └── result/
│   │       ├── page.tsx              # Generic results
│   │       ├── 1/page.tsx            # Plan 1 specific results
│   │       ├── 2/page.tsx            # Plan 2 specific results
│   │       ├── 3/page.tsx            # Plan 3 specific results
│   │       ├── 4/page.tsx            # Plan 4 specific results
│   │       └── 5/page.tsx            # Plan 5 specific results
│   └── membros/
│       └── page.tsx                  # Protected members area (8 sessions)
│
├── components/
│   ├── AudioPlayer.tsx               # Full-featured audio player
│   ├── ProgressBar.tsx               # Quiz progress indicator
│   ├── QuizChoice.tsx                # Single choice questions
│   ├── QuizMultiple.tsx              # Multiple selection questions
│   ├── QuizRange.tsx                 # Range/slider questions
│   ├── QuizMeasurements.tsx          # Body measurements input
│   ├── QuizInfo.tsx                  # Info/testimonial screens
│   └── dashboard/
│       ├── Sidebar.tsx               # Dashboard navigation sidebar
│       ├── StatCard.tsx              # Metric card component
│       ├── FunnelChart.tsx           # Conversion funnel visualization
│       └── LineChart.tsx             # Trend line chart
│
├── components/ui/
│   ├── button.tsx                    # UI button component
│   ├── card.tsx                      # UI card component
│   └── input.tsx                     # UI input component
│
├── lib/
│   ├── quizData.ts                   # Quiz configuration (21 questions)
│   ├── prisma.ts                     # Prisma client singleton
│   ├── auth.ts                       # NextAuth configuration
│   ├── auth/
│   │   └── validateToken.ts          # Token validation logic
│   ├── email/
│   │   └── sendAccessEmail.ts        # Email sending via Resend
│   └── hooks/
│       └── useQuizTracking.ts        # Custom hook for quiz tracking
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.js                       # Database seeding script
│
├── data/
│   └── access-tokens.json            # User access tokens storage
│
├── public/
│   ├── tracking.js                   # Quiz tracking script (legacy)
│   └── audios/
│       └── sessao-1.mp3              # Hypnotherapy audio files
│
└── Documentation/
    ├── CLAUDE.md                     # This file (for AI assistance)
    ├── README.md                     # Project documentation
    ├── INTEGRACAO-ANALYTICS.md      # Analytics integration guide
    ├── FLUXO-COMPLETO.md            # Complete user flow
    ├── CONFIGURAR-EMAIL.md          # Email setup guide
    ├── INTEGRACAO-LASTLINK.md       # LastLink integration
    ├── DEPLOY-PRODUCAO.md           # Deployment guide
    └── [other guides...]
```

## Architecture & Data Flow

### Complete User Journey

```
1. Landing Page (/)
   User arrives → Clicks "Começar Agora" → localStorage cleared → Redirects to /quiz/1

2. Quiz Funnel (/quiz/1 through /quiz/21)
   21 personalized questions stored in localStorage as "quizAnswers"
   Questions include: age, motivation, struggles, habits, goals, measurements

3. Email Capture (/quiz/email)
   Name + Email collected → Stored in localStorage as "userData"

4. Loading Screen (/quiz/loading)
   Processing animation → Auto-redirect to results

5. Results Page (/quiz/result/[1-5])
   Personalized analysis based on quiz answers
   5 different plan options displayed
   "Garantir Meu Acesso" button → Checkout

6. Checkout (/quiz/checkout)
   LastLink payment processor integration

7. Payment Webhook (/api/webhook/lastlink)
   Purchase_Order_Confirmed event received
   → Token generated (crypto.randomBytes)
   → Saved to data/access-tokens.json
   → Email sent via Resend with magic link

8. Email Delivery
   User receives beautiful HTML email
   Contains magic link: /membros?token=xxx

9. Members Area (/membros)
   Token validated via /api/validate-token
   → If valid: Access granted to 8 audio sessions
   → If invalid/expired: Error message

10. Audio Sessions
    User listens to hypnotherapy sessions
    Progress tracked in localStorage
    Completion status saved per session
```

### State Management

**Client-Side (localStorage)**
- `quizAnswers`: Object with step numbers as keys (e.g., {"1": "26-35", "2": "health", ...})
- `userData`: Object with name and email (e.g., {"name": "Maria", "email": "maria@example.com"})
- `accessToken`: String token for members area access
- `completedSessions`: Array of completed audio session IDs (e.g., [1, 2, 3])

**Server-Side (data/access-tokens.json)**
```json
[
  {
    "token": "unique-token-string",
    "email": "user@example.com",
    "name": "User Name",
    "planType": "plan-1",
    "orderId": "lastlink-order-id",
    "customerId": "lastlink-customer-id",
    "subscriptionId": "lastlink-subscription-id",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "expiresAt": "2026-01-15T10:30:00.000Z",
    "isActive": true
  }
]
```

### Question Types

Configured in `lib/quizData.ts`:

- **choice**: Single selection with buttons (QuizChoice component)
- **multiple**: Multi-selection with checkboxes (QuizMultiple component)
- **range**: Slider input for numeric values (QuizRange component)
- **measurements**: Height/weight inputs (QuizMeasurements component)
- **info**: Informational/testimonial screens (QuizInfo component)

### API Routes

**GET /api/validate-token?token=xxx**
- Validates access token
- Returns: `{ valid: boolean, userData?: {...} }`
- Checks: token exists, isActive=true, not expired

**POST /api/webhook/lastlink**
- Receives LastLink payment events
- Handles: Purchase_Order_Confirmed, Subscription_Created, Subscription_Canceled
- Actions: Generate token, send email, update token status

## Key Features

### 21-Step Quiz Funnel
- Age selection
- Weight loss motivation
- Educational info screens
- Eating habits and cravings
- Physical activity level
- Goal setting and measurements
- Time commitment assessment
- Social proof testimonials

### Payment Integration (LastLink)
- Webhook-based integration
- Automatic token generation on purchase
- Subscription tracking
- Cancellation handling (auto-deactivate access)

### Email Automation (Resend)
- Beautiful HTML email templates
- Magic link delivery
- Welcome message with plan details
- 8-session overview
- Support information

### Token-Based Access Control
- Secure token generation (crypto.randomBytes)
- Expiration checking
- Active/inactive status
- One-year access by default

### Audio Player Features
- Play/pause controls
- Progress bar with seeking
- Volume control
- Playback speed adjustment (0.75x, 1x, 1.25x, 1.5x)
- Session completion tracking
- Responsive design

### UI/UX Patterns

- **SoulSync Color Palette**: Purple, lavender, rose, peach, cream tones
- **Gradient backgrounds**: Soft purple-to-peach gradients
- **Glass morphism**: Frosted glass overlays with backdrop blur
- **Smooth animations**: Fade-ins, scale transforms, progress animations
- **Mobile-first**: Responsive breakpoints at sm, md, lg
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## Styling Conventions

### Custom Tailwind Colors

```javascript
colors: {
  'soul-purple': '#5B4B8A',
  'soul-lavender': '#9B8BC4',
  'soul-rose': '#D4A5A5',
  'soul-peach': '#E8C4B8',
  'soul-cream': '#F5F3ED',
  'soul-sand': '#E8E4DC',
}
```

### Common Patterns

- Buttons: `rounded-full` with purple gradients
- Cards: `rounded-3xl` with white/cream backgrounds
- Shadows: `shadow-lg` and `shadow-xl` for depth
- Opacity: `bg-white/80` for glass effects
- Blur: `backdrop-blur-sm` for frosted glass

## Data Structures

### QuizQuestion Interface
```typescript
type QuestionType = "choice" | "multiple" | "range" | "measurements" | "info";

interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  subtitle?: string;
  description?: string;
  options?: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}
```

### Access Token Interface
```typescript
interface AccessToken {
  token: string;
  email: string;
  name: string;
  planType: string;
  orderId: string;
  customerId: string;
  subscriptionId: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}
```

## Environment Variables

Required in `.env.local`:

```bash
# Resend API for email sending
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

# Optional: Custom sender email (requires verified domain)
RESEND_FROM_EMAIL=onboarding@yourdomain.com

# Optional: LastLink webhook secret for verification
LASTLINK_WEBHOOK_SECRET=your-secret-key
```

## Customization Points

### Adding/Modifying Quiz Questions

Edit `lib/quizData.ts`:
- Add new questions to the array
- Update total question count in ProgressBar
- Ensure step numbers are sequential

### Adding Audio Sessions

1. Add MP3 file to `public/audios/` (e.g., `sessao-9.mp3`)
2. Update `app/membros/page.tsx` sessions array:
```typescript
{
  id: 9,
  title: "Nova Sessão",
  description: "Descrição da sessão",
  duration: "20 min",
  audioUrl: "/audios/sessao-9.mp3"
}
```

### Customizing Email Template

Edit `lib/email/sendAccessEmail.ts`:
- Modify HTML structure
- Update colors and branding
- Add/remove sections
- Customize sender name and subject

### Changing Plan Options

Edit result pages in `app/quiz/result/[1-5]/page.tsx`:
- Modify plan titles and descriptions
- Update pricing
- Change benefits list
- Customize CTA buttons

## Payment Integration (LastLink)

### Webhook Events Handled

1. **Purchase_Order_Confirmed**
   - Generates access token
   - Sends welcome email
   - Stores customer data

2. **Subscription_Created**
   - Links subscription to token
   - Updates token with subscriptionId

3. **Subscription_Canceled**
   - Sets isActive = false
   - Revokes access

### Testing Webhooks

Use `test-webhook.bat` or curl:
```bash
curl -X POST http://localhost:3000/api/webhook/lastlink \
  -H "Content-Type: application/json" \
  -d '{
    "event": "Purchase_Order_Confirmed",
    "order": {...},
    "customer": {...}
  }'
```

## Security Considerations

### Current Implementation (MVP)
- File-based token storage (JSON)
- localStorage for client data
- Simple token validation

### Production Recommendations
- Migrate to database (PostgreSQL, MongoDB)
- Add rate limiting on API routes
- Implement webhook signature verification
- Use HTTP-only cookies instead of localStorage for tokens
- Add CSRF protection
- Encrypt sensitive data at rest
- Implement proper session management
- Add logging and monitoring

## Performance Optimization

- Audio files should be optimized/compressed
- Consider CDN for audio delivery in production
- Implement lazy loading for result pages
- Add loading states for all async operations
- Consider service worker for offline audio access

## Browser Compatibility

Requires modern browsers with support for:
- ES2017+ JavaScript
- CSS Grid and Flexbox
- backdrop-filter (Safari needs -webkit prefix)
- HTML5 Audio API
- localStorage API
- Fetch API

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Port Already in Use
Run `npm run clean` or use `iniciar.bat` which auto-cleans.

### Dev Server Won't Start
Delete `.next` folder and run `npm run dev:clean`.

### Email Not Sending
- Verify RESEND_API_KEY in `.env.local`
- Check Resend dashboard for errors
- Ensure sender email is verified (or use default onboarding@resend.dev)

### Token Validation Failing
- Check `data/access-tokens.json` file exists
- Verify token is in the file
- Check isActive = true
- Verify expiresAt is in the future

### Audio Won't Play
- Verify MP3 file exists in `public/audios/`
- Check browser console for errors
- Ensure correct audioUrl path in sessions array
- Test with different browsers (codec support)

## Direct Response Marketing Elements

This funnel is optimized for conversion with:

- **Immediate engagement**: Quiz instead of traditional form
- **Progressive profiling**: One question at a time (21 steps)
- **Educational content**: Info screens build authority and trust
- **Personalization**: Results based on actual quiz answers
- **Social proof**: Testimonials throughout journey
- **Multiple price points**: 5 different plan options
- **Urgency**: Limited offer messaging
- **Clear CTAs**: Prominent action buttons
- **Email automation**: Instant access delivery
- **Low friction**: Magic link login (no passwords)
- **Value stacking**: 8 sessions included in all plans

## Future Enhancements

Consider adding:
- Database integration (replace JSON file storage)
- User dashboard (track progress, stats)
- Additional audio content (new sessions)
- Community features (forum, comments)
- Progress tracking (which day of program)
- Email reminders (daily session prompts)
- Analytics integration (conversion tracking)
- A/B testing framework
- Affiliate program
- Referral system
