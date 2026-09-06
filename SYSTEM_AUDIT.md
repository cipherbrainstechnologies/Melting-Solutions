# SYSTEM_AUDIT.md — Melting Solution

**Audit date:** 2026-09-06  
**Auditor role:** Senior Full-Stack Engineer (production-first)  
**Repo:** `e:/Projects/melting-solution`  
**App type:** React Native (Expo SDK 44) B2B industrial marketplace (quote → order)

---

## Web / Railway hosting

- **Local prod:** `npm run build:web` then `npm run start:web` (port 3000 or `PORT`)
- **Railway:** connect repo; uses `Dockerfile` + `railway.toml`; health `/health`
- **Firebase:** add your Railway public domain under Auth → Authorized domains
- Details: `RAILWAY.md`


### Config files present
| File | Purpose |
|------|---------|
| `src/common/FirebaseConfig.js` | Firebase Web SDK config (committed client keys) |
| `google-services.json` / `android/app/google-services.json` | Android Firebase |
| `app.json` | Expo + Google Maps API key |
| `.env.example` | Placeholder env names (app currently reads hardcoded FirebaseConfig, not dotenv) |

**No `.env` loader is wired.** Runtime uses `FirebaseConfig.js` and `app.json` directly.

---

## Tech stack and major modules

| Layer | Tech |
|-------|------|
| UI | React Native 0.64.3, Expo ~44, Native Base 3.4.1 |
| Nav | React Navigation 4 (Switch / Stack / Tabs) |
| State | Redux + Thunk + FirebaseContext (`redux/index.js`) |
| Backend | Firebase Auth (email/password), Firestore, Storage |
| Maps | `react-native-maps` + Google Maps key in `app.json` |
| Push | Expo Notifications → `exp.host/--/api/v2/push/send` |
| Payments | **None** — manual transaction ID / cheque / credit fields only |

### Major modules
- Auth: Login / Register / ForgotPassword / AuthLoading / Profile
- Buyer: Home catalog, Search, Cart, Quote request, Orders, Chat
- Admin: Dashboard, Users, Products, Orders, Reports, Notification Broadcast
- Shared: OrderDetails lifecycle, ChatBoard, delivery address

---

## Required services / configuration

1. **Firebase Auth** — Email/Password provider enabled  
2. **Firestore** — collections: `Users`, `Products`, `Cart`, `Quotes`, `Orders`, `Chats`, `ChatList`, `Settings`  
3. **Firebase Storage** — product / profile / chat images  
4. **Google Maps API** — Maps SDK for Android (key in `app.json`)  
5. **Expo push** — physical device + notification permission  
6. **At least one Firestore user with `usertype: 'admin'`** — required for quote notifications and chat routing  

---

## Feature classification (evidence-based)

Legend: WORKING | PARTIALLY_WORKING | BROKEN | MOCKED_OR_FAKE | MISCONFIGURED | BLOCKED_EXTERNALLY | NOT_IMPLEMENTED

