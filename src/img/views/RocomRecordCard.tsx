import React from 'react';
import HTML from './HTML.js';

type BattleCard = {
  leftName: string;
  rightName: string;
  resultLabel: string;
  resultKind: 'win' | 'lose';
  time: string;
  date: string;
};

type Props = {
  data: {
    pageNo: number;
    battles: BattleCard[];
  };
};

const width = 1120;

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
    <HTML style={{ width: `${width}px`, background: 'linear-gradient(180deg, #191818 0%, #111111 100%)' }}>
      <div
        style={{
          width: `${width}px`,
          boxSizing: 'border-box',
          padding: '28px',
          background:
            'radial-gradient(circle at top left, rgba(255,196,95,0.16), transparent 22%), radial-gradient(circle at top right, rgba(255,255,255,0.08), transparent 18%), linear-gradient(180deg, #2c2118 0%, #16120f 100%)',
          color: '#f4efe2'
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
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#ffc966', letterSpacing: '2px' }}>闪耀大赛战绩</div>
            <div style={{ marginTop: '8px', fontSize: '16px', color: '#dfcfb0' }}>最近战斗记录总览</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '15px', color: 'rgba(244,239,226,0.72)' }}>
            <div>页码：{data.pageNo}</div>
            <div style={{ marginTop: '6px' }}>战绩 &lt;页码&gt;</div>
          </div>
        </div>

        <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.battles.map((battle, index) => {
            const style = getResultStyle(battle.resultKind);

            return (
              <div
                key={`${battle.leftName}-${battle.rightName}-${index}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr auto',
                  alignItems: 'center',
                  gap: '16px',
                  borderRadius: '24px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '18px 20px',
                  boxShadow: '0 16px 30px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', color: 'rgba(244,239,226,0.56)' }}>我方</div>
                  <div style={{ marginTop: '6px', fontSize: '24px', fontWeight: 900 }}>{battle.leftName}</div>
                </div>

                <div
                  style={{
                    minWidth: '120px',
                    borderRadius: '999px',
                    padding: '10px 18px',
                    textAlign: 'center',
                    fontSize: '22px',
                    fontWeight: 900,
                    ...style
                  }}
                >
                  {battle.resultLabel}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: 'rgba(244,239,226,0.56)' }}>对手</div>
                  <div style={{ marginTop: '6px', fontSize: '24px', fontWeight: 900 }}>{battle.rightName}</div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900 }}>{battle.time}</div>
                  <div style={{ marginTop: '4px', fontSize: '14px', color: 'rgba(244,239,226,0.6)' }}>{battle.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </HTML>
  );
}
