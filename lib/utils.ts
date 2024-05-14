export function isLocalhost(ip: string): Boolean {
  return Boolean(
    ip === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      ip === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      ip.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
}
