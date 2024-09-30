export interface GetPaginationProps {
  skip?: string;
  limit?: string;
  first?: string;
  sort_by?: Record<string, 'asc' | 'ascending' | 'desc' | 'descending'>;
}
