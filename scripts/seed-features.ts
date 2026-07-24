import * as dotenv from 'dotenv';
import { resolve } from 'path';
import fetch from 'cross-fetch';

(global as any).fetch = fetch;
(global as any).FormData = class FormData {};

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { graphFetch } from '../lib/graph';

const featuresData = [
  { Title: 'Placement Support', tso: true, others: false, order0: 1 },
  { Title: 'Industry Trainers', tso: true, others: false, order0: 2 },
  { Title: 'Real Project Work', tso: true, others: false, order0: 3 },
  { Title: 'Mock Interviews', tso: true, others: false, order0: 4 },
  { Title: 'Flexible Batches', tso: true, others: true, order0: 5 },
  { Title: 'Resume Building', tso: true, others: false, order0: 6 },
];

async function createFeaturesList() {
  console.log('Creating features list...');
  const payload = {
    displayName: 'features',
    columns: [
      { name: 'tso', boolean: {} },
      { name: 'others', boolean: {} },
      { name: 'order', number: {} }
    ],
    list: {
      template: 'genericList'
    }
  };

  const response = await graphFetch(`/lists`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (errorText.includes('nameAlreadyExists')) {
      console.log('List features already exists. Skipping creation.');
    } else {
      console.error('Failed to create features list:', errorText);
      return;
    }
  } else {
    console.log('Successfully created features list!');
  }
}

async function seedList(listName: string, items: any[]) {
  console.log(`\nStarting seeding for ${listName}...`);
  for (const item of items) {
    try {
      const payload = { fields: item };
      const response = await graphFetch(`/lists/${listName}/items`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.error(`Failed to create item in ${listName}:`, await response.text());
      } else {
        const data = await response.json();
        console.log(`✅ Created ${item.Title} (ID: ${data.id})`);
      }
    } catch (e) {
      console.error(`Error creating ${item.Title}:`, e);
    }
  }
}

async function main() {
  try {
    await createFeaturesList();
    // Wait a couple seconds for list to fully propagate in SharePoint before adding items
    await new Promise(r => setTimeout(r, 2000));
    await seedList('features', featuresData);
    console.log('\nAll done!');
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

main();
