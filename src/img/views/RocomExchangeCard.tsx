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
    filterLabel: string;
    commandHint: string;
    posters: Poster[];
  };
};

const width = 1010;

function renderProvideItems(items: string[]) {
  if (items.length === 0) {
    return <span style={{ color: 'rgba(73, 58, 44, 0.58)', fontSize: '18px', fontWeight: 700 }}>未填写</span>;
  }

  return items.map(item => (
    <div
      key={item}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '34px',
        padding: '0 12px',
        borderRadius: '10px',
        background: '#f3e8d1',
        color: '#5c4a39',
        fontSize: '17px',
        fontWeight: 800,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)'
      }}
    >
      {item}
    </div>
  ));
}

function renderPoster(poster: Poster, index: number) {
  return (
    <div
      key={`${poster.userId}-${index}`}
      style={{
        width: '319px',
        minHeight: '232px',
        borderRadius: '14px',
        background: poster.isExpired ? '#ddd2bc' : '#faf3e0',
        padding: '30px 22px 16px',
        boxSizing: 'border-box',
        position: 'relative',
        boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
        border: '1px solid rgba(255,255,255,0.08)',
        opacity: poster.isExpired ? 0.8 : 1
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '18px',
          color: '#6b5a49',
          fontSize: '15px',
          fontWeight: 700
        }}
      >
        {poster.timeLabel}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#2f2a26',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
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
          ) : null}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: '#2f251d',
              fontSize: '22px',
              fontWeight: 900,
              lineHeight: 1.1,
              maxWidth: '190px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {poster.userName}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <div
              style={{
                borderRadius: '999px',
                background: '#dfd7c0',
                color: '#181817',
                padding: '4px 9px',
                fontSize: '12px',
                fontWeight: 900
              }}
            >
              LV{poster.userLevel}
            </div>
            <div
              style={{
                borderRadius: '999px',
                background: poster.isOnline ? '#91e400' : '#6b6b6b',
                color: poster.isOnline ? '#272727' : '#d7d7d7',
                padding: '4px 9px',
                fontSize: '12px',
                fontWeight: 900
              }}
            >
              {poster.isOnline ? '在线' : '离线'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <i
            style={{
              display: 'inline-block',
              width: '4px',
              height: '18px',
              borderRadius: '999px',
              background: '#f0a53a'
            }}
          />
          <span style={{ color: '#4d3d2f', fontSize: '15px', fontWeight: 900 }}>我想拥有</span>
        </div>
        <div
          style={{
            color: '#2f251d',
            fontSize: '18px',
            fontWeight: 800,
            lineHeight: 1.35,
            minHeight: '48px',
            paddingTop: '4px'
          }}
        >
          {poster.wantText}
        </div>
      </div>

      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <i
            style={{
              display: 'inline-block',
              width: '4px',
              height: '18px',
              borderRadius: '999px',
              background: '#f0a53a'
            }}
          />
          <span style={{ color: '#4d3d2f', fontSize: '15px', fontWeight: 900 }}>我能提供</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '42px', alignItems: 'flex-start' }}>
          {renderProvideItems(poster.provideItems)}
        </div>
      </div>

      <div
        style={{
          marginTop: '14px',
          width: '100%',
          borderRadius: '8px',
          background: '#e0d5ba',
          color: '#5a4b3c',
          padding: '8px 12px',
          boxSizing: 'border-box',
          boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.45)',
          textAlign: 'center',
          fontSize: '17px',
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
    <HTML style={{ width: `${width}px`, background: 'transparent' }}>
      <div
        style={{
          width: '960px',
          padding: '25px',
          boxSizing: 'border-box',
          background:
            'linear-gradient(rgba(30, 26, 22, 0.72), rgba(30, 26, 22, 0.72)), radial-gradient(circle at top left, rgba(255, 206, 108, 0.18), transparent 22%), linear-gradient(180deg, #5a4634 0%, #2a221d 34%, #181411 100%)',
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'top'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#ffc966',
                  letterSpacing: '2px'
                }}
              >
                交换大厅
              </span>
              <span style={{ color: '#eeddbb', fontSize: '18px', marginTop: '6px' }}>当前筛选：{data.filterLabel}</span>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                gap: '24px 28px',
                minHeight: '556px',
                alignContent: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {data.posters.map((poster, index) => renderPoster(poster, index))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '14px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255,255,255,0.12)',
                color: '#f2e7ce',
                fontSize: '18px',
                fontWeight: 800
              }}
            >
              <span>
                第 {data.pageNo} 页，共 {data.totalPages} 页
              </span>
              <span style={{ color: '#d6c8a7', fontSize: '16px' }}>{data.commandHint}</span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
}
