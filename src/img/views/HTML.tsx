import URL_SCSS from '@src/assets/css/input.scss';
import URL_TTT from '@src/assets/font/tttgbnumber.ttf';
import classNames from 'classnames';
import React from 'react';

const HTML = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement> & {}) => {
  const { children, className, style, ...reSet } = props;

  return (
    <html className='p-0 m-0' style={{ margin: 0, padding: 0, width: 'fit-content' }}>
      <head>
        <link type='text/css' rel='stylesheet' href={URL_SCSS} />
        <meta httpEquiv='content-type' content='text/html;charset=utf-8' />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'tttgbnumber';
                src: url('${URL_TTT}'); 
                font-weight: normal; 
                font-style: normal; 
              }
              body { 
                font-family: 'tttgbnumber', 
                system-ui, sans-serif; 
              }
            `
          }}
        />
      </head>
      <body
        className={classNames('p-0 m-0', className)}
        style={{
          margin: 0,
          padding: 0,
          display: 'inline-block',
          width: 'fit-content',
          textAlign: 'left',
          ...style
        }}
        {...reSet}
      >
        {children}
      </body>
    </html>
  );
};

export default HTML;
