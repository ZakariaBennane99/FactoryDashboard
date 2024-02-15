import { usePDF } from 'react-to-pdf';

const Component = ({ content }) => {
   const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
   return (
      <div>
         <button onClick={() => toPDF()}>Download PDF</button>
         <div ref={targetRef}>
            {
                content
            }
         </div>
      </div>
   )
}