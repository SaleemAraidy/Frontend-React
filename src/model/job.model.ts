export interface PostedTimestamp {
    _seconds: number; 
    _nanoseconds: number; 
  }
  
  export interface JobObject {
    id: string; 
    skills: string[]; 
    placeType: string; 
    jobTitle: string; 
    contactNumber: string;
    link: string; 
    type: string; 
    jobPlace: string; 
    posted: PostedTimestamp; 
  }

