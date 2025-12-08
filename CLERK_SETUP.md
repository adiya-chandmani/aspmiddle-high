# Clerk 설정 가이드

## 1. Clerk 계정 생성

1. [Clerk 공식 웹사이트](https://clerk.com/)에 접속
2. "Sign Up" 또는 "Get Started" 클릭
3. 이메일 또는 GitHub 계정으로 회원가입

## 2. 애플리케이션 생성

1. Clerk 대시보드에 로그인
2. "Create Application" 또는 "New Application" 클릭
3. 애플리케이션 이름 입력 (예: "School Web Platform")
4. 인증 방법 선택:
   - Email (이메일)
   - Google (구글)
   - GitHub (깃허브)
   - 등 원하는 소셜 로그인 추가
5. "Create Application" 클릭

## 3. API 키 확인

1. 대시보드 왼쪽 메뉴에서 **"API Keys"** 클릭
2. 다음 키들을 복사:
   - **Publishable key** (공개 키)
   - **Secret key** (비밀 키)

## 4. Webhook 설정

1. 대시보드 왼쪽 메뉴에서 **"Webhooks"** 클릭
2. **"Add Endpoint"** 클릭
3. Endpoint URL 입력:
   ```
   https://your-domain.com/api/webhooks/clerk
   ```
   (로컬 개발 시: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk` 또는 나중에 배포 후 설정)
4. **"Subscribe to events"** 선택:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. **"Create"** 클릭
6. 생성된 Webhook의 **"Signing Secret"** 복사 (이것이 `CLERK_WEBHOOK_SECRET`)

## 5. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/schoolweb?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Webhook Secret (for Clerk webhooks)
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# 학교 이메일 도메인 (쉼표로 구분, 예: school.edu,example.edu)
# 이 도메인을 가진 이메일은 STUDENT role 없이도 커뮤니티에 접근 가능
SCHOOL_EMAIL_DOMAINS=school.edu,example.edu
```

**중요**: 
- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에서도 접근 가능합니다
- `CLERK_SECRET_KEY`와 `CLERK_WEBHOOK_SECRET`는 서버에서만 사용되므로 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다
- `SCHOOL_EMAIL_DOMAINS`: 학교 이메일 도메인을 쉼표로 구분하여 입력 (예: `school.edu,example.edu`)

## 6. 로컬 개발 시 Webhook 테스트 (선택사항)

로컬에서 webhook을 테스트하려면:

1. [ngrok](https://ngrok.com/) 설치 및 실행:
   ```bash
   ngrok http 3000
   ```
2. ngrok에서 제공하는 HTTPS URL을 복사
3. Clerk 대시보드의 Webhook 설정에서 Endpoint URL을 ngrok URL로 업데이트:
   ```
   https://xxxx-xxxx-xxxx.ngrok.io/api/webhooks/clerk
   ```

## 7. 확인 사항

설정이 완료되면:

1. `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
2. 개발 서버 재시작:
   ```bash
   npm run dev
   ```
3. 브라우저에서 `http://localhost:3000/sign-in` 접속하여 로그인 페이지 확인
4. 회원가입 테스트

## 8. 사용자 Role 설정

기본적으로 모든 사용자는 `STUDENT` role로 생성됩니다.

관리자가 사용자 role을 변경하려면:

1. Prisma Studio 실행:
   ```bash
   npm run db:studio
   ```
2. `users` 테이블에서 사용자 선택
3. `role` 필드를 `ADMIN`, `STAFF`, `PARENT`, `STUDENT` 중 하나로 변경

또는 직접 DB 쿼리:
```sql
UPDATE users SET role = 'ADMIN' WHERE clerk_user_id = 'user_xxxxx';
```

## 문제 해결

### 로그인 페이지가 표시되지 않는 경우
- `.env` 파일의 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 확인
- 개발 서버 재시작

### Webhook이 작동하지 않는 경우
- `CLERK_WEBHOOK_SECRET` 확인
- Webhook URL이 올바른지 확인
- 로컬 개발 시 ngrok 사용 또는 배포 후 설정

### 사용자가 DB에 생성되지 않는 경우
- Webhook 설정 확인
- `CLERK_WEBHOOK_SECRET` 확인
- 서버 로그 확인

