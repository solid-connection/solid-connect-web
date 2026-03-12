# 🏗️ Clean FSD & CQRS 아키텍처 가이드 (v1.0)

## 1. 핵심 철학 (Core Philosophy)

우리는 **Clean FSD (Feature-Sliced Design)**를 기반으로, **CQRS (Read/Write 분리)** 패턴과 **Next.js App Router**의 장점을 결합한 아키텍처를 따릅니다.

- **Lego Architecture:** 하위 레이어(Entities, Features)는 독립적인 레고 블록이며, 상위 레이어(Widgets, Pages)는 이를 조립하는 역할을 합니다.
- **Server First:** 읽기(Read) 동작은 **RSC(Server Component)**를 통해 최적화하고, 쓰기(Write) 동작은 **Client Component**로 상호작용을 처리합니다.
- **Separation of Concerns:** 프레임워크 설정(`app`)과 비즈니스 화면 구현(`pages`)을 철저히 분리합니다.

---

## 2. 디렉토리 구조 (Directory Structure)

### 2.1. 전체 트리 (Overview)

```
src/
├── app/                  # [Framework Layer] 라우팅, 메타데이터, 레이아웃 (Shell)
├── pages/                # [Page Layer] 실제 페이지 화면 조립 (Implementation)
├── widgets/              # [Composition Layer] Feature와 Entity를 결합한 독립 블록
├── features/             # [Write Layer] 사용자 행동, 뮤테이션 (Verbs)
├── entities/             # [Read Layer] 도메인 데이터, 조회 (Nouns)
└── shared/               # [Generic Layer] 도메인을 모르는 순수 공통 로직
```

### 2.2. 레이어별 상세 역할

| 레이어 | 역할 | 성격 | 주요 포함 내용 | 참조 가능 범위 |
|--------|------|------|----------------|----------------|
| App | 라우팅 (Shell) | Framework | page.tsx, layout.tsx, Metadata | pages 이하 전체 |
| Pages | 화면 조립 | Business | 페이지 단위 UI 조합 | widgets 이하 전체 |
| Widgets | 블록 조립 | Composition | Header, PostDetail, Sidebar | features, entities, shared |
| Features | 쓰기 (Write) | Action (CUD) | 로그인 폼, 좋아요 버튼, useMutation | entities, shared |
| Entities | 읽기 (Read) | Data (R) | 유저 프로필 뷰, fetchUser, Type | shared |
| Shared | 공통 | Generic | Button, Axios, Utils | 불가 (최하위) |

---

## 3. CQRS 패턴 적용

### 3.1. Read (Entity)

데이터 조회와 표시를 담당합니다.

```typescript
// entities/post/api/getPost.ts
export const getPost = async (id: string) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

// entities/post/ui/PostContent.tsx
export const PostContent = ({ post }: { post: Post }) => {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
};
```

### 3.2. Write (Feature)

사용자 행동과 데이터 변경을 담당합니다.

```typescript
// features/post-interaction/api/likePost.ts
export const likePost = async (postId: string) => {
  await api.post(`/posts/${postId}/like`);
};

// features/post-interaction/ui/LikeButton.tsx
"use client";

export const LikeButton = ({ postId }: { postId: string }) => {
  const { mutate } = useMutation({ mutationFn: likePost });
  
  return (
    <button onClick={() => mutate(postId)}>
      좋아요
    </button>
  );
};
```

### 3.3. Composition (Widget)

Entity와 Feature를 조합하여 독립적인 블록을 만듭니다.

```typescript
// widgets/PostViewer/index.tsx
import { PostContent } from "@/entities/post/ui/PostContent";
import { LikeButton } from "@/features/post-interaction/ui/LikeButton";

export const PostViewer = async ({ postId }: { postId: string }) => {
  const post = await getPost(postId); // Server Component
  
  return (
    <div>
      <PostContent post={post} />
      <LikeButton postId={postId} />
    </div>
  );
};
```

---

## 4. 레이어 간 의존성 규칙

### 4.1. 허용되는 참조 (Allowed)

```
App → Pages → Widgets → Features → Entities → Shared
                     ↘                    ↗
                       → Entities → Shared
```

### 4.2. 금지되는 참조 (Forbidden)

- ❌ Entities → Features (읽기에서 쓰기 참조 금지)
- ❌ Features → Features (Feature 간 참조 금지)
- ❌ Entities → Entities (Entity 간 참조 금지)
- ❌ 하위 레이어 → 상위 레이어 (역방향 참조 금지)

### 4.3. 예외 처리

만약 Feature에서 다른 Feature의 로직이 필요하다면:
- 해당 로직을 **Shared**로 추출하거나
- 상위 레이어(**Widgets** 또는 **Pages**)에서 조합합니다.

---

## 5. 구현 가이드 (Implementation Guide)

### 5.1. App vs Pages 분리 패턴

Next.js의 라우팅과 비즈니스 로직을 분리하여 유지보수성을 극대화합니다.

**1. `src/app/post/[id]/page.tsx` (껍데기)**