| Feature | Status | Evidence / notes |
|---------|--------|------------------|
| App bootstrap (fonts, Redux, Firebase init) | PARTIALLY_WORKING | Code path in `App.js` + `redux/index.js`; full device run blocked pending Expo CLI / device |
| Email login | PARTIALLY_WORKING | `emailPasswordSignIn` + Login navigate to AuthLoading; **fixed** Platform crash on device token path |
| Email register | PARTIALLY_WORKING | **Fixed** reducer `info`, navigation, race with Firestore write; needs live Firebase verify |
| Forgot password | PARTIALLY_WORKING | **Fixed** false-success UI; needs Firebase Email provider + SMTP |
| Role routing (user/admin) | WORKING (code) | `AuthLoadingScreen.js` routes by `usertype` + `profileStatus` |
| Product catalog browse | WORKING (code) | Firestore `fetchProducts` → Home / Search |
| Add to cart / cart list | PARTIALLY_WORKING | Real Firestore; **fixed** empty-cart hang |
| Submit quote | WORKING (code) | `cartactions.submitForQuote` with order id + admin notify |
| Quote / order lifecycle | WORKING (code) | `doQuoteSent` → accept/payment → processing → complete |
| “Online payment” | MOCKED_OR_FAKE | No Stripe/Razorpay; stores typed `transactionId` only |
| Chat (Firestore) | PARTIALLY_WORKING | Real messages in `ChatBoard.js`; push deep-link params fragile |
| Push notifications | PARTIALLY_WORKING | Expo HTTP API; **fixed** null-token skip |
| Admin Reports / Broadcast UI | PARTIALLY_WORKING | **Fixed** unreachable after drawer removal — linked from HomeAdmin |
| Maps / save address | PARTIALLY_WORKING | Map + Location APIs; **fixed** `selectSavedAddress` deleting addresses |
| Admin create Auth user | NOT_IMPLEMENTED | `AddUser` edits Firestore only; no `createUserWithEmailAndPassword` |
| Phone OTP / Verification | NOT_IMPLEMENTED | Migrated away; `Verification.js` dead |
| OrderManagement screen | MOCKED_OR_FAKE | Hardcoded mock UI; nav commented out |
| Automated tests / CI | NOT_IMPLEMENTED | No test script; no CI config in repo |
| i18n | NOT_IMPLEMENTED | English-only strings (acceptable for this app’s current scope) |

---

## Issues register

### A1 — Stale phone-auth imports crash module graph
- **Severity:** blocker  
- **Impact:** Metro / app fail to resolve `mobileSignIn` / `requestPhoneOtpDevice`  
- **Repro:** Import `redux/index.js` after phone→email migration  
- **Evidence:** `redux/index.js` imported symbols removed from `authactions.js`  
- **Root cause:** Incomplete migration cleanup  
- **Status:** **Fixed** — imports removed  
- **Verification:** Grep shows no `mobileSignIn` / `requestPhoneOtpDevice` in `redux/index.js`

### A2 — Missing `Platform` import in auth push-token helper
- **Severity:** blocker (physical Android/iOS)  
- **Impact:** `ReferenceError` during login/register/fetchUser after token fetch → auth appears broken  
- **Evidence:** `authactions.js` used `Platform.OS` outside try/catch without import  
- **Status:** **Fixed** — import + channel setup inside try/catch  
- **Verification:** Static review of `getPushNotificationsToken`

### A3 — Registration never set `auth.info` / no navigation
- **Severity:** blocker  
- **Impact:** User registers but stays on Register screen / incomplete profile stub race  
- **Evidence:** `EMAIL_REGISTER_SUCCESS` did not set `info`; Register had no navigate effect  
- **Status:** **Fixed** — reducer sets `info`; Register navigates to AuthLoading; Firestore write awaited; fetchUser retries before creating incomplete profile  
- **Verification:** Code path review (live Firebase E2E pending)

### A4 — `RootNavigator` import from missing export
- **Severity:** high (lint/bundle noise; unused)  
- **Status:** **Fixed** — removed from `AppNavigator.js`

### A5 — `OrderDetails` missing `Platform` import
- **Severity:** high  
- **Impact:** Crash when payment method sheet renders iOS/Android height styles  
- **Status:** **Fixed**

### A6 — Forgot password always showed success
- **Severity:** high  
- **Impact:** User told email sent even when Firebase fails  
- **Status:** **Fixed** — waits for `success: 'reset_sent'` / shows errors

### A7 — Admin Reports & NotificationBroadcast unreachable
- **Severity:** high  
- **Impact:** Features exist in stack but drawer removed → no UI entry  
- **Status:** **Fixed** — HomeAdmin cards navigate to Reports / NotificationBroadcast / Orders / etc.

### A8 — Empty cart never finishes loading
- **Severity:** medium  
- **Status:** **Fixed** — dispatch `[]` when docs length is 0

### A9 — `selectSavedAddress` deleted addresses via `arrayRemove`
- **Severity:** high (if called)  
- **Status:** **Fixed** — no-op local selection (Cart already selects in component state)

