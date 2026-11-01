import type { RocomMerchantRoundCardData } from '@src/model/rocomMerchantRealtime';
import React from 'react';
import HTML from './HTML.js';

export default function RocomMerchantRoundCard({ data }: { data: RocomMerchantRoundCardData }) {
  return (
    <HTML style={{ width: '1120px', background: '#ece3d3' }}>
      <div
        style={{
          width: '1120px',
          padding: '26px',
          boxSizing: 'border-box',
          background: '#ece3d3',
          color: '#3a2f24',
          fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
        }}
      >
        <div
          style={{
            borderRadius: '30px',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #f6ecda 0%, #eadbbf 100%)',
            boxShadow: '0 24px 52px rgba(58, 39, 21, 0.14)'
          }}
        >
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '104px',
              padding: '0 34px',
              background: 'linear-gradient(90deg, #e9b04c, #d99a35)'
            }}
          >
            <div>
              <div style={{ fontSize: '40px', letterSpacing: '4px', fontWeight: 800, color: '#2c2013' }}>{data.title}</div>
              <div style={{ marginTop: '6px', color: '#6b4a13', fontSize: '16px' }}>
                {data.dateStr} · {data.timeRange} · 每日 08:00 / 12:00 / 16:00 / 20:00 刷新
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <span
                style={{
                  padding: '9px 16px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.74)',
                  color: '#3a2f24',
                  fontSize: '17px',
                  fontWeight: 800
                }}
              >
                {data.currentRoundLabel}
              </span>
              <span style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.62)', fontSize: '14px', color: '#bf5f3f' }}>
                剩余 {data.countdown}
              </span>
            </div>
          </header>

          <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '22px 30px 30px' }}>
            {data.goods.length > 0 ? (
              data.goods.map(item => (
                <section
                  key={`${item.goodsName}-${item.roundId}-${item.num}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 18px',
                    borderRadius: '20px',
                    border: '1px solid rgba(118, 97, 74, 0.14)',
                    background: item.isEnded ? 'rgba(240,234,222,0.78)' : 'rgba(255,255,255,0.85)',
                    opacity: item.isEnded ? 0.66 : 1
                  }}
                >
                  <span
                    style={{
                      flex: 'none',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '999px',
                      background: item.isHot ? '#d99a35' : 'rgba(118,97,74,0.14)',
                      color: item.isHot ? '#fff' : '#5c4a37',
                      fontSize: '17px',
                      fontWeight: 800
                    }}
                  >
                    {item.num}
                  </span>
                  {item.iconUrl ? (
                    <img
                      src={item.iconUrl}
                      alt={item.goodsName}
                      style={{ flex: 'none', width: '82px', height: '82px', objectFit: 'contain', borderRadius: '14px', background: 'rgba(255,255,255,0.6)' }}
                    />
                  ) : (
                    <div
                      style={{
                        flex: 'none',
                        width: '82px',
                        height: '82px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '14px',
                        background: '#e8dfcd',
                        color: '#8b7a63'
                      }}
                    >
                      无图
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '23px', fontWeight: 800, overflowWrap: 'break-word' }}>{item.goodsName}</span>
                      {item.isHot ? (
                        <span style={{ padding: '3px 9px', borderRadius: '999px', background: '#d99a35', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                          热销
                        </span>
                      ) : null}
                    </div>
                    <div style={{ marginTop: '6px', color: '#7f6e57', fontSize: '13px' }}>{item.timeLabel}</div>
                    <div style={{ marginTop: '6px', fontSize: '13px', color: '#8b7a63' }}>{item.remainingStr}</div>
                  </div>
                  <div style={{ flex: 'none', textAlign: 'right' }}>
                    <div style={{ color: '#b5791f', fontSize: '26px', fontWeight: 800 }}>{item.price > 0 ? item.price : '--'}</div>
                    <div style={{ color: '#8b7a63', fontSize: '12px' }}>价格</div>
                  </div>
                </section>
              ))
            ) : (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '40px',
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: '1px dashed rgba(120, 102, 81, 0.35)',
                  color: '#5c4a37',
                  fontSize: '18px'
                }}
              >
                当前轮次暂无商品。
              </div>
            )}
          </main>
        </div>
      </div>
    </HTML>
  );
}
