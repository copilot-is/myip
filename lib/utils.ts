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
    // ignore
  }

  return hostnames;
}

export async function getDomainAddress(domain: string): Promise<string> {
  let address: string = '';

  try {
    address = (await dns.promises.lookup(domain)).address;
  } catch (error) {
    // ignore
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
