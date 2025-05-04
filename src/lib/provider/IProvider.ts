export interface Provider {
    id?: number;
    businessName: string;
    name?: string; 
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

  export interface ProductProvider {
    id: number;
    name: string;
  }