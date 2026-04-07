# 🤝 기여 가이드 (CONTRIBUTING)

본 프로젝트의 안정적인 운영과 협업을 위해 아래 가이드를 준수해 주시기 바랍니다.

---

## 🛠 로컬 환경 설정

```bash
# 1. 원격 저장소 클론
git clone [repository_url]

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. Mock API 서버 실행 (터미널 분리)
npx json-server@0.17.4 db.json --port 3000
```

---

## 🛣 브랜치 전략 (Simplified Git Flow)

우리는 **Simplified Git Flow** 전략을 따릅니다.

1. **main:** 제품으로 배포되는 가장 안정적인 브랜치 (관리자만 직접 푸시 가능)
2. **develop:** 다음 배포를 위해 모든 기능이 합쳐지는 통합 브랜치
3. **feature/기능명:** 각 기능을 개발하는 단위 브랜치 (`feat/login`, `feat/history` 등)

### 작업 프로세스:
- **`develop`** 브랜치에서 **`feature/xxx`** 브랜치를 생성하여 작업합니다.
- 작업 완료 후 **`develop`** 브랜치로 **Pull Request(PR)**를 보냅니다.
- 코드 리뷰가 완료되면 **`develop`**에 머지합니다.

---

## 📝 코드 리뷰 규칙

- 모든 PR은 최소 1명 이상의 리뷰어 승인이 있어야 머지할 수 있습니다.
- 리뷰는 비판이 아닌 **성장**을 위한 제안이어야 합니다.
- 질문이나 이해가 되지 않는 코드는 적극적으로 코멘트를 남겨주세요.
