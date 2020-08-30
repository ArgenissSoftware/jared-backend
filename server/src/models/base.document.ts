
import type { Document } from "mongoose";

export interface BaseDocument extends Document {
  active: boolean;
}
