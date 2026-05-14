import React from 'react';
import HTML from './HTML.js';

type Poster = {
  userName: string;
  userLevel: number;
  isOnline: boolean;
  userId: string;
  wantText: string;
  provideItems: string[];
  timeLabel: string;
  isExpired: boolean;
  avatarUrl: string;
};

type Props = {
  data: {
    pageNo: number;
    totalPages: number;
    refresh: boolean;
    posters: Poster[];
  };
};

const width = 1080;

function renderPoster(poster: Poster, index: number) {
  return (
    <div
      key={`${poster.userId}-${index}`}
      style={{
        borderRadius: '28px',
        background: poster.isExpired
          ? 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
          : 'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '18px',
        boxShadow: '0 18px 36px rgba(0,0,0,0.22)',
        opacity: poster.isExpired ? 0.72 : 1
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f7d88a, #b77444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 10px 22px rgba(0,0,0,0.22)'
            }}
          >
            {poster.avatarUrl ? (
              <img
                src={poster.avatarUrl}
                alt={poster.userName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#3a2415' }}>{poster.userName.slice(0, 1)}</div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#f5efdf' }}>{poster.userName}</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '5px 10px',
                  borderRadius: '999px',
                  background: '#dfd7c0',
                  color: '#181817',
                  fontSize: '13px',
                  fontWeight: 900
                }}
              >
                LV{poster.userLevel}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '5px 10px',
                  borderRadius: '999px',
                  background: poster.isOnline ? '#91e400' : '#6b6b6b',
                  color: poster.isOnline ? '#272727' : '#cccccc',
                  fontSize: '13px',
                  fontWeight: 900
                }}
              >
                {poster.isOnline ? '在线' : '离线'}
              </span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(245,239,223,0.74)' }}>{poster.timeLabel}</div>
      </div>

      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '14px' }}>
        <div
          style={{
            borderRadius: '22px',
            background: 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#ffc867', marginBottom: '10px' }}>我想拥有</div>
          <div style={{ fontSize: '18px', lineHeight: 1.45, color: '#f5efdf', fontWeight: 700 }}>{poster.wantText}</div>
        </div>

        <div
          style={{
            borderRadius: '22px',
            background: 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#ffc867', marginBottom: '10px' }}>我能提供</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {poster.provideItems.length > 0 ? (
              poster.provideItems.map(item => (
                <span
                  key={item}
                  style={{
                    display: 'inline-block',
                    padding: '7px 10px',
                    borderRadius: '12px',
                    background: 'rgba(255,200,103,0.14)',
                    color: '#f5efdf',
                    fontSize: '13px',
                    fontWeight: 800
                  }}
                >
                  {item}
                </span>
              ))
            ) : (
              <span style={{ color: 'rgba(245,239,223,0.56)', fontSize: '14px' }}>未填写</span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '14px',
          borderRadius: '16px',
          background: '#e0d5ba',
          color: '#5a4b3c',
          padding: '10px 14px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 900
        }}
      >
        ID: {poster.userId}
      </div>
    </div>
  );
}

export default function RocomExchangeCard({ data }: Props) {
  return (
    <HTML style={{ width: `${width}px`, background: 'linear-gradient(180deg, #1d1916 0%, #11100f 100%)' }}>
      <div
        style={{
          width: `${width}px`,
          boxSizing: 'border-box',
          padding: '28px',
          background:
            'radial-gradient(circle at top left, rgba(255,201,102,0.16), transparent 24%), radial-gradient(circle at top right, rgba(255,255,255,0.08), transparent 18%), linear-gradient(180deg, #2a221d 0%, #151210 100%)',
          color: '#f5efdf'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '18px'
          }}
        >
          <div>
            <div style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '2px', color: '#ffc966' }}>交换大厅</div>
            <div style={{ marginTop: '8px', fontSize: '16px', color: '#e8d7b8' }}>{data.refresh ? '当前模式：强制刷新' : '当前模式：普通查询'}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '15px', color: 'rgba(245,239,223,0.74)' }}>
            <div>
              第 {data.pageNo} / {data.totalPages} 页
            </div>
            <div style={{ marginTop: '6px' }}>交换大厅 &lt;页码&gt; [刷新]</div>
          </div>
        </div>

        <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {data.posters.map((poster, index) => renderPoster(poster, index))}
        </div>
      </div>
    </HTML>
  );
}
