import type { RocomAccountsCardData } from '@src/model/rocomAccount';
import React from 'react';
import HTML from './HTML.js';

function getBadgeStyle(type: string) {
  switch (type) {
    case 'primary':
      return { background: '#ffe082', color: '#4e342e' };
    case 'valid':
      return { background: '#dcedc8', color: '#33691e' };
    case 'invalid':
      return { background: '#ffcdd2', color: '#b71c1c' };
    case 'online':
      return { background: '#b2dfdb', color: '#004d40' };
    case 'offline':
      return { background: '#e0e0e0', color: '#424242' };
    default:
      return { background: '#eceff1', color: '#37474f' };
  }
}

export default function RocomAccountListCard({ data }: { data: RocomAccountsCardData }) {
  return (
    <HTML style={{ width: '860px', background: '#f5efe2' }}>
      <div
        style={{
          width: '860px',
          padding: '28px',
          boxSizing: 'border-box',
          fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif',
          background: 'linear-gradient(180deg, #f7f1e3 0%, #efe3c6 100%)',
          color: '#3e2b1b'
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.78)',
            border: '2px solid rgba(135,96,41,0.18)',
            borderRadius: '24px',
            padding: '26px 28px 22px',
            boxShadow: '0 12px 32px rgba(69, 45, 18, 0.12)'
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '2px', marginBottom: '8px' }}>{data.title}</div>
            <div style={{ fontSize: '16px', color: '#71553a' }}>{data.subtitle}</div>
          </div>

          {data.bindings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.bindings.map(item => (
                <div
                  key={`${item.index}-${item.roleId}-${item.tgpId}`}
                  style={{
                    display: 'flex',
                    gap: '18px',
                    alignItems: 'stretch',
                    background: item.isPrimary ? 'linear-gradient(180deg, #fff8e1 0%, #fff3d2 100%)' : 'rgba(255,255,255,0.9)',
                    border: item.isPrimary ? '2px solid #f0c96a' : '1px solid rgba(113, 85, 58, 0.18)',
                    borderRadius: '18px',
                    padding: '18px 18px 16px'
                  }}
                >
                  <div
                    style={{
                      minWidth: '58px',
                      height: '58px',
                      borderRadius: '16px',
                      background: '#6d4c41',
                      color: '#fff8e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: 800
                    }}
                  >
                    #{item.index}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800 }}>{item.nickname}</div>
                      <div
                        style={{
                          fontSize: '13px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: 'rgba(109, 76, 65, 0.10)',
                          color: '#6d4c41',
                          fontWeight: 700
                        }}
                      >
                        绑定{item.bindingIndex}
                      </div>
                      {item.badges.map(badge => (
                        <div
                          key={`${item.index}-${badge.type}-${badge.text}`}
                          style={{
                            ...getBadgeStyle(badge.type),
                            fontSize: '13px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontWeight: 700
                          }}
                        >
                          {badge.text}
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 18px', fontSize: '15px', color: '#5d4037' }}>
                      <div>角色ID：{item.roleId}</div>
                      <div>WeGameID：{item.tgpId}</div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 18px', fontSize: '15px', color: '#5d4037' }}>
                      <div>登录方式：{item.loginType}</div>
                      <div>等级：{item.levelText}</div>
                      <div>星级：{item.starName}</div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 18px', fontSize: '14px', color: '#6d4c41' }}>
                      <div>状态：{item.statusText}</div>
                      <div>更新时间：{item.updatedAt}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '30px 24px',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.85)',
                border: '1px dashed rgba(109, 76, 65, 0.35)',
                fontSize: '18px',
                color: '#6d4c41',
                textAlign: 'center'
              }}
            >
              {data.emptyText}
            </div>
          )}

          <div
            style={{
              marginTop: '18px',
              padding: '14px 16px',
              borderRadius: '14px',
              background: 'rgba(109, 76, 65, 0.08)',
              color: '#5d4037',
              fontSize: '15px',
              fontWeight: 600
            }}
          >
            {data.tip}
          </div>

          <div style={{ marginTop: '14px', fontSize: '12px', color: '#8d6e63', textAlign: 'right' }}>{data.copyright}</div>
        </div>
      </div>
    </HTML>
  );
}
