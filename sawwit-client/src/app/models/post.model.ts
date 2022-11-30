export interface Post {
  id: string;
  userId: string;
  username: string;
  title: string;
  body: string;
  image: string;
  url: string;
  linkPreview: string;
  subreddit: string;
  subredditIcon: string;
  createdAt: number;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  type: number;
  myVote: number;
}
