# 개발 가이드라인

## 프로젝트 개요

### 목적
- Next.js 기반 학교 웹사이트 및 학생 커뮤니티 플랫폼
- 3단계 Phase로 점진적 개발: Phase 1(공개 웹사이트) → Phase 2(학생 커뮤니티) → Phase 3(관리자 대시보드)

### 기술 스택
- **프론트엔드**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **인증**: Clerk (무료 플랜, 10,000 MAU)
- **데이터베이스**: PostgreSQL 또는 MySQL (Prisma ORM 권장)
- **에디터**: Quill (react-quill, MIT) 또는 TinyMCE Community (GPLv2+)
- **배포**: Vercel 또는 자체 호스팅

### 핵심 기능
- 공개 웹사이트 (About, Admission, Student Life 등)
- 학생 전용 커뮤니티 (에브리타임 스타일)
- 관리자 대시보드 (신고 처리, 공지 관리)

---

## 프로젝트 아키텍처

### 디렉토리 구조
```
/
├── app/                    # Next.js App Router
│   ├── (public)/          # 공개 페이지 (Phase 1)
│   │   ├── about/
│   │   ├── admission/
│   │   ├── student-life/
│   │   └── ...
│   ├── community/         # 커뮤니티 (Phase 2)
│   │   ├── student/
│   │   ├── parents/
│   │   └── ...
│   ├── admin/             # 관리자 대시보드 (Phase 3)
│   ├── api/               # API 라우트
│   └── layout.tsx
├── components/            # 재사용 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── community/        # 커뮤니티 관련 컴포넌트
│   └── admin/            # 관리자 컴포넌트
├── lib/                  # 유틸리티 함수
│   ├── auth.ts          # Clerk 인증 관련
│   ├── db.ts            # DB 연결
│   └── utils.ts
├── prisma/               # Prisma 스키마 (또는 직접 DB 스키마)
│   └── schema.prisma
└── middleware.ts         # Next.js 미들웨어 (인증/접근 제어)
```

### 모듈 분리 원칙
- **페이지**: `app/` 디렉토리 내 라우트별 분리
- **컴포넌트**: 기능별로 `components/` 하위 디렉토리 분리
- **API**: `app/api/` 내 엔드포인트별 분리
- **유틸리티**: `lib/` 내 기능별 파일 분리

---

## 코딩 표준

### 네이밍 규칙
- **파일명**:
  - 컴포넌트: `PascalCase.tsx` (예: `PostCard.tsx`)
  - 페이지: `page.tsx`, `layout.tsx` (Next.js App Router 규칙)
  - 유틸리티: `kebab-case.ts` (예: `auth-utils.ts`)
- **변수/함수**: `camelCase` (예: `getUserRole`)
- **상수**: `UPPER_SNAKE_CASE` (예: `MAX_POST_LENGTH`)
- **타입/인터페이스**: `PascalCase` (예: `PostData`, `UserRole`)

### 코드 스타일
- **언어**: TypeScript 필수 사용
- **주석**: 한국어 주석 허용 (PRD가 한국어이므로)
- **포맷팅**: Prettier 사용 권장
- **에러 핸들링**: 모든 API 호출 및 DB 쿼리에 try-catch 필수

### 타입 정의
- 모든 함수 파라미터와 반환값에 타입 명시
- DB 모델은 Prisma 스키마에서 자동 생성된 타입 사용
- Clerk User ID는 `string` 타입으로 통일

---

## 기능 구현 표준

### 인증 및 접근 제어
- **Clerk 통합**:
  - `middleware.ts`에서 role 기반 접근 제어 구현
  - `/community/student` → `role === "student"`만 접근
  - `/community/parents` → `role === "parent"`만 접근
  - `/admin` → `role === "admin"` 또는 지정된 staff만 접근
- **DB 연동**:
  - `users` 테이블에 `clerk_user_id`와 `role` 저장
  - 모든 커뮤니티 글/댓글에 `author_clerk_user_id` 저장 필수

