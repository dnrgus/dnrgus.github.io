# dnrgus의 탐구 노트

GitHub Pages에 게시하는 2026 활동 아카이브입니다. T-blog와 공개 GitHub 저장소를 근거로 개발, CTF/Wargame, Bug Bounty, 블로그/기술문서, 논문/컨퍼런스, 공모전/자격증 활동을 정리했습니다.

## 게시 방식

- 저장소: `dnrgus/dnrgus.github.io`
- 주소: <https://dnrgus.github.io/>
- 게시 소스: `main` 브랜치의 `/(root)`
- 진입 파일: `index.html`

GitHub Pages는 저장소의 정적 HTML/CSS/JavaScript를 웹사이트로 게시합니다. `main`에 변경 사항을 커밋하면 Pages 배포 작업이 실행됩니다. 배포 결과는 저장소의 **Actions**에서 확인합니다.

## 글 추가하기

1. `posts/`에서 같은 카테고리의 기존 HTML 파일을 복사해 새 파일을 만듭니다.
2. 새 파일의 `title`, 소개 문장, `h1`, `h2`, `p` 내용을 교체합니다.
3. 아래 표에서 해당하는 `categories/*.html`을 열고 `archive-list` 안에 새 글 링크를 추가합니다.
4. 새 글을 메인에도 보여주고 싶으면 `index.html`의 `writing-list` 맨 위에 링크를 넣고, 목록이 너무 길어지지 않도록 오래된 항목은 메인에서만 제거합니다.
5. 링크, 모바일 화면, 이미지 대체 텍스트를 확인한 뒤 커밋합니다.

| 카테고리 | 전체 글 목록 파일 |
|---|---|
| 개발 | `categories/development.html` |
| CTF/Wargame | `categories/ctf-wargame.html` |
| Bug Bounty | `categories/bug-bounty.html` |
| 블로그/기술문서 | `categories/technical-writing.html` |
| 논문/컨퍼런스 | `categories/papers-conferences.html` |
| 공모전/자격증 | `categories/competitions-certifications.html` |

## 구성

- `index.html`: 소개, 여섯 활동 카테고리, 최근·대표 글 목록
- `categories/`: 카테고리별 전체 글 목록. 새 글을 작성하면 해당 목록에 링크를 추가합니다.
- `posts/`: 카테고리별 활동 회고 6편과 부족한 점·90일 보완 계획 1편
- `assets/site.css`: 반응형 디자인
- `assets/brachio-*.webp`: 사용자 제공 이미지를 웹용으로 변환한 파일

활동 내용은 2026년 11월 6일 공개 자료 기준입니다. 확인되지 않은 수상, 자격증 취득, 버그바운티 채택 실적은 성과로 적지 않았습니다. 보안 실습은 CTF/워게임 또는 명시적으로 승인된 범위에서만 진행합니다.
