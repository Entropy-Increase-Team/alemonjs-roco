import React from 'react';
import HTML from './HTML.js';

export interface WeGameHelpCardItem {
  title: string;
  desc: string;
}

export interface WeGameHelpCardCategory {
  title: string;
  items: WeGameHelpCardItem[];
}

export interface WeGameHelpCardData {
  title: string;
  subtitle: string;
  categories: WeGameHelpCardCategory[];
  footerBrand: string;
}

export default function WeGameHelpCard({ data }: { data: WeGameHelpCardData }) {
  return (
    <HTML style={{ background: '#f3f5f8' }}>
      <div
        style={{
          margin: 0,
          padding: '20px',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          fontFamily: '"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif',
          color: '#111827',
          background: '#f3f5f8',
          boxSizing: 'border-box'
        }}
      >
        <main
          style={{
            width: '100%',
            maxWidth: '1176px',
            padding: '24px 24px 20px',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            background: '#ffffff',
            boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
            boxSizing: 'border-box'
          }}
        >
          <header
            style={{
              paddingBottom: '16px',
              marginBottom: '16px',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            <div style={{ minWidth: 0 }}>
              <span
                style={{
                  display: 'inline-block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                WeGame Plugin
              </span>
              <h1
                style={{
                  margin: '0 0 6px',
                  fontSize: '34px',
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: '#111827'
                }}
              >
                {data.title}
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: '18px',
                  lineHeight: 1.5,
                  color: '#4b5563'
                }}
              >
                {data.subtitle}
              </p>
            </div>
          </header>

          {data.categories.map((group, index) => (
            <section
              key={`${group.title}-${index}`}
              style={{
                marginTop: index === 0 ? 0 : '18px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '10px'
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '24px',
                      lineHeight: 1.2,
                      fontWeight: 700,
                      color: '#111827'
                    }}
                  >
                    {group.title}
                  </h2>
                </div>
                <span
                  style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {group.items.length} 条命令
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 340px)',
                  gap: '18px'
                }}
              >
                {group.items.map((item, itemIndex) => (
                  <article
                    key={`${group.title}-${item.title}-${itemIndex}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minHeight: '84px',
                      padding: '14px',
                      border: '1px solid #d9dee7',
                      borderRadius: '12px',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          marginBottom: '4px',
                          color: '#111827',
                          fontSize: '18px',
                          lineHeight: 1.3,
                          fontWeight: 700,
                          wordBreak: 'break-word'
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          color: '#4b5563',
                          fontSize: '14px',
                          lineHeight: 1.5,
                          wordBreak: 'break-word'
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <footer
            style={{
              marginTop: '20px',
              paddingTop: '14px',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: 1.5
              }}
            >
              {data.footerBrand}
            </div>
          </footer>
        </main>
      </div>
    </HTML>
  );
}
