import Dexie, { Table } from 'dexie';

export interface PushHistory {
  id?: number;
  title: string;
  body: string;
  imageUrl?: string;
  linkUrl?: string;
  sentAt: Date;
  status: 'success' | 'error';
  errorMessage?: string;
}

class PushTaroDB extends Dexie {
  history!: Table<PushHistory>;

  constructor() {
    super('PushTaroDB');
    this.version(1).stores({
      history: '++id, sentAt',
    });
  }
}

export const db = new PushTaroDB();

// JSONとしてエクスポート（フォルダダウンロード）
export async function exportHistoryToJSON(): Promise<string> {
  const all = await db.history.toArray();
  return JSON.stringify(all, null, 2);
}

// JSONからインポート（フォルダ読み込み）
export async function importHistoryFromJSON(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString) as PushHistory[];
  await db.history.bulkAdd(
    data.map((d) => ({
      ...d,
      sentAt: new Date(d.sentAt),
    }))
  );
}
