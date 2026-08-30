import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  let uid: string;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch (err: any) {
    return NextResponse.json({ error: '無効な認証トークンです' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, referralCode } = body;

    const existing = await db.collection('shops').where('ownerUid', '==', uid).limit(1).get();
    if (!existing.empty) {
      const doc = existing.docs[0];
      return NextResponse.json({ 
        success: true, 
        shopId: doc.id,
        exists: true,
        shop: doc.data()
      }, { status: 200 });
    }

    const shopName = name || '未設定の店舗';
    let referrerInfo = null;

    // 紹介コードが存在する場合、所有者（代理店またはProユーザー）を検索
    if (referralCode) {
      const referralQuery = await db.collection('referrals')
        .where('code', '==', referralCode.trim())
        .limit(1)
        .get();

      if (!referralQuery.empty) {
        const refDoc = referralQuery.docs[0].data();
        referrerInfo = {
          referrerId: refDoc.userId,
          referredByCode: referralCode.trim(),
          referrerType: refDoc.type, // 'agency' | 'pro'
          referrerEmail: refDoc.email,
        };
      }
    }

    const shopRef = db.collection('shops').doc();
    const shopData: any = {
      name: shopName,
      ownerUid: uid,
      createdAt: FieldValue.serverTimestamp(),
      coupon: { enabled: false, title: '', description: '', discountRate: 0 },
      linkUrl: '',
      iconUrl: '',
    };

    if (referrerInfo) {
      shopData.referrerId = referrerInfo.referrerId;
      shopData.referredByCode = referrerInfo.referredByCode;
      shopData.referrerType = referrerInfo.referrerType;
    }

    await shopRef.set(shopData);

    // 紹介者が存在する場合、ダッシュボード通知とメール送信を実行
    if (referrerInfo) {
      // 1. ダッシュボード用通知（notifications）を作成
      await db.collection('notifications').add({
        targetUserId: referrerInfo.referrerId,
        type: 'new_referral',
        shopId: shopRef.id,
        shopName: shopName,
        referralCode: referrerInfo.referredByCode,
        isRead: false,
        createdAt: FieldValue.serverTimestamp(),
      });

      // 2. 紹介者へメール通知を送信
      if (referrerInfo.referrerEmail) {
        const html = `
          <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
            <h2>【プッシュ太郎】新規店舗のお申し込み</h2>
            <p>ご設定の紹介コードを経由して、新しい店舗が登録されました。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <ul>
              <li><strong>店舗名（顧客名）:</strong> ${shopName}</li>
              <li><strong>使用紹介コード:</strong> ${referrerInfo.referredByCode}</li>
              <li><strong>対象プラン種別:</strong> ${referrerInfo.referrerType === 'agency' ? '代理店紹介' : 'Proユーザー紹介'}</li>
            </ul>
            <p>詳細および現在の顧客一覧はダッシュボードよりご確認ください。</p>
          </div>
        `;

        await sendEmail({
          to: referrerInfo.referrerEmail,
          subject: `【プッシュ太郎】紹介コード [${referrerInfo.referredByCode}] から新店舗（${shopName}）が登録されました`,
          html,
        });
      }
    }

    return NextResponse.json({ success: true, shopId: shopRef.id, exists: false }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'サーバーエラー',
      detail: error.message 
    }, { status: 500 });
  }
}
