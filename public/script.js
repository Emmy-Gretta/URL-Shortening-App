const host = "http://localhost:3002";

document.querySelector('#create-short-url').addEventListener("click", () => {
   let longUrl = document.querySelector('#longUrl').value.trim();
   if(longUrl.length == 0){
      alert('Enter valid URL');
      return;
   }else if(!(longUrl.startsWith("http://") || longUrl.startsWith("https://"))){
      alert('Enter valid link');
      return;
   }
   fetch(host + "/api/create-short-url", {
      method: "POST",
      body: JSON.stringify({
         longUrl: longUrl
      }),
      headers: {
         "content-type": "application/json; charset=UTF-8"
      }
   }).then((response) => {
      return response.json();
   }).then((data) => {
      if(data.status == "Ok"){
         document.querySelector("#shortUrl").innerText = host + data.shortUrlId;
         document.querySelector("#shortUrl").href = host + data.shortUrlId;
         let html =  `
         <tr>
            <td>${longUrl}</td>
            <td>${host}${data.shortUrlId}</td>
            <td>${0}</td>
         </tr>
         `;
         console.log(data.shortUrlId);
         document.querySelector("#listUrls tbody").innerText += html
      }
   }).catch((err) => {
      // alert(err.message);
      console.log(err.message);
   })
});
(() => {
   fetch(host + "api/get-all-short-urls").then((res) => {
      return res.json();
   }).then((data) => {
      let html = '';
      for(let i=0;i<data.length;i++){
         html += `
         <tr>
           <td>${data[i].longUrl}</td>
           <td>${host}${data[i].shortUrlId}</td>
           <td>${data[i].count}</td>
        </tr>
         `;
         document.querySelector("#listUrls tbody").innerHTML = html;
      }
   }).catch((err) => {
      console.log(err.message);
   })
})