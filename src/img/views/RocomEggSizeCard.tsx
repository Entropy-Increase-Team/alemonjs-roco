import React from 'react';
import HTML from './HTML.js';

type Props = {
  data: {
    queryLabel: string;
    hasResults: boolean;
    perfectMatches: Array<{
      id: string;
      name: string;
      icon: string;
      typeLabel: string;
      eggGroupsLabel: string;
      heightLabel: string;
      weightLabel: string;
    }>;
    rangeMatches: Array<{
      id: string;
      name: string;
      icon: string;
      typeLabel: string;
      eggGroupsLabel: string;
      heightLabel: string;
      weightLabel: string;
    }>;
    commandHint: string;
    copyright: string;
  };
};

const width = 820;

function renderMatchCard(
  item: {
    id: string;
    name: string;
    icon: string;
    typeLabel: string;
    eggGroupsLabel: string;
    heightLabel: string;
    weightLabel: string;
  },
  key: string
) {
  return (
    <div
      key={key}
      style={{
        background: 'rgba(255,255,255,0.94)',
        borderRadius: '18px',
        padding: '18px',
        boxShadow: '0 10px 24px rgba(40, 31, 23, 0.08)',
        border: '1px solid rgba(75, 52, 35, 0.08)'
      }}
    >
      {item.icon ? (
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(248,244,236,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            border: '1px solid rgba(75, 52, 35, 0.08)'
          }}
        >
          <img src={item.icon} alt={item.name} style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
        </div>
      ) : null}
      <div style={{ fontSize: '26px', fontWeight: 700, color: '#4d3624' }}>
        {item.name} #{item.id}
      </div>
      <div style={{ marginTop: '8px', color: '#75563d', fontSize: '18px', lineHeight: 1.7 }}>
        属性：{item.typeLabel}
        <br />
        蛋组：{item.eggGroupsLabel}
        <br />
        身高：{item.heightLabel} ｜ 体重：{item.weightLabel}
      </div>
    </div>
  );
}

export default function RocomEggSizeCard({ data }: Props) {
  return (
    <HTML style={{ width: `${width}px`, background: '#faf6ed' }}>
      <div
        style={{
          width: '820px',
          background: 'linear-gradient(180deg, #fbf6ec 0%, #f5efe3 100%)',
          position: 'relative',
          padding: '40px 45px',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.72)',
            borderRadius: '22px',
            padding: '22px 28px',
            border: '1px solid rgba(201, 121, 38, 0.18)',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#5a3e1b', letterSpacing: '2px' }}>尺寸反查</div>
          <div style={{ fontSize: '18px', color: '#84674d', marginTop: '8px' }}>查询条件：{data.queryLabel}</div>
        </div>

        {!data.hasResults ? (
          <div
            style={{
              textAlign: 'center',
              color: '#6f5845',
              padding: '44px 20px',
              fontSize: '24px',
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '20px',
              border: '1px solid rgba(201, 121, 38, 0.15)'
            }}
          >
            没有找到匹配当前尺寸的精灵
          </div>
        ) : null}

        {data.perfectMatches.length > 0 ? (
          <section style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#4b3423', marginBottom: '14px' }}>完美匹配</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
              {data.perfectMatches.map((item, index) => renderMatchCard(item, `perfect-${index}`))}
            </div>
          </section>
        ) : null}

        {data.rangeMatches.length > 0 ? (
          <section style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#4b3423', marginBottom: '14px' }}>范围匹配</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
              {data.rangeMatches.map((item, index) => renderMatchCard(item, `range-${index}`))}
            </div>
          </section>
        ) : null}

        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px',
            color: '#9e8e76',
            fontSize: '15px'
          }}
        >
          <span>{data.commandHint}</span>
          <span>{data.copyright}</span>
        </div>
      </div>
    </HTML>
  );
}