### A10 — Reports date filter used wrong reducer field
- **Severity:** medium  
- **Evidence:** `state.orderdata.toDate` instead of `state.reportsdata.toDate`  
- **Status:** **Fixed**

### A11 — Push sent with null tokens; NB forced every user `status: "active"`
- **Severity:** medium  
- **Status:** **Fixed** — token guard in `sendNotification` + broadcast; stop clobbering status

### A12 — Notification listener leak + bad ChatBoard deep link
- **Severity:** medium  
- **Status:** **Partially fixed** — cleanup added; chat push falls back to OrderDetails when params incomplete  
- **Needs:** Product decision on chat notification payload shape

### A13 — Duplicate broken `submitForQuote` in orderactions
- **Severity:** medium  
- **Status:** **Fixed** — delegates to cartactionsctions implementation

### A14 — Manual / fake online payment
- **Severity:** high (product/compliance)  
- **Impact:** “Accept & payment” only stores typed IDs; no charge verification  
- **Status:** **Needs product clarification** — documented as offline/manual verification  
- **Risk:** False “paid” state; finance disputes

### A15 — No payment gateway / secrets env wiring
- **Severity:** medium  
- **Status:** **Blocked externally / needs clarification** — `.env.example` added; app still uses hardcoded client config

### A16 — Firebase Email/Password + security rules unknown
- **Severity:** blocker for live E2E  
- **Status:** **BLOCKED_EXTERNALLY** — cannot verify without console access / test account

### A17 — Google Maps API key committed & Maps config module unused
- **Severity:** medium (security + possible Maps misconfig)  
- **Status:** **Needs clarification** — rotate keys if public; confirm Maps SDK billing enabled

### A18 — Admin cannot create Firebase Auth users from AddUser
- **Severity:** high  
- **Status:** **NOT_IMPLEMENTED** — needs Admin SDK / Cloud Function (client cannot safely create other users’ passwords)

### A19 — OrderManagement mock screen
- **Severity:** low  
- **Status:** MOCKED_OR_FAKE — left in place; not linked

### A20 — No tests / lint / typecheck scripts
- **Severity:** medium  
- **Status:** NOT_IMPLEMENTED — `npm install` succeeded; Expo start requires expo-cli (install attempted)

### A21 — Dev admin self-registration flag
- **Severity:** medium (security)  
- **Status:** **Fixed** — removed `isAdmin` toggle path; register always `usertype: 'user'`

### A22 — `LogBox.ignoreAllLogs(true)` hides runtime errors
- **Severity:** medium (ops)  
- **Status:** Open — not changed (would flood UI); recommend disabling in staging builds

---

## Working features confirmed (code-path evidence)

These have complete UI → Redux → Firebase write/read wiring in source (not mocked), but **live Firebase E2E was not executed** in this session due to missing device session + credential confirmation:

1. Email/password Auth action surface (`authactions.js`)  
2. Product list / detail / add-to-cart  
3. Quote request + admin quote send + status transitions  
4. Chat message persistence in Firestore  
5. Address save via `arrayUnion`  
6. Admin dashboard counts (`homeactions.js`)  

---

## Exact verification performed

| Check | Result |
|-------|--------|
| Read memory-bank + package.json + App entry + Firebase config | Done |
| Static audit of auth/cart/order/nav/admin | Done (incl. explore subagent) |
| `npm install --legacy-peer-deps` | **Passed** (1221 packages) |
| Grep: stale phone auth imports gone | **Passed** |
| Grep: `Platform` imported in authactions / OrderDetails | **Passed** |
| `expo-cli start` (Metro) | **Passed** — Metro started on `:19000` |
| `expo-cli export` (JS bundle compile) | **Passed** — “Export was successful” → `.tmp-web-export` |
| Firestore / Auth live calls | **Not completed** — needs your Firebase console confirmation |
| Lint / unit tests | **N/A** — no scripts configured |

---

## Input needed from you

See final report section — Firebase Email/Password enablement, test admin account, payment product decision, Maps key rotation.
