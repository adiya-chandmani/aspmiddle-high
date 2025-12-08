# 단계별 배포 가이드 (도메인 없이 시작)

도메인을 구매하지 않고도 Vercel의 무료 도메인으로 배포할 수 있습니다. 나중에 커스텀 도메인을 추가할 수 있습니다.

## 📋 배포 순서

### 1단계: Vercel에 배포 (테스트 키 사용)

#### 1-1. Vercel 계정 생성 및 프로젝트 Import
1. [Vercel](https://vercel.com)에 가입/로그인
2. GitHub 계정 연동
3. "Add New Project" 클릭
4. GitHub 저장소 `adiya-chandmani/aspmiddle-high` 선택
5. "Import" 클릭

#### 1-2. 프로젝트 설정
- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

#### 1-3. 환경 변수 설정 (테스트 키 사용)
Vercel 대시보드에서 "Environment Variables" 섹션으로 이동:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... (현재 테스트 키)
CLERK_SECRET_KEY=sk_test_... (현재 테스트 키)
DATABASE_URL=postgresql://... (프로덕션 DB)
SCHOOL_EMAIL_DOMAINS=school.edu,example.edu (선택사항)
```

**중요:** 
- 이 단계에서는 **테스트 키**를 사용합니다
- `CLERK_WEBHOOK_SECRET`은 아직 설정하지 않습니다 (다음 단계에서)

#### 1-4. 데이터베이스 설정

**옵션 A: Vercel Postgres 사용 (권장)**
1. Vercel 대시보드 → 프로젝트 → "Storage" 탭
2. "Create Database" → "Postgres" 선택
3. 데이터베이스 생성
4. 자동으로 `DATABASE_URL` 환경 변수가 설정됨

**옵션 B: 외부 PostgreSQL 서비스**
- [Supabase](https://supabase.com) - 무료 플랜
- [Neon](https://neon.tech) - 무료 플랜
- [Railway](https://railway.app) - 무료 플랜

연결 문자열 형식:
```
postgresql://user:password@host:port/database?sslmode=require
```

#### 1-5. 배포 실행
1. "Deploy" 버튼 클릭
2. 빌드 완료 대기 (약 2-3분)
3. 배포 완료 후 Vercel이 자동으로 도메인 제공:
   - 예: `your-project-name.vercel.app`
   - 또는: `your-project-name-username.vercel.app`

#### 1-6. 데이터베이스 마이그레이션
배포 완료 후 로컬에서 마이그레이션 실행:

```bash
# 프로덕션 DATABASE_URL로 설정
export DATABASE_URL="postgresql://..." # Vercel에서 제공한 연결 문자열

# 마이그레이션 실행
npm run db:push
```

---

### 2단계: Clerk Webhook 설정

배포가 완료되고 Vercel 도메인을 받은 후:

#### 2-1. Vercel 도메인 확인
배포 완료 후 Vercel 대시보드에서 도메인 확인:
- 예: `aspmiddle-high.vercel.app`
- 또는: `aspmiddle-high-adiya-chandmani.vercel.app`

#### 2-2. Clerk Dashboard에서 Webhook 설정
1. [Clerk Dashboard](https://dashboard.clerk.com) 접속
2. 애플리케이션 선택
3. 좌측 메뉴 → "Webhooks" 클릭
4. "Add Endpoint" 클릭
5. **Endpoint URL** 입력:
   ```
   https://your-project-name.vercel.app/api/webhooks/clerk
   ```
   (실제 Vercel 도메인으로 변경)
6. **Subscribe to events** 선택:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
7. "Create" 클릭
8. 생성된 Webhook의 **"Signing Secret"** 복사
   - 예: `whsec_xxxxxxxxxxxxxxxxxxxxx`

#### 2-3. Vercel에 Webhook Secret 추가
1. Vercel 대시보드 → 프로젝트 → "Settings" → "Environment Variables"
2. 새 환경 변수 추가:
   ```
   CLERK_WEBHOOK_SECRET=whsec_... (Clerk에서 복사한 값)
   ```
3. "Save" 클릭
4. 자동으로 재배포됨 (또는 수동으로 "Redeploy" 클릭)

---

### 3단계: 테스트 및 확인

#### 3-1. 기본 기능 테스트
1. Vercel 도메인으로 사이트 접속
2. 회원가입 테스트
3. 로그인 테스트
4. 데이터베이스 연결 확인

#### 3-2. Webhook 작동 확인
1. Clerk Dashboard → Webhooks → 최근 이벤트 확인
2. 회원가입/로그인 시 이벤트가 기록되는지 확인

---

### 4단계: Live 키로 전환 (나중에)

**⚠️ 중요:** 도메인을 구매하고 커스텀 도메인을 설정한 후에 Live 키로 전환하는 것을 권장합니다.

#### 4-1. 커스텀 도메인 추가 (선택사항)
1. Vercel 대시보드 → 프로젝트 → "Settings" → "Domains"
2. 원하는 도메인 입력 (예: `school.aspmiddle-high.edu`)
3. DNS 설정 안내에 따라 도메인 제공업체에서 설정
4. SSL 인증서 자동 발급 (약 1-2분 소요)

#### 4-2. Clerk Live 키 확인
1. Clerk Dashboard → API Keys
2. "Production" 또는 "Live" 키 확인
   - 없으면 Clerk 지원팀에 문의하거나 프로덕션 모드로 전환

#### 4-3. Live 키로 환경 변수 업데이트
1. Vercel 대시보드 → "Environment Variables"
2. 다음 변수들을 Live 키로 업데이트:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... (Live 키)
   CLERK_SECRET_KEY=sk_live_... (Live 키)
   ```
3. "Save" 클릭
4. 자동 재배포

#### 4-4. Webhook URL 업데이트 (커스텀 도메인 사용 시)
1. Clerk Dashboard → Webhooks
2. 기존 Webhook 편집 또는 새로 생성
3. Endpoint URL을 커스텀 도메인으로 변경:
   ```
   https://your-custom-domain.com/api/webhooks/clerk
   ```
4. 새로운 Signing Secret 복사
5. Vercel 환경 변수 업데이트

---

## 🎯 요약: 지금 해야 할 것

### 지금 바로 할 것:
1. ✅ Vercel에 프로젝트 Import
2. ✅ 테스트 키로 환경 변수 설정
3. ✅ 프로덕션 데이터베이스 설정
4. ✅ 배포 실행
5. ✅ Vercel 도메인 확인
6. ✅ Clerk Webhook 설정 (Vercel 도메인 사용)
7. ✅ 기본 기능 테스트

### 나중에 할 것:
- 🔄 커스텀 도메인 구매 및 설정
- 🔄 Live 키로 전환
- 🔄 Webhook URL 업데이트 (커스텀 도메인 사용 시)

---

## 💡 팁

### Vercel 무료 도메인 사용
- Vercel은 모든 프로젝트에 무료 도메인을 제공합니다
- 형식: `project-name.vercel.app`
- SSL 인증서 자동 포함
- 커스텀 도메인 없이도 프로덕션 사용 가능

### 테스트 키 vs Live 키
- **테스트 키**: 개발 및 초기 배포에 사용 가능
- **Live 키**: 실제 사용자 서비스에 권장 (하지만 필수는 아님)
- 테스트 키로도 프로덕션 배포 가능하지만, Live 키 사용 권장

### 도메인 구매 시기
- 지금 당장 필요하지 않음
- Vercel 무료 도메인으로 시작 가능
- 나중에 커스텀 도메인 추가 가능 (무료)

---

## ❓ 문제 해결

### Webhook이 작동하지 않는 경우
1. Vercel 도메인이 올바른지 확인
2. Webhook URL에 `https://` 포함 확인
3. Clerk Dashboard에서 Webhook 이벤트 확인
4. Vercel Functions 로그 확인

### 데이터베이스 연결 오류
1. `DATABASE_URL`에 SSL 모드 포함 확인 (`?sslmode=require`)
2. 데이터베이스 서비스 상태 확인
3. 방화벽 설정 확인

### 배포 실패
1. Vercel 빌드 로그 확인
2. 환경 변수 이름 확인 (대소문자 구분)
3. `npm run build` 로컬에서 성공하는지 확인

