# Expo Pass

ระบบ Register / Login / User Management (List, Edit, Delete)
ต่อ API จริงจาก [reqres.in](https://reqres.in) (collection ส่วนตัว — ข้อมูล persist จริง)

## Tech Stack

| ส่วน         | เทคโนโลยี                                                               |
| ------------ | ----------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)                                      |
| Styling      | Tailwind CSS v4 + dark mode (next-themes)                               |
| Server state | TanStack React Query v5 (useQuery / useMutation / invalidateQueries)    |
| Client state | Zustand (persist เฉพาะข้อมูลแสดงผล)                                     |
| Auth         | JWT (jose) ผ่าน Next.js Route Handlers + httpOnly cookie + proxy.ts     |
| Validation   | validate ฝั่ง client (รหัสผ่าน ≥ 8 ตัว มีตัวอักษร/ตัวเลข/อักขระพิเศษ)   |
| Tooling      | ESLint + Prettier (+ prettier-plugin-tailwindcss) + husky + lint-staged |

## Getting Started

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ที่รากโปรเจกต์:

```bash
# API key จาก app.reqres.in (แบบ environment-scoped, prefix "pro_")
NEXT_PUBLIC_REQRES_API_KEY=your_reqres_api_key

# secret สำหรับเซ็น JWT — generate ด้วย: openssl rand -hex 32
JWT_SECRET=your_random_hex_secret
```

### 3. รัน dev server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

**บัญชีทดสอบ:** `george.bluth@reqres.in` / `password123`

### คำสั่งอื่นๆ

```bash
npm run build    # production build
npm run lint     # ตรวจ ESLint
npm run format   # จัด format ทั้งโปรเจกต์ด้วย Prettier
```

ตอน `git commit` husky จะรัน lint-staged (prettier) กับไฟล์ที่ staged ให้อัตโนมัติ

## โครงสร้างโปรเจกต์

```
app/
├─ (auth)/                # หน้า auth — ไม่มี navbar/footer
│  ├─ sign-in/            # /sign-in
│  └─ sign-up/            # /sign-up
├─ (main)/                # หน้าปกติ — มี navbar/footer
│  ├─ page.tsx            # / (hero)
│  └─ (private)/          # ทุกหน้าใน group นี้ต้อง login (ตรวจโดย proxy.ts)
│     └─ users/           # /users — ตาราง + Edit/Delete modal
├─ api/auth/              # Route handlers: sign-in, sign-up, sign-out
├─ error.tsx              # Error boundary
└─ not-found.tsx          # 404
components/               # Navbar, Footer, Logo, ThemeToggle, TextField, ฯลฯ
lib/
├─ api/                   # axios instance + auth service (ฝั่ง client)
└─ server/                # jwt sign/verify + reqres repo (ฝั่ง server เท่านั้น)
store/                    # zustand auth store
proxy.ts                  # ตรวจ JWT ก่อนเข้า route private (middleware เดิมของ Next 16)
```

## Authentication Flow

```
Browser ── POST /api/auth/sign-in ──→ Route Handler (server)
   │                                    ├─ ตรวจ email + password (SHA-256) กับ reqres
   │                                    ├─ เซ็น JWT { sub: userId } ด้วย JWT_SECRET (อายุ 1 วัน)
   │                                    └─ set httpOnly cookie (JS อ่านไม่ได้ กัน XSS)
   │
   └── เข้า /users ──→ proxy.ts ตรวจ signature ฝั่ง server ก่อน render
                        token ปลอม/หมดอายุ → redirect /sign-in
```

- Token ไม่เคยอยู่ใน localStorage — zustand เก็บเฉพาะข้อมูลแสดงผล (id, email, ชื่อ)
- Password เก็บเป็น SHA-256 hash ใน collection
- Cookie ตั้ง `sameSite: lax` กัน CSRF และ `secure: true` ใน production

## ข้อจำกัดที่ทราบ (Known Limitations)

สิ่งที่จำลอง/ลดทอนโดยตั้งใจ เพราะ reqres เป็น data store ไม่ใช่ backend เต็มรูปแบบ:

1. **Hash รหัสผ่านด้วย SHA-256 ไม่มี salt** — ระบบจริงควรใช้ bcrypt/argon2 ฝั่ง server
2. **API key เป็น `NEXT_PUBLIC_`** — หน้า users ยัง CRUD ตรงกับ reqres จาก browser
   ขั้นถัดไปคือย้าย CRUD เข้า route handlers ทั้งหมด (BFF) ให้ key เป็น server-only
3. **ไม่มี refresh token / token revocation** — JWT ใบเดียวอายุ 1 วัน
   บังคับ logout กลางอากาศไม่ได้ (ต้องมี session store/blacklist เพิ่ม)
4. **ตรวจ login โดยดึง records มา filter ฝั่งเรา** — เพราะ reqres ไม่มี query by field

## Deploy (Vercel)

1. Import repo ที่ [vercel.com/new](https://vercel.com/new) — Framework preset detect เป็น Next.js อัตโนมัติ
2. ตั้ง Environment Variables: `NEXT_PUBLIC_REQRES_API_KEY` และ `JWT_SECRET`
   (แนะนำ generate `JWT_SECRET` ตัวใหม่สำหรับ production)
3. Deploy — build settings ใช้ค่า default ได้เลย
