import React from 'react';
import HTML from './HTML.js';

type Props = {
  data: {
    petName: string;
    petId: string;
    petIcon: string;
    typeLabel: string;
    eggGroups: string[];
    eggGroupsLabel: string;
    maleRate: number | null;
    femaleRate: number | null;
    hatchLabel: string;
    weightLabel: string;
    heightLabel: string;
    totalStats: string;
    totalCompatible: string;
    isUndiscovered: boolean;
    commandHint: string;
    copyright: string;
    sections: Array<{
      id: string;
      label: string;
      count: string;
      members: Array<{
        name: string;
        meta: string;
      }>;
      hasMore: boolean;
      remainCount: string;
    }>;
    eggDetails: null | {
      preciousEggLabel: string;
      baseProbText: string;
      addProbText: string;
      contactAddText: string;
      variantCount: string;
    };
  };
};

const width = 820;

export default function RocomEggCard({ data }: Props) {
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
              🥚 精灵查蛋
            </div>
            <div style={{ color: '#9e8e76', fontSize: '15px', marginTop: '6px' }}>蛋组查询 · 配种兼容一览</div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '18px',
              padding: '22px 28px',
              marginBottom: '20px',
              border: '1px solid rgba(201, 121, 38, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '18px',
                    background: 'rgba(255,255,255,0.92)',
                    border: '1px solid rgba(201, 121, 38, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  {data.petIcon ? (
                    <img
                      src={data.petIcon}
                      alt={data.petName}
                      style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'contain'
                      }}
                    />
                  ) : null}
                </div>
                <div>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#5a3e1b' }}>{data.petName}</span>
                  <span style={{ fontSize: '14px', color: '#8c7a61', marginLeft: '8px' }}>#{data.petId}</span>
                </div>
              </div>
              <span
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #fde68a, #fbbf24)',
                  color: '#5a3e1b',
                  fontSize: '13px',
                  fontWeight: 900,
                  padding: '3px 12px',
                  borderRadius: '20px'
                }}
              >
                {data.typeLabel}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {data.eggGroups.map(item => (
                <span
                  key={item}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: item === '未发现' ? 'linear-gradient(135deg, #fecaca, #fca5a5)' : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    color: item === '未发现' ? '#991b1b' : '#5a3e1b',
                    fontSize: '14px',
                    fontWeight: 900,
                    padding: '5px 14px',
                    borderRadius: '20px',
                    border: '1px solid rgba(201, 121, 38, 0.3)'
                  }}
                >
                  {item === '未发现' ? '🚫 未发现' : `🥚 ${item}`}
                </span>
              ))}
            </div>

            {data.maleRate !== null && data.femaleRate !== null ? (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', color: '#8c7a61', marginBottom: '6px' }}>性别比例</div>
                <div
                  style={{
                    display: 'flex',
                    height: '10px',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    background: '#e5e7eb'
                  }}
                >
                  <div style={{ width: `${data.maleRate}%`, background: 'linear-gradient(90deg, #60a5fa, #3b82f6)' }} />
                  <div style={{ width: `${data.femaleRate}%`, background: 'linear-gradient(90deg, #f472b6, #ec4899)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8c7a61', marginTop: '4px' }}>
                  <span>♂ {data.maleRate}%</span>
                  <span>♀ {data.femaleRate}%</span>
                </div>
              </div>
            ) : null}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              {[
                ['孵化时长', data.hatchLabel],
                ['体重范围', data.weightLabel],
                ['身高范围', data.heightLabel],
                ['总种族值', data.totalStats],
                ['可配种数', data.totalCompatible],
                ['蛋组', data.eggGroupsLabel]
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    border: '1px solid rgba(201, 121, 38, 0.15)'
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#8c7a61', marginBottom: '4px', letterSpacing: '1px' }}>{label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#5a3e1b' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {data.eggDetails ? (
            <div
              style={{
                background: 'rgba(255,255,255,0.6)',
                borderRadius: '18px',
                padding: '20px 24px',
                marginBottom: '20px',
                border: '1px solid rgba(201, 121, 38, 0.25)'
              }}
            >
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#c97926', marginBottom: '14px' }}>🥚 蛋种详细数据</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  ['蛋类型', data.eggDetails.preciousEggLabel],
                  ['基础异色概率', data.eggDetails.baseProbText],
                  ['额外异色概率', data.eggDetails.addProbText],
                  ['接触增加异色', data.eggDetails.contactAddText],
                  ['蛋变体数', data.eggDetails.variantCount]
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: '1px solid rgba(201, 121, 38, 0.15)'
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#8c7a61', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#5a3e1b' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {data.isUndiscovered ? (
            <div
              style={{
                background: 'linear-gradient(135deg, #fef2f2, #fecaca)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '14px',
                padding: '18px 22px',
                marginBottom: '20px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#991b1b', marginBottom: '6px' }}>⚠️ 未发现蛋组</div>
              <div style={{ fontSize: '14px', color: '#b91c1c' }}>该精灵属于「未发现」蛋组，不能和任何精灵生蛋。</div>
            </div>
          ) : null}

          {data.sections.map(section => (
            <div key={section.id} style={{ marginBottom: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid rgba(201, 121, 38, 0.2)'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fde68a, #f59e0b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#fff',
                    fontWeight: 900,
                    flexShrink: 0
                  }}
                >
                  {section.id}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#c97926' }}>{section.label}</div>
                <div style={{ fontSize: '13px', color: '#8c7a61', marginLeft: 'auto' }}>{section.count} 只可配种</div>
              </div>

              {section.members.length === 0 ? (
                <div style={{ fontSize: '13px', color: '#8c7a61', textAlign: 'center', padding: '12px' }}>暂无同蛋组可配种精灵</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {section.members.map(item => (
                    <div
                      key={`${section.id}-${item.name}`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.65)',
                        borderRadius: '10px',
                        padding: '10px 14px'
                      }}
                    >
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#5a3e1b' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#8c7a61', marginTop: '4px' }}>{item.meta}</div>
                    </div>
                  ))}
                  {section.hasMore ? (
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.35)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        color: '#8c7a61',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ... 还有 {section.remainCount} 只精灵未显示
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}

          <div style={{ fontSize: '15px', textAlign: 'center', color: '#9e8e76', marginTop: '10px' }}>{data.commandHint}</div>
          <div style={{ fontSize: '14px', textAlign: 'center', color: '#b09d84', marginTop: '6px' }}>{data.copyright}</div>
        </div>
      </div>
    </HTML>
  );
}
