# 배포 시 환경 변수 체크리스트

현재 프로젝트에서 사용되는 환경 변수와 배포 시 수정해야 할 사항입니다.

## 필수 환경 변수

### 1. Clerk 인증 키 (⚠️ 중요: 테스트 키 → Live 키로 변경 필요)

#### 개발 환경 (현재)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

#### 프로덕션 환경 (배포 시 변경)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...  # ⚠️ Live 키로 변경
CLERK_SECRET_KEY=sk_live_...                    # ⚠️ Live 키로 변경
```

**변경 방법:**
1. [Clerk Dashboard](https://dashboard.clerk.com) 접속
2. 애플리케이션 선택
3. "API Keys" 메뉴에서 **Production** 키 확인
4. `pk_test_` → `pk_live_` (Publishable Key)
5. `sk_test_` → `sk_live_` (Secret Key)

---

### 2. Clerk Webhook Secret

```env
CLERK_WEBHOOK_SECRET=whsec_...
```

**배포 시 설정:**
1. Vercel 배포 완료 후 도메인 확인 (예: `your-project.vercel.app`)
2. Clerk Dashboard → Webhooks → "Add Endpoint"
3. Endpoint URL: `https://your-domain.com/api/webhooks/clerk`
4. Events 선택:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Webhook 생성 후 **Signing Secret** 복사하여 환경 변수에 추가

---

### 3. 데이터베이스 연결 문자열 (⚠️ 중요: 로컬 → 프로덕션 DB로 변경 필요)

#### 개발 환경 (현재)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/schoolweb"
# 또는 SQLite 사용 시
DATABASE_URL="file:./dev.db"
```

#### 프로덕션 환경 (배포 시 변경)
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

**변경 방법:**

**옵션 A: Vercel Postgres 사용 (권장)**
1. Vercel 대시보드 → 프로젝트 → "Storage" 탭
2. "Create Database" → "Postgres" 선택
3. 자동으로 `DATABASE_URL` 환경 변수 설정됨
4. SSL 모드가 자동으로 포함됨 (`?sslmode=require`)

**옵션 B: 외부 PostgreSQL 서비스**
- [Supabase](https://supabase.com) - 무료 플랜 제공
- [Neon](https://neon.tech) - 무료 플랜 제공
- [Railway](https://railway.app) - 무료 플랜 제공

연결 문자열 형식:
```
postgresql://user:password@host:port/database?sslmode=require
```

**⚠️ 중요:**
- 프로덕션 DB는 반드시 **SSL 연결** 필요 (`?sslmode=require`)
- 로컬 개발용 SQLite는 프로덕션에서 사용 불가

---

### 4. 학교 이메일 도메인 (선택사항, 권장)

```env
SCHOOL_EMAIL_DOMAINS=school.edu,example.edu
```

**설명:**
- 이 도메인을 가진 이메일은 `STUDENT` 역할 없이도 Student Community 접근 가능
- 쉼표로 여러 도메인 구분
- 설정하지 않으면 모든 로그인 사용자 허용 (개발 편의용)

**배포 시:**
- 실제 학교 이메일 도메인으로 설정 권장
- 예: `aspmiddle-high.edu`, `asp.edu`

---

## 자동 설정되는 환경 변수

다음 변수들은 배포 플랫폼에서 자동으로 설정되므로 수동 설정 불필요:

```env
NODE_ENV=production  # Vercel에서 자동 설정
```

---

## Vercel 배포 시 환경 변수 설정 방법

### 1. Vercel 대시보드에서 설정
1. 프로젝트 선택 → "Settings" → "Environment Variables"
2. 각 환경 변수 추가:
   - **Key**: 환경 변수 이름
   - **Value**: 값
   - **Environment**: Production, Preview, Development 모두 선택

### 2. 설정해야 할 환경 변수 목록

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...?sslmode=require
SCHOOL_EMAIL_DOMAINS=school.edu,example.edu
```

---

## 배포 전 체크리스트

- [ ] Clerk Live 키 준비 (`pk_live_`, `sk_live_`)
- [ ] 프로덕션 데이터베이스 준비 (PostgreSQL)
- [ ] `DATABASE_URL`에 SSL 모드 포함 확인 (`?sslmode=require`)
- [ ] Clerk Webhook 엔드포인트 URL 준비
- [ ] `SCHOOL_EMAIL_DOMAINS` 실제 도메인으로 설정
- [ ] Vercel에 모든 환경 변수 추가 완료
- [ ] 모든 환경(Production, Preview, Development)에 변수 설정 확인

---

## 배포 후 확인사항

- [ ] Clerk Webhook 설정 완료
- [ ] 데이터베이스 마이그레이션 실행 (`npm run db:push`)
- [ ] 로그인/회원가입 기능 테스트
- [ ] 데이터베이스 연결 확인
- [ ] Student Community 접근 제어 테스트

---

## 보안 주의사항

⚠️ **절대 하지 말아야 할 것:**
- ❌ `.env` 파일을 Git에 커밋하지 않기 (이미 `.gitignore`에 포함됨)
- ❌ 테스트 키를 프로덕션에 사용하지 않기
- ❌ 환경 변수를 코드에 하드코딩하지 않기
- ❌ 데이터베이스 비밀번호를 공개 저장소에 올리지 않기

✅ **해야 할 것:**
- ✅ Vercel 대시보드에서만 환경 변수 관리
- ✅ 프로덕션에는 Live 키만 사용
- ✅ 데이터베이스 연결에 SSL 사용
- ✅ 정기적으로 환경 변수 확인

---

## 문제 해결

### 환경 변수가 적용되지 않는 경우
1. Vercel 대시보드에서 환경 변수 재확인
2. 프로젝트 재배포
3. Vercel Functions 로그 확인

### Clerk 인증 오류
- Live 키 사용 확인
- Webhook 설정 확인
- 환경 변수 이름 확인 (대소문자 구분)

### 데이터베이스 연결 오류
- `DATABASE_URL` 형식 확인
- SSL 모드 포함 확인 (`?sslmode=require`)
- 방화벽 설정 확인
- 데이터베이스 서비스 상태 확인