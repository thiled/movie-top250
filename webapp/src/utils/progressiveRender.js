 const progressiveRender = (targetList, renderList, pageSize) => {
   renderList.push(...(targetList.splice(0, pageSize)))
   if (targetList.length) {
     setTimeout(() => {
       progressiveRender(targetList, renderList, pageSize)
     }, 0)
   }
 }

 export default progressiveRender