### 커뮤니티 기능
- **글쓰기**:
  - WYSIWYG 에디터 필수 사용 (Quill 또는 TinyMCE Community)
  - 이미지 업로드는 별도 API 엔드포인트 (`/api/upload`) 사용
  - 작성 옵션: 닉네임 또는 "익명으로 게시" 체크박스 제공
- **익명 게시물 처리**:
  - UI에는 "익명" 또는 닉네임만 표시
  - **DB에는 반드시 `author_clerk_user_id` 저장** (내부 추적 가능)
  - `/admin`에서만 실제 작성자 확인 가능
- **HOT 게시물**:
  - 좋아요 수 + 댓글 수 기반 자동 계산
  - 주기적으로 업데이트 (예: 1시간마다)
- **신고 기능**:
  - 모든 게시물/댓글에 "신고" 버튼 필수 포함
  - 신고 시 `/admin`으로 전달되어 관리자 검토

### 관리자 기능
- **신고 처리**:
  - 신고된 글 목록에서 작성자 내부 식별자(`clerk_user_id`, `role`) 노출
  - 조치 버튼: 숨김/삭제/경고/정지
  - 처리 로그 저장 필수
- **공지/캘린더 관리**:
  - 공지 작성 시 Student Life(공개)와 Community(내부) 양쪽에 자동 노출
  - 학사 일정 업데이트 시 양쪽 영역 동기화

---

## 외부 라이브러리 사용 표준

### 필수 라이브러리
- **Clerk**: 무료 플랜 사용 (10,000 MAU까지 무료)
  - Next.js용 prebuilt 컴포넌트 사용
  - `@clerk/nextjs` 패키지 사용
- **WYSIWYG 에디터**: 
  - **Quill** (`react-quill`): MIT 라이선스, 완전 무료, 우선 권장
  - **TinyMCE Community**: GPLv2+ 기반, 자체 호스팅 가능, 대안
  - CKEditor5 등 유료 라이선스 라이브러리 사용 금지

### 권장 라이브러리
- **Prisma**: DB ORM (타입 안정성)
- **Tailwind CSS**: 스타일링
- **Zod**: 런타임 타입 검증 (선택)

### 라이브러리 선택 원칙
- **무료/오픈소스 우선**: 모든 외부 라이브러리는 무료 또는 오픈소스만 사용
- **라이선스 확인 필수**: 상용 라이선스가 필요한 라이브러리 사용 금지
- **Next.js 호환성**: Next.js App Router와 호환되는 버전만 사용

---

## 워크플로우 표준

### Phase 개발 순서
1. **Phase 1 완료 후 Phase 2 시작**
2. **Phase 2 완료 후 Phase 3 시작**
3. **Phase 순서 무시하고 기능 추가 금지**

### 개발 워크플로우
1. **기능 추가 시**:
   - 해당 Phase가 완료되었는지 확인
   - 필요한 role 기반 접근 제어 추가
   - DB 스키마 변경 시 마이그레이션 파일 생성
2. **커뮤니티 기능 추가 시**:
   - 신고 기능 함께 구현
   - `/admin` 대시보드도 함께 업데이트
3. **공지사항 기능 추가 시**:
   - Student Life(공개)와 Community(내부) 양쪽 노출 로직 구현

### 데이터 흐름
```
사용자 요청
  ↓
middleware.ts (인증/role 체크)
  ↓
페이지/API 라우트
  ↓
DB 쿼리 (Prisma)
  ↓
응답 반환
```

---

## 주요 파일 상호작용 규칙

### DB 스키마 변경 시
- **동시 수정 필수**:
  - `prisma/schema.prisma` 수정
  - `prisma migrate dev` 실행하여 마이그레이션 파일 생성
  - 관련 TypeScript 타입 자동 업데이트 확인

