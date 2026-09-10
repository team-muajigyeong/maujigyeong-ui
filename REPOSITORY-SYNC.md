# UI 독립 저장소와 원격 설치 운영

## 현재 상태 — 2026-09-10

| 구분 | 상태 |
| --- | --- |
| 앱 저장소 | git@github.com:team-muajigyeong/muajigyeong.git |
| 앱 브랜치 | master, workspace-form, heogh, yoo를 같은 검증된 커밋으로 동기화 |
| 독립 UI 로컬 저장소 | C:/Users/qwqw3/Desktop/muajigyeong-ui |
| 독립 UI 기준 구현 | c311128: 패키지 이력 추출, ESM 및 Storybook 독립 구성 |
| 독립 UI 원격 | 미등록. 원격 URL 또는 생성할 소유자·이름·공개 여부 필요 |
| 현재 앱의 UI 설치 | packages/ui를 npm workspace로 연결 |
| npm 레지스트리 게시 | 미실행 |

독립 UI 저장소 준비는 끝났지만, 앱의 외부 패키지 소비 전환은 아직 완료되지 않았다.
앱 저장소를 clone하면 현재는 포함된 workspace 패키지를 사용한다.
독립 UI를 원격에서 바로 설치하려면 먼저 UI 저장소를 게시해야 한다.
원격 게시 전까지 기존 앱의 packages/ui와 Storybook을 유지해 설치·빌드를 보존한다.
분리 이후 공통 UI 변경은 독립 저장소에서 진행하고 앱 쪽 복사본을 병행 수정하지 않는다.

## 원격에서 설치하는 방법

npm은 Git URL과 커밋 SHA를 의존성으로 사용할 수 있으므로 npm 레지스트리
게시 없이도 독립 Git 저장소에서 패키지를 설치할 수 있다.
아래 OWNER, UI_REPO, FULL_COMMIT_SHA는 실제 값으로 바꿔야 하는 자리표시자다.

```bash
npm install --save-exact "git+ssh://git@github.com/OWNER/UI_REPO.git#FULL_COMMIT_SHA"
```

이 명령은 아래의 workspace 제거 단계를 마친 소비 앱에서 실행한다.
현재 workspace가 남은 앱에서 곧바로 실행하지 않는다.

독립 UI는 prepare 스크립트로 설치 시 ESM·타입 선언·CSS를 빌드한다.
Git 설치 시 npm이 빌드용 개발 의존성도 설치하므로, 빌드 스크립트 실행을 허용하는
환경과 해당 저장소의 읽기 권한이 필요하다. private 원격이라면 배포 CI에도 권한이 필요하다.
패키지는 React 19 및 CSS Modules를 지원하는 번들러를 사용한다.

나중에 레지스트리에 게시한 경우에는 버전으로 설치할 수 있다.
아래 명령은 실제 게시 후에만 사용한다.

```bash
npm install --save-exact @muajigyeong/ui@0.1.0
```

## 앱 전환 순서

1. UI 원격을 연결하고 master를 게시한다. 원격 조회로 커밋 존재를 확인한다.
2. 별도 임시 소비 프로젝트에서 원격 고정 커밋 설치와 빌드를 검증한다.
3. 앱의 packages/ui와 .storybook을 제거한다. 독립 UI 저장소가 구현과 예제를 소유한다.
4. 앱 package.json의 workspaces와 UI 빌드 전용 prepare/predev/prebuild,
   build:ui, storybook, build:docs, pack:ui 명령을 정리한다.
5. 앱 typecheck는 next typegen과 tsc만 실행하도록 바꾼다.
   앱에서 더 이상 쓰지 않는 Storybook·Vite 개발 의존성도 제거한다.
6. UI 의존성을 원격의 고정 커밋 또는 게시된 버전으로 교체하고 lockfile을 갱신한다.
7. 기존 @muajigyeong/ui import와 앱 전역 테마는 유지한다.
8. npm ci, 타입 검사, 앱 빌드와 실제 컴포넌트 상호작용을 검증하고 커밋한다.

## 업데이트와 동기화

UI: 소스·JSDoc·stories 수정 → 타입 검사·빌드·문서 검증 → 커밋·원격 게시.
앱: 새 UI 커밋/버전 선택 → 의존성과 lockfile 갱신 → 앱 검증 → 커밋·원격 게시.
UI를 푸시하는 것만으로 이미 배포된 앱이 자동 변경되지는 않는다.
앱과 UI는 서로 다른 Git 저장소이므로 커밋 해시를 같게 만들지 않는다.
각 저장소에서 로컬과 자기 원격을 동기화하고, 앱 의존성이 UI 버전을 지정한다.

앱 전체 브랜치 동기화는 사용자의 명시적 요청에 따라 이력을 보존하는
fast-forward와 atomic push를 사용한다. 원격에 분기된 고유 커밋이 있으면
먼저 통합·검증하고, 강제 푸시로 덮어쓰지 않는다.
등록되지 않은 fork 및 UI 원격에 대한 동기화 완료를 주장하지 않는다.

## 검증 범위

앱과 UI 소스는 이번 문서 정리에서 변경하지 않았다.
기존 타입·앱·문서·패키지·브라우저 검증 결과는 ui-package-plan.md에 기록되어 있다.
전체 테스트의 기존 server-only 모듈 누락 3건은 여전히 별도 해결 항목이다.
실제 UI 원격 설치 검증은 원격 주소가 제공된 뒤 수행한다.
로컬 Git URL과 고정 커밋 c311128을 사용하는 별도 임시 npm 소비 프로젝트에서
Git clone 기반 설치와 prepare 빌드, dist/index.js 생성을 확인했다.
이는 Git 패키지 설치 과정의 검증이며 GitHub 접근 권한이나 원격 게시 검증은 아니다.

공식 근거: https://docs.npmjs.com/cli/v11/commands/npm-install/
