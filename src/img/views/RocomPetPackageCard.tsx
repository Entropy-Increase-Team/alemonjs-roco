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

const tabs = ['全部', '了不起', '异色', '炫彩'];
const width = 1320;
const columns = 5;

function getTypeTokens(types: string) {
  return String(types || '')
    .split(/[、/\s]+/u)
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 2);
}

export default function RocomPetPackageCard({ data }: Props) {
  const { currentTab, userName, userLevel, userUid, totalCount, currentPage, totalPages, accountLabel, pets, pageSize } = data;
  const emptySlots = Math.max(pageSize - pets.length, 0);

  return (
    <HTML style={{ width: `${width}px`, background: '#1b1d18' }}>
      <div
        style={{
          width: `${width}px`,
          padding: '30px',
          boxSizing: 'border-box',
          background:
            'radial-gradient(circle at top left, rgba(255,206,109,0.22), transparent 28%), radial-gradient(circle at top right, rgba(122,181,202,0.18), transparent 24%), linear-gradient(180deg, #272b24 0%, #171914 100%)'
        }}
      >
        <div
          style={{
            minWidth: '900px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '20px',
            padding: '16px 20px 16px',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '18px',
                    background: 'linear-gradient(180deg, #ffd87b 0%, #ffc65f 100%)',
                    color: '#272624',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 800
                  }}
                >
                  洛
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#f4eee1', fontSize: '22px', fontWeight: 800 }}>{userName}</span>
                    <span
                      style={{
                        backgroundColor: '#ffc966',
                        color: '#272624',
                        fontSize: '14px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        lineHeight: 1.2
                      }}
                    >
                      Lv. {userLevel}
                    </span>
                  </div>
                  <span style={{ color: '#a8a69f', fontSize: '14px' }}>ID:{userUid || '未返回'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    color: '#f4eee1',
                    fontSize: '24px',
                    fontWeight: 800,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    lineHeight: 1
                  }}
                >
                  我的精灵
                </div>
                <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '15px' }}>
                  {tabs.map(item => (
                    <li
                      key={item}
                      style={{
                        color: item === currentTab ? '#f4eee1' : '#a8a69f',
                        fontSize: '16px',
                        padding: '2px 0',
                        borderBottom: item === currentTab ? '2px solid #ffc65f' : '2px solid transparent',
                        fontWeight: 700
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', flex: 1 }}>
                <span style={{ color: '#f1b958', fontSize: '16px', fontWeight: 800 }}>当前查看：{currentTab}</span>
                <span style={{ color: '#f4eee1', fontSize: '14px' }}>总计持有：{totalCount}</span>
                <span style={{ color: '#f4eee1', fontSize: '14px' }}>当前账号：{accountLabel}</span>
              </div>
            </div>

            <main style={{ marginTop: '5px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1.9rem)`,
                  gridTemplateRows: 'repeat(2, 2.6rem)',
                  gap: '0.2rem 0.25rem',
                  justifyContent: 'center'
                }}
              >
                {pets.length > 0 ? (
                  <>
                    {pets.map((pet, index) => (
                      <div
                        key={`${pet.name}-${index}`}
                        style={{
                          width: '1.9rem',
                          height: '2.6rem',
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
                          borderRadius: '0.28rem',
                          border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            padding: '0.15rem 0.2rem 0',
                            zIndex: 2
                          }}
                        >
                          <div style={{ display: 'flex', gap: '0.05rem' }}>
                            {getTypeTokens(pet.types).length > 0 ? (
                              getTypeTokens(pet.types).map((token, tokenIndex) => (
                                <div
                                  key={`${pet.name}-${token}-${tokenIndex}`}
                                  style={{
                                    width: '0.28rem',
                                    height: '0.28rem',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.14)',
                                    color: '#f4eee1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.12rem',
                                    fontWeight: 700
                                  }}
                                >
                                  {token.slice(0, 1)}
                                </div>
                              ))
                            ) : (
                              <div
                                style={{
                                  width: '0.28rem',
                                  height: '0.28rem',
                                  borderRadius: '50%',
                                  background: 'rgba(255,255,255,0.14)',
                                  color: '#f4eee1',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.14rem'
                                }}
                              >
                                ?
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: '0.22rem', color: '#555350', fontWeight: 800 }}>LV.{pet.level}</div>
                        </div>

                        <div
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            position: 'relative',
                            paddingTop: '0.1rem'
                          }}
                        >
                          <div style={{ width: '1.7rem', height: '1.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {pet.imageUrl ? (
                              <img
                                src={pet.imageUrl}
                                alt={pet.name}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain',
                                  filter: 'drop-shadow(0 0.06rem 0.12rem rgba(0, 0, 0, 0.18))'
                                }}
                              />
                            ) : (
                              <div style={{ color: '#7d7568', fontSize: '0.2rem', fontWeight: 800 }}>空位</div>
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            width: '100%',
                            height: '0.45rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            bottom: '0.06rem',
                            left: 0,
                            right: 0
                          }}
                        >
                          <span
                            style={{
                              color: '#272624',
                              fontSize: '0.22rem',
                              fontWeight: 800,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              padding: '0 0.06rem'
                            }}
                          >
                            {pet.name}
                          </span>
                        </div>
                      </div>
                    ))}

                    {Array.from({ length: emptySlots }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        style={{
                          width: '1.9rem',
                          height: '2.6rem',
                          borderRadius: '0.28rem',
                          border: '1px dashed rgba(255,255,255,0.12)',
                          background: 'rgba(255,255,255,0.03)',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          opacity: 0.42
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.15rem 0.2rem 0' }}>
                          <div />
                          <div style={{ fontSize: '0.22rem', color: '#555350', fontWeight: 800 }}>--</div>
                        </div>
                        <div
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#7d7568',
                            fontSize: '0.2rem',
                            fontWeight: 800
                          }}
                        >
                          空位
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '0.45rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            bottom: '0.06rem',
                            left: 0,
                            right: 0,
                            color: '#272624',
                            fontSize: '0.22rem',
                            fontWeight: 800
                          }}
                        >
                          待补位
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      minHeight: '5.4rem',
                      gridColumn: '1 / -1',
                      borderRadius: '0.24rem',
                      border: '1px dashed rgba(255, 255, 255, 0.18)',
                      background: 'rgba(0, 0, 0, 0.14)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.12rem'
                    }}
                  >
                    <div style={{ color: '#f4eee1', fontSize: '0.24rem', fontWeight: 800 }}>这一页暂时没有精灵</div>
                    <div style={{ color: '#b9b1a2', fontSize: '0.15rem' }}>试试切换分类或页码重新查询</div>
                  </div>
                )}
              </div>
            </main>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '14px',
                fontSize: '14px',
                color: 'rgba(244,239,226,0.66)'
              }}
            >
              <span>
                第 {currentPage} 页，共 {totalPages} 页，每页 {pageSize} 只精灵
              </span>
              <span>翻页：+精灵列表 &lt;了不起|异色|炫彩&gt; &lt;页码&gt;</span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
}
