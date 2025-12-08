# 데이터베이스 설정 가이드

## 옵션 1: PostgreSQL 사용 (권장)

### macOS에서 PostgreSQL 설치

#### Homebrew를 사용하는 경우:
```bash
# PostgreSQL 설치
brew install postgresql@15

# PostgreSQL 서비스 시작
brew services start postgresql@15

# 또는 수동으로 시작
pg_ctl -D /usr/local/var/postgresql@15 start
```

#### PostgreSQL.app 사용:
1. [PostgreSQL.app](https://postgresapp.com/) 다운로드 및 설치
2. 앱 실행 (자동으로 서버 시작)

### 데이터베이스 생성

```bash
# PostgreSQL에 접속
psql postgres

# 데이터베이스 생성
CREATE DATABASE schoolweb;

# 사용자 생성 (선택사항)
CREATE USER schooluser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE schoolweb TO schooluser;

# 종료
\q
```

### .env 파일 설정

```env
DATABASE_URL="postgresql://schooluser:yourpassword@localhost:5432/schoolweb?schema=public"
```

또는 기본 postgres 사용자 사용:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/schoolweb?schema=public"
```

### Prisma 마이그레이션

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 적용
npm run db:push
```

---

## 옵션 2: SQLite 사용 (개발용, 간단함)

개발 환경에서 빠르게 시작하려면 SQLite를 사용할 수 있습니다.

### Prisma 스키마 변경

`prisma/schema.prisma` 파일을 열고:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### .env 파일 설정

```env
DATABASE_URL="file:./dev.db"
```

### Prisma 마이그레이션

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 적용
npm run db:push
```

---

## 문제 해결

### PostgreSQL 서버가 실행되지 않는 경우

**macOS:**
```bash
# 서비스 상태 확인
brew services list

# PostgreSQL 시작
brew services start postgresql@15
```

**Linux:**
```bash
# 서비스 상태 확인
sudo systemctl status postgresql

# PostgreSQL 시작
sudo systemctl start postgresql
```

### 연결 오류가 계속되는 경우

1. **포트 확인**: PostgreSQL이 5432 포트에서 실행 중인지 확인
   ```bash
   lsof -i :5432
   ```

2. **인증 설정 확인**: `pg_hba.conf` 파일에서 인증 방식 확인

3. **방화벽 확인**: 로컬 방화벽이 PostgreSQL 포트를 차단하지 않는지 확인

4. **임시로 SQLite 사용**: 개발 중에는 SQLite로 전환하여 계속 진행 가능

### 데이터베이스가 없는 경우

```bash
# PostgreSQL 접속
psql postgres

# 데이터베이스 생성
CREATE DATABASE schoolweb;

# 종료
\q
```

---

## 빠른 시작 (SQLite)

가장 빠르게 시작하려면:

1. `prisma/schema.prisma`에서 `provider = "sqlite"`로 변경
2. `.env`에 `DATABASE_URL="file:./dev.db"` 추가
3. `npm run db:push` 실행

이렇게 하면 별도의 데이터베이스 서버 없이 바로 시작할 수 있습니다.

