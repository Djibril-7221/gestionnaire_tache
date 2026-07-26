export interface RefreshToken {

  token: string;
  expiresAt: Date;
  createdAt: Date;
  user_id: number;
}