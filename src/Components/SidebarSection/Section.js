import React from 'react';

const Section = ({children, paddingBottom}) => {
   const style = {
      borderTop: '1px solid #E8E8E8',
      padding: paddingBottom ? `8px 0 ${paddingBottom}px 0` : '8px 0',

   }
   return (
      <div style={style}>
         {children}
      </div>
   )
}

export default Section;
