export type QueryAndHeader = {
  id: number;
  key: string;
  value: string;
};

export type RequestType = "GET" | "POST" | "PUT" | "DELETE";
export type HeaderProps = {
  headerList: QueryAndHeader[];
  setHeaderList: React.Dispatch<React.SetStateAction<QueryAndHeader[]>>;
};

export type QueryParameterProps = {
  queryParameters: QueryAndHeader[];
  setQueryParameters: React.Dispatch<React.SetStateAction<QueryAndHeader[]>>;
};
