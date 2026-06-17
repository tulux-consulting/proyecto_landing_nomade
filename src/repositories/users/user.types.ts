export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
