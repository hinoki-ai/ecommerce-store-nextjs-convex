import { ID, Timestamp, AuditInfo } from './common';

export interface ReviewHelpfulVote {
  id: ID;
  reviewId: ID;
  userId: ID;
  voteType: 'helpful' | 'not_helpful';
  audit: {
    createdAt: Timestamp;
  };
}

export interface ReviewResponse {
  id: ID;
  reviewId: ID;
  userId: ID;
  userName: string;
  content: string;
  isApproved: boolean;
  audit: AuditInfo;
}

export interface Review {
  id: ID;
  productId: ID;
  userId?: ID;
  orderId?: ID;
  customerName: string;
  rating: number;
  title?: string;
  content?: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulVotes: number;
  totalHelpful: number;
  responses?: ReviewResponse[];
  audit: AuditInfo;
}