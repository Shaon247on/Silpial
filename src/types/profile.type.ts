export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  username: string;
  profile_pic_url: string;
  date_joined: string;
  is_admin: boolean;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}