import dns from 'dns';

export function isLocalhost(ip: string): Boolean {
  return Boolean(
    ip === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      ip === '::1' ||
      ip === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      ip.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
}

export async function getHostnames(ip: string): Promise<string[]> {
  let hostnames: string[] = [];

  try {
    hostnames = await dns.promises.reverse(ip);
  } catch (error) {
    console.error(error);
  }

  return hostnames;
}

export async function getDomainAddress(domain: string): Promise<string> {
  let address: string = '';

  try {
    address = (await dns.promises.lookup(domain)).address;
  } catch (error) {
    console.error(error);
  }

  return address;
}

export function pruneObject<T extends Record<string, any>>(obj: T): T {
  const prunedData = Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) =>
        value !== '' && value !== '0' && value !== null && value !== undefined
    )
  );

  return prunedData as T;
}

export function parseASNData(input?: string): { asn?: number; org?: string } {
  if (!input) {
    return {};
  }

  try {
    const regex = /^(AS\d+)\s+(.+)$/;
    const match = input.match(regex);

    if (!match) {
      throw new Error(
        'Invalid input format. Expected format: AS<digits> <organization>'
      );
    }

    return {
      asn: parseInt(match[1].replace('AS', '')),
      org: match[2].trim()
    };
  } catch (error) {
    console.error(error);
  }

  return {};
}
