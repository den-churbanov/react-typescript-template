import os from 'node:os';

export function getPublicIPAddress() {
  const interfaces = os.networkInterfaces();
  let address = 'localhost';
  Object.keys(interfaces).forEach(key => {
    for (const details of interfaces[key]) {
      if (details.family === 'IPv4' && details.internal === false) {
        address = details.address;
      }
    }
  })
  return address;
}