# solid-connect-web 컨벤션
솔리드커넥션 웹 프로젝트의 컨벤션을 정리한 문서입니다.

## 이름 컨벤션
- pages/ 에 정의하는 페이지 컴포넌트는 ~Page로 끝나야 합니다.

### 파일명
- 파일명은 기본적으로 kebab-case로 작성합니다.
- React Component 파일명은 PascalCase로 작성합니다.
  - 현재 React Component 파일명을 kebab-case에서 PascalCase로 변경하는 작업을 진행 중입니다.

## CSS
### CSS 속성 선언 순서
Tailwindcss의 속성은 린터에 의한 자동 정렬을 사용합니다.

### (Legacy)CSS 속성 선언 순서
1. **display** - 표시(관련속성:visibility)
2. **overflow** - 넘침
3. **float** - 흐름(관련속성:clear)
4. **position** - 위치(관련속성:top,right,bottom,left,z-index)
5. **width & height** - 크기
6. **margin & padding(그룹)** - 간격
7. **border(그룹)** - 테두리
8. **background(그룹)** - 배경
9. **font(그룹)** - 폰트(관련속성:colr,letter-spacing,text-align,text-decoration,text-indent,vertical-align,white-space 등)
10. **animation** - 동작(관련속성:animation,transform,transition,marquee 등)
11. **기타** - 위에 언급되지 않은 나머지 속성들로 폰트의 관련 속성 이후에 선언하며, 기타 속성 내의 선언 순서는 무관함.