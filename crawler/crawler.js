// Config
var target_url = "https://sletaem.kz/";
var method = "GET";

// HttpObject initialize
function makeHttpObject() {
   try {return new XMLHttpRequest();}
   catch (error) {}
   try {return new ActiveXObject("Msxml2.XMLHTTP");}
   catch (error) {}
   try {return new ActiveXObject("Microsoft.XMLHTTP");}
   catch (error) {}

   throw new Error("Could not create HTTP request object.");
}

// Main
var domain = /http[s]?:\/\/[a-z0-9.]*\.[a-z]{2,3}/g.exec(target_url)
var request = makeHttpObject();
request.open(method, target_url, true);
request.send();
request.onreadystatechange = function() {
   if (request.readyState == 4) {
      var resp = request.responseText;
      var regex = /<img src="([a-z0-9=./_-]*)".*/g;
      const img_arr = [...resp.matchAll(regex)];

      for (let i = 0; i < img_arr.length; i++) {
         document.getElementById("place-here").innerHTML +=
           '<div class="img card"> \
               <a class="img" target="_blank" href="' + domain + img_arr[i][1] + '"> \
                  <img class="img card-img-top" src="' + domain + img_arr[i][1] + '"> \
               </a>  \
               <div class="img-text card-body row">  \
                  <p class="img-text card-text col">Аноним</p>  \
                  <p class="img-text card-text col" style="text-align: end;">№16423301</p> \
               </div> \
            </div>';
      };
   };
};