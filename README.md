# dnrgus의 탐구 노트

GitHub Pages에 게시하는 정적 개인 블로그입니다.

## 게시 방식

- 저장소: `dnrgus/dnrgus.github.io`
- 주소: <https://dnrgus.github.io/>
- 게시 소스: `main` 브랜치의 `/(root)`
- 진입 파일: `index.html`

GitHub Pages는 저장소의 정적 HTML/CSS/JavaScript를 웹사이트로 게시합니다. `main`에 변경 사항을 커밋하면 Pages 배포 작업이 실행됩니다. 배포 결과는 저장소의 **Actions**에서 확인합니다.

## 글 추가하기

1. `posts/`에 새 HTML 파일을 만듭니다.
2. 기존 글의 헤더·본문·푸터 구조를 복사해 제목, 설명, 본문을 교체합니다.
3. `index.html`의 카테고리와 글 목록에 링크를 추가합니다.
4. 링크, 모바일 화면, 이미지 대체 텍스트를 확인한 뒤 커밋합니다.

## 구성

- `index.html`: 자기소개, 메뉴, 여섯 카테고리, 글 목록
- `posts/`: 각 카테고리의 시작 글
- `assets/site.css`: 반응형 디자인
- `assets/brachio-*.webp`: 사용자 제공 이미지를 웹용으로 변환한 파일

보안 실습은 CTF/워게임 또는 명시적으로 승인된 범위에서만 진행합니다. 공개 저장소에 비밀키나 개인정보를 넣지 않습니다.
