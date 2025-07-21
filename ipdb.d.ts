declare module 'ipdb' {
    interface IPDBData {
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
    }
  
    interface IPDBResult {
      data: IPDBData;
      code: number;
    }
  
    export default class IPDB {
      constructor(filePath: string);
      find(ip: string): IPDBResult;
    }
  }