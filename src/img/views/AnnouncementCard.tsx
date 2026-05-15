import URL_ANN_BG from '@src/assets/bg/image3.png';
import type { AnnouncementItem } from '@src/data/announcement.js';
import React from 'react';
import HTML from './HTML.js';

interface Props {
  data: {
    announcements: AnnouncementItem[];
    activeTab?: string;
    page?: number;
    totalPages?: number;
  };
}

const TABS = ['最新', '公告', '资讯', '活动'] as const;

const CARD_W = 600;

function formatDate(dateStr: string): string {
  return dateStr.replace(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2}:\d{2})/, '$1-$2-$3 $4');
}

export default function AnnouncementCard({ data }: Props) {
  const { announcements, activeTab = '最新', page = 1, totalPages = 1 } = data;

  return (
    <HTML style={{ width: `${CARD_W}px` }}>
      <div className='bg-ann-bg box-border overflow-hidden' style={{ width: `${CARD_W}px`, background: `url(${URL_ANN_BG}) no-repeat center/cover` }}>
        {/* Tab 栏 */}
        <div className='flex items-stretch' style={{ borderBottom: '2px solid rgba(180,160,130,0.35)' }}>
          {TABS.map(tab => {
            const isActive = tab === activeTab;

            return (
              <div
                key={tab}
                className='flex-1 text-center py-2.5 text-[15px] font-bold'
                style={{
                  background: isActive ? '#E8A820' : 'transparent',
                  color: isActive ? '#fff' : '#6B5D4F',
                  borderRadius: isActive ? '8px 8px 0 0' : '0'
                }}
              >
                {tab}
              </div>
            );
          })}
        </div>

        {/* 公告列表 */}
        <div className='flex flex-col gap-3 p-4 px-5'>
          {announcements.map((item, idx) => (
            <div
              key={idx}
              className='bg-ann-card rounded-xl py-4 px-5 flex items-center justify-between'
              style={{ border: '1px solid rgba(180,160,130,0.25)' }}
            >
              <div className='flex items-center gap-3 flex-1 mr-4'>
                <span
                  className='text-[13px] font-extrabold shrink-0'
                  style={{
                    background: '#E8A820',
                    color: '#fff',
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {idx + 1}
                </span>
                <div
                  className='text-ann-title font-extrabold leading-snug flex-1'
                  style={{
                    fontSize: '16px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {item.title}
                </div>
              </div>
              <div className='text-ann-date text-[13px] whitespace-nowrap shrink-0' style={{ fontFamily: 'monospace, tttgbnumber' }}>
                {formatDate(item.date)}
              </div>
            </div>
          ))}
        </div>

        {/* 底部翻页 + 页码 */}
        <div className='flex flex-col items-center gap-1 py-3 pb-4' style={{ borderTop: '1px solid rgba(180,160,130,0.25)' }}>
          <div className='flex items-center gap-3'>
            <span className='text-ann-footer text-sm font-bold'>合共</span>
            <span className='text-ann-title text-base font-extrabold'>
              {page} / {totalPages}
            </span>
            <span className='text-ann-footer text-lg' style={{ marginLeft: '4px' }}>
              ▶
            </span>
          </div>
          <span className='text-ann-date text-[12px]'>发送 #洛克公告 序号 查看详情</span>
        </div>
      </div>
    </HTML>
  );
}
