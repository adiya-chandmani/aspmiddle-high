

---

# 0. 메타정보

- 문서명: [학교명] 웹사이트 & 커뮤니티 플랫폼 PRD (Product Requirements Document)
    
- 버전: v2 (2025-10-29)
    
- 오너: 학교 운영진 / 개발팀
    
- 독자: 교장/운영팀, 개발자(프론트/백엔드), IT 관리자, 상담교사
    

---

# 1. 배경 / 문제 정의

## 1.1 왜 이 웹사이트가 필요한가

학교는 외부 학부모/미래 학생에게 “우리는 어떤 교육 철학을 가지고 있고, 어떤 커리큘럼(STEM 포함)을 어떻게 가르치며, 어느 캠퍼스에서 어떤 선생님들이 가르치는가”를 한 번에 보여줘야 한다.  
실제 American STEM Prep(아메리칸 스템 프렙, 이하 ASP) 계열 사이트는 상단 메뉴에서 ABOUT / ADMISSION / ELEM / M.H / STEM / STUDENT LIFE / More 등을 제공하고, 그 안에 Mission & Value, Accreditation(공식 인가), Team Members(교사진), Contact Us(캠퍼스별 주소/전화/이메일) 같은 신뢰 콘텐츠를 배치해 학교의 정체성과 신뢰성을 바로 전달한다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙"))  
또한 Student Life 섹션에는 Academic Calendar, Announcements, Newsletter, Documents 등 학부모가 자주 묻는 실용정보를 한 곳에 정리해준다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙"))  
즉, 이 사이트는 단순 홍보가 아니라 “학사 정보 허브 + 입학 문의 접점” 역할을 동시에 한다.

## 1.2 왜 학생 커뮤니티(에브리타임 느낌)가 필요한가

