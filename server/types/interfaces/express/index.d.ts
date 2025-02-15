import {RequestUser} from "../global"

declare global {
  namespace Express {
    interface Request {
      user?: RequstUser;
    }
  }
}
