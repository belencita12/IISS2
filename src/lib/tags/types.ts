import { BaseQueryParams } from "../types";

export interface Tag {
  id: number;
  name: string;
}

export interface TagQueryParams extends BaseQueryParams {
  name?: string;
}
