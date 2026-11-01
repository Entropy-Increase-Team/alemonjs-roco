import type { RocomHomePetsCardData } from '@src/model/rocomHomePets';
import React from 'react';
import HTML from './HTML.js';

export default function RocomHomePetsCard({ data }: { data: RocomHomePetsCardData }) {
  return (
    <HTML style={{ width: '1120px', background: '#f4ecdc' }}>
      <div
        style={{
          width: '1120px',
          padding: '26px',
          boxSizing: 'border-box',
          background: '#f4ecdc',
          color: '#33271a',
          fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            borderRadius: '28px',
            background: 'radial-gradient(circle at 10% 12%, rgba(255,231,177,0.52), transparent 28%), linear-gradient(180deg, #f7ecd5 0%, #efddbc 100%)',
            boxShadow: '0 26px 58px rgba(76, 55, 32, 0.18)'
          }}
        >
          <header
            style={{
              position: 'relative',
              minHeight: '104px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 34px',
              overflow: 'hidden',
              background: 'linear-gradient(90deg, #ffc95f, #f5b64c)'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2, fontSize: '42px', letterSpacing: '4px', fontWeight: 800, color: '#10100e' }}>{data.title}</div>
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ padding: '8px 16px', borderRadius: '999px', background: 'rgba(255,255,255,0.52)', color: '#79521b', fontSize: '17px' }}>
                UID {data.uid}
              </span>
              <span
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.72)',
                  color: '#4a2d0b',
                  fontSize: '17px',
                  fontWeight: 700
                }}
              >
                共 {data.total} 只 · 可收蛋 {data.eggCount} 只
              </span>
            </div>
          </header>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '18px 34px 0' }}>
            <div style={{ fontSize: '26px', fontWeight: 800 }}>{data.homeName}</div>
            <div style={{ color: '#7f6e57', fontSize: '15px' }}>
              {data.subtitle} · 数据更新时间：{data.updatedAt}
            </div>
          </div>

          <main style={{ padding: '16px 34px 30px' }}>
            {data.pets.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                {data.pets.map((pet, index) => (
                  <article
                    key={`${pet.id}-${pet.name}-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      borderRadius: '19px',
                      border: '1px solid rgba(143,113,73,0.12)',
                      background: pet.eggReady ? 'rgba(255,248,225,0.9)' : 'rgba(255,255,255,0.62)'
                    }}
                  >
                    {pet.iconUrl ? (
                      <img
                        src={pet.iconUrl}
                        alt=''
                        style={{ flex: 'none', width: '72px', height: '72px', objectFit: 'contain', borderRadius: '16px', background: '#ede7dc' }}
                      />
                    ) : (
                      <div
                        style={{
                          flex: 'none',
                          width: '72px',
                          height: '72px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#8d6e63',
                          background: '#ede7dc',
                          borderRadius: '16px',
                          fontSize: '20px'
                        }}
                      >
                        无图
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '21px', fontWeight: 800, color: '#33271a' }}>{pet.name}</span>
                        {pet.variantText ? (
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              background: 'rgba(206,147,216,0.24)',
                              color: '#8e44ad',
                              fontSize: '13px',
                              fontWeight: 700
                            }}
                          >
                            {pet.variantText}
                          </span>
                        ) : null}
                        {pet.eggReady ? (
                          <span
                            style={{ padding: '4px 10px', borderRadius: '999px', background: '#c8e6c9', color: '#1b5e20', fontSize: '13px', fontWeight: 700 }}
                          >
                            🥚 可收蛋
                          </span>
                        ) : null}
                      </div>
                      <div style={{ marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '14px', color: '#5f4d33' }}>
                        <span>Lv.{pet.level}</span>
                        <span>{pet.genderText}</span>
                        <span>体重 {pet.weightText}</span>
                        <span>声音 {pet.voiceText}</span>
                      </div>
                      {pet.eggText ? (
                        <div style={{ marginTop: '6px', fontSize: '14px', color: pet.eggReady ? '#1b5e20' : '#b36a19' }}>{pet.eggText}</div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ padding: '40px 18px', textAlign: 'center', color: '#8d6e63', fontSize: '18px' }}>{data.emptyText}</div>
            )}
          </main>
        </div>
      </div>
    </HTML>
  );
}
