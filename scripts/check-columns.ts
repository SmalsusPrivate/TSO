import * as dotenv from 'dotenv';
import { resolve } from 'path';
import fetch from 'cross-fetch';

(global as any).fetch = fetch;
(global as any).FormData = class FormData {};

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { graphFetch } from '../lib/graph';

async function main() {
  try {
    const response = await graphFetch(`/lists/features/columns`);
    const data = await response.json();
    console.log(JSON.stringify(data.value.map((c: any) => ({ name: c.name, displayName: c.displayName })), null, 2));
  } catch (e) {
    console.error(e);
  }
}
main();
