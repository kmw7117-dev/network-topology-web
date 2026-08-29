# network-topology-web

🇰🇷 한국어 · [🇺🇸 English](README.en.md)

IP/ARP 스캔 기반 네트워크 토폴로지 시각화 웹 UI입니다. [network-topology-api](https://github.com/kmw7117-dev/network-topology-api)가 InfluxDB v3에 적재한 스캔 결과를 읽어와, 서브넷별 장비 목록과 L3 연결 구조(게이트웨이/브릿지)를 화면에 그려줍니다.

## 스크린샷

![토폴로지 뷰](screenshots/topology-view.png)

서브넷(10.10.10.0/24, 192.168.45.0/24)별로 장비를 그룹핑해서 보여주고, 각 카드에는 IP, 호스트명, 제조사(벤더) 정보가 표시됩니다.

## 주요 기능

- **토폴로지**: 서브넷별 장비 카드 뷰 (IP / 호스트명 / 벤더)
- **네트워크 지도**: `@xyflow/react` 기반 그래프 뷰 — 서브넷별 게이트웨이-스타 엣지 + 멀티홈 장비의 크로스 서브넷 브릿지 엣지 표시
- **변경 비교**: 스캔 시점 간 장비 변화(diff) 비교

## 기술 스택

- Frontend: Vite + React + TypeScript, `@xyflow/react`
- Backend: [network-topology-api](https://github.com/kmw7117-dev/network-topology-api) (Node.js/Express)
- Data source: InfluxDB v3

## 실행

```bash
npm install
npm run dev
```

백엔드(network-topology-api)가 먼저 실행되어 있어야 합니다.
