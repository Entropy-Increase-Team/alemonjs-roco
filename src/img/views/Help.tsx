import React from 'react';
import HTML from './HTML.js';

export interface HelpCardItem {
  title: string;
  desc: string;
  example?: string;
}

export interface HelpCardCategory {
  title: string;
  items: HelpCardItem[];
}

export interface HelpCardData {
  title: string;
  subtitle: string;
  categories: HelpCardCategory[];
  prefixTitle: string;
  prefixText: string;
  footerBrand: string;
  footerNote: string;
}

const width = 780;

export default function ALemonJSHelpCard({ data }: { data: HelpCardData }) {
  return (
    <HTML style={{ width: `${width + 60}px`, background: '#faf6ed' }}>
      <div
        style={{
          width: `${width + 60}px`,
          padding: '30px',
          backgroundColor: '#faf6ed',
          display: 'inline-block',
          fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
        }}
      >
        <div
          style={{
            width: `${width}px`,
            position: 'relative',
            padding: '40px 50px',
            boxSizing: 'border-box',
            background:
              'radial-gradient(circle at 15% 12%, rgba(255, 227, 170, 0.48), transparent 26%), radial-gradient(circle at 85% 18%, rgba(218, 181, 120, 0.2), transparent 28%), linear-gradient(180deg, rgba(250, 246, 237, 0.98) 0%, rgba(244, 235, 218, 0.98) 100%)',
            borderRadius: '20px',
            boxShadow: '0 12px 30px rgba(66, 48, 24, 0.12)'
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '26px',
              bottom: '18px',
              fontSize: '92px',
              fontWeight: 900,
              color: 'rgba(180, 146, 95, 0.1)',
              letterSpacing: '6px',
              zIndex: 1,
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          >
            洛克
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '30px',
                borderBottom: '2px dashed rgba(160, 140, 110, 0.4)',
                paddingBottom: '15px'
              }}
            >
              <div
                style={{
                  color: '#ffc65f',
                  fontSize: '38px',
                  fontWeight: 800,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  WebkitTextStroke: '1.5px #d4842b',
                  letterSpacing: '2px'
                }}
              >
                {data.title}
              </div>
              <div
                style={{
                  color: '#9e8e76',
                  fontSize: '16px',
                  marginTop: '6px'
                }}
              >
                {data.subtitle}
              </div>
            </div>

            <main
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '25px'
              }}
            >
              {data.categories.length > 0 ? (
                data.categories.map((group, index) => (
                  <div key={`${group.title}-${index}`}>
                    <div
                      style={{
                        fontSize: '22px',
                        fontWeight: 800,
                        color: '#c97926',
                        marginBottom: '15px',
                        paddingLeft: '12px',
                        borderLeft: '5px solid #ffc65f'
                      }}
                    >
                      {group.title}
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '15px'
                      }}
                    >
                      {group.items.map((item, itemIndex) => (
                        <div
                          key={`${group.title}-${item.title}-${itemIndex}`}
                          style={{
                            width: '100%',
                            height: '85px',
                            background: 'linear-gradient(180deg, rgba(246, 237, 219, 0.98) 0%, rgba(238, 227, 205, 0.98) 100%)',
                            border: '1px solid rgba(196, 169, 129, 0.45)',
                            borderRadius: '16px',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 25px',
                            paddingRight: '50px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontSize: '20px',
                                fontWeight: 800,
                                color: '#5a3e1b',
                                marginBottom: '8px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.1
                              }}
                            >
                              {item.title}
                            </div>
                            <div
                              style={{
                                fontSize: '14px',
                                color: '#8c7a61',
                                lineHeight: 1.35
                              }}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    minHeight: '180px',
                    borderRadius: '18px',
                    border: '1px dashed rgba(196, 169, 129, 0.65)',
                    background: 'rgba(255,255,255,0.42)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8c7a61',
                    fontSize: '18px',
                    fontWeight: 700
                  }}
                >
                  暂无可展示的帮助项
                </div>
              )}
            </main>

            <div
              style={{
                marginTop: '30px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#bfae95'
              }}
            >
              {data.footerBrand || data.footerNote}
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
}
