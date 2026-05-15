import URL_HELP_BG from '@src/assets/bg/image2.png';
import classNames from 'classnames';
import React from 'react';
import HTML from './HTML.js';

interface CmdItem {
  name: string;
  desc: string;
  eg: string;
}

interface HelpCategory {
  title: string;
  items: CmdItem[];
}

const HELP_DATA: HelpCategory[] = [
  {
    title: '宠物图鉴',
    items: [
      { name: '查看宠物', desc: '洛克图鉴 / 洛克查询 / 洛克cw + 宠物名', eg: '#洛克图鉴 迪莫' },
      { name: '宠物列表', desc: '洛克宠物 / 洛克精灵 / 洛克cwlb', eg: '#洛克宠物' },
      { name: '属性筛选', desc: '按属性筛选宠物列表', eg: '#洛克宠物 火' },
      { name: '技能搜索', desc: '洛克技能 / 洛克jn + 技能名', eg: '#洛克技能 闪光冲击' }
    ]
  },
  {
    title: '资讯功能',
    items: [
      { name: '活动日历', desc: '洛克活动 / 洛克日历 / 洛克hdrl', eg: '#洛克活动' },
      { name: '公告列表', desc: '查看最新公告，可切换分类', eg: '#洛克公告' },
      { name: '公告分类', desc: '公告 / 资讯 / 活动', eg: '#洛克公告 资讯' },
      { name: '公告详情', desc: '公告 + 序号查看详情', eg: '#洛克公告 3' }
    ]
  },
  {
    title: '快捷指令',
    items: [
      { name: '帮助', desc: '支持 #洛克帮助 / #roco帮助 / +帮助', eg: '#洛克帮助' },
      { name: '前缀', desc: '显式命令用 # / ＃ / /，快捷入口用 +', eg: '#洛克图鉴 / +帮助' }
    ]
  }
];

const CARD_W = 520;

/** 星星装饰 */
function Star({ size, top, left, right, opacity = 1 }: { size: number; top?: string; left?: string; right?: string; opacity?: number }) {
  return (
    <div
      className='absolute text-help-star'
      style={{ top, left, right, width: `${size}px`, height: `${size}px`, opacity, fontSize: `${size}px`, lineHeight: 1 }}
    >
      ✦
    </div>
  );
}

export default function RocoHelp() {
  return (
    <HTML style={{ width: `${CARD_W}px` }}>
      <div className='bg-help-border p-2.5 box-border'>
        {/* 内卡片 */}
        <div className='bg-help-gold rounded-[14px] overflow-hidden'>
          {/* 标题区 */}
          <div className='pt-6 px-7 pb-4 text-center' style={{ background: `url(${URL_HELP_BG}) no-repeat center/cover` }}>
            <div className='text-[34px] font-black text-[#1a1a1a] tracking-[4px]' style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.3)' }}>
              洛克王国助手
            </div>
            <div className='text-[15px] text-[#5a4210] mt-1 opacity-70'>小洛克，欢迎来到洛克王国！</div>
          </div>

          {/* 虚线分隔 */}
          <div className='mx-5 border-t-[3px] border-dashed border-black/15' />

          {/* 内容主体 */}
          <div className='p-5 px-6'>
            <div className='bg-help-cream rounded-2xl p-5 shadow-cream'>
              {HELP_DATA.map((cat, ci) => (
                <div key={ci} className={classNames(ci < HELP_DATA.length - 1 && 'mb-[18px]')}>
                  {/* 分类标题 */}
                  <div className='text-lg font-extrabold text-[#4a3210] border-l-4 border-help-gold-dk pl-2.5 mb-2.5'>{cat.title}</div>

                  {/* 指令列表 */}
                  <div className='flex flex-col gap-2'>
                    {cat.items.map((item, idx) => (
                      <div key={idx} className='flex items-center justify-between bg-white/70 border border-help-gold/30 rounded-[10px] py-2.5 px-3.5'>
                        <div>
                          <div className='text-base font-bold text-help-dark'>{item.name}</div>
                          <div className='text-xs text-[#888] mt-0.5'>{item.desc}</div>
                        </div>
                        <div className='text-[13px] text-help-gold-dp bg-help-gold/20 py-1 px-2.5 rounded-lg font-bold whitespace-nowrap'>{item.eg}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部深色区域 */}
          <div className='bg-help-dark py-5 px-6 relative overflow-hidden'>
            {/* 星星装饰 */}
            <Star size={18} top='8px' right='60px' />
            <Star size={12} top='14px' right='30px' opacity={0.6} />
            <Star size={22} top='28px' right='80px' opacity={0.4} />
            <Star size={10} top='6px' right='120px' opacity={0.5} />

            {/* 前缀提示 */}
            <div className='bg-white/[0.08] rounded-[10px] py-3 px-4 flex items-center gap-3'>
              <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl font-black text-help-dark shrink-0'>#</div>
              <div>
                <div className='text-sm text-white/80 font-bold'>指令前缀</div>
                <div className='text-xs text-white/45 mt-0.5'># / ＃ / 用于显式命令，+ 用于洛克快捷入口</div>
              </div>
            </div>

            {/* 页脚 */}
            <div className='flex justify-between items-center mt-4'>
              <span className='text-base font-black text-white/60 tracking-widest'>洛克王国</span>
              <span className='text-xs text-white/25'>Powered by alemonjs</span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
}