### 커뮤니티 기능 추가 시
- **동시 수정 필수**:
  - `app/community/[category]/page.tsx` (페이지)
  - `components/community/` (컴포넌트)
  - `middleware.ts` (접근 제어)
  - `app/api/posts/` 또는 관련 API 라우트
  - `prisma/schema.prisma` (필요 시)

### 신고 기능 추가 시
- **동시 수정 필수**:
  - 게시물/댓글 컴포넌트에 신고 버튼 추가
  - `app/api/reports/` (신고 API)
  - `app/admin/reports/` (관리자 신고 처리 페이지)
  - `prisma/schema.prisma` (reports 테이블)

### 공지사항 작성 시
- **동시 업데이트 필수**:
  - `app/student-life/announcements/` (공개 영역)
  - `app/community/announcements/` (내부 영역)
  - 단일 소스에서 관리하되 양쪽에 노출되도록 구현

---

## AI 의사결정 기준

### 우선순위
1. **보안 관련 기능 최우선**: 인증, 접근 제어, 신고 처리
2. **Phase 순서 준수**: Phase 1 → Phase 2 → Phase 3
3. **PRD 문서 참조**: 모호한 경우 PRD 문서의 요구사항 우선 적용

### 의사결정 트리
```
기능 추가 요청
  ↓
해당 Phase가 완료되었는가?
  ├─ 아니오 → Phase 완료 후 진행
  └─ 예 → 다음 단계
      ↓
보안 관련 기능인가?
  ├─ 예 → 접근 제어 및 내부 추적 가능 여부 확인
  └─ 아니오 → 다음 단계
      ↓
커뮤니티 기능인가?
  ├─ 예 → 신고 기능 포함, 익명 게시물도 author_clerk_user_id 저장
  └─ 아니오 → 일반 기능 구현
```

### 모호한 상황 처리
- **PRD 문서 우선 참조**: 모든 모호한 요구사항은 PRD 문서 확인
- **보안 우선**: 보안과 편의성 충돌 시 보안 우선
- **확장성 고려**: Phase별 확장 가능한 구조로 설계

---

## 금지 사항

### 보안 관련
- ❌ **완전 익명 게시물 금지**: DB에 작성자 정보(`author_clerk_user_id`) 없이 저장 금지
- ❌ **관리자도 작성자 추적 불가능한 구조 금지**: `/admin`에서 작성자 확인 불가능한 구조 금지
- ❌ **접근 제어 미구현**: role 체크 없이 커뮤니티 페이지 접근 허용 금지
- ❌ **신고 기능 누락**: 게시물/댓글에 신고 버튼 없이 배포 금지

### 개발 프로세스
- ❌ **Phase 순서 무시**: Phase 2/3 기능을 Phase 1에 포함 금지
- ❌ **유료 라이브러리 사용**: 상용 라이선스가 필요한 라이브러리 사용 금지
- ❌ **에러 핸들링 누락**: try-catch 없이 API 호출/DB 쿼리 작성 금지

### 코드 품질
- ❌ **타입 안정성 무시**: `any` 타입 남용 금지
- ❌ **하드코딩**: 환경 변수로 관리해야 할 값 하드코딩 금지
- ❌ **중복 코드**: 재사용 가능한 로직은 컴포넌트/함수로 분리

---

## 참고 사항

### PRD 문서
- 모든 요구사항은 `School Web PRD.md` 파일 참조
- Phase별 상세 요구사항은 PRD의 "3. 릴리즈 단계" 섹션 확인

### 보안 정책
- 익명 게시물도 내부 추적 가능하도록 구현 (사이버불링 방지)
- 신고 처리 평균 시간 최소화 목표
- 심각한 위협(협박, 자해 유도 등)은 상담교사/학교 안전 프로토콜로 에스컬레이션 가능하도록 로그화

### 성능 목표
- 게시판 목록/상세 로드: 1~2초 이내
- 모바일 대응: 최소한 읽기/쓰기 가능 (반응형 UI 우선)

