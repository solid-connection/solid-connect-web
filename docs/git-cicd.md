# solid-connect-web Git, CI/CD 관련

## Git 커밋 메시지 규칙

Git 커밋 메시지는 다음과 같은 규칙을 따릅니다.

```plain text
<type>: <subject>
<body>
```

### Type

- feat : 새로운 기능 추가, 기존의 기능을 요구 사항에 맞추어 수정
- fix : 기능에 대한 버그 수정
- refactor : 기능의 변화가 아닌 코드 리팩터링 ex) 변수 이름 변경
- style : 코드 스타일, 포맷팅에 대한 수정
- test : 테스트 코드 추가/수정
- docs : 문서(주석) 수정
- chore : 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore

### Subject

Type 과 함께 헤더를 구성합니다.

### Body

헤더로 표현이 가능하다면 생략이 가능합니다. 아닌 경우에는 자세한 내용을 함께 적어 본문을 구성합니다.

## 버저닝

Line의 HeadVer을 사용하여 버저닝을 합니다.

[HeadVer - 기민한 프로덕트 팀을 위한 새로운 버저닝 시스템](https://techblog.lycorp.co.jp/ko/headver-new-versioning-system-for-product-teams)

빌드 버전은 빌드시 자동으로 증가합니다. 헤드 버전은 headver.json 파일에 정의되어 있으며, 배포 이후 수동으로 업데이트 해야합니다.

## CI/CD

GitHub Actions, Vercel를 사용하여 CI/CD를 관리합니다.

main 브랜치에 push가 되면 자동으로 CI가 진행되어 stage 환경에 배포됩니다.

Github Actions의 `Promote Main to Release Branches`를 가동시키면 선택한 release branch가 main으로 갱신되고, 각 Vercel Project의 production 환경에 배포됩니다.

- `release-web`: web production 배포
- `release-admin`: admin production 배포
- `release-university`: university-web production 배포

릴리즈 workflow의 target은 다음과 같이 사용합니다.

- `all`: web, admin, university-web 전체 릴리즈
- `both`: 기존 호환용 web + admin 릴리즈
- `web`: web만 릴리즈
- `admin`: admin만 릴리즈
- `university`: university-web만 릴리즈

기본값은 `both`입니다. university-web까지 함께 릴리즈하려면 `all` 또는 `university`를 명시적으로 선택합니다.
