export interface Provider {
    id?: number;
    businessName: string;
    description: string;
    phoneNumber: string;
    ruc: string;
  }

  export interface ProviderQueryParams {
    page: number;
    size?: number;
    from?: string;
    to?: string;
    includeDeleted?: boolean;
    query?: string;
  }