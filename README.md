# network-topology-web

network-topology-api를 통해 InfluxDB v3의 스캔 결과를 시각화하는 React(Vite) 프론트엔드.

- 서브넷별 카드 형태 토폴로지 뷰 (vendor 문자열 기반으로 대략적인 장비 아이콘 자동 매핑)
- 스캔 회차(날짜) 선택 드롭다운
- 최근 두 회차 비교(신규/사라진 장비) 탭

## 설치 및 실행

```bash
npm install
cp .env.example .env
# .env 의 VITE_API_BASE 를 network-topology-api 주소로 맞추기
npm run dev -- --host
```

## vendor → 아이콘 매핑

`src/vendorIcon.tsx`의 `KEYWORD_RULES`에서 vendor 문자열 키워드로 장비
유형(router/server/pc/mobile/iot/unknown)을 추정하고, lucide-react의 범용
아이콘을 붙인다. 실제 회사 로고(상표)는 쓰지 않음 — 특정 장비를 브랜드
느낌으로 표시하고 싶으면 이 매핑 규칙에 케이스를 추가하면 됨.

## 프로덕션 빌드

```bash
npm run build   # dist/ 생성
npm run preview # 로컬에서 빌드 결과 확인
```
