// password.util.ts
import { randomBytes } from "crypto";

export class Utilitaire {

  static genererToken(length = 12): string {
    return randomBytes(length)
      .toString("base64")
      .slice(0, length);
  }

}