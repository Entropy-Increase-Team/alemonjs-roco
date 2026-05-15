import React from 'react';
import HTML from './HTML.js';

type Props = {
  data: {
    name: string;
    attribute: string;
    category: string;
    cost: string;
    power: string;
    description: string;
    commandHint: string;
    updatedAt: string;
    copyright: string;
    resultHint: string;
  };
};

const width = 920;

export default function SkillWikiCard({ data }: Props) {
  return (
    <HTML style={{ width: `${width}px`, background: 'linear-gradient(180deg, #f6f1e5 0%, #ece6d9 100%)' }}>
      <div
        style={{
          width: '920px',
          margin: '0 auto',
          padding: '22px 18px 28px',
          boxSizing: 'border-box',
          color: '#2a2218'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 260px',
            gap: '16px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(250,244,233,0.96))',
            border: '1px solid rgba(113, 96, 78, 0.18)',
            borderRadius: '28px',
            padding: '22px 24px',
            boxShadow: '0 18px 40px rgba(77, 56, 30, 0.08)'
          }}
        >
          <div>
            <div style={{ color: '#2f6fda', fontSize: '18px', letterSpacing: '1px', fontWeight: 900 }}>ROCOM BWIKI STYLE</div>
            <h1
              style={{
                margin: '8px 0 0',
                fontSize: '48px',
                lineHeight: 1.05,
                wordBreak: 'break-word'
              }}
            >
              {data.name}
            </h1>
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
              {[data.attribute, data.category].map(item => (
                <span
                  key={item}
                  style={{
                    borderRadius: '999px',
                    padding: '8px 14px',
                    fontSize: '18px',
                    background: 'rgba(42, 34, 24, 0.06)',
                    border: '1px solid rgba(42, 34, 24, 0.08)'
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
            <div
              style={{
                marginTop: '18px',
                fontSize: '18px',
                lineHeight: 1.8,
                color: '#786451',
                wordBreak: 'break-word'
              }}
            >
              {data.description}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '14px', alignContent: 'center' }}>
            <div
              style={{
                borderRadius: '24px',
                padding: '18px 20px',
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(42, 34, 24, 0.08)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '18px', color: '#786451' }}>PP</div>
              <div style={{ marginTop: '8px', fontSize: '52px', color: '#d57f24', fontWeight: 900 }}>{data.cost}</div>
            </div>
            <div
              style={{
                borderRadius: '24px',
                padding: '18px 20px',
                background: 'linear-gradient(135deg, rgba(213,127,36,0.12), rgba(255,238,214,0.92))',
                border: '1px solid rgba(42, 34, 24, 0.08)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '18px', color: '#786451' }}>威力</div>
              <div style={{ marginTop: '8px', fontSize: '52px', color: '#d57f24', fontWeight: 900 }}>{data.power}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '18px' }}>
          <section
            style={{
              background: 'rgba(252, 249, 242, 0.95)',
              border: '1px solid rgba(113, 96, 78, 0.18)',
              borderRadius: '24px',
              padding: '18px 20px',
              boxShadow: '0 12px 30px rgba(77, 56, 30, 0.05)'
            }}
          >
            <div style={{ fontSize: '26px', marginBottom: '14px', fontWeight: 900 }}>技能说明</div>
            <div style={{ fontSize: '18px', lineHeight: 1.9, color: '#4d4032', wordBreak: 'break-word' }}>{data.description}</div>
          </section>

          <section
            style={{
              background: 'rgba(252, 249, 242, 0.95)',
              border: '1px solid rgba(113, 96, 78, 0.18)',
              borderRadius: '24px',
              padding: '18px 20px',
              boxShadow: '0 12px 30px rgba(77, 56, 30, 0.05)'
            }}
          >
            <div style={{ fontSize: '26px', marginBottom: '14px', fontWeight: 900 }}>基础信息</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
              {[
                ['属性', data.attribute],
                ['类别', data.category],
                ['PP', data.cost],
                ['威力', data.power]
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    borderRadius: '18px',
                    padding: '18px',
                    background: 'rgba(255,255,255,0.82)',
                    border: '1px solid rgba(42, 34, 24, 0.06)'
                  }}
                >
                  <div style={{ fontSize: '17px', color: '#786451' }}>{label}</div>
                  <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 700, wordBreak: 'break-word' }}>{value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div
          style={{
            marginTop: '18px',
            padding: '16px 8px 0',
            borderTop: '1px solid rgba(113, 96, 78, 0.16)',
            display: 'grid',
            gap: '6px',
            color: '#7a6757',
            fontSize: '15px',
            wordBreak: 'break-word'
          }}
        >
          <div>{data.commandHint}</div>
          <div>{data.resultHint}</div>
          <div>Updated: {data.updatedAt}</div>
          <div>{data.copyright}</div>
        </div>
      </div>
    </HTML>
  );
}
