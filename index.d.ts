declare module 'ipdb' {
  interface IPDBOptions {
    patches?: string[];
  }

  interface IPDBResult {
    code: number;
    data: {
      country_name: string;
      region_name: string;
      city_name: string;
      district_name: string;
      owner_domain: string;
      isp_domain: string;
      country_code: string;
      continent_code: string;
      postal?: string;
      latitude?: number;
      longitude?: number;
      ip: string;
      bitmask: number;
    };
  }

  class IPDB {
    constructor(file: string | Buffer, options?: IPDBOptions);
    find(ip: string, options?: IPDBOptions): IPDBResult;
  }

  export = IPDB;
}
