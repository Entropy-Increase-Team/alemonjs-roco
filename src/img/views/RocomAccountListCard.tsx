import type { RocomAccountsCardData } from '@src/model/rocomAccount';
import React from 'react';
import HTML from './HTML.js';

function getBadgeStyle(type: string) {
  switch (type) {
    case 'primary':
      return {
        background: '#ffc65f',
        color: '#fff',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
      };
    case 'valid':
      return { background: 'rgba(105, 170, 97, 0.16)', color: '#4f8a44' };
    case 'invalid':
      return { background: 'rgba(199, 102, 86, 0.16)', color: '#b44c3c' };
    case 'online':
      return { background: 'rgba(76, 166, 201, 0.16)', color: '#2d84a7' };
    case 'offline':
      return { background: 'rgba(140, 122, 97, 0.14)', color: '#7e6d57' };
    default:
      return { background: 'rgba(177, 132, 67, 0.12)', color: '#9d6c29' };
  }
}

export default function RocomAccountListCard({ data }: { data: RocomAccountsCardData }) {
  return (
    <HTML style={{ width: '740px', background: '#faf6ed' }}>
      <div
        style={{
          width: '740px',
          padding: '30px',
          boxSizing: 'border-box',
          background: '#faf6ed',
          fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
        }}
      >
        <div
          style={{
            width: '680px',
            margin: '0 auto',
            padding: '30px 40px',
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #f7ecd5 0%, #efddbc 100%)',
            borderRadius: '26px',
            boxShadow: '0 14px 34px rgba(122, 92, 48, 0.18)'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '25px',
                borderBottom: '2px dashed rgba(160, 140, 110, 0.4)',
                paddingBottom: '12px'
              }}
            >
              <h1
                style={{
                  color: '#ffc65f',
                  fontSize: '34px',
                  fontWeight: 800,
                  textShadow: '0 2px 4px rgba(0,0,0,0.35)',
                  letterSpacing: '2px',
                  margin: 0
                }}
              >
                {data.title}
              </h1>
              <p style={{ color: '#9e8e76', fontSize: '14px', marginTop: '6px', marginBottom: 0 }}>{data.subtitle}</p>
            </div>

            {data.bindings.length > 0 ? (
              <main style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                {data.bindings.map(item => (
                  <div
                    key={`${item.index}-${item.roleId}-${item.tgpId}`}
                    style={{
                      width: '100%',
                      minHeight: '106px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '18px 25px',
                      boxSizing: 'border-box',
                      position: 'relative',
                      borderRadius: '20px',
                      background: item.isPrimary ? 'linear-gradient(180deg, #fff8e8 0%, #fff1cf 100%)' : 'linear-gradient(180deg, #fffaf0 0%, #f8eedc 100%)',
                      border: item.isPrimary ? '2px solid rgba(255, 198, 95, 0.75)' : '1px solid rgba(183, 152, 111, 0.28)',
                      boxShadow: item.isPrimary ? '0 0 8px rgba(255, 198, 95, 0.35)' : 'none'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#c97926',
                        width: '50px',
                        textAlign: 'center',
                        opacity: 0.85
                      }}
                    >
                      #{item.index}
                    </div>

                    <div style={{ flex: 1, paddingLeft: '10px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '10px',
                          marginBottom: '8px'
                        }}
                      >
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#5a3e1b' }}>{item.nickname}</span>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: 'rgba(177, 132, 67, 0.12)',
                            color: '#9d6c29',
                            fontWeight: 700
                          }}
                        >
                          绑定{item.bindingIndex}
                        </span>
                        {(item.badges || []).map(badge => (
                          <span
                            key={`${item.index}-${badge.type}-${badge.text}`}
                            style={{
                              ...getBadgeStyle(badge.type),
                              fontSize: '11px',
                              padding: '2px 7px',
                              borderRadius: '10px',
                              fontWeight: 700
                            }}
                          >
                            {badge.text}
                          </span>
                        ))}
                      </div>

                      <div
                        style={{
                          fontSize: '13px',
                          color: '#8c7a61',
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          rowGap: '4px',
                          marginBottom: '4px'
                        }}
                      >
                        <span style={{ opacity: 0.7, marginRight: '4px', whiteSpace: 'nowrap' }}>角色ID</span>
                        <span style={{ fontWeight: 500, color: '#5f4d33' }}>{item.roleId}</span>
                        <span style={{ opacity: 0.7, marginRight: '4px', marginLeft: '15px', whiteSpace: 'nowrap' }}>WeGameID</span>
                        <span style={{ fontWeight: 500, color: '#5f4d33' }}>{item.tgpId}</span>
                      </div>

                      <div
                        style={{
                          fontSize: '13px',
                          color: '#8c7a61',
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          rowGap: '4px'
                        }}
                      >
                        <span style={{ opacity: 0.7, marginRight: '4px', whiteSpace: 'nowrap' }}>登录方式</span>
                        <span style={{ fontWeight: 500, color: '#5f4d33' }}>{item.loginType}</span>
                        <span style={{ opacity: 0.7, marginRight: '4px', marginLeft: '15px', whiteSpace: 'nowrap' }}>等级</span>
                        <span style={{ fontWeight: 500, color: '#5f4d33' }}>{item.levelText}</span>
                        <span style={{ opacity: 0.7, marginRight: '4px', marginLeft: '15px', whiteSpace: 'nowrap' }}>星级</span>
                        <span style={{ fontWeight: 500, color: '#5f4d33' }}>{item.starName}</span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        fontSize: '11px',
                        textAlign: 'right',
                        width: '124px',
                        flexShrink: 0
                      }}
                    >
                      <span style={{ color: '#aa9b83' }}>更新时间</span>
                      <span style={{ color: '#8c7a61', lineHeight: 1.3 }}>{item.updatedAt}</span>
                    </div>
                  </div>
                ))}
              </main>
            ) : (
              <div
                style={{
                  padding: '60px 0',
                  textAlign: 'center',
                  color: '#9e8e76',
                  borderRadius: '20px',
                  background: 'linear-gradient(180deg, #fffaf0 0%, #f8eedc 100%)',
                  border: '1px solid rgba(183, 152, 111, 0.28)',
                  fontSize: '16px',
                  marginBottom: '20px'
                }}
              >
                {data.emptyText || '暂无可识别的账号信息'}
              </div>
            )}

            <div
              style={{
                marginTop: '15px',
                padding: '10px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#9e8e76',
                fontSize: '14px',
                fontWeight: 700
              }}
            >
              <span style={{ fontSize: '14px', color: '#b17f35' }}>提示</span>
              <span>{data.tip || '发送 #wg切换账号 <绑定序号> 切换默认账号'}</span>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#bfae95', opacity: 0.8 }}>{data.copyright}</div>
          </div>
        </div>
      </div>
    </HTML>
  );
}
