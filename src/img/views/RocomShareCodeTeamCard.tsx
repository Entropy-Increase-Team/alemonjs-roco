import type { ShareCodeTeam } from '@src/model/rocomShareCode';
import React from 'react';
import HTML from './HTML.js';

export default function RocomShareCodeTeamCard({ team }: { team: ShareCodeTeam }) {
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '104px',
              padding: '0 34px',
              background: 'linear-gradient(90deg, #ffc95f, #f5b64c)'
            }}
          >
            <div>
              <div style={{ fontSize: '40px', letterSpacing: '4px', fontWeight: 800, color: '#10100e' }}>{team.mode_name}</div>
              <div style={{ marginTop: '6px', color: '#6b4a13', fontSize: '16px' }}>阵容码：{team.share_code || '--'}</div>
            </div>
            <span
              style={{ padding: '10px 18px', borderRadius: '999px', background: 'rgba(255,255,255,0.72)', color: '#4a2d0b', fontSize: '19px', fontWeight: 800 }}
            >
              {team.count_label}
            </span>
          </header>

          <main style={{ display: 'grid', gap: '14px', padding: '22px 30px 30px' }}>
            {team.teams.map(pet => (
              <section
                key={`${pet.slot}-${pet.pet.id}`}
                style={{
                  display: 'flex',
                  gap: '18px',
                  padding: '18px',
                  borderRadius: '20px',
                  border: `2px solid ${pet.color}`,
                  background: 'rgba(255,255,255,0.66)'
                }}
              >
                <div style={{ flex: 'none', textAlign: 'center' }}>
                  <div style={{ fontSize: '15px', color: pet.color, fontWeight: 800 }}>No.{pet.slotText}</div>
                  {pet.pet.icon ? (
                    <img
                      src={pet.pet.icon}
                      alt={pet.pet.name}
                      style={{ width: '96px', height: '96px', marginTop: '4px', objectFit: 'contain', borderRadius: '18px', background: '#ede7dc' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '96px',
                        height: '96px',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '18px',
                        background: '#ede7dc',
                        color: '#8d6e63'
                      }}
                    >
                      无图
                    </div>
                  )}
                  <div style={{ marginTop: '6px', maxWidth: '120px', fontSize: '17px', fontWeight: 800, overflowWrap: 'break-word' }}>{pet.pet.name}</div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {pet.typeIcons.map(type => (
                      <span
                        key={type.name}
                        style={{ padding: '4px 12px', borderRadius: '999px', background: '#33271a', color: '#fff', fontSize: '13px', fontWeight: 700 }}
                      >
                        {type.name}
                      </span>
                    ))}
                    <span style={{ padding: '4px 12px', borderRadius: '999px', background: pet.color, color: '#fff', fontSize: '13px', fontWeight: 700 }}>
                      {pet.bloodline.name}
                    </span>
                    {pet.personality.name ? (
                      <span style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(143,113,73,0.14)', color: '#5f4d33', fontSize: '13px' }}>
                        {pet.personality.name}
                        {pet.personality.up || pet.personality.down ? `（+${pet.personality.up || '-'} / -${pet.personality.down || '-'}）` : ''}
                      </span>
                    ) : null}
                    {pet.ivs_detail.map(item => (
                      <span
                        key={item.name}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: 'rgba(255,198,95,0.28)',
                          color: '#9a5f0f',
                          fontSize: '12px',
                          fontWeight: 700
                        }}
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>

                  {pet.skills.length > 0 ? (
                    <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {pet.skills.map((skill, skillIndex) => (
                        <React.Fragment key={`${pet.slot}-${skill.name}-${skillIndex}`}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '7px',
                              padding: '7px 13px',
                              borderRadius: '12px',
                              background: 'rgba(255,255,255,0.78)',
                              border: '1px solid rgba(143,113,73,0.16)',
                              fontSize: '14px'
                            }}
                          >
                            {skill.icon ? <img src={skill.icon} alt='' style={{ width: '24px', height: '24px', objectFit: 'contain' }} /> : null}
                            {skill.name}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div style={{ marginTop: '12px', color: '#9a876d', fontSize: '14px' }}>未携带技能</div>
                  )}
                </div>
              </section>
            ))}
            {team.teams.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8d6e63' }}>阵容码解析成功，但没有返回阵容精灵数据。</div>
            ) : null}
          </main>
        </div>
      </div>
    </HTML>
  );
}
