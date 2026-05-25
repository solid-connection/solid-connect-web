export interface BrunoApiDefinitionRegistryItem {
  domain: string;
  name: string;
  displayName: string;
  sourceFile?: string;
  definition: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
    path: string;
    pathParamsExample: Record<string, string>;
    queryParamsExample: Record<string, unknown>;
    bodyExample?: unknown;
    hasBody: boolean;
    bodyType: string | null;
  };
}

export const brunoApiDefinitionRegistry = [
  {
    domain: "Admin",
    name: "delete권역삭제",
    displayName: "권역 삭제",
    sourceFile: "7) 어드민 [Admin]/권역 관리 - region/권역 삭제.bru",
    definition: {
      method: "DELETE",
      path: "{{URL}}/admin/regions/{{code}}",
      pathParamsExample: {
        "code": ""
      },
      queryParamsExample: {},
      bodyExample: {
        "koreanName": "미주권"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Admin",
    name: "delete지역삭제",
    displayName: "지역 삭제",
    sourceFile: "7) 어드민 [Admin]/지역 관리 - country/지역 삭제.bru",
    definition: {
      method: "DELETE",
      path: "{{URL}}/admin/countries/{{code}}",
      pathParamsExample: {
        "code": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Admin",
    name: "getCountMentorApplicationByStatus",
    displayName: "멘토 지원서 상태별 개수 조회",
    sourceFile: "7) 어드민 [Admin]/멘토- mentor/멘토 지원서 상태별 개수 조회 [count-mentor-application-by-status].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/admin/mentor-applications/count",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Admin",
    name: "getGpaList",
    displayName: "학점\u001b조회",
    sourceFile: "7) 어드민 [Admin]/학점 조회 [gpa-list].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/admin/scores/gpas",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Admin",
    name: "getLanguageTestList",
    displayName: "어학 조회",
    sourceFile: "7) 어드민 [Admin]/어학 조회 [language-test-list].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/admin/scores/language-tests?page=1&size=10",
      pathParamsExample: {},
      queryParamsExample: {
        "page": "1",
        "size": "10"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Admin",
    name: "getMentorApplicationHistoryList",
    displayName: "멘토 지원서 이력 조회",
    sourceFile: "7) 어드민 [Admin]/멘토- mentor/멘토 지원서 이력 조회 [mentor-application-history-list].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/admin/mentor-applications/{{site_user_id}}/history",
      pathParamsExample: {
        "site_user_id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Admin",
    name: "getMentorApplicationList",
    displayName: "멘토 승격 요청 내역 조회",
    sourceFile: "7) 어드민 [Admin]/멘토- mentor/멘토 승격 요청 내역 조회 [mentor-application-list].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/admin/mentor-applications?page=2&size=10&mentorApplicationStatus=PENDING&nickname&createdAt=2025-11-14",
      pathParamsExample: {},
      queryParamsExample: {
        "page": "2",
        "size": "10",
        "mentorApplicationStatus": "PENDING",
        "createdAt": "2025-11-14"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Admin",
    name: "get권역조회",
    displayName: "권역 조회",
    sourceFile: "7) 어드민 [Admin]/권역 관리 - region/권역 조회.bru",
    definition: {
      method: "GET",
      path: "{{URL}}/admin/regions",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Admin",
    name: "get지역조회",
    displayName: "지역 조회",
    sourceFile: "7) 어드민 [Admin]/지역 관리 - country/지역 조회.bru",
    definition: {
      method: "GET",
      path: "{{URL}}/admin/countries",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Admin",
    name: "postApproveMentorApplication",
    displayName: "멘토 요청 승격 처리",
    sourceFile: "7) 어드민 [Admin]/멘토- mentor/멘토 요청 승격 처리 [approve-mentor-application].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/admin/mentor-applications/{{mentor-application-id}}/approve",
      pathParamsExample: {
        "mentor-application-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Admin",
    name: "postMappingMentorapplicationUniversity",
    displayName: "멘토 지원서 대학 매핑",
    sourceFile: "7) 어드민 [Admin]/멘토- mentor/멘토 지원서 대학 매핑 [mapping-mentorapplication-university].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/admin/mentor-applications/{{mentor-application-id}}/assign-university",
      pathParamsExample: {
        "mentor-application-id": ""
      },
      queryParamsExample: {},
      bodyExample: {
        "universityId": 1
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Admin",
    name: "postRejectMentorApplication",
    displayName: "멘토 승격 요청 거절",
    sourceFile: "7) 어드민 [Admin]/멘토- mentor/멘토 승격 요청 거절 [reject-mentor-application].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/admin/mentor-applications/{{mentor-application-id}}/reject",
      pathParamsExample: {
        "mentor-application-id": ""
      },
      queryParamsExample: {},
      bodyExample: {
        "rejectedReason": "잘못됌"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Admin",
    name: "post권역생성",
    displayName: "권역 생성",
    sourceFile: "7) 어드민 [Admin]/권역 관리 - region/권역 생성.bru",
    definition: {
      method: "POST",
      path: "{{URL}}/admin/regions",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "code": "AMERICAS",
        "koreanName": "미주권"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Admin",
    name: "post지역생성",
    displayName: "지역 생성",
    sourceFile: "7) 어드민 [Admin]/지역 관리 - country/지역 생성.bru",
    definition: {
      method: "POST",
      path: "{{URL}}/admin/countries",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "code": "AT",
        "koreanName": "오스트리아",
        "regionCode": "EUROPE"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Admin",
    name: "putVerifyGpa",
    displayName: "학점 검증 및 수정",
    sourceFile: "7) 어드민 [Admin]/학점 검증 및 수정 [verify-gpa].bru",
    definition: {
      method: "PUT",
      path: "{{URL}}/admin/scores/gpas/{{gpa-score-id}}",
      pathParamsExample: {
        "gpa-score-id": ""
      },
      queryParamsExample: {},
      bodyExample: {
        "gpa": 3.2,
        "gpaCriteria": 4.5,
        "verifyStatus": "REJECTED",
        "rejectedReason": "유효하지 않은 성적표"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Admin",
    name: "putVerifyLanguageTest",
    displayName: "어학 검증 및 수정",
    sourceFile: "7) 어드민 [Admin]/어학 검증 및 수정 [verify-language-test].bru",
    definition: {
      method: "PUT",
      path: "{{URL}}/admin/scores/language-tests/{{language-test-score-id}}",
      pathParamsExample: {
        "language-test-score-id": ""
      },
      queryParamsExample: {},
      bodyExample: {
        "languageTestType": "TOEIC",
        "languageTestScore": "990",
        "verifyStatus": "REJECTED",
        "rejectedReason": "유효 기간 만료"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Admin",
    name: "put권역수정",
    displayName: "권역 수정",
    sourceFile: "7) 어드민 [Admin]/권역 관리 - region/권역 수정.bru",
    definition: {
      method: "PUT",
      path: "{{URL}}/admin/regions/{{code}}",
      pathParamsExample: {
        "code": ""
      },
      queryParamsExample: {},
      bodyExample: {
        "koreanName": "미주권"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Admin",
    name: "put지역수정",
    displayName: "지역 수정",
    sourceFile: "7) 어드민 [Admin]/지역 관리 - country/지역 수정.bru",
    definition: {
      method: "PUT",
      path: "{{URL}}/admin/countries/{{code}}",
      pathParamsExample: {
        "code": ""
      },
      queryParamsExample: {},
      bodyExample: {
        "koreanName": "오스트리아",
        "regionCode": "EUROPE"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "applications",
    name: "getApplicants",
    displayName: "지원자 현황 조회",
    sourceFile: "4) 지원정보 [applications]/지원자 현황 [applicants].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/applications",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "applications",
    name: "getCompetitors",
    displayName: "나의 지원과 동일한 지원자 현황 조회",
    sourceFile: "4) 지원정보 [applications]/경쟁자 현황 [competitors].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/applications/competitors",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "applications",
    name: "postSubmitApplication",
    displayName: "지원서 제출",
    sourceFile: "4) 지원정보 [applications]/지원서 제출 [submit-application].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/applications",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "gpaScoreId": 1,
        "languageTestScoreId": 1,
        "universityChoiceRequest": {
          "firstChoiceUniversityId": 1,
          "secondChoiceUniversityId": 2,
          "thirdChoiceUniversityId": 3
        }
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Auth",
    name: "deleteAccount",
    displayName: "회원 탈퇴",
    sourceFile: "1) 인증 [Auth]/회원 탈퇴 [account].bru",
    definition: {
      method: "DELETE",
      path: "{{URL}}/auth/quit",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Auth",
    name: "postAppleAuth",
    displayName: "애플 인증 (로그인 or 가입 코드 발급)",
    sourceFile: "1) 인증 [Auth]/애플 인증 [apple-auth].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/auth/apple",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "code": "04XcLzhPY8BOihCltYUDXHrloUDYdLn3xQu1juGaoDkw2j6SyvHlsAAAAAQKPXPrAAABk7Gd_pJyxKx5jTsi9A"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Auth",
    name: "postEmailLogin",
    displayName: "이메일 로그인",
    sourceFile: "1) 인증 [Auth]/이메일 로그인 [email-login].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/auth/email/sign-in",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "email": "test0410@solid-connection.com",
        "password": "12341234"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Auth",
    name: "postEmailVerification",
    displayName: "이메일 인증 (가입 코드 발급)",
    sourceFile: "1) 인증 [Auth]/이메일 인증 [email-verification].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/auth/email/sign-up",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "email": "test0410@solid-connection.com",
        "password": "12341234"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Auth",
    name: "postKakaoAuth",
    displayName: "카카오 인증 (로그인 or 가입 코드 발급)",
    sourceFile: "1) 인증 [Auth]/카카오 인증 [kakao-auth].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/auth/kakao",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "code": "04XcLzhPY8BOihCltYUDXHrloUDYdLn3xQu1juGaoDkw2j6SyvHlsAAAAAQKPXPrAAABk7Gd_pJyxKx5jTsi9A"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Auth",
    name: "postRefreshToken",
    displayName: "엑세스 토큰 재발급",
    sourceFile: "1) 인증 [Auth]/엑세스 토큰 재발급 [refresh-token].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/auth/reissue",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Auth",
    name: "postSignOut",
    displayName: "로그아웃",
    sourceFile: "1) 인증 [Auth]/로그아웃 [sign-out].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/auth/sign-out",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Auth",
    name: "postSignUp",
    displayName: "회원가입",
    sourceFile: "1) 인증 [Auth]/회원가입 [sign-up].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/auth/sign-up",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "signUpToken": "1234token1234",
        "interestedRegions": [
          "미주권"
        ],
        "interestedCountries": [
          "헝가리2"
        ],
        "preparationStatus": "CONSIDERING",
        "nickname": "솔커0410",
        "profileImageUrl": "http://k.kakaocdn.net/dn/DKxlu/btstVhE45Ub/lP9ZXHVRjFwTZDUqQxg7KK/img_640x640.jpg"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "chat",
    name: "getChatMessages",
    displayName: "채팅 내역 조회",
    sourceFile: "11) 채팅 [chat]/채팅 내역 [chat-messages].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/chats/rooms/{{room-id}}?size={{default-size}}&page={{default-page}}",
      pathParamsExample: {
        "room-id": "",
        "default-size": "",
        "default-page": ""
      },
      queryParamsExample: {
        "size": "{{default-size}}",
        "page": "{{default-page}}"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "chat",
    name: "getChatPartner",
    displayName: "채팅방 파트너 조회",
    sourceFile: "11) 채팅 [chat]/채팅방 파트너 [chat-partner].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/chats/rooms/{{room-id}}/partner",
      pathParamsExample: {
        "room-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "chat",
    name: "getChatRooms",
    displayName: "채팅방 목록 조회",
    sourceFile: "11) 채팅 [chat]/채팅방 목록 [chat-rooms].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/chats/rooms",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "chat",
    name: "putReadChatRoom",
    displayName: "채팅방 읽음 처리",
    sourceFile: "11) 채팅 [chat]/채팅방 읽음 [read-chat-room].bru",
    definition: {
      method: "PUT",
      path: "{{URL}}/chats/rooms/{{room-id}}/read",
      pathParamsExample: {
        "room-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "community",
    name: "deleteComment",
    displayName: "댓글 삭제",
    sourceFile: "5) 커뮤니티 [community]/comments/댓글 삭제 [comment].bru",
    definition: {
      method: "DELETE",
      path: "{{URL}}/comments/{{comment-id}}",
      pathParamsExample: {
        "comment-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "community",
    name: "deleteLikePost",
    displayName: "게시글 좋아요 삭제",
    sourceFile: "5) 커뮤니티 [community]/posts/게시글 좋아요 취소 [like-post].bru",
    definition: {
      method: "DELETE",
      path: "{{URL}}/posts/{{post-id}}/like",
      pathParamsExample: {
        "post-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "community",
    name: "deletePost",
    displayName: "게시글 삭제",
    sourceFile: "5) 커뮤니티 [community]/posts/게시글 삭제 [post].bru",
    definition: {
      method: "DELETE",
      path: "{{URL}}/posts/{{post-id}}",
      pathParamsExample: {
        "post-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "community",
    name: "getBoard",
    displayName: "게시판 조회",
    sourceFile: "5) 커뮤니티 [community]/boards/게시판 조회 [board].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/boards/{{board-code}}",
      pathParamsExample: {
        "board-code": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "community",
    name: "getBoardList",
    displayName: "게시판 목록 조회",
    sourceFile: "5) 커뮤니티 [community]/boards/게시판 목록 [board-list].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/boards",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "community",
    name: "getPostDetail",
    displayName: "게시글 조회",
    sourceFile: "5) 커뮤니티 [community]/posts/게시글 조회 [post-detail].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/posts/{{post-id}}",
      pathParamsExample: {
        "post-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "community",
    name: "patchUpdateComment",
    displayName: "댓글 수정",
    sourceFile: "5) 커뮤니티 [community]/comments/댓글 수정 [update-comment].bru",
    definition: {
      method: "PATCH",
      path: "{{URL}}/comments/{{comment-id}}",
      pathParamsExample: {
        "comment-id": ""
      },
      queryParamsExample: {},
      bodyExample: {
        "content": "string222"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "community",
    name: "patchUpdatePost",
    displayName: "게시글 수정",
    sourceFile: "5) 커뮤니티 [community]/posts/게시글 수정 [update-post].bru",
    definition: {
      method: "PATCH",
      path: "{{URL}}/posts/{{post-id}}",
      pathParamsExample: {
        "post-id": ""
      },
      queryParamsExample: {},
      hasBody: true,
      bodyType: "multipart-form",
    },
  },
  {
    domain: "community",
    name: "postCreateComment",
    displayName: "댓글 작성",
    sourceFile: "5) 커뮤니티 [community]/comments/댓글 작성 [create-comment].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/comments",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "postId": 1,
        "content": "답변",
        "parentId": null
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "community",
    name: "postCreatePost",
    displayName: "게시글 작성",
    sourceFile: "5) 커뮤니티 [community]/posts/게시글 작성 [create-post].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/posts",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: true,
      bodyType: "multipart-form",
    },
  },
  {
    domain: "community",
    name: "postLikePost",
    displayName: "게시글 좋아요 등록",
    sourceFile: "5) 커뮤니티 [community]/posts/게시글 좋아요 [like-post].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/posts/{{post-id}}/like",
      pathParamsExample: {
        "post-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "image-upload",
    name: "postSlackNotification",
    displayName: "슬랙 알림",
    sourceFile: "이미지 업로드 [image-upload]/슬랙 알림 [slack-notification].bru",
    definition: {
      method: "POST",
      path: "https://hooks.slack.com/services/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",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "text": "테스트"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "image-upload",
    name: "postUploadGpaReport",
    displayName: "학적 성적표 업로드",
    sourceFile: "이미지 업로드 [image-upload]/학적 성적표 업로드 [upload-gpa-report].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/file/gpa",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "image-upload",
    name: "postUploadLanguageTestReport",
    displayName: "어학 성적표 업로드",
    sourceFile: "이미지 업로드 [image-upload]/어학 성적표 업로드 [upload-language-test-report].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/file/language-test",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "image-upload",
    name: "postUploadProfileImage",
    displayName: "프로필 사진 업로드 (가입 후)",
    sourceFile: "이미지 업로드 [image-upload]/프로필 사진 업로드 [upload-profile-image].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/file/profile/post",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "image-upload",
    name: "postUploadProfileImageBeforeSignup",
    displayName: "프로필 사진 업로드 (가입 전)",
    sourceFile: "이미지 업로드 [image-upload]/프로필 사진 업로드 가입전 [upload-profile-image-before-signup].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/file/profile/pre",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "kakao-api",
    name: "getKakaoInfo",
    displayName: "정보 조회",
    sourceFile: "99) 카카오 API [kakao-api]/카카오 정보 조회 [kakao-info].bru",
    definition: {
      method: "GET",
      path: "https://kapi.kakao.com/v2/user/me?property_keys=[\"kakao_account.email\"]&target_id_type=user_id&target_id=3715136239",
      pathParamsExample: {},
      queryParamsExample: {
        "property_keys": "[\"kakao_account.email\"]",
        "target_id_type": "user_id",
        "target_id": "3715136239"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "kakao-api",
    name: "getKakaoUserIds",
    displayName: "사용자 id 목록 조회",
    sourceFile: "99) 카카오 API [kakao-api]/카카오 사용자 ID 목록 [kakao-user-ids].bru",
    definition: {
      method: "GET",
      path: "https://kapi.kakao.com/v1/user/ids?order=dsc",
      pathParamsExample: {},
      queryParamsExample: {
        "order": "dsc"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "kakao-api",
    name: "postKakaoUnlink",
    displayName: "연결 끊기",
    sourceFile: "99) 카카오 API [kakao-api]/카카오 연결 끊기 [kakao-unlink].bru",
    definition: {
      method: "POST",
      path: "https://kapi.kakao.com/v1/user/unlink?target_id_type=user_id&target_id=3715136239",
      pathParamsExample: {},
      queryParamsExample: {
        "target_id_type": "user_id",
        "target_id": "3715136239"
      },
      hasBody: true,
      bodyType: "multipart-form",
    },
  },
  {
    domain: "mentor",
    name: "getAppliedMentorings",
    displayName: "신청한 멘토링 목록",
    sourceFile: "9) 멘토 [mentor]/mentee-only/신청한 멘토링 목록 [applied-mentorings].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/mentee/mentorings?verify-status={{verify-status}}&size={{default-size}}&page={{default-page}}",
      pathParamsExample: {
        "verify-status": "",
        "default-size": "",
        "default-page": ""
      },
      queryParamsExample: {
        "verify-status": "{{verify-status}}",
        "size": "{{default-size}}",
        "page": "{{default-page}}"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "mentor",
    name: "getMatchedMentors",
    displayName: "매칭된 멘토 목록",
    sourceFile: "9) 멘토 [mentor]/mentee-only/매칭된 멘토 목록 [matched-mentors].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/mentee/mentorings/matched-mentors?size={{default-size}}&page={{default-page}}",
      pathParamsExample: {
        "default-size": "",
        "default-page": ""
      },
      queryParamsExample: {
        "size": "{{default-size}}",
        "page": "{{default-page}}"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "mentor",
    name: "getMentorDetail",
    displayName: "멘토 상세 조회",
    sourceFile: "9) 멘토 [mentor]/mentor/멘토 상세 [mentor-detail].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/mentors/{{site-user-id}}",
      pathParamsExample: {
        "site-user-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "mentor",
    name: "getMentorList",
    displayName: "멘토 목록 조회",
    sourceFile: "9) 멘토 [mentor]/mentor/멘토 목록 [mentor-list].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/mentors?region=미주권&size={{default-size}}&page={{default-page}}",
      pathParamsExample: {
        "default-size": "",
        "default-page": ""
      },
      queryParamsExample: {
        "region": "미주권",
        "size": "{{default-size}}",
        "page": "{{default-page}}"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "mentor",
    name: "getMyMentorPage",
    displayName: "나의 멘토 페이지 조회",
    sourceFile: "9) 멘토 [mentor]/mentor-only/나의 멘토 페이지 [my-mentor-page].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/mentor/my",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "mentor",
    name: "getReceivedMentorings",
    displayName: "신청받은 멘토링 목록",
    sourceFile: "9) 멘토 [mentor]/mentor-only/신청받은 멘토링 목록 [received-mentorings].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/mentor/mentorings",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "mentor",
    name: "getUnconfirmedMentoringCount",
    displayName: "확인하지 않은 멘토링 수",
    sourceFile: "9) 멘토 [mentor]/mentor-only/확인하지 않은 멘토링 수 [unconfirmed-mentoring-count].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/mentor/mentorings/check",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "mentor",
    name: "patchConfirmMentoring",
    displayName: "멘토링 확인",
    sourceFile: "9) 멘토 [mentor]/mentee-only/멘토링 확인 [confirm-mentoring].bru",
    definition: {
      method: "PATCH",
      path: "{{URL}}/mentee/mentorings/check",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "checkedMentoringIds": [
          1,
          2,
          3
        ]
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "mentor",
    name: "patchConfirmMentoring2",
    displayName: "멘토링 확인",
    sourceFile: "9) 멘토 [mentor]/mentor-only/멘토링 확인 [confirm-mentoring].bru",
    definition: {
      method: "PATCH",
      path: "{{URL}}/mentor/mentorings/check",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "checkedMentoringIds": [
          1,
          2,
          3
        ]
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "mentor",
    name: "patchMentoringStatus",
    displayName: "멘토링 수락/거절",
    sourceFile: "9) 멘토 [mentor]/mentor-only/멘토링 수락-거절 [mentoring-status].bru",
    definition: {
      method: "PATCH",
      path: "{{URL}}/mentor/mentorings/{{mentoring-id}}",
      pathParamsExample: {
        "mentoring-id": ""
      },
      queryParamsExample: {},
      bodyExample: {
        "status": "APPROVED"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "mentor",
    name: "postApplyMentorApplication",
    displayName: "멘토 승격 요청",
    sourceFile: "9) 멘토 [mentor]/mentee-only/멘토 승격 요청 [apply-mentor-application].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/mentees/mentor-applications",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: true,
      bodyType: "multipart-form",
    },
  },
  {
    domain: "mentor",
    name: "postApplyMentoring",
    displayName: "멘토링 신청",
    sourceFile: "9) 멘토 [mentor]/mentee-only/멘토링 신청 [apply-mentoring].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/mentee/mentorings",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "mentor",
    name: "postCreateMentorMyPage",
    displayName: "멘토 마이 페이지 생성",
    sourceFile: "9) 멘토 [mentor]/mentor-only/멘토 마이 페이지 생성 [create-mentor-my-page].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/mentor/my",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "mentor",
    name: "putUpdateMyMentorPage",
    displayName: "나의 멘토 페이지 수정",
    sourceFile: "9) 멘토 [mentor]/mentor-only/나의 멘토 페이지 수정 [update-my-mentor-page].bru",
    definition: {
      method: "PUT",
      path: "{{URL}}/mentor/my",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "channels": [
          {
            "type": "BLOG",
            "url": "https://example.com/blog"
          },
          {
            "type": "YOUTUBE",
            "url": "https://youtube.com/channel"
          }
        ],
        "passTip": "합격 레시피",
        "introduction": "멘토 소개글입니다"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "MyPage",
    name: "getProfile",
    displayName: "내 정보 조회",
    sourceFile: "3) 마이페이지 [MyPage]/내 정보 조회 [profile].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/my",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "MyPage",
    name: "patchInterestedRegionCountry",
    displayName: "관심 권역/국가 변경",
    sourceFile: "3) 마이페이지 [MyPage]/관심 권역-국가 변경 [interested-region-country].bru",
    definition: {
      method: "PATCH",
      path: "{{URL}}/my/interested-location",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "interestedRegions": [
          "아시아권",
          "유럽권"
        ],
        "interestedCountries": [
          "일본",
          "프랑스",
          "미국"
        ]
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "MyPage",
    name: "patchPassword",
    displayName: "비밀번호 변경",
    sourceFile: "3) 마이페이지 [MyPage]/비밀번호 변경 [password].bru",
    definition: {
      method: "PATCH",
      path: "{{URL}}/my/password",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "currentPassword": "1q2w3e4r5t!!!!",
        "newPassword": "1q2w3e4r5t!!!",
        "newPasswordConfirmation": "1q2w3e4r5t!!!"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "MyPage",
    name: "patchProfile",
    displayName: "내 정보 수정",
    sourceFile: "3) 마이페이지 [MyPage]/내 정보 수정 [profile].bru",
    definition: {
      method: "PATCH",
      path: "{{URL}}/my",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: true,
      bodyType: "multipart-form",
    },
  },
  {
    domain: "news",
    name: "deleteLikeNews",
    displayName: "소식지 좋아요 삭제",
    sourceFile: "10) 소식지 [news]/소식지 좋아요 취소 [like-news].bru",
    definition: {
      method: "DELETE",
      path: "{{URL}}/news/{{news-id}}/like",
      pathParamsExample: {
        "news-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "news",
    name: "deleteNews",
    displayName: "소식지 삭제",
    sourceFile: "10) 소식지 [news]/소식지 삭제 [news].bru",
    definition: {
      method: "DELETE",
      path: "{{URL}}/news/{{news-id}}",
      pathParamsExample: {
        "news-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "news",
    name: "getNewsList",
    displayName: "소식지 목록 조회",
    sourceFile: "10) 소식지 [news]/소식지 목록 [news-list].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/news?author-id=6",
      pathParamsExample: {},
      queryParamsExample: {
        "author-id": "6"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "news",
    name: "postCreateNews",
    displayName: "소식지 추가",
    sourceFile: "10) 소식지 [news]/소식지 추가 [create-news].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/news",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: true,
      bodyType: "multipart-form",
    },
  },
  {
    domain: "news",
    name: "postLikeNews",
    displayName: "소식지 좋아요 추가",
    sourceFile: "10) 소식지 [news]/소식지 좋아요 [like-news].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/news/{{news-id}}/like",
      pathParamsExample: {
        "news-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "news",
    name: "putUpdateNews",
    displayName: "소식지 수정",
    sourceFile: "10) 소식지 [news]/소식지 수정 [update-news].bru",
    definition: {
      method: "PUT",
      path: "{{URL}}/news/{{news-id}}",
      pathParamsExample: {
        "news-id": ""
      },
      queryParamsExample: {},
      hasBody: true,
      bodyType: "multipart-form",
    },
  },
  {
    domain: "reports",
    name: "postReport",
    displayName: "신고하기",
    sourceFile: "11) 신고 [reports]/신고하기 [report].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/reports",
      pathParamsExample: {},
      queryParamsExample: {},
      bodyExample: {
        "targetType": "POST",
        "targetId": 1,
        "reasonType": "SPAM"
      },
      hasBody: true,
      bodyType: "json",
    },
  },
  {
    domain: "Scores",
    name: "getGpaList",
    displayName: "학점 조회",
    sourceFile: "6) 성적 [Scores]/학점 조회 [gpa-list].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/scores/gpas",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Scores",
    name: "getLanguageTestList",
    displayName: "어학 성적 조회",
    sourceFile: "6) 성적 [Scores]/어학 성적 조회 [language-test-list].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/scores/language-tests",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "Scores",
    name: "postCreateGpa",
    displayName: "학점 등록",
    sourceFile: "6) 성적 [Scores]/학점 등록 [create-gpa].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/scores/gpas",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: true,
      bodyType: "multipart-form",
    },
  },
  {
    domain: "Scores",
    name: "postCreateLanguageTest",
    displayName: "어학 성적 등록",
    sourceFile: "6) 성적 [Scores]/어학 성적 등록 [create-language-test].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/scores/language-tests",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: true,
      bodyType: "multipart-form",
    },
  },
  {
    domain: "universities",
    name: "deleteWish",
    displayName: "위시 학교 삭제",
    sourceFile: "2) 대학교 [universities]/univ-apply-infos/위시 학교 삭제 [wish].bru",
    definition: {
      method: "DELETE",
      path: "{{URL}}/univ-apply-infos/{{univ-apply-info-id}}/like",
      pathParamsExample: {
        "univ-apply-info-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "universities",
    name: "getByRegionCountry",
    displayName: "권역-국가에 해당하는 전체 대학",
    sourceFile: "2) 대학교 [universities]/universities/권역-국가별 대학 [by-region-country].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/universities/search",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "universities",
    name: "getIsWish",
    displayName: "위시 학교인지 조회",
    sourceFile: "2) 대학교 [universities]/univ-apply-infos/위시 학교 확인 [is-wish].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/univ-apply-infos/{{univ-apply-info-id}}/like",
      pathParamsExample: {
        "univ-apply-info-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "universities",
    name: "getRecommendedUniversities",
    displayName: "맞춤 대학 추천",
    sourceFile: "2) 대학교 [universities]/univ-apply-infos/맞춤 대학 추천 [recommended-universities].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/univ-apply-infos/recommend",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "universities",
    name: "getSearchText",
    displayName: "학교 텍스트 검색",
    sourceFile: "2) 대학교 [universities]/univ-apply-infos/학교 텍스트 검색 [search-text].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/univ-apply-infos/search/text?value=일본",
      pathParamsExample: {},
      queryParamsExample: {
        "value": "일본"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "universities",
    name: "getUniversityDetail",
    displayName: "학교 상세 정보 조회",
    sourceFile: "2) 대학교 [universities]/univ-apply-infos/학교 상세 정보 [university-detail].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/univ-apply-infos/{{univ-apply-info-id}}",
      pathParamsExample: {
        "univ-apply-info-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "universities",
    name: "getWishList",
    displayName: "위시 학교 목록 조회",
    sourceFile: "2) 대학교 [universities]/univ-apply-infos/위시 학교 목록 [wish-list].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/univ-apply-infos/like",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "universities",
    name: "postAddWish",
    displayName: "위시 학교 추가",
    sourceFile: "2) 대학교 [universities]/univ-apply-infos/위시 학교 추가 [add-wish].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/univ-apply-infos/{{univ-apply-info-id}}/like",
      pathParamsExample: {
        "univ-apply-info-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "users",
    name: "deleteUnblockUser",
    displayName: "유저 차단 취소",
    sourceFile: "8) 사용자 [users]/유저 차단 취소 [unblock-user].bru",
    definition: {
      method: "DELETE",
      path: "{{URL}}/users/block/{{blocked-id}}",
      pathParamsExample: {
        "blocked-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "users",
    name: "getBlockedUsers",
    displayName: "차단한 유저 목록 조회",
    sourceFile: "8) 사용자 [users]/차단한 유저 목록 [blocked-users].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/users/blocks",
      pathParamsExample: {},
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "users",
    name: "getNicknameExists",
    displayName: "닉네임 중복 검증",
    sourceFile: "8) 사용자 [users]/닉네임 중복 검증 [nickname-exists].bru",
    definition: {
      method: "GET",
      path: "{{URL}}/users/exists?nickname=abc",
      pathParamsExample: {},
      queryParamsExample: {
        "nickname": "abc"
      },
      hasBody: false,
      bodyType: null,
    },
  },
  {
    domain: "users",
    name: "postBlockUser",
    displayName: "유저 차단",
    sourceFile: "8) 사용자 [users]/유저 차단 [block-user].bru",
    definition: {
      method: "POST",
      path: "{{URL}}/users/block/{{blocked-id}}",
      pathParamsExample: {
        "blocked-id": ""
      },
      queryParamsExample: {},
      hasBody: false,
      bodyType: null,
    },
  },
] as const satisfies readonly BrunoApiDefinitionRegistryItem[];

export type BrunoApiDefinitionRegistry = typeof brunoApiDefinitionRegistry;