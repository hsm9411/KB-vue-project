# 가계부 서비스 앱 (Household Account Book App)

본 프로젝트는 K-디지털 트레이닝 'IT's Your Life' 과정의 수강생들을 위한 **가계부 서비스 앱 스켈레톤 프로젝트**입니다. Vue 3 Composition API, Pinia, Vue-Router, 그리고 Axios를 활용하여 실제 작동하는 웹 애플리케이션을 구축하는 예제를 제공합니다.

---

## 1. 프로젝트 소개
- **기획 의도:** 수강생들이 Vue.js의 핵심 생태계를 이해하고, Mock API를 연동하여 CRUD(Create, Read, Update, Delete) 기능을 직접 구현해 보는 실습 예제입니다.
- **프로젝트 목표:** 직관적인 UI를 통해 수입/지출 내역을 관리하고, 자산 현황을 한눈에 파악할 수 있는 대시보드를 제공합니다.

---

## 2. 시작 가이드 (How to run)

### 필수 요구사항
- Node.js (v16 이상 권장)
- npm

### 설치 및 실행 순서

1. **의존성 패키지 설치**
   ```bash
   npm install
   ```

2. **백엔드 (json-server) 실행**
   ```bash
   npx json-server db.json --port 3000
   ```
   *주의: 백엔드 서버는 `http://localhost:3000`에서 구동됩니다.*

3. **프론트엔드 (Vite) 개발 서버 실행**
   ```bash
   npm run dev
   ```
   *기본 주소: `http://localhost:5173`*

---

## 3. 사용 기술 스택 (Tech Stack)

- **Frontend:** Vue 3 (Composition API), Vite, Vue-Router, Pinia, Axios
- **Styling:** Bootstrap 5, FontAwesome
- **Backend:** json-server (Mock API)

---

## 4. 프로젝트 디렉토리 구조 (Tree)

```text
src/
├── api/          # Axios 인스턴스 및 API 호출 모듈 (CRUD 로직)
├── components/   # 재사용 가능한 UI 컴포넌트
├── router/       # Vue-Router 설정 및 페이지 경로 정의
├── store/        # Pinia를 이용한 상태 관리 (데이터 중앙 집중화)
├── views/        # 페이지 단위의 컴포넌트 (Home, History, Form, Profile)
├── App.vue       # 메인 레이아웃 및 라우터 뷰 포함
└── main.js       # 앱 초기화 및 외부 라이브러리(Bootstrap, Pinia) 등록
```

---

## 5. 주요 기능 (Features)

1. **메인 대시보드 (Home.vue)**
   - 당월 총 수입/지출/순이익 요약 정보 제공
   - 최근 거래 내역 간략 보기 및 빠른 추가 버튼(FAB) 제공
2. **거래 내역 조회 (History.vue)**
   - 전체 거래 내역 리스트 출력
   - 수입/지출 유형별 필터링 기능
   - 각 내역의 수정 및 삭제 기능
3. **거래 등록 및 수정 (TransactionForm.vue)**
   - 수입/지출 구분, 날짜, 카테고리, 금액, 메모 입력 폼
   - 신규 데이터 저장 및 기존 데이터 수정(API 연동)
4. **설정 및 프로필 (Profile.vue)**
   - 사용자 이름 및 이메일 조회/수정 기능

---

## 6. 💡 학습 포인트 (What we learn)

- **Vue 3 Composition API (`<script setup>`):** 반응형 데이터(`ref`, `reactive`)와 생명주기 훅을 활용한 현대적인 컴포넌트 작성 방식.
- **Vue-Router를 활용한 페이지 이동:** 동적 라우팅과 네비게이션 가드를 통한 싱글 페이지 애플리케이션(SPA) 구축.
- **Pinia를 이용한 전역 상태 관리:** 여러 컴포넌트에서 공유해야 하는 데이터(로딩 상태, 공통 데이터 등)를 효율적으로 관리하는 방법.
- **Axios와 json-server 연동:** RESTful API의 기본인 GET, POST, PUT, DELETE 요청을 통한 비동기 데이터 처리 방식.
- **Bootstrap 5 활용:** 반응형 디자인과 유틸리티 클래스를 사용하여 빠르게 UI를 구성하는 기술.
