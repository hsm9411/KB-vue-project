# 📌 Git 커밋 컨벤션 가이드

본 프로젝트는 원활한 협업과 코드 이력 관리를 위해 **Conventional Commits** 표준을 따릅니다.

---

## 🏗 커밋 메시지 구조
```text
<type>(<scope>): <subject>

<body> (선택 사항)

<footer> (선택 사항)
```

---

## 🏷 Type 종류

| Type | 설명 | 예시 |
| :--- | :--- | :--- |
| **feat** | 새로운 기능 추가 | `feat(history): 거래 내역 필터 기능 추가` |
| **fix** | 버그 수정 | `fix(auth): 로그인 실패 시 로딩바 무한 루프 수정` |
| **refactor** | 코드 리팩토링 (기능 변화 없음) | `refactor(ui): BaseButton 공통 컴포넌트 적용` |
| **style** | 코드 포맷 변경 (세미콜론, 들여쓰기 등) | `style: lint 규칙에 맞춰 들여쓰기 수정` |
| **docs** | 문서 수정 (README 등) | `docs: 프로젝트 설치 가이드 업데이트` |
| **chore** | 빌드 업무, 패키지 매니저 설정 등 | `chore: axios 패키지 추가` |
| **test** | 테스트 코드 추가 및 수정 | `test(store): budgetStore 액션 테스트 추가` |

---

## 💡 작성 규칙
1. **Subject**: 명령문 형태로 작성하며, 마침표(.)를 찍지 않습니다. (예: 추가함 -> 추가)
2. **Body**: '무엇을', '왜' 변경했는지 상세히 적습니다.
3. **Footer**: 관련 이슈 번호가 있다면 명시합니다. (예: `Close #123`)
