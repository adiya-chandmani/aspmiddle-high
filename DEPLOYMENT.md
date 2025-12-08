# 배포 가이드

이 문서는 School Web Platform을 프로덕션 환경에 배포하는 방법을 안내합니다.

## 배포 전 체크리스트

### 1. 코드 준비
- [ ] 모든 변경사항 커밋 및 푸시 완료
- [ ] 빌드 테스트 통과 (`npm run build`)
- [ ] 린트 오류 해결 (`npm run lint`)

### 2. 환경 변수 준비
다음 환경 변수들이 준비되어 있어야 합니다:

#### Clerk 인증 (필수)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk 대시보드에서 발급
- `CLERK_SECRET_KEY` - Clerk 대시보드에서 발급
- `CLERK_WEBHOOK_SECRET` - Clerk Webhook 설정 후 발급

#### 데이터베이스 (필수)
- `DATABASE_URL` - PostgreSQL 연결 문자열
  - 형식: `postgresql://user:password@host:port/database?sslmode=require`

#### 선택사항
- `SCHOOL_EMAIL_DOMAINS` - 학교 이메일 도메인 (쉼표로 구분)
  - 예: `school.edu,example.edu`

## 배포 방법

### 방법 1: Vercel 배포 (권장)

Vercel은 Next.js 프로젝트에 최적화되어 있으며, 무료 플랜으로도 충분히 사용 가능합니다.

#### 1단계: Vercel 계정 생성
1. [Vercel](https://vercel.com)에 가입/로그인
2. GitHub 계정 연동 (권장)

#### 2단계: 프로젝트 Import
1. Vercel 대시보드에서 "Add New Project" 클릭
2. GitHub 저장소 선택 또는 직접 Import
3. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)
   - **Install Command**: `npm install` (기본값)

#### 3단계: 환경 변수 설정
Vercel 대시보드의 프로젝트 설정에서 "Environment Variables" 섹션으로 이동하여 다음 변수들을 추가:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
SCHOOL_EMAIL_DOMAINS=school.edu,example.edu
```

**중요**: 
- 프로덕션 환경에는 Clerk의 **Live 키**를 사용해야 합니다 (테스트 키가 아님)
- 모든 환경(Production, Preview, Development)에 동일한 변수 설정

#### 4단계: 데이터베이스 설정

##### 옵션 A: Vercel Postgres (권장)
1. Vercel 대시보드에서 프로젝트 선택
2. "Storage" 탭으로 이동
3. "Create Database" → "Postgres" 선택
4. 데이터베이스 생성 후 자동으로 `DATABASE_URL` 환경 변수가 설정됨
5. 로컬에서 마이그레이션 실행:
   ```bash
   # Vercel Postgres 연결 정보로 DATABASE_URL 설정
   export DATABASE_URL="postgresql://..."
   npm run db:push
   ```

##### 옵션 B: 외부 PostgreSQL 서비스
- [Supabase](https://supabase.com) (무료 플랜 제공)
- [Neon](https://neon.tech) (무료 플랜 제공)
- [Railway](https://railway.app) (무료 플랜 제공)
- [AWS RDS](https://aws.amazon.com/rds/) (유료)

외부 서비스를 사용하는 경우:
1. 데이터베이스 인스턴스 생성
2. 연결 문자열을 `DATABASE_URL` 환경 변수로 설정
3. 로컬에서 마이그레이션 실행:
   ```bash
   export DATABASE_URL="postgresql://..."
   npm run db:push
   ```

#### 5단계: Clerk Webhook 설정
1. Vercel 배포 완료 후 도메인 확인 (예: `your-project.vercel.app`)
2. [Clerk Dashboard](https://dashboard.clerk.com) 접속
3. "Webhooks" 메뉴로 이동
4. "Add Endpoint" 클릭
5. Endpoint URL 입력: `https://your-domain.com/api/webhooks/clerk`
6. Events 선택:
   - `user.created`
   - `user.updated`
   - `user.deleted`
