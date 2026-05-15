import type { WeGameBindingListCardData } from '@src/model/wegameAccount';
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
    default:
      return { background: '#eceff1', color: '#37474f' };
  }
}

export default function WeGameBindingListCard({ data }: { data: WeGameBindingListCardData }) {
  return (
    <HTML style={{ width: '860px', background: '#eef3f8' }}>
      <div
        style={{
          width: '860px',
          padding: '28px',
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #f3f8fd 0%, #e4edf6 100%)',
          fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif',
          color: '#243447'
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(65, 93, 121, 0.14)',
            borderRadius: '24px',
            padding: '26px 28px 22px',
            boxShadow: '0 14px 36px rgba(46, 74, 102, 0.10)'
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '1px', marginBottom: '8px' }}>{data.title}</div>
            <div style={{ fontSize: '16px', color: '#5e7690' }}>{data.subtitle}</div>
          </div>

          {data.bindings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.bindings.map(item => (
                <div
                  key={`${item.index}-${item.tgpId}-${item.roleId}`}
                  style={{
                    display: 'flex',
                    gap: '18px',
                    alignItems: 'stretch',
                    background: item.isPrimary ? 'linear-gradient(180deg, #fffef5 0%, #fff8db 100%)' : 'rgba(255,255,255,0.92)',
                    border: item.isPrimary ? '2px solid #f0c96a' : '1px solid rgba(94, 118, 144, 0.16)',
                    borderRadius: '18px',
                    padding: '18px'
                  }}
                >
                  <div
                    style={{
                      minWidth: '58px',
                      height: '58px',
                      borderRadius: '16px',
                      background: '#3b5b7a',
                      color: '#f7fbff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: 800
                    }}
                  >
                    {item.index}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800 }}>{item.nickname}</div>
                      <div
                        style={{
                          fontSize: '13px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: 'rgba(59, 91, 122, 0.08)',
                          color: '#3b5b7a',
                          fontWeight: 700
                        }}
                      >
                        序号 {item.index}/{item.total}
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

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 18px', fontSize: '15px', color: '#48627c' }}>
                      <div>状态：{item.statusText}</div>
                      <div>登录方式：{item.loginType}</div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 18px', fontSize: '15px', color: '#48627c' }}>
                      <div>TGP ID：{item.tgpId}</div>
                      {item.roleId ? <div>角色ID：{item.roleId}</div> : null}
                    </div>

                    <div style={{ fontSize: '14px', color: '#6a829a' }}>更新时间：{item.updatedAt}</div>
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
                border: '1px dashed rgba(59, 91, 122, 0.35)',
                fontSize: '18px',
                color: '#5e7690',
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
              background: 'rgba(59, 91, 122, 0.08)',
              color: '#445c74',
              fontSize: '15px',
              fontWeight: 600
            }}
          >
            {data.tip}
          </div>

          <div style={{ marginTop: '14px', fontSize: '12px', color: '#8aa0b5', textAlign: 'right' }}>{data.copyright}</div>
        </div>
      </div>
    </HTML>
  );
}
