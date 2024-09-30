export interface ResponseProps<T = { [k: string]: any }> {
  status: number;
  data?: T;
  message?: string;
  count?: number;
}
