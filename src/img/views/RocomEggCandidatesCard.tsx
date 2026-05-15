import React from 'react';
import HTML from './HTML.js';

type Props = {
  data: {
    keyword: string;
    count: string;
    candidates: Array<{
      id: string;
      name: string;
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

export default function RocomEggCandidatesCard({ data }: Props) {
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
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px dashed rgba(160, 140, 110, 0.4)'
            }}
          >
            <div
              style={{
                color: '#ffc65f',
                fontSize: '36px',
                fontWeight: 900,
                letterSpacing: '2px',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              查蛋候选结果
            </div>
            <div style={{ color: '#9e8e76', fontSize: '15px', marginTop: '6px' }}>
              关键词「{data.keyword}」命中 {data.count} 个候选，请使用更精确的名称
            </div>
          </div>

          {data.candidates.length > 0 ? (
            <div style={{ display: 'grid', gap: '14px', marginTop: '22px' }}>
              {data.candidates.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  style={{
                    background: 'rgba(255,255,255,0.94)',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    boxShadow: '0 10px 24px rgba(40, 31, 23, 0.08)',
                    border: '1px solid rgba(75, 52, 35, 0.08)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#4d3624'
                    }}
                  >
                    <span>{item.name}</span>
                    <span>#{item.id}</span>
                  </div>
                  <div style={{ marginTop: '10px', color: '#75563d', fontSize: '18px', lineHeight: 1.7 }}>
                    属性：{item.typeLabel}
                    <br />
                    蛋组：{item.eggGroupsLabel}
                    <br />
                    身高：{item.heightLabel} ｜ 体重：{item.weightLabel}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                fontSize: '24px',
                color: '#6f5845',
                padding: '48px 24px',
                background: 'rgba(255,255,255,0.6)',
                borderRadius: '18px',
                border: '1px solid rgba(201, 121, 38, 0.15)'
              }}
            >
              没有可展示的候选结果
            </div>
          )}

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
      </div>
    </HTML>
  );
}
