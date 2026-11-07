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
2. 파일 맨 위의 `title`, `post_category`, `category_label`, `post_date`를 새 글에 맞게 수정합니다.
3. 본문의 소개 문장, `h1`, `h2`, `p` 내용을 교체합니다.
4. 링크, 모바일 화면, 이미지 대체 텍스트를 확인한 뒤 커밋합니다.

같은 `post_category` 값을 가진 글은 해당 카테고리 페이지에 최신순으로 자동 표시됩니다. 기존 활동 보고서 6편의 내용은 `posts/activity-archive.html` 한 편에 모았습니다. 원래 주소는 유지하되 글 목록에서는 제외했습니다. 메인페이지에는 모든 카테고리를 합친 최신 글 7개만 자동 표시되므로, 글이 많아져도 메인페이지가 계속 길어지지 않습니다.

~~~yaml
---
item_type: post
title: "새 글 제목"
post_category: development
category_label: 개발
post_date: 2026-11-06 18:00:00 +0900
---
~~~

| 카테고리 | 전체 글 목록 파일 |
|---|---|
| 개발 | `categories/development.html` (기존 활동 글로 연결) |
| CTF/Wargame | `categories/ctf-wargame.html` (기존 활동 글로 연결) |
| Bug Bounty | `categories/bug-bounty.html` (기존 활동 글로 연결) |
| 블로그/기술문서 | `categories/technical-writing.html` |
| 논문/컨퍼런스 | `categories/papers-conferences.html` (기존 활동 글로 연결) |
| 공모전/자격증 | `categories/competitions-certifications.html` (기존 활동 글로 연결) |

## 구성

- `index.html`: 소개, 여섯 활동 카테고리, 최근·대표 글 목록
- `categories/`: `post_category` 값을 기준으로 생성되는 글 목록과 종합 활동 글의 분야별 바로가기
- `posts/`: 여섯 분야를 모은 종합 활동 글 1편, 기존 글 6편의 보관본, 그 밖의 글과 성장 계획
- `assets/site.css`: 반응형 디자인
- `assets/brachio-*.webp`: 사용자 제공 이미지를 웹용으로 변환한 파일

활동 내용은 2026년 11월 6일 공개 자료 기준입니다. 확인되지 않은 수상, 자격증 취득, 버그바운티 채택 실적은 성과로 적지 않았습니다. 보안 실습은 CTF/워게임 또는 명시적으로 승인된 범위에서만 진행합니다.
