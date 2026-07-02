export type UserData = {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  gender: number;
  age: number;
};

export type UserRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  data: UserData;
};

export type SessionUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};
