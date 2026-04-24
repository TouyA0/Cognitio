export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Discovery {
  id: string;
  user_id: string;
  type: 'reflection' | 'discovery' | 'quote' | 'lecture';
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  metadata: Record<string, any>;
}

export interface Tag {
  id: string;
  name: string;
  parent_id: string | null;
  category: string | null;
  theologian_id: string | null;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: { id: string; email: string };
  token: string;
}
