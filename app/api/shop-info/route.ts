import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('s') || searchParams.get('shopid');

  // shopId が存在しない、または 'undefined' / 'null' 文字列の場合
  if (!shopId || shopId === 'undefined' || shopId === 'null' || shopId.trim() === '') {
    return NextResponse.json(
      { success: false, error: '有効な shopId が必要です' },
      { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  }

  try {
    const doc = await db.collection('shops').doc(shopId.trim()).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: '店舗が見つかりません' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, max-age=0',
          }
        }
      );
    }

    const data = doc.data();
    return NextResponse.json({
      success: true,
      shopId: doc.id,
      name: data?.name || '登録店舗',
      coupon: data?.coupon || null,
      linkUrl: data?.linkUrl || '',
      iconUrl: data?.iconUrl || '',
      plan: data?.plan || 'free',
    }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      }
    });

  } catch (error: any) {
    console.error('[shop-info] エラー:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  }
}
