import { Request } from 'express';

export interface RequestUserPayload {
  sub: number;
  email: string;
}

export interface RequestWithUser extends Request {
  user: RequestUserPayload;
}
