// Config
const cors_check_url = "https://google.com/";
const error_page     = "pages/cors_error.html";
const method         = "GET";

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

// 4chan.org
function appendImagesFourchan(request) {
   // Parse
   var resp = request.responseText;
   const img_regex = /<a [a-z0-9A-Z=."\/_\-?\s ;:,()\'&\\]*href=\"([a-z0-9A-Z=.\/_\-?;:&\\]*.(?:jpg|png))\"[a-z0-9A-Z=."\/_\-? ;:&]*><img/g;
   var img_arr = [...resp.matchAll(img_regex)];
   // View
   var col_width = 100;
   switch(document.getElementById("columns").selectedIndex) {
      case 0: col_width = 210; break;
      case 2: col_width = 80; break;
   }

   // Format
   for (img of img_arr.slice(1)) {
      var img_url = img[1];
      if (img_url.slice(0, 2) == "//") {
         img_url = "https:" + img_url;
      }
      // Debig
      /* console.log(img_url); */
      // Print
      document.getElementById("cards-here").innerHTML +=
      '<div class="img card" style="width: calc('+col_width+'px + 11vw); height: calc('+(col_width+20)+'px + 11vw);"> \
         <img class="img card-img-top" src="'+img_url+'" style="height: calc('+col_width+'px + 9.5vw);" onclick="window.open(this.src)"> \
         <div class="img-text card-body row">  \
            <p class="img-text card-text col">Аноним</p>  \
            <p class="img-text card-text col" style="text-align: end;">№16423301</p> \
         </div> \
      </div>';
      // Compress
      /* TODO */
   }
}

// Main logic
function main() {
   var request = makeHttpObject();
   request.open(method, cors_check_url, true);
   request.send(null);

   request.onreadystatechange = function() {
      // CORS error handling
      if (request.status != 200) {
         fetch(error_page).then(response => response.text())
            .then(data => { document.getElementById("cors-error").innerHTML += data; });

      } else if (request.readyState == 4) {
         request.abort();
         // Button click handling
         document.getElementById("search").onclick = (event) => {
            // Form clearing
            document.getElementById("cards-here").innerHTML = '';
            // Imageboard url formatting
            var board_selector = document.getElementById("board");
            var board = board_selector.options[board_selector.selectedIndex].text;
            var url_selector = document.getElementById("chan_url");
            var req = makeHttpObject();

            event.preventDefault();
            setTimeout(() => {
               switch (url_selector.selectedIndex) {
                  case 0:
                     req.open(method, "https://boards.4channel.org"+board, true);
                     req.send(null);
                     req.onreadystatechange = function() {
                        if (req.status == 200 && req.readyState == 4)
                           appendImagesFourchan(req);
                     }
                     break;
                  default:
                     break;
               }
            }, 100);
         }
      }
   }
}

main();
