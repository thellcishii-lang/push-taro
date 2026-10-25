'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import Link from 'next/link';

interface KeyInfo {
  hasKey: boolean;
  keyPrefix: string | null;
  createdAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

export default function PosIntegrationSection({ shopId, user }: { shopId: string; user: Pick<User, 'getIdToken'> }) {
  const [info, setInfo] = useState<KeyInfo | null>(null);
  const [plainKey, setPlainKey] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [revision, setRevision] = useState(0);
  const endpoint = `/api/pro-shop/pos-api-key?shopId=${encodeURIComponent(shopId)}`;

  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    setError('');
    void (async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'キー情報を取得できませんでした');
        if (!cancelled) setInfo(data);
      } catch (reason) {
        if (!cancelled) setError(reason instanceof Error ? reason.message : 'キー情報を取得できませんでした');
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => { cancelled = true; };
  }, [endpoint, user, revision]);

  const mutateKey = async (method: 'POST' | 'DELETE') => {
    const prompt = method === 'DELETE' ? 'APIキーを失効します。接続中のPOSは利用できなくなります。続けますか？'
      : info?.hasKey ? 'APIキーを再発行すると、現在のキーは即時失効します。すべてのPOSでキーの更新が必要です。続けますか？' : '';
    if (prompt && !window.confirm(prompt)) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const token = await user.getIdToken();
      const response = await fetch(endpoint, { method, headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'APIキーの更新に失敗しました');
      setPlainKey(method === 'POST' ? data.key : '');
      setMessage(data.message);
      setRevision((value) => value + 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'APIキーの更新に失敗しました');
    } finally {
      setBusy(false);
    }
  };

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(plainKey);
      setMessage('APIキーをコピーしました。安全な場所に保管してください。');
    } catch (reason) {
      console.error('APIキーのコピー失敗:', reason);
      setError('コピーできませんでした。表示されているキーを選択して手動でコピーしてください。');
    }
  };
  const date = (value: string | null) => value ? new Date(value).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) : 'なし';

  return <section>
    <h2>POS連携</h2>
    <p>店舗共通のAPIキーをPOS側に設定して、クーポンの確認と消し込みを連携します。POS側でのAPI接続開発・設定が必要です。</p>
    <p><Link href="/developers/pos-api">API仕様・接続サンプル</Link> / <Link href="/guide/pos-integration">導入ガイド</Link></p>
    {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    {message && <p role="status">{message}</p>}
    {busy && <p>処理中...</p>}
    {info && <dl>
      <dt>状態</dt><dd>{info.hasKey ? '有効' : info.revokedAt ? '失効済み' : '未発行'}</dd>
      <dt>キー識別子</dt><dd>{info.keyPrefix ? `${info.keyPrefix}…` : 'なし'}</dd>
      <dt>発行日時（日本時間）</dt><dd>{date(info.createdAt)}</dd>
      <dt>最終利用日時（日本時間）</dt><dd>{date(info.lastUsedAt)}</dd>
    </dl>}
    {plainKey && <div style={{ padding: 16, border: '1px solid #fdba74', borderRadius: 8, background: '#fff7ed', marginBottom: 16 }}>
      <p><strong>このキーは今回だけ表示されます。タブを閉じる前に保存してください。</strong> 第三者と共有しないでください。</p>
      <label htmlFor="pos-api-key">APIキー</label>
      <input id="pos-api-key" readOnly value={plainKey} autoComplete="off" spellCheck={false}
        style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: 10, margin: '8px 0', fontFamily: 'monospace' }} />
      <button type="button" onClick={copyKey}>キーをコピー</button>
    </div>}
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <button type="button" disabled={busy || !info} onClick={() => void mutateKey('POST')}>{info?.hasKey ? 'APIキーを再発行' : 'APIキーを発行'}</button>
      <button type="button" disabled={busy || !info?.hasKey} onClick={() => void mutateKey('DELETE')}>APIキーを失効</button>
      <button type="button" disabled={busy} onClick={() => setRevision((value) => value + 1)}>状態を更新</button>
    </div>
    <p style={{ color: '#64748b', fontSize: 13 }}>平文キーは画面の表示中だけ保持し、ブラウザの保存領域には記録しません。再発行すると以前のキーは使えなくなります。</p>
  </section>;
}
