// Config
const target_url = "htsdfs";
const error_page = "pages/cors_error.html"
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
const domain = /http[s]?:\/\/[a-z0-9.]*\.[a-z]{2,3}/g.exec(target_url)
var request = makeHttpObject();

var request = makeHttpObject();
request.open(method, target_url, true);
request.send(null);
request.onreadystatechange = function() {
   if (request.readyState != 4 || request.status != 200) {
      console.log("nope");
      fetch(error_page).then(response => response.text()).then(data => {
         console.log(data);
      });

   } else {
      var resp = request.responseText;
      var regex = /<img [a-z0-9A-Z=."\/_\-?\s ;:,()\'&\\]*src=\"([a-z0-9A-Z=.\/_\-?;:&\\]*)\"[a-z0-9A-Z=."\/_\-? ;:&]*>/g;
      var img_arr = [...resp.matchAll(regex)];
      // console.log(resp);
      // document.getElementById("cards-here").innerHTML += resp;
      
      console.log(img_arr);

      for (img of img_arr) {
         var img_path = img[1];
         var img_url;

         if (img_path.slice(0, 2) == "//") {
            img_url = "https:" + img_path;
         } else {
            img_url = domain + img_path;
         }

         document.getElementById("cards-here").innerHTML += '<div class="img card"> \
               <a class="img" target="_blank" href="' + img_url + '"> \
                  <img class="img card-img-top" src="' + img_url + '"> \
               </a>  \
               <div class="img-text card-body row">  \
                  <p class="img-text card-text col">Аноним</p>  \
                  <p class="img-text card-text col" style="text-align: end;">№16423301</p> \
               </div> \
            </div>';
      };
   };
};