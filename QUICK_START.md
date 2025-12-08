# 빠른 시작 가이드

## 데이터베이스 설정 (필수)

### 방법 1: PostgreSQL 설치 (권장, 5분)

**macOS에서 Homebrew 사용:**

```bash
# 1. PostgreSQL 설치
brew install postgresql@15

# 2. PostgreSQL 서비스 시작
brew services start postgresql@15

# 3. 데이터베이스 생성
createdb schoolweb

# 4. .env 파일 수정 (이미 되어있음)
# DATABASE_URL="postgresql://$(whoami)@localhost:5432/schoolweb?schema=public"
```

**또는 PostgreSQL.app 사용:**
1. https://postgresapp.com/ 에서 다운로드
2. 앱 실행
3. 데이터베이스 생성: `createdb schoolweb`

### 방법 2: SQLite 사용 (빠른 시작, 2분)

개발 환경에서 빠르게 시작하려면:

1. `prisma/schema.prisma` 수정 필요 (enum을 String으로 변경)
2. `.env`에 `DATABASE_URL="file:./dev.db"` 설정

**주의**: SQLite는 enum을 지원하지 않아 스키마 수정이 필요합니다.

---

## 다음 단계

데이터베이스 설정 후:

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 적용
npm run db:push

# 개발 서버 시작
npm run dev
```

---

## 문제 해결

### PostgreSQL이 설치되지 않은 경우

**macOS:**
```bash
# Homebrew가 없으면 먼저 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# PostgreSQL 설치
brew install postgresql@15
brew services start postgresql@15
```

### 연결 오류가 계속되는 경우

1. PostgreSQL이 실행 중인지 확인:
   ```bash
   brew services list
   # 또는
   pg_isready
   ```

2. 데이터베이스가 생성되었는지 확인:
   ```bash
   psql -l
   ```

3. `.env` 파일의 `DATABASE_URL` 확인