학생들은 실제 생활 질문(행사 몇 시야? 내일 체육복? 버스 어디 타?), 시험/공부 정보, 분실물, 동아리 모집 같은 걸 서로에게 묻는다. 한국 대학생 전용 플랫폼 ‘에브리타임’은 학교 이메일/학교 인증을 통해 “같은 학교 학생만”이 접근 가능한 폐쇄형 커뮤니티를 제공하고, 익명/닉네임 기반 자유게시판·고민상담·시험정보 공유·동아리 홍보·분실물·강의평가·시간표 관리까지 학생 생활 정보가 전부 몰린다. ([경남도민일보](https://www.idomin.com/news/articleView.html?idxno=827193&utm_source=chatgpt.com "\"xx충\" 차별·혐오 표현 온상이 된 대학생 익명 커뮤니티"))  
결과적으로 에브리타임은 그 학교 학생들 일상에서 거의 필수 플랫폼처럼 취급된다. (국내 수백 개 캠퍼스에서 수백만 명의 학생이 사용 중이라고 보도되며, 사실상 ‘학교 내부 전용 인터넷’ 역할을 한다.) ([경남도민일보](https://www.idomin.com/news/articleView.html?idxno=827193&utm_source=chatgpt.com "\"xx충\" 차별·혐오 표현 온상이 된 대학생 익명 커뮤니티"))

우리 목표:

- 이 “학생들만의 질문/정보/잡담 흐름”을 학교 공식 플랫폼 안으로 끌어와 축적한다.
    
- 질문이 반복될수록 아카이브화돼서 검색으로 해결 가능하게 한다.
    
- 분실물/동아리/행사 등 교내 실생활 정보를 빠르게 순환시킨다.
    

## 1.3 리스크 (우리가 반드시 해결해야 하는 것)

에브리타임 모델은 장점만 있는 게 아니다.  
“완전 익명” 구조라서 특정 학생을 향한 사이버불링, 혐오 표현, 개인 정보 노출, 심한 악성 댓글 등이 쌓이고, 실제로 학생 정신건강을 위협하거나 극단적 선택까지 연결된 사건들이 사회적으로 문제 제기가 되어 왔다. 이런 혐오·집단 공격은 특히 10~20대 학생들 사이에서 반복적으로 지적됐고, 대학 사회에서도 ‘운영진과 학교가 방치하고 있다’는 비판이 있었다. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))

우리 쪽 커뮤니티는 이 문제를 초반부터 정책&기술로 막아야 한다:

- 게시물은 익명/닉네임으로 보이지만 내부적으로는 작성자-계정 매핑이 남아 운영진/상담교사가 확인 가능하게 함.
    
- 신고(Report) → 관리자 즉시 검토 → 문제 글 숨김/제재가 가능해야 함.
    

---

# 2. 제품 목표 (Goals)

1. **브랜딩 / 신뢰 확보**  
    외부 방문자(학부모, 예비학생)에게
    
    - 학교 사명/미션, 가치, 커리큘럼, 교사진, 인가(Accreditation), 캠퍼스 위치/연락처를 명확히 전달
        
    - ASP도 Cognia, MSA-CESS 등 미국/국제 인증기관 인가 사실과 CEEB Code를 전면에 내세워 신뢰도를 만든다. ([American Stem Prep](https://www.astemprep.org/%EB%B3%B5%EC%A0%9C-accreditation?utm_source=chatgpt.com "Accreditation"))
        
2. **입학 문의 전환(리드 확보)**
    
    - Admission 섹션에서 How to Apply(절차), Non-discrimination Policy(차별 금지/평등한 접근성 선언), Inquiry Form(상담 신청)을 구조화 → 학부모가 바로 상담 요청을 넣을 수 있게 한다. ASP 역시 “차별 없이 모든 학생에게 프로그램 접근 제공”과 “정보 넣으면 우리가 연락하겠다” 흐름을 제공한다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙"))
        
3. **학생 생활 지원**
    
    - 학생 전용 Community에서 자유게시판/HOT/분실물/동아리/행사 정보를 돌리고 축적해서, “같은 질문 무한 반복”을 줄인다.
        
    - 에브리타임식으로 같은 학교 학생끼리만 접근 가능한 폐쇄 커뮤니티 모델을 도입한다. ([경남도민일보](https://www.idomin.com/news/articleView.html?idxno=827193&utm_source=chatgpt.com "\"xx충\" 차별·혐오 표현 온상이 된 대학생 익명 커뮤니티"))
        
4. **안전한 커뮤니티 운영**
    
    - 악성 게시글/댓글을 신고하면 관리자가 즉시 확인하고 숨길 수 있는 운영 대시보드(/admin)를 제공한다.
        
    - 익명은 UI에서만 유지, 서버에는 실제 작성자-계정 매핑을 저장해서 사이버불링/혐오 표현에 빠르게 대응한다. 이는 기존 대학 커뮤니티에서 계속 지적된 “방치된 익명 폭력성” 문제를 줄이려는 핵심 장치다. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))
        

---

# 3. 릴리즈 단계 (Scope by Phase)

## Phase 1: 공개 웹사이트 (브랜딩 & 정보 중심)

**목표:** 누구나 볼 수 있는 공식 사이트. 학교 소개 + 입학 안내 + 학사 정보 허브.

포함 기능:

- 상단 내비게이션 (PC 기준)
    
    - ABOUT
        
    - ADMISSION
        
    - ELEMENTARY
        
    - MIDDLE & HIGH
        
    - STEM PROGRAM
        
    - STUDENT LIFE
        
    - COMMUNITY (소개/티저만)
        
    - MORE
        
    - LOG IN / PORTAL  
        (이 구조는 ASP의 글로벌/로컬 캠퍼스 사이트 상단 메뉴 형태를 참고했다. ABOUT / ADMISSION / ELEM / M.H / STEM / STUDENT LIFE / More 등이 이미 존재한다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙")))
        
- ABOUT
    
    - Welcome Message (교장/Director 인사말과 학교 비전. ASP 사이트는 Director of Academics의 환영 메시지를 통해 “교사·학부모·학생이 함께 성장하는 커뮤니티” 이미지를 강조한다. ([American Stem Prep](https://www.astemprep.org/welcome-message?utm_source=chatgpt.com "Welcome Message")))
        
    - Mission & Values (우리가 어떤 인재상을 키우는지: 영어 유창성, 비판적 사고, 다양한 코딩 언어를 통한 로봇/회로 제작 등 실전 STEM 역량을 갖춘 글로벌 학생이라는 식으로 ASP가 강조한다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙")))
        
    - Accreditation (Cognia, MSA-CESS 등 국제/미국 인증 현황과 확인 방법을 안내. 이는 학부모에게 “정식 교육기관이다”라는 강력한 신뢰 근거가 된다. ([American Stem Prep](https://www.astemprep.org/%EB%B3%B5%EC%A0%9C-accreditation?utm_source=chatgpt.com "Accreditation")))
        
    - Team / Faculty (교사진 사진, 담당과목, 역할. ASP도 Team Members 항목에서 교사진과 스태프를 소개한다. ([American Stem Prep](https://www.astemprep.org/team-members?utm_source=chatgpt.com "Team Members")))
        
    - Contact Us (캠퍼스별 주소, 전화, 이메일. ASP는 초등/중고 캠퍼스 전화·이메일·주소를 푸터와 Contact 정보에 명시적으로 노출한다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙")))
        
- ADMISSION
    
    - How to Apply (상담 → 테스트 → 서류 제출 → 합격 안내 등 단계형 플로우. ASP Admission 페이지는 상담 방문 → 영어/수학 테스트(MAP TEST) → 서류 제출 → 합격 통보 순으로 절차를 시각화한다. ([American Stem Prep](https://www.astemprep.org/admission?utm_source=chatgpt.com "ADMISSION")))
        
    - Non-Discrimination / Equal Access Policy (인종·성별·출신국 등과 무관하게 모든 학생에게 교육 기회를 제공한다는 메시지를 명문화. ASP는 이런 비차별 방침을 Admission 영역에서 강조한다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙")))
        
    - Inquiry Form (전화 없이 “상담 요청”만으로 리드 확보. ASP도 “정보를 입력하면 학교에서 연락하겠다”는 흐름을 제공한다. ([American Stem Prep](https://www.astemprep.org/admission?utm_source=chatgpt.com "ADMISSION")))
        
    - Tuition & Fees (가능하다면 공개 또는 문의 유도)
        
- ELEMENTARY / MIDDLE & HIGH
    
    - Academics (커리큘럼 소개. ASP 초등부 페이지는 “미국식 정규 커리큘럼 제공”, 핵심 수업 표준(Common Core, NGSS 등)과 일일 타임테이블(예: 8:30~16:30, 45분 수업 + 5분 쉬는 시간)을 안내한다. ([American Stem Prep](https://www.astemprep.org/elem-academics?utm_source=chatgpt.com "ELEM Academics")))
        
    - After-school / CCA(Elem) & ECA(M.H)
        
    - Campus Info (해당 부서 전화/메일/주소 명시. ASP도 초등/중고 캠퍼스별 전화번호와 이메일을 분리해 안내한다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙")))
        
- STEM PROGRAM
    
    - Why STEM? / Engineering / Robotics / Computer Science / Circuits / CAD & 3D Printing / Apple Certified etc.
        
    - USP(차별화 포인트): “학생이 실제 로봇을 프로그래밍하고, 간단한 전자 회로를 만들고, 다양한 코딩 언어로 스스로 문제를 해결하도록 교육한다”는 식의 메시지. ASP는 이런 실습형 STEM 교육을 학교의 핵심 가치이자 차별점으로 내세운다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙"))
        
- STUDENT LIFE
    
    - Academic Calendar
        
    - Announcements / Newsletter
        
    - Documents & Forms (결석계 등 각종 양식 다운로드)
        
    - Events (다가오는 일정. ASP 사이트도 “No events at the moment” 같은 이벤트 위젯/슬롯을 이미 가지고 있다.) ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙"))
        
- COMMUNITY (Phase 1에서는 소개만)
    
    - “학생 전용 커뮤니티는 로그인 후 이용 가능합니다”
        
    - Lost & Found 미리보기(일부 공개 가능 여부는 정책에 따라)
        
- MORE
    
    - Campus Network / ASE Network: 각 캠퍼스 위치와 주소, 전화 등. ASP는 Gwanggyo, Songdo, Daegu 등 여러 캠퍼스를 ASE Network라는 식으로 지도처럼 소개하고 주소와 연락처를 나열한다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙"))
        
    - Careers (채용 안내)
        
    - Media / Gallery / Press / Partnerships
        
- LOG IN / PORTAL
    
    - Student / Parent / Staff 포털 링크 (Phase 1에서는 실제 커뮤니티 로그인 기능까지는 안 붙여도 됨)
        

**Phase 1 종료 상태 =**  
학교 소개, 신뢰(Accreditation), 커리큘럼, 캠퍼스 연락처, 입학 절차/상담 폼, 학사 캘린더/공지/양식까지 외부에 공개.  
아직 학생 커뮤니티(글쓰기·댓글)는 비활성.

---

## Phase 2: 학생 커뮤니티 베타 (에브리타임 스타일)

**목표:** 인증된 내부 사용자(학생 등)만 접근 가능한 “커뮤니티 공간” 오픈.

추가/활성화 기능:

1. **인증/로그인(Clerk 도입)**
    
    - Clerk은 Next.js/React용으로 회원가입, 로그인, 프로필 관리 컴포넌트가 이미 준비돼 있고 바로 임베드 가능한 상용 인증 서비스다. ([Clerk](https://clerk.com/nextjs-authentication?utm_source=chatgpt.com "Next.js Authentication - Best Auth Middleware for your ..."))
        
    - Clerk의 무료 플랜은 최대 10,000 Monthly Active Users(MAU)와 일정 수의 조직(Org)까지 무료 제공이라, 학교 규모 초기에는 사실상 비용 없이 운영 가능하다고 공식 문서/가격 정책에 명시돼 있다. ([Clerk](https://clerk.com/pricing?utm_source=chatgpt.com "Pricing"))
        
    - 로그인 성공 시 Clerk가 돌려주는 유저 ID를 우리 DB의 user record와 연결하고, 그 record에 role(student / parent / staff / admin 등)을 저장한다.
        
    - 페이지 접근 제어는 role 기반으로 처리:
        
        - `/community/student` → role === "student" 만 접근
            
        - `/community/parents` → role === "parent" 만
            
        - `/admin` → role === "admin" 또는 지정된 staff만
            
    - 이 구조는 “학교 인증 학생만 커뮤니티 접근”이라는 에브리타임식 폐쇄 커뮤니티 모델(같은 학교 학생끼리만 접근 가능)과 동일한 보안/폐쇄성 효과를 준다. ([경남도민일보](https://www.idomin.com/news/articleView.html?idxno=827193&utm_source=chatgpt.com "\"xx충\" 차별·혐오 표현 온상이 된 대학생 익명 커뮤니티"))
        
2. **커뮤니티 섹션 실제 작동**  
    COMMUNITY 탭 내부 하위 메뉴:
    
    - School Announcements
        
        - 학교 공식 공지. 교사/운영진만 글쓰기, 학생/학부모는 읽기만 가능.
            
    - Student Community ← 핵심
        
        - 자유게시판 / 잡담
            
        - 고민상담(학교생활 스트레스, 진로 고민 등)
            
        - 공부·시험 정보 공유
            
        - 정보/팁(행사 일정, 교내 규정, 급식/매점/버스 정보 등)
            
        - HOT 게시물(좋아요+댓글 등 반응 많은 글 자동 노출)
            
            - 에브리타임도 “HOT 게시물 / 실시간 인기글”처럼, 같은 학교 학생들 사이에서 이슈가 되는 글을 묶어 보여주며 커뮤니티 체류율을 높인다. ([에브리타임](https://everytime.kr/?utm_source=chatgpt.com "에브리타임"))  
                기능 요구사항:
                
        - 글쓰기 (WYSIWYG 에디터)
            
        - 댓글 / 대댓글
            
        - 좋아요
            
        - @멘션 → 알림(상단 벨 아이콘 뱃지)
            
        - 검색(키워드/태그)  
            정책 요구사항:
            
        - 작성 시 “닉네임” 기본, “익명으로 올리기” 옵션 제공
            
        - 단, 서버(DB)에는 작성자 Clerk User ID를 항상 저장해서 내부 추적 가능
            
            - 이유: 에브리타임식 완전 익명은 사이버불링, 혐오 표현, 표적 공격이 심각하다는 지적이 계속 나왔다. 일부 사건은 실제로 극단적 선택과 법적 대응까지 이어졌고, “학교/운영진이 방치했다”는 비판도 있었다. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))
                
            - 우리는 “피해자 보호”와 “사건 대응”을 위해 내부 추적 가능성(= 책임성)을 명문화한다.
                
    - Q&A / Ask the School
        
        - 규정, 일정, 행정(예: 결석계 제출법, 교복 규정, 행사 시간 등) 질문을 등록
            
        - 교직원/운영진이 공식 답변
            
        - 누적된 Q&A는 검색 가능 → 반복 질문 감소
            
    - Lost & Found
        
        - 분실물 사진/습득 위치/시간 공유
            
        - 댓글로 “내 거 맞아요”“보건실에 맡겼어요” 같은 follow-up
            
        - 실제로 이런 분실물/습득 게시판은 학교 커뮤니티에서 굉장히 자주 쓰인다. ([byroe](https://byroe.tistory.com/entry/%EB%94%94%EC%9E%90%EC%9D%B8%EC%9E%85%EB%AC%B8-%EA%B0%9C%EC%9D%B8%EA%B3%BC%EC%A0%9C-%EB%AF%B8%EB%8B%88%EC%8B%A4%EC%8A%B5-%EC%97%90%EB%B8%8C%EB%A6%AC%ED%83%80%EC%9E%84-%EB%B8%94%EB%9D%BC%EC%9D%B8%EB%93%9C-%EC%95%B1-%EB%B6%84%EC%84%9D?utm_source=chatgpt.com "[디자인입문] 개인과제 미니실습 - 에브리타임, 블라인드 앱 분석"))
            
    - Clubs & Activities
        
        - 동아리 / 소모임 모집 공지
            
        - 행사 일정, 연습 시간, 대회 준비 등 알림
            
        - Student Community 우측 사이드바에 “지금 모집 중인 동아리”, “다가오는 행사” 카드로 노출 → 커뮤니티가 항상 ‘살아있다’는 느낌.
            
    - Parent Lounge (선택)
        
        - 학부모 전용 게시판. 학생은 접근 불가.
            
        - 학부모 간 정보 공유 / 질문 / 학교와의 소통.
            
    - Report / 신고센터
        
        - 모든 글/댓글에 “신고” 버튼
            
        - 신고 누적 시 자동 임시 숨김 가능
            
        - 관리자는 신고센터에서 사건별로 처리
            
3. **WYSIWYG 글쓰기 에디터 (무료)**
    
    - 에디터는 Quill(react-quill) 또는 TinyMCE Community Edition 중 하나를 사용한다.
        
    - Quill은 “완전 무료, 오픈소스, MIT 라이선스, 현대 웹을 위한 WYSIWYG 에디터”로 소개되며 React에서 `react-quill`로 바로 붙일 수 있는 컴포넌트가 존재한다. ([Quill](https://quilljs.com/?utm_source=chatgpt.com "Quill - Your powerful rich text editor"))
        
    - TinyMCE Community는 수년간 검증된 오픈소스 WYSIWYG이며, Core 에디터는 GPLv2+ 기반으로 무료 배포/자체 호스팅이 가능하고(핵심 편집 기능은 무료), 고급 플러그인만 유료인 구조다. TinyMCE는 self-host도 지원해 학교 서버에 그대로 올릴 수 있다. ([TinyMCE](https://www.tiny.cloud/get-tiny/self-hosted/?utm_source=chatgpt.com "Self Hosted WYSIWYG HTML Editor | Trusted Rich Text ..."))
        
    - 요구사항:
        
        - Bold / Italic / Underline / 리스트 / 링크 / 이미지 첨부 정도
            
        - 이미지 업로드는 우리 백엔드 API로 저장
            
        - 모바일에서도 최소한 작성/읽기 가능
            
    - CKEditor5 등은 상용 라이선스가 얽혀서(비공개 서비스에서 쓸 때는 라이선스 검토 필수, 유료 플랜 비싸다는 피드백 존재) 초기 MVP 단계에서는 제외한다. ([Reddit](https://www.reddit.com/r/reactjs/comments/14s4mmh/which_rich_text_editor_to_use/?utm_source=chatgpt.com "Which Rich Text Editor to use ? : r/reactjs"))
        
4. **알림 시스템**
    
    - 내 글에 댓글/멘션 생기면 상단 벨 아이콘에 badge
        
    - HOT 게시글 / 모집 중인 동아리 / 곧 있는 행사 등은 /community 메인 허브에서 카드로 노출
        

**Phase 2 종료 상태 =**

- 실제 로그인/역할(학생/학부모/교직원/관리자)로 접근 제어.
    
- 학생 전용 Student Community 가동 (에브리타임식 자유게시판/HOT/분실물/동아리/Q&A).
    
- 신고/알림/검색 기초 완성.
    
- 모든 글은 UI에서는 익명/닉네임, 내부 DB에서는 작성자 계정(Clerk User ID) 추적 가능 → 안전장치 확보. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))
    

---

## Phase 3: 운영 대시보드(/admin)

**목표:** 학교가 커뮤니티를 안전하게 “운영”할 수 있는 관리 화면.

포함 기능:

- 신고 관리
    
    - 신고 들어온 글/댓글 목록
        
    - 본문 내용 / 첨부 이미지 / 신고 사유 / 신고 횟수 표시
        
    - 해당 글의 내부 작성자(Clerk User ID, role 등) 확인 가능
        
    - 버튼: “임시 숨김”, “삭제”, “경고”, “계정 정지”
        
    - 사이버불링, 혐오 표현, 협박, 개인정보 유출 등 즉각 조치 가능
        
    - 이건 기존 대학 커뮤니티에서 방치된 사이버불링과 혐오 표현이 학생에게 실제 피해, 심지어 극단적 선택까지 이어졌다는 사례에서 배운 안전장치다. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))
        
- 공지 / 캘린더 관리
    
    - School Announcements 게시물 작성/수정/고정
        
    - 학사 캘린더/행사 일정 업데이트
        
    - 업데이트된 일정은 Student Life(공개 영역)와 Community 허브(내부 영역) 양쪽에 노출
        
- Admission 문의 관리
    
    - Phase 1의 Inquiry Form 제출 내역 열람/다운로드
        
    - 학부모 리드 관리(연락 예정자 정리 등)
        

**Phase 3 종료 상태 =**  
운영자는 /admin에서 위험한 글을 즉시 숨기고 작성자에게 조치를 취할 수 있다.  
학교 일정/공지/행사를 한 번만 올려도 Student Life(공개)와 Community(내부)에 동시에 보이게 된다.  
입학 문의(DB화된 리드)를 한 화면에서 관리할 수 있다.

---

# 4. 사용자/권한 모델

|역할|접근 가능 영역|글쓰기/댓글|관리 권한|
|---|---|---|---|
|비로그인 방문자|ABOUT / ADMISSION / STEM PROGRAM / STUDENT LIFE / MORE / COMMUNITY 소개 일부|불가|없음|
|학생 (student)|COMMUNITY 전체 중 Student Community, Lost & Found, Clubs 등|가능 (익명/닉)|신고 가능|
|학부모 (parent)|Parent Lounge(있을 경우), 공지/캘린더 열람|Parent Lounge에만|신고 가능|
|교사/스태프|Q&A 답변, School Announcements 게시|가능(공지/Q&A)|일부 신고 처리|
|관리자 (admin)|/admin 대시보드 전체, 신고 처리, 계정 제재, 공지/캘린더/행사 관리, Admission 문의 관리|전체 가능|전체|

권한 구현 방식:

- Clerk로 로그인하면 Clerk User ID를 받는다. Clerk는 Next.js/React용으로 사인인/사인업/프로필 관리 컴포넌트를 이미 제공하는 인증 서비스로, 최대 10,000 MAU까지 무료 플랜을 제공한다. ([Clerk](https://clerk.com/pricing?utm_source=chatgpt.com "Pricing"))
    
- 서버 DB의 `users` 테이블에 `clerk_user_id`와 `role`(student, parent, staff, admin 등)을 저장한다.
    
- 페이지 접근 전, role 체크.
    
- 커뮤니티 글/댓글 DB row에는 `author_clerk_user_id`를 저장한다.
    
    - UI에는 “익명” 또는 닉네임만 노출
        
    - /admin에서만 실제 작성자를 확인 가능
        
    - 이 구조는 익명 소통의 자유(에브리타임식 솔직함)와 학생 보호(사이버불링 대응)를 동시에 달성하려는 의도다. 기존 대학 익명 커뮤니티에서 사이버불링과 혐오 표현이 반복적으로 사회적 문제로 지적된 점을 반영한 설계다. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))
        

---

# 5. 기능 요구사항 (Functional Requirements)

## 5.1 Phase 1 (공개 웹사이트)

- 페이지 렌더링
    
    - Next.js 기반 SSR/SSG로 빠른 초기 로드 + SEO 확보
        
- 상단 내비게이션 / 푸터
    
    - 푸터는 캠퍼스별 주소/전화/이메일 공개 (ASP도 초/중고 캠퍼스 연락처를 명확히 푸터에 넣는다). ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙"))
        
- About / Mission & Values / Accreditation / Faculty / Contact
    
    - Accreditation에 Cognia, MSA-CESS 등 실제 인증 마크/코드/확인방법을 안내 (ASP는 Cognia Global Commission, MSA-CESS 코드 등 세부 내용을 페이지에 공개하고 ‘검색으로 확인하는 방법’을 상세하게 적는다). ([American Stem Prep](https://www.astemprep.org/%EB%B3%B5%EC%A0%9C-accreditation?utm_source=chatgpt.com "Accreditation"))
        
- Admission
    
    - How to Apply (단계별 플로우)
        
    - Non-Discrimination Policy
        
    - Inquiry Form (DB에 저장 또는 이메일 전송)
        
    - Tuition & Fees(선택)
        
- Student Life
    
    - Academic Calendar
        
    - Announcements / Newsletter
        
    - Documents & Forms 다운로드
        
    - Events
        
- More
    
    - Campus Network / ASE Network (각 캠퍼스 위치/주소/연락처) ([American Stem Prep](https://www.astemprep.org/american-stem-education?utm_source=chatgpt.com "American STEM Education"))
        
    - Careers, Media/Gallery, Press
        
- Community (티저)
    
    - “로그인 후 학생 커뮤니티 접근 가능” 문구와 몇 개의 최근 공지/분실물 썸네일(비공개 정보 아니면)
        

## 5.2 Phase 2 (커뮤니티 기능)

- Auth (Clerk)
    
    - 사인업 / 로그인 / 비밀번호 재설정 / 프로필 편집 화면은 Clerk 컴포넌트로 임베드
        
    - 로그인 후 role별 접근 제어
        
    - Clerk 무료 플랜은 10,000 MAU까지 무료로 제공되므로, 초기 운영에 추가 비용 없이 충분하다. ([Clerk](https://clerk.com/pricing?utm_source=chatgpt.com "Pricing"))
        
- Student Community
    
    - 글 목록: 최신 / HOT 탭
        
    - 글 상세: 본문 + 댓글/대댓글 + 좋아요 + 신고 버튼
        
    - 글쓰기: 무료 WYSIWYG 에디터(Quill 또는 TinyMCE Community)
        
        - Quill은 MIT 라이선스의 무료 오픈소스 WYSIWYG 에디터이고 React용 래퍼(react-quill)로 즉시 쓸 수 있다. ([Quill](https://quilljs.com/?utm_source=chatgpt.com "Quill - Your powerful rich text editor"))
            
        - TinyMCE Community는 GPLv2+ 기반으로 자체 호스팅 가능한 무료 Core 에디터를 제공하고, Bold/Italic/List 등 기본 편집 툴바는 바로 사용 가능하다. 고급 플러그인은 유료지만 MVP에선 필요 없다. ([TinyMCE](https://www.tiny.cloud/get-tiny/self-hosted/?utm_source=chatgpt.com "Self Hosted WYSIWYG HTML Editor | Trusted Rich Text ..."))
            
    - 작성 옵션: 닉네임 or “익명으로 게시” 체크박스
        
    - 서버 저장: `post_id`, `author_clerk_user_id`, `role`, `visibility_name(익명/닉)`, `content(html or delta)`, `images`
        
- Q&A / Ask the School
    
    - 질문 작성(학생/학부모) → 교직원/운영진 답변
        
    - 답변은 공개 FAQ로 축적, 검색 가능
        
- Lost & Found
    
    - 이미지 업로드(분실물 사진), 위치/시간, 상태 업데이트(“보건실에 보관 중” 등)
        
- Clubs & Activities
    
    - 동아리/소모임 모집 공지
        
    - “다가오는 행사” 카드 → Student Community 우측 사이드바에도 노출
        
- Parent Lounge (옵션)
    
    - parent role만 접근
        
- Report / 신고센터 (사용자 측면)
    
    - 각 글/댓글에 “신고” 버튼
        
    - 신고 제출 시 사유(required)와 함께 /admin으로 전달
        

## 5.3 Phase 3 (/admin)

- 신고 관리 화면
    
    - 신고된 글 목록(최신순/신고 많은 순 정렬)
        
    - 글/댓글 본문 미리보기
        
    - 작성자 내부 식별자(clerk_user_id, role) 노출
        
    - 조치 버튼: 숨김/삭제/경고/정지
        
    - 처리 로그 저장
        
- 공지 & 캘린더 관리
    
    - School Announcements 작성/수정/고정
        
    - 학사 일정/행사 관리 → Student Life(공개) + Community 허브(내부) 자동 노출
        
- Admission 문의 관리
    
    - Inquiry Form 응답 리스트/다운로드(CSV 등)
        

---

# 6. 비기능 요구사항 (Non-Functional Requirements)

1. **학생 보호 / 안전**
    
    - UI상 익명/닉네임 허용하지만, DB에는 작성자 Clerk User ID 저장 → 운영진은 /admin에서 누가 썼는지 확인 가능.
        
    - 악성 허위사실, 인신공격, 혐오 표현 등은 즉시 숨김/삭제/정지 가능.
        
    - 이건 대학 익명 커뮤니티(에브리타임)에서 반복적으로 문제가 된 사이버불링, 혐오 표현, 표적공격을 사전에 제어하려는 목적이다. 여러 사례에서 에브리타임 내 악성 댓글이 학생 정신건강에 심각한 영향을 주고 극단적 선택까지 이어졌다는 지적이 공식적으로 제기되었다. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))
        
2. **접근 제한**
    
    - Student Community는 인증된 student role만 접근 가능
        
    - Parent Lounge는 parent role만
        
    - /admin은 admin/staff만
        
    - 비로그인 사용자는 Community 본문 열람 불가 (티저만)
        
3. **성능 / 안정성**
    
    - 게시판 목록/상세 로드 1~2초 이내(일반 사양 PC/학교 Wi-Fi 가정)
        
    - Clerk SDK 기반 인증 흐름은 Next.js 미들웨어와 연동해 라우트 보호 (Clerk는 Next.js에서 간단한 미들웨어/Provider로 페이지 보호 가이드를 제공하고, 사인인/사인업 컴포넌트를 drop-in 형태로 쓸 수 있도록 문서화돼 있다). ([Clerk](https://clerk.com/nextjs-authentication?utm_source=chatgpt.com "Next.js Authentication - Best Auth Middleware for your ..."))
        
4. **확장성**
    
    - 추후 학년/반별 서브게시판, 동아리별 프라이빗 방, 학급 공지전용 보드 등 세분화 가능
        
    - 에브리타임 역시 학과/학번별 그룹, 동아리 모집/공모전 홍보 등 세부 커뮤니티를 쪼개 운영하는 패턴이 이미 존재한다. ([byroe](https://byroe.tistory.com/entry/%EB%94%94%EC%9E%90%EC%9D%B8%EC%9E%85%EB%AC%B8-%EA%B0%9C%EC%9D%B8%EA%B3%BC%EC%A0%9C-%EB%AF%B8%EB%8B%88%EC%8B%A4%EC%8A%B5-%EC%97%90%EB%B8%8C%EB%A6%AC%ED%83%80%EC%9E%84-%EB%B8%94%EB%9D%BC%EC%9D%B8%EB%93%9C-%EC%95%B1-%EB%B6%84%EC%84%9D?utm_source=chatgpt.com "[디자인입문] 개인과제 미니실습 - 에브리타임, 블라인드 앱 분석"))
        
    - 모바일 대응: 최소한 읽기/쓰기 가능해야 함 (반응형 UI 우선)
        
5. **데이터 보존 / 법적 대응**
    
    - 신고/제재 이력, 심각한 위협(자해 유도, 집단 따돌림 지시 등)은 상담교사/학교 안전 프로토콜로 에스컬레이션 할 수 있도록 로그화
        
    - 극단적 사례에서 법적/학내 징계가 필요할 수 있으므로, 일정 기간 데이터 보존 필요(정책 별도 수립)
        

---

# 7. 기술 스택 (권장안)

- **프론트엔드:**
    
    - Next.js (React 기반, 서버 렌더링/정적 빌드 가능)
        
    - Tailwind CSS 또는 자체 디자인 시스템
        
    - Clerk SDK (인증 UI/세션 관리) ([Clerk](https://clerk.com/nextjs-authentication?utm_source=chatgpt.com "Next.js Authentication - Best Auth Middleware for your ..."))
        
    - Quill(react-quill) 또는 TinyMCE Community(자체 호스팅) WYSIWYG 에디터
        
        - Quill: MIT 라이선스, 완전 무료, React에 바로 임베드 가능하며 JSON 기반 Delta 포맷 제공. ([Quill](https://quilljs.com/?utm_source=chatgpt.com "Quill - Your powerful rich text editor"))
            
        - TinyMCE Community: GPLv2+ 오픈소스 Core, 자체 호스팅 가능, Bold/Italic/List 등 기본 툴바 제공, 고급 플러그인은 유료. ([TinyMCE](https://www.tiny.cloud/get-tiny/self-hosted/?utm_source=chatgpt.com "Self Hosted WYSIWYG HTML Editor | Trusted Rich Text ..."))
            
- **백엔드:**
    
    - Next.js API routes 또는 Node.js/Express
        
    - DB: PostgreSQL 또는 MySQL
        
        - `users` (clerk_user_id, role 등)
            
        - `posts` (category, content, author_clerk_user_id, visibility_name, timestamps)
            
        - `comments`
            
        - `reports` (신고 내역)
            
        - `events` / `calendar_items`
            
        - `admission_inquiries`
            
    - 이미지 업로드 엔드포인트 (게시글/분실물 사진 등)
        
- **관리자 대시보드(/admin):**
    
    - role === "admin" 또는 지정 staff만 접근 가능한 보호 라우트
        
    - 신고 처리, 공지/캘린더 관리, Admission 문의 리스트 관리
        

---

# 8. 정책 / 커뮤니티 가이드라인 (UI에 항상 고정 공지)

Student Community 상단 고정 공지문(초안):

1. “이 게시판은 학교 인증된 학생만 이용할 수 있습니다. (무단 외부 열람 금지)”
    
    - 에브리타임도 특정 학교 학생 본인만 학교 커뮤니티에 접근 가능하도록 학교 인증을 요구한다. ([경남도민일보](https://www.idomin.com/news/articleView.html?idxno=827193&utm_source=chatgpt.com "\"xx충\" 차별·혐오 표현 온상이 된 대학생 익명 커뮤니티"))
        
2. “당신이 작성한 글은 화면에서는 익명/닉네임으로만 보입니다.  
    하지만 학교 안전을 위해 운영진은 필요 시 작성자를 확인할 수 있습니다.”
    
    - 기존 대학 커뮤니티에서 완전 무책임한 익명성은 사이버불링·혐오 표현을 키웠고, 심각한 정신적 피해와 극단적 선택까지 이어진 바 있다. 우리는 그런 상황을 막기 위해 안전장치를 둡니다. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))
        
3. “타인 실명/신상 공개, 협박, 따돌림 유도, 혐오 발언, 자해/자살 조장, 허위사실 유포는 즉시 삭제 또는 숨김 대상이며, 계정 제한이나 학교 차원의 후속 조치가 이루어질 수 있습니다.”
    
    - 일부 대학에서는 악성 댓글 게시자가 실제로 법정에 서거나 징계를 받은 사례가 있다. ([상명대학교](https://learning.smu.ac.kr/newspaper/university.do?article.offset=280&articleLimit=10&articleNo=713178&mode=view&utm_source=chatgpt.com "대학 게시판읽기(대학 내 사이버 불링, 처벌을 향해 높아지는 ..."))
        
4. “문제가 되는 글/댓글을 보면 즉시 신고(Report)하세요. 신고가 누적되면 우선 숨김 처리될 수 있습니다.”
    
    - 에브리타임 역시 신고 누적으로 게시물이 자동 삭제/숨김되는 시스템을 갖고 있다고 학생들이 증언하고 있다. ([상명대학교](https://learning.smu.ac.kr/newspaper/university.do?article.offset=280&articleLimit=10&articleNo=713178&mode=view&utm_source=chatgpt.com "대학 게시판읽기(대학 내 사이버 불링, 처벌을 향해 높아지는 ..."))
        
5. “심리적으로 위험하거나 긴급한 상황(협박, 자해, 따돌림 지시 등)은 상담교사 또는 학교 안전 프로토콜로 바로 전달될 수 있습니다.”
    

이 고정 공지는 단순 이용약관이 아니라 “우리는 방치하지 않는다”는 선언이다. 이는 대학가에서 반복적으로 나온 ‘운영진과 학교가 방치했다’는 비판(특히 에브리타임 관련)과 반대로 가는 방향이다. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))

---

# 9. KPI (성공 지표)

1. **입학 문의 전환**
    
    - Phase 1 오픈 후 Admission Inquiry Form 제출 수 (주/월 단위)
        
    - 상담 전화 없이 웹에서 바로 리드가 들어오는지
        
2. **학생 참여**
    
    - Phase 2 이후 Student Community 주간 신규 글 수 / 댓글 수
        
    - HOT에 올라간 글 수 (학생 관심사 순환 지표)
        
    - 에브리타임도 “실시간 인기글/HOT” 노출로 학생 참여가 유지된다고 분석된다. ([에브리타임](https://everytime.kr/?utm_source=chatgpt.com "에브리타임"))
        
3. **안전 지표**
    
    - 신고 후 평균 처리 시간
        
    - 신고 누적으로 임시 숨김된 글 비율
        
    - 재발(동일 작성자 반복 제재)의 감소 추세
        
    - 목표: “방치”가 아니라 “즉각 반응하는 관리”라는 신뢰를 학생/학부모에게 주는 것. 이건 기존 대학 커뮤니티에 대한 사회적 요구였다. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))
        

---

# 10. 다음 액션 (실행 순서)

1. **브랜딩/콘텐츠 수집 (Phase 1용)**
    
    - Mission & Values, Welcome Message(교장/Director 인사), Accreditation 상세(예: Cognia, MSA-CESS 코드와 확인법), 캠퍼스별 주소/전화/이메일
        
    - 커리큘럼/일일 스케줄(예: “08:30~16:30, 45분 수업 + 5분 쉬는 시간” 같이 ASP 초등부가 공개한 식의 구체적인 일과 예시). ([American Stem Prep](https://www.astemprep.org/elem-academics?utm_source=chatgpt.com "ELEM Academics"))
        
    - Admission 프로세스(상담→테스트→서류→합격 통보) 문안. ([American Stem Prep](https://www.astemprep.org/admission?utm_source=chatgpt.com "ADMISSION"))
        
2. **역할/권한 정책 확정**
    
    - student / parent / staff / admin 부여 기준
        
    - Parent Lounge 실제로 운영할지(부모도 내부 커뮤니티 허용인지) 결정
        
    - 교사가 Student Community 글을 읽을 수 있는지 여부(완전 학생만의 공간 vs 안전 모니터링 목적 최소 접근) 정책 확정
        
3. **기술 세팅(Phase 2 대비)**
    
    - Next.js + Clerk 기본 통합 (SignIn/SignUp/ProtectedRoute 테스트)
        
        - Clerk는 Next.js용 prebuilt SignIn/SignUp 컴포넌트와 route protection 가이드를 제공한다. ([Clerk](https://clerk.com/nextjs-authentication?utm_source=chatgpt.com "Next.js Authentication - Best Auth Middleware for your ..."))
            
    - DB 스키마 초안 (`users`, `posts`, `comments`, `reports`, `events`, `admission_inquiries`)
        
    - Quill(react-quill) 또는 TinyMCE Community 샘플 에디터 붙여서 글 작성/이미지 업로드 end-to-end 테스트
        
        - Quill은 MIT 무료 오픈소스, React에 바로 쓸 수 있고 Delta(JSON) 포맷 지원
            
        - TinyMCE Community는 GPLv2+ 기반의 셀프호스트 가능 코어 에디터로 Bold/Italic 등 바로 사용 가능하며, 고급 기능은 유료 플러그인 구조다. ([Quill](https://quilljs.com/?utm_source=chatgpt.com "Quill - Your powerful rich text editor"))
            
4. **/community/student PC 와이어프레임**
    
    - 좌측: 카테고리 (자유 / 고민상담 / 공부 / 정보 / HOT)
        
    - 중앙: 피드(최신 / HOT 탭), 글쓰기 버튼(에디터 모달)
        
    - 우측: “다가오는 행사”, “현재 모집 중인 동아리”, “최근 분실물 TOP3” 카드
        
    - 상단 우측: 알림(벨 아이콘), 프로필/로그아웃(Clerk UserButton)
        
5. **/admin 와이어프레임**
    
    - 신고 목록 테이블
        
    - 클릭 시 상세(본문, 이미지, 신고 사유, 작성자 내부 ID, 조치 버튼)
        
    - 공지/캘린더 관리 탭
        
    - Admission 문의 목록 탭
        

---

# 11. 한 줄 결론

- Phase 1:  
    외부 홍보/신뢰/입학문의 → ASP식 정보 구조(About, Accreditation, Admission Process, Student Life, Campus Network)를 베이스로 완성한다. ([American Stem Prep](https://www.astemprep.org/?utm_source=chatgpt.com "American Stem Prep.ㅣ아메리칸스템프렙"))
    
- Phase 2:  
    내부 학생 전용 커뮤니티를 연다.  
    Clerk(무료 10,000 MAU auth)로 학생 인증하고, Quill 또는 TinyMCE Community(무료 WYSIWYG)로 글쓰기/댓글/HOT/분실물/동아리/질문/신고를 돌린다. ([Quill](https://quilljs.com/?utm_source=chatgpt.com "Quill - Your powerful rich text editor"))
    
- Phase 3:  
    /admin으로 신고/제재/일정·공지 관리/입학 문의 관리까지 붙여서, 에브리타임식 자유로움은 살리되 방치 문제(사이버불링·혐오 표현)를 제도적으로 막는 “안전한 학교 공식 커뮤니티”를 완성한다. ([청주대학교평생교육원](https://edulife.cju.ac.kr/cjunews/selectBbsNttView.do?bbsNo=1399&nttNo=105928&pageIndex=111&pageUnit=10&utm_source=chatgpt.com "【사회】 혐오의 장이 된 에브리타임 - 익명이 불러온 비극"))
    

이게 최종 PRD야.