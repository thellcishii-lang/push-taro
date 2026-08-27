'use client';

import { useState } from 'react';

export default function AgencyPage() {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = () => {
    if (!agreed) {
      alert('代理店利用規約への同意が必要です。');
      return;
    }
    setLoading(true);
    // 決済ページ（Squareの加盟金決済URLなど）へリダイレクト
    window.location.href = 'https://square.link/u/your-agency-payment-link';
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 font-sans text-gray-800">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">公式パートナー・代理店募集</h1>
        <p className="text-gray-600 text-base md:text-lg">
          導入実績を伸ばす強力なインセンティブと、スムーズな運用体制をご用意しています。
        </p>
      </div>

      {/* 特徴・仕組み */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-2 text-blue-600">📈 超過累進報酬</h3>
          <p className="text-sm text-gray-600">
            1〜100件は30%、101〜200件は36%、201件以降は45%還元！紹介数に応じて単価がアップします。
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-2 text-blue-600">⚡ 手数料無料の受取り</h3>
          <p className="text-sm text-gray-600">
            運営側のPayPay銀行からあなたのPayPayへ直接送金。面倒な振込手数料やタイムラグがありません。
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-2 text-blue-600">💻 完全自動化システム</h3>
          <p className="text-sm text-gray-600">
            紹介店舗の管理や月別の明細・CSVダウンロードも専用の管理画面からいつでも確認可能です。
          </p>
        </div>
      </div>

      {/* 加盟金のご案内 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-8 rounded-2xl mb-10 text-center">
        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          期間限定キャンペーン
        </span>
        <h2 className="text-2xl font-bold mt-3 mb-2">代理店加盟金</h2>
        <div className="text-gray-400 line-through text-lg">通常 1,000,000円 (税別)</div>
        <div className="text-4xl md:text-5xl font-extrabold text-blue-600 my-2">
          今だけ 300,000円 <span className="text-lg font-normal text-gray-600">(税別)</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ※システム利用権および初期サポート費用を含みます。原則として返金はいたしかねます。
        </p>
      </div>

      {/* 規約の表示エリア */}
      <div className="bg-white border border-gray-300 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-lg mb-3">代理店利用規約（抜粋・重要事項）</h3>
        <div className="h-48 overflow-y-auto text-xs text-gray-600 bg-gray-50 p-4 rounded border border-gray-200 leading-relaxed space-y-2">
          <p><strong>第1条（目的）</strong> 本規約は、当社のサービスの販売促進活動を行う代理店の条件を定めます。</p>
          <p><strong>第2条（加盟金）</strong> 支払われた加盟金はシステムの利用権等の対価であり、理由の如何を問わず原則返金されません。</p>
          <p><strong>第3条（報酬算定）</strong> 有効なアクティブ店舗数に応じた超過累進報酬ロジックに基づき報酬を算定し、PayPay等へ送金します。</p>
          <p><strong>第4条（禁止事項）</strong> 虚偽の説明や誇大広告、その他当社の信用を傷つける行為を固く禁じます。</p>
          <p><strong>第5条（解除）</strong> 違反行為が認められた場合、直ちに契約解除およびアカウント停止の措置をとります。</p>
        </div>
        
        {/* 同意チェックボックス */}
        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="agreement"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="agreement" className="text-sm font-medium text-gray-700 cursor-pointer">
            上記「代理店利用規約」の内容を確認し、同意します。
          </label>
        </div>
      </div>

      {/* 申込ボタン */}
      <div className="text-center">
        <button
          onClick={handleApply}
          disabled={!agreed || loading}
          className={`w-full md:w-auto px-12 py-4 rounded-xl font-bold text-lg text-white shadow-md transition duration-200 ${
            agreed && !loading
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {loading ? '処理中...' : '加盟金（30万円）を決済して代理店に申し込む'}
        </button>
      </div>
    </main>
  );
}