7. Webhook Secret 복사하여 `CLERK_WEBHOOK_SECRET` 환경 변수에 추가
8. Vercel에서 환경 변수 업데이트 후 재배포

#### 6단계: 빌드 및 배포
1. Vercel이 자동으로 빌드 시작
2. 빌드 완료 후 배포 URL 확인
3. 사이트 접속하여 테스트

#### 7단계: 커스텀 도메인 설정 (선택사항)
1. Vercel 프로젝트 설정 → "Domains"
2. 도메인 추가 및 DNS 설정
3. SSL 인증서 자동 발급

---

### 방법 2: 다른 플랫폼 배포

#### Railway
1. [Railway](https://railway.app)에 가입
2. "New Project" → "Deploy from GitHub repo"
3. 환경 변수 설정
4. PostgreSQL 서비스 추가
5. 자동 배포

#### Netlify
1. [Netlify](https://netlify.com)에 가입
2. "Add new site" → "Import an existing project"
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. 환경 변수 설정
5. 외부 PostgreSQL 서비스 연결 필요

#### Docker 배포
```dockerfile
# Dockerfile 예시
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 배포 후 확인사항

### 필수 확인
- [ ] 홈페이지 접속 가능
- [ ] 로그인/회원가입 기능 작동
- [ ] 데이터베이스 연결 확인
- [ ] Clerk Webhook 작동 확인
- [ ] 관리자 대시보드 접근 가능
- [ ] 파일 업로드 기능 작동 (이미지 등)

### 기능 테스트
- [ ] 게시물 작성/수정/삭제
- [ ] 댓글 작성
- [ ] 좋아요 기능
- [ ] 신고 기능
- [ ] 관리자 조치 기능
- [ ] Q&A 시스템
- [ ] Student Community 접근 제어

### 성능 확인
- [ ] 페이지 로딩 속도 확인
- [ ] 이미지 최적화 확인
- [ ] API 응답 시간 확인

---

## 문제 해결

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 오류 확인 및 수정
npm run lint
```

### 데이터베이스 연결 오류
- `DATABASE_URL` 형식 확인
- SSL 모드 확인 (`?sslmode=require`)
- 방화벽 설정 확인
- 데이터베이스 서비스 상태 확인

### Clerk 인증 오류
- Live 키 사용 확인 (테스트 키 아님)
- Webhook 설정 확인
- 환경 변수 이름 확인 (대소문자 구분)

### 이미지 업로드 오류
- `public/uploads` 디렉토리 확인
- 파일 권한 확인
- Vercel의 경우 파일 시스템이 읽기 전용이므로, 외부 스토리지 사용 고려:
  - AWS S3
  - Cloudinary
  - Vercel Blob Storage

---

## 프로덕션 최적화

### 1. 이미지 최적화
현재는 로컬 파일 시스템을 사용하고 있지만, 프로덕션에서는 외부 스토리지 사용 권장:

```typescript
// 예: Cloudinary 사용
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

### 2. 환경 변수 보안
- 민감한 정보는 절대 코드에 하드코딩하지 않기
- 환경 변수는 Vercel 대시보드에서만 관리
- `.env` 파일은 `.gitignore`에 포함되어 있는지 확인

### 3. 모니터링 설정
- Vercel Analytics 활성화
- 에러 로깅 서비스 연동 (Sentry 등)
- 성능 모니터링 설정

### 4. 백업
- 데이터베이스 정기 백업 설정
- 중요 데이터는 별도 백업 저장

---

## 롤백 방법

Vercel에서 이전 배포로 롤백:
1. Vercel 대시보드 → 프로젝트 → "Deployments"
2. 이전 배포 버전 선택
3. "..." 메뉴 → "Promote to Production"

---

## 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Clerk 배포 가이드](https://clerk.com/docs/deployments/overview)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)

---

## 지원

배포 중 문제가 발생하면:
1. 로그 확인 (Vercel 대시보드 → Functions → Logs)
2. 환경 변수 재확인
3. 데이터베이스 연결 상태 확인
4. Clerk 대시보드에서 Webhook 이벤트 확인

