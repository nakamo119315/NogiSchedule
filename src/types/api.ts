// Schedule API Response
export interface ScheduleApiResponse {
  count: string;
  data: ScheduleApiItem[];
}

export interface ScheduleApiItem {
  code: string;
  title: string;
  date: string; // "YYYY/MM/DD"
  start_time: string;
  end_time: string;
  cate: string; // "tv", "radio", "live", etc.
  text: string; // HTML content
  link: string;
  arti_code: string[][]; // Nested array of member codes
}

// Member API Response
export interface MemberApiResponse {
  count: string;
  data: MemberApiItem[];
}

export interface MemberApiItem {
  code: string;
  name: string;
  english_name: string;
  kana: string;
  cate: string; // "1期生", "6期生", etc.
  img: string;
  link: string;
  graduation: string; // "YES" or "NO"
  pick?: string;
  god?: string;
  under?: string;
  birthday?: string;
  blood?: string;
  constellation?: string;
  groupcode?: string;
}

// Error types
export interface ApiError {
  type: 'NETWORK_ERROR' | 'PARSE_ERROR' | 'TIMEOUT';
  message: string;
  originalError?: Error;
}