```typescript
import { Metadata } from 'next';
import { PostPage } from '@/pages/post-detail'; // 실제 구현체 import
import { getPost } from '@/entities/post/api';  // API import

// 메타데이터용 Fetch (Request Memoization으로 중복 호출 걱정 X)
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getPost(params.id);
  return { title: data.title };
}

// Params만 전달하고 빠짐
export default function Page({ params }) {
  return <PostPage id={params.id} />;
}
```

**2. `src/pages/post-detail/ui/PostPage.tsx` (알맹이)**

```typescript
import { PostViewerWidget } from '@/widgets/PostViewer';

// 순수 비즈니스 로직 및 조립
export const PostPage = ({ id }) => {
  return (
    <main>
      <PostViewerWidget postId={id} />
    </main>
  );
};
```

### 5.2. CQRS 패턴 적용 예시

**상황:** 게시글을 보고(Read), 좋아요를 누른다(Write).

1. **Read (Entity):** `entities/post`
   - `api/getPost.ts`: 데이터를 가져옴.
   - `ui/PostContent/`: 데이터를 보여주기만 함 (Server Component 권장).

2. **Write (Feature):** `features/post-interaction`
   - `api/likePost.ts`: 서버에 좋아요 요청을 보냄.
   - `ui/LikeButton/`: 클릭 이벤트를 받음 (Client Component 필수).

3. **Composition (Widget):** `widgets/PostViewer`
   - `Entity`와 `Feature`를 import 하여 한 덩어리로 만듦.
   - `props`를 통해 Entity의 ID를 Feature에게 전달.

---

## 6. 리팩토링 체크리스트 (Rule of Two)

코드를 작성하다가 아래 상황이 발생하면 리팩토링을 진행합니다.

1. **중복 발견:** 특정 UI나 로직이 **2곳 이상의 슬라이스**에서 똑같이 필요하다.
   - → 도메인 로직이 없으면 **`shared`**로 이동.
   - → 도메인 로직이 있으면 **`widgets`**으로 이동.

2. **참조 위반:** `import` 경로가 상위로 가거나, 옆집(다른 슬라이스)을 가리킨다.
   - → 해당 로직을 **상위 레이어(`Widgets`, `Pages`)**로 끌어올려서 조합하는 형태로 변경.

3. **파일 비대화:** 하나의 컴포넌트 파일이 너무 길어진다.
   - → 내부 로직은 `model/useLogic.ts`로 분리.
   - → 하위 UI는 같은 폴더 내 컴포넌트로 분리.

---

## 7. 실전 예제

### 7.1. 좋아요 기능 구현

```
entities/post/
├── api/
│   └── getPost.ts
├── ui/
│   └── PostContent.tsx
└── types/
    └── Post.ts

features/post-interaction/
├── api/
│   └── likePost.ts
└── ui/
    └── LikeButton.tsx

widgets/PostViewer/
└── index.tsx

pages/post-detail/
└── ui/
    └── PostPage.tsx

app/post/[id]/
└── page.tsx
```

### 7.2. 파일 내용

**entities/post/types/Post.ts**
```typescript
export type Post = {
  id: string;
  title: string;
  content: string;
  likeCount: number;
};
```

**features/post-interaction/ui/LikeButton.tsx**
```typescript
"use client";

export const LikeButton = ({ postId, initialCount }: Props) => {
  const [count, setCount] = useState(initialCount);
  const { mutate } = useMutation({
    mutationFn: likePost,
    onSuccess: () => setCount(prev => prev + 1),
  });
  
  return (
    <button onClick={() => mutate(postId)}>
      ❤️ {count}
    </button>
  );
};
```

---

## 8. 마이그레이션 가이드

기존 코드베이스를 Clean FSD로 마이그레이션할 때는 다음 순서를 따릅니다:

1. **Shared 추출:** 도메인 무관한 공통 유틸리티 분리
2. **Entities 생성:** 데이터 조회 API와 타입 정의
3. **Features 생성:** 사용자 행동과 뮤테이션 로직
4. **Widgets 조합:** Entity + Feature를 조합한 독립 블록
5. **Pages 조립:** 비즈니스 화면 로직
6. **App 정리:** 라우팅과 메타데이터만 남김

---

## 9. 자주 묻는 질문 (FAQ)

### Q1. Server Component와 Client Component를 어떻게 구분하나요?

- **Entity (Read):** 기본적으로 Server Component (데이터 페칭 최적화)
- **Feature (Write):** 반드시 Client Component (이벤트 핸들링 필요)
- **Widget:** Entity(Server) + Feature(Client) 조합

### Q2. 같은 레이어 내에서 참조가 필요하면?

- Entity → Entity, Feature → Feature는 금지
- 공통 로직은 **Shared**로 추출
- 조합이 필요하면 **Widgets**에서 처리

### Q3. 기존 프로젝트를 점진적으로 마이그레이션하려면?

1. 새로운 기능부터 Clean FSD 적용
2. 레거시 코드는 `_legacy/` 폴더로 이동
3. 수정이 필요할 때 리팩토링 진행

---

## 10. 참고 자료

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [CQRS 패턴](https://martinfowler.com/bliki/CQRS.html)
- [Next.js App Router](https://nextjs.org/docs/app)
