# 💰 가계부 서비스 앱 (Household Account Book App) - Phase 2 (Mobile-First)

본 프로젝트는 **K-디지털 트레이닝 'IT's Your Life'** 과정의 수강생들을 위해 제작된 **가계부 서비스 애플리케이션 스켈레톤 프로젝트**입니다.
Phase 2에서는 기존의 핵심 기능을 유지하면서, 실제 스마트폰 앱처럼 편안하게 사용할 수 있는 **모바일 중심(Mobile-First) 디자인 고도화**를 적용했습니다.

---

## 📸 미리보기 (Screenshots)

<details>
<summary><b>📱 클릭하여 모바일 디자인 확인하기</b></summary>
<br>

| 1. 홈 대시보드 | 2. 거래 내역 리스트 |
| :---: | :---: |
| <img src="./public/img/dashboard.png" width="300"> | <img src="./public/img/history.png" width="300"> |
| **3. 거래 등록/수정** | **4. 설정 및 프로필** |
| <img src="./public/img/transaction_form.png" width="300"> | <img src="./public/img/profile.png" width="300"> |

</details>

---

## 🚀 시작 가이드 (How to Run)

초보 개발자분들도 따라 할 수 있도록 순서대로 설명합니다.

### 1. 패키지 설치
```bash
npm install
```

### 2. 백엔드(Mock API) 서버 실행
```bash
npx json-server db.json --port 3000
```

### 3. 프론트엔드 개발 서버 실행
```bash
npm run dev
```

---

## 📂 프로젝트 구조 (Project Structure)

```text
src/
├── api/          # 📡 API 통신 (Axios)
├── store/        # 📦 상태 관리 (Pinia)
├── router/       # 🛣 페이지 경로 (Vue Router)
├── views/        # 🖥 주요 페이지 컴포넌트
│   ├── Home.vue            # 대시보드 (카드 UI)
│   ├── History.vue         # 내역 리스트 (리스트 타일 UI)
│   ├── TransactionForm.vue # 등록/수정 폼 (모바일 터치 친화적)
│   └── Profile.vue         # 프로필 설정
├── App.vue       # 🏠 모바일 레이아웃 래퍼 및 하단 네비게이션
└── main.js       # 🎬 앱 시작점
```

---

## 💡 학습 포인트 (What we learn)

본 Phase 2 프로젝트를 통해 수강생들이 배울 수 있는 핵심 디자인/UX 개념입니다.

### 1. Mobile-First & App-like Layout
- **Centering & Max-width:** PC 환경에서도 모바일 크기(`max-w-md`)를 유지하여 일관된 UX를 제공하는 기법.
- **Bottom Navigation Bar:** 모바일에서 한 손 조작을 가능케 하는 필수적인 네비게이션 패턴.
- **SafeArea:** 하단 탭바와 상단 상태표시줄을 고려한 컨텐츠 배치 방법.

### 2. 모던 UI 컴포넌트 디자인
- **Balance Card:** 그라데이션과 그림자(Shadow)를 활용하여 가장 중요한 정보(잔액)를 시각적으로 강조.
- **List Tile Pattern:** 단순 테이블 대신 아이콘, 텍스트(제목/설명), 데이터(금액)를 조합한 풍부한 리스트 구성.
- **Segmented Control:** 라디오 버튼 대신 직관적인 토글 버튼으로 수입/지출 선택 UI 개선.

### 3. UX(사용자 경험) 최적화
- **Touch Targets:** 버튼과 입력창의 크기를 최소 44px 이상으로 설정하여 오클릭 방지.
- **Visual Feedback:** 클릭 시 애니메이션(`scale`, `transition`)과 색상 대비를 통한 인터랙션 강화.
- **FAB (Floating Action Button):** 핵심 기능(추가하기)에 대한 접근성을 높이는 디자인.

### 4. Tailwind & Bootstrap의 활용
- 유틸리티 클래스 기반의 빠른 레이아웃 구성 및 반응형 설계.
- 모던한 폰트(Pretendard 등)와 아이콘(Bootstrap Icons)을 통한 심미성 향상.

---

### 👨‍🏫 멘토의 한마디
"기능이 완성되었다면, 이제 사용자의 입장에서 **'얼마나 편하게 쓸 수 있는가'**를 고민할 차례입니다. 모바일 중심의 디자인 리팩토링은 실제 서비스 출시를 위해 반드시 거쳐야 할 과정입니다."
