import React from 'react';
import HTML from './HTML.js';

type BattleCard = {
  leftName: string;
  leftAvatar: string;
  leftPets: Array<{ name: string; icon: string }>;
  rightName: string;
  rightAvatar: string;
  rightPets: Array<{ name: string; icon: string }>;
  resultLabel: string;
  resultKind: 'win' | 'lose';
  time: string;
  date: string;
};

type Props = {
  data: {
    userName: string;
    userLevel: string;
    userUid: string;
    userAvatar: string;
    winRate: string;
    totalMatch: string;
    currentPage: number;
    pageText: string;
    footerCommandHint: string;
    battles: BattleCard[];
  };
};

const width = 1280;

function getResultStyle(kind: 'win' | 'lose') {
  if (kind === 'win') {
    return {
      background: 'linear-gradient(135deg, #9be15d 0%, #00c853 100%)',
      color: '#143016'
    };
  }

  return {
    background: 'linear-gradient(135deg, #ff9a9e 0%, #f6416c 100%)',
    color: '#3b111c'
  };
}

export default function RocomRecordCard({ data }: Props) {
  return (
    <HTML style={{ width: `${width}px`, background: '#1b1d18' }}>
      <div
        style={{
          width: `${width}px`,
          padding: '16px 24px',
          boxSizing: 'border-box',
          background:
            'radial-gradient(circle at top left, rgba(255,196,95,0.16), transparent 22%), radial-gradient(circle at top right, rgba(255,255,255,0.08), transparent 18%), linear-gradient(180deg, #2c2118 0%, #16120f 100%)',
          fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(50, 42, 30, 0.85)',
            borderRadius: '15px',
            padding: '12px 20px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            {data.userAvatar ? (
              <img src={data.userAvatar} alt='' style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
            ) : (
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
                赛
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#f4eee1', fontSize: '22px', fontWeight: 800 }}>{data.userName}</span>
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
                  Lv. {data.userLevel}
                </span>
              </div>
              <span style={{ color: '#a8a69f', fontSize: '14px' }}>ID:{data.userUid}</span>
            </div>
          </div>

          <div style={{ flex: 2, textAlign: 'center' }}>
            <span
              style={{
                color: '#ffc65f',
                fontSize: '28px',
                fontWeight: 800,
                textShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }}
            >
              闪耀大赛 · 战绩总览
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ color: '#a8a69f', fontSize: '14px' }}>总场次</span>
                <span style={{ color: '#f4eee1', fontSize: '20px', fontWeight: 800 }}>{data.totalMatch}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ color: '#a8a69f', fontSize: '14px' }}>胜率</span>
                <span style={{ color: '#f4eee1', fontSize: '20px', fontWeight: 800 }}>{data.winRate}</span>
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.battles.map((battle, index) => (
            <div
              key={`${battle.leftName}-${battle.rightName}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(247, 244, 237, 0.92)',
                borderRadius: '12px',
                padding: '12px 18px',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <div style={{ flex: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  {battle.leftAvatar ? (
                    <img src={battle.leftAvatar} alt='' style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'contain' }} />
                  ) : (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(180deg, #ffe8b0 0%, #ffc65f 100%)',
                        color: '#5a3e1b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 800
                      }}
                    >
                      {battle.leftName.slice(0, 1)}
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#5a3e1b',
                      maxWidth: '160px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {battle.leftName}
                  </span>
                </div>
                {battle.leftPets.length ? (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {battle.leftPets.map((pet, petIndex) => (
                      <img
                        key={`${battle.leftName}-${pet.name}-${petIndex}`}
                        src={pet.icon}
                        alt={pet.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.05)' }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              <div style={{ flex: 1.5, display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '98px',
                    height: '81px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '16px',
                    fontSize: '24px',
                    fontWeight: 900,
                    ...getResultStyle(battle.resultKind)
                  }}
                >
                  {battle.resultLabel}
                </div>
              </div>

              <div style={{ flex: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#5a3e1b',
                      maxWidth: '160px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {battle.rightName}
                  </span>
                  {battle.rightAvatar ? (
                    <img src={battle.rightAvatar} alt='' style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'contain' }} />
                  ) : (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(180deg, #dfdfdf 0%, #bfbfbf 100%)',
                        color: '#4a4a4a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 800
                      }}
                    >
                      {battle.rightName.slice(0, 1)}
                    </div>
                  )}
                </div>
                {battle.rightPets.length ? (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {battle.rightPets.map((pet, petIndex) => (
                      <img
                        key={`${battle.rightName}-${pet.name}-${petIndex}`}
                        src={pet.icon}
                        alt={pet.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.05)' }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#5a3e1b' }}>{battle.time}</span>
                <span style={{ fontSize: '12px', color: '#9e8e76' }}>{battle.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            marginTop: '16px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(0,0,0,0.08)'
          }}
        >
          <span style={{ fontSize: '16px', color: '#5a3e1b', fontWeight: 800 }}>{data.pageText}</span>
          <span style={{ fontSize: '14px', color: '#9e8e76' }}>{data.footerCommandHint}</span>
        </div>
      </div>
    </HTML>
  );
}
