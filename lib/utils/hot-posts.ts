/**
 * HOT 게시물 점수 계산
 * 점수 = (좋아요 수 * 2) + (댓글 수 * 1) + (시간 가중치)
 * 시간 가중치: 최근 24시간 내 작성된 게시물은 추가 점수 부여
 */
export function calculateHotScore(
  likeCount: number,
  commentCount: number,
  createdAt: Date | string
): number {
  const createdDate = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const now = new Date();
  const hoursSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

  // 기본 점수: 좋아요 2점, 댓글 1점
  let score = likeCount * 2 + commentCount * 1;

  // 시간 가중치: 24시간 이내 게시물은 추가 점수
  if (hoursSinceCreation < 24) {
    // 최근일수록 높은 점수 (24시간 기준으로 선형 감소)
    const timeWeight = 1 - hoursSinceCreation / 24;
    score += timeWeight * 10; // 최대 10점 추가
  }

  return score;
}

/**
 * 게시물 목록을 HOT 점수 순으로 정렬
 */
export function sortByHotScore<T extends {
  likeCount: number;
  commentCount: number;
  createdAt: Date | string;
}>(posts: T[]): T[] {
  return [...posts].sort((a, b) => {
    const scoreA = calculateHotScore(a.likeCount, a.commentCount, a.createdAt);
    const scoreB = calculateHotScore(b.likeCount, b.commentCount, b.createdAt);
    return scoreB - scoreA; // 내림차순
  });
}

