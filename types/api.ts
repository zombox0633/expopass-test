import { UserRecord } from "./users";

export type RecordsListResponse = {
  data: UserRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type SingleRecordResponse = {
  data: UserRecord;
};

export type AuthInput = {
  email: string;
  password: string;
};
