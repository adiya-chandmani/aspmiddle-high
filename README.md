# School Web Platform

중고등학교 학생 전용 웹사이트 및 커뮤니티 플랫폼

## 기술 스택

- **프론트엔드**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **인증**: Clerk (최대 10,000 MAU 무료)
- **데이터베이스**: PostgreSQL (Prisma ORM)
- **에디터**: Quill (react-quill)
- **배포**: Vercel (권장)

## 주요 기능

### Phase 1: 공개 웹사이트 ✅
- About 페이지 (학교 소개, Mission & Values, 교사진)
- News 페이지 (뉴스 게시글 관리)
- Teachers 페이지 (교사 프로필 관리)
- Club 페이지 (동아리 정보 관리)
- Q&A 페이지 (질문 및 답변)

### Phase 2: 학생 커뮤니티 ✅
- Student Community (자유게시판, 고민상담, 공부·시험, 정보/팁)
- Q&A 시스템 (작성자와 관리자만 열람 가능)
- 댓글 및 좋아요 기능
- HOT 게시물 정렬
- 신고 기능 (게시물/댓글 신고)

### Phase 3: 관리자 대시보드 ✅
- 관리자 대시보드 (통계 및 최근 활동)
- 신고 관리 시스템
  - 신고 목록 및 상세 보기
  - 작성자 정보 확인 (Clerk User ID, Role)
  - 조치 기능 (숨김, 삭제, 경고, 계정 정지, 기각)
  - 조치 이력 로그
- News 관리 (Quill 에디터)
- Club Sections 관리 (Quill 에디터)
- User Roles 관리

## 프로젝트 구조

```
/
├── app/                    # Next.js App Router
│   ├── (middle-high)/     # 중고등학교 전용 페이지
│   │   ├── about/         # About 페이지
│   │   ├── news/          # News 페이지
│   │   ├── teachers/      # Teachers 페이지
│   │   ├── club/          # Club 페이지
│   │   └── qna/           # Q&A 페이지
│   ├── community/         # 커뮤니티 (Phase 2)
│   │   ├── student/       # Student Community
│   │   └── suggestion/    # Suggestion
│   ├── admin/             # 관리자 대시보드 (Phase 3)
│   │   ├── reports/       # 신고 관리
│   │   ├── news/          # News 관리
│   │   ├── clubs/         # Club 관리
│   │   └── users/         # User Roles 관리
│   └── api/               # API 라우트
├── components/            # 재사용 컴포넌트
│   ├── navigation/        # 네비게이션 컴포넌트
│   ├── layouts/          # 레이아웃 컴포넌트
│   ├── community/        # 커뮤니티 관련 컴포넌트
│   └── admin/            # 관리자 컴포넌트
├── lib/                  # 유틸리티 함수
│   ├── auth.ts          # 인증 관련 함수
│   ├── db.ts            # Prisma 클라이언트
│   └── utils/           # 유틸리티 함수
└── prisma/               # Prisma 스키마
    └── schema.prisma
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Clerk 인증
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# 데이터베이스
DATABASE_URL="postgresql://user:password@localhost:5432/schoolweb"

# 학교 이메일 도메인 (선택사항)
SCHOOL_EMAIL_DOMAINS=school.edu,example.edu
```

### 3. 데이터베이스 설정

PostgreSQL 데이터베이스를 생성하고 `.env` 파일의 `DATABASE_URL`을 설정한 후:

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 푸시
npm run db:push
```

### 4. Clerk 설정

1. [Clerk Dashboard](https://dashboard.clerk.com)에서 새 애플리케이션 생성
2. Webhook 엔드포인트 설정: `https://your-domain.com/api/webhooks/clerk`
3. 환경 변수에 Clerk 키 설정

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 사용자 역할

- **STUDENT**: 학생 (Student Community 접근 가능)
- **PARENT**: 학부모 (일부 콘텐츠만 접근)
- **STAFF**: 교직원 (Q&A 답변 가능)
- **TEACHER**: 선생님 (프로필 관리 가능)
- **ADMIN**: 관리자 (전체 관리 권한)
- **VISITOR**: 방문자 (보기만 가능, Student Community 접근 불가)

## 주요 기능 설명

### Q&A 시스템
- 모든 로그인 사용자가 질문 가능
- 작성자와 관리자만 질문 열람 가능
- 관리자는 질문에 답변 가능

### Student Community
- STUDENT 역할 또는 학교 이메일 소유자만 접근 가능
- 익명/닉네임 선택 가능
- 카테고리: 자유게시판, 고민상담, 공부·시험, 정보/팁
- HOT 게시물 정렬 (좋아요, 댓글, 시간 가중치 기반)

### 신고 시스템
- 모든 게시물/댓글에 신고 버튼
- 관리자는 신고된 내용 검토 및 조치 가능
- 조치 이력 자동 저장

### 관리자 대시보드
- 통계 정보 (뉴스, 클럽, 사용자, 대기 중인 신고)
- 최근 게시물 및 신고 목록
- 신고 관리 (상세 보기, 조치)
- News 및 Club 콘텐츠 관리 (Quill 에디터)
- 사용자 역할 관리

## 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행
- `npm run db:generate` - Prisma 클라이언트 생성
- `npm run db:push` - 데이터베이스 스키마 푸시
- `npm run db:migrate` - 데이터베이스 마이그레이션
- `npm run db:studio` - Prisma Studio 실행

## 보안 고려사항

- 익명 게시물도 DB에 작성자 Clerk User ID 저장 (관리자만 확인 가능)
- Student Community는 STUDENT 역할 또는 학교 이메일 소유자만 접근
- Q&A는 작성자와 관리자만 열람 가능
- 모든 API 엔드포인트에 적절한 권한 체크 적용
- 관리자 조치 이력 자동 로그 저장

## 배포

### Vercel 배포 (권장)

1. GitHub 저장소에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경 변수 설정
4. 자동 배포 완료

### 환경 변수 (프로덕션)

프로덕션 환경에서도 동일한 환경 변수를 설정해야 합니다.

## 참고 문서

- [PRD 문서](./School%20Web%20PRD.md)
- [개발 가이드라인](./shrimp-rules.md)

## 라이선스

이 프로젝트는 학교 내부 사용을 위한 것입니다.

