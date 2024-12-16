import { serverTimestamp, Timestamp } from "firebase/firestore";

export interface PostedTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface JobObject {
  id?: string;
  isChecked?: boolean;
  skills: string[];
  placeType: string;
  jobTitle: string;
  contactNumber: string;
  link: string;
  type: string;
  jobPlace: string;
  posted: typeof serverTimestamp;
  description: string;
}
