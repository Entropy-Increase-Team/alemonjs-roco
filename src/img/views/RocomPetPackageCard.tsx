import React from 'react';
import HTML from './HTML.js';

type PetCard = {
  name: string;
  level: string;
  types: string;
  rarity: string;
  imageUrl: string;
};

type Props = {
  data: {
    currentTab: string;
    userName: string;
    userLevel: string;
    userUid: string;
    totalCount: number;
    currentPage: number;
    totalPages: number;
    accountLabel: string;
    pets: PetCard[];
    pageSize: number;
  };
};

const columns = 5;
const width = 1280;

function getRarityColor(value: string): string {
  if (value === '了不起') {
    return '#ffca5c';
  }

  if (value === '异色') {
    return '#6ed6ff';
  }

  if (value === '炫彩') {
    return '#ff7de1';
  }

  return '#8fb47a';
}

export default function RocomPetPackageCard({ data }: Props) {
  const { currentTab, userName, userLevel, userUid, totalCount, currentPage, totalPages, accountLabel, pets, pageSize } = data;
  const emptySlots = Math.max(pageSize - pets.length, 0);
  const rows = Math.ceil(pageSize / columns);

  return (
    <HTML style={{ width: `${width}px`, background: 'linear-gradient(180deg, #1f221d 0%, #11130f 100%)' }}>
      <div
        style={{
          width: `${width}px`,
          minHeight: `${rows * 260 + 280}px`,
          boxSizing: 'border-box',
          padding: '28px',
          background:
            'radial-gradient(circle at top left, rgba(255, 206, 109, 0.22), transparent 28%), radial-gradient(circle at top right, rgba(122, 181, 202, 0.18), transparent 24%), linear-gradient(180deg, #272b24 0%, #171914 100%)',
          color: '#f4efe2'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 6px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '30%', textAlign: 'left' }}>
            <div style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '2px' }}>我的精灵</div>
            <div style={{ fontSize: '18px', color: '#d9d1bd' }}>
              {userName} · Lv.{userLevel}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(244,239,226,0.62)' }}>ID: {userUid || '未返回'} </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '40%' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['全部', '了不起', '异色', '炫彩'].map(item => (
                <span
                  key={item}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '15px',
                    fontWeight: 800,
                    background: item === currentTab ? 'linear-gradient(135deg, #ffcc67, #ff9758)' : 'rgba(255,255,255,0.08)',
                    color: item === currentTab ? '#2f2312' : '#f4efe2'
                  }}
                >
                  {item === '全部' ? '全部精灵' : `${item}精灵`}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(244,239,226,0.72)' }}>当前账号：{accountLabel}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '30%', textAlign: 'right' }}>
            <div style={{ fontSize: '16px', color: '#f3bf66', fontWeight: 800 }}>当前查看：{currentTab}</div>
            <div style={{ fontSize: '15px', color: '#f4efe2' }}>总计持有：{totalCount}</div>
            <div style={{ fontSize: '15px', color: '#f4efe2' }}>
              第 {currentPage} / {totalPages} 页
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '22px',
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '18px'
          }}
        >
          {pets.map((pet, index) => (
            <div
              key={`${pet.name}-${index}`}
              style={{
                borderRadius: '28px',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 18px 38px rgba(0,0,0,0.28)',
                height: '252px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 0' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '58px',
                    height: '28px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#f4efe2',
                    fontSize: '13px',
                    fontWeight: 800
                  }}
                >
                  {pet.types}
                </span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffe19b' }}>Lv.{pet.level}</span>
              </div>

              <div
                style={{
                  height: '150px',
                  margin: '8px 14px 0',
                  borderRadius: '24px',
                  background:
                    'radial-gradient(circle at top, rgba(255,255,255,0.22), transparent 35%), linear-gradient(180deg, rgba(252,233,187,0.72), rgba(242,193,101,0.22))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {pet.imageUrl ? (
                  <img
                    src={pet.imageUrl}
                    alt={pet.name}
                    style={{
                      maxWidth: '92%',
                      maxHeight: '92%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 12px 22px rgba(0,0,0,0.22))'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '48px', fontWeight: 900, color: 'rgba(0,0,0,0.18)' }}>{pet.name.slice(0, 1)}</div>
                )}
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  right: '14px',
                  bottom: '14px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #f6d27c 0%, #d88f43 100%)',
                  color: '#2f2312',
                  padding: '10px 14px'
                }}
              >
                <div style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1.1 }}>{pet.name}</div>
                <div style={{ marginTop: '4px', fontSize: '13px', fontWeight: 800, color: '#573e1b' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: getRarityColor(pet.rarity),
                      color: pet.rarity === '常规' ? '#16301d' : '#29151f'
                    }}
                  >
                    {pet.rarity}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {Array.from({ length: emptySlots }).map((_, index) => (
            <div
              key={`empty-${index}`}
              style={{
                borderRadius: '28px',
                border: '1px dashed rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.03)',
                height: '252px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(244,239,226,0.36)',
                fontSize: '28px',
                fontWeight: 900
              }}
            >
              空位
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '14px',
            fontSize: '14px',
            color: 'rgba(244,239,226,0.66)'
          }}
        >
          <span>翻页：+精灵列表 &lt;了不起|异色|炫彩&gt; &lt;页码&gt;</span>
          <span>Powered by alemonjs</span>
        </div>
      </div>
    </HTML>
  );
}
