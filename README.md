# dnrgus의 탐구 노트

GitHub Pages로 게시하는 활동 기록입니다. 개발, CTF/Wargame, Bug Bounty, 블로그/기술문서, 논문/컨퍼런스, 공모전/자격증 여섯 분야에서 **한 활동당 한 편의 글**을 작성합니다. 한 활동이 여러 분야에 해당할 때는 게시글을 복제하지 않고 각 카테고리에서 같은 글로 연결합니다.

## 게시 구조

- 주소: <https://dnrgus.github.io/>
- 진입점: `index.html`
- 개별 글: `posts/<slug>/index.html` → `/posts/<slug>/`
- 카테고리 목록: `categories/*.html`
- 공통 스타일: `assets/site.css`

기존 종합 글과 카테고리별 활동 보고서 주소는 새 목록으로 이동합니다. 이전 링크를 통해 들어온 독자가 글을 찾을 수 있도록 이동 페이지를 남겨 두었습니다.

## 글 추가

1. `posts/<slug>/index.html`을 만들고 `permalink: /posts/<slug>/`을 지정합니다.
2. `item_type: post`, `post_category`, `post_categories`, `category_label`, `post_date`를 적습니다. `post_categories`에는 글을 보여줄 모든 카테고리를 넣습니다.
3. 한 글에는 한 활동의 역할, 실제로 한 일, 확인한 결과와 근거 자료를 씁니다. 확인되지 않은 성과는 적지 않습니다.
4. 본문과 제목을 다시 읽고 링크, 모바일 화면, 이미지 대체 텍스트를 확인합니다.

```yaml
---
item_type: post
permalink: /posts/example/
title: "활동 제목"
post_category: development
post_categories:
  - development
  - competitions-certifications
category_label: 개발
post_date: 2026-11-07 10:00:00 +0900
---
```

`post_category`는 대표 분야이며 메인페이지의 최근 글에 표시됩니다. `post_categories`는 카테고리별 목록을 만드는 데 사용합니다. 메인페이지는 `item_type: post`인 글 중 최신 8편을 보여줍니다.

글의 사실관계는 공개 T-blog와 GitHub 저장소를 기준으로 확인했습니다. 수상, 자격증 취득, 버그바운티 채택처럼 공개 자료로 확인되지 않는 결과는 성과로 적지 않았습니다.
