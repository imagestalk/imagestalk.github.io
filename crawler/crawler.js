// Config
const cors_check_url = "https://boards.4channel.org/o/";
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

// Image compressing
// https://img.ly/blog/how-to-compress-an-image-before-uploading-it-in-javascript/
function compressImage(imgToCompress, resizingFactor, quality) {
   const compressedImage = document.getElementById("newimg");
   let compressedImageBlob;

   const canvas = document.createElement("canvas");
   const context = canvas.getContext("2d");

   const originalWidth = imgToCompress.width;
   const originalHeight = imgToCompress.height;

   const canvasWidth = originalWidth * resizingFactor;
   const canvasHeight = originalHeight * resizingFactor;

   canvas.width = canvasWidth;
   canvas.height = canvasHeight;

   context.drawImage(
      imgToCompress,
      0,
      0,
      originalWidth * resizingFactor,
      originalHeight * resizingFactor
   );
   canvas.toBlob(
      (blob) => {
         if (blob) {
            compressedImageBlob = blob;
            compressedImage.src = URL.createObjectURL(compressedImageBlob);
         }
      },
      "image/jpeg",
      quality
   );
}

// 4chan.org
function appendImagesFourchan(request) {
   // Parse
   var resp = request.responseText;
   const img_regex = /<a [a-z0-9A-Z=."\/_\-?\s ;:,()\'&\\]*href=\"([a-z0-9A-Z=.\/_\-?;:&\\]*)\"[a-z0-9A-Z=."\/_\-? ;:&]*><img/g;
   var img_arr = [...resp.matchAll(img_regex)];
   // Format
   for (img of img_arr.slice(1)) {
      var img_url = img[1];
      if (img_url.slice(0, 2) == "//") {
         img_url = "https:" + img_url;
      } else {
         img_url = /http[s]?:\/\/[a-z0-9.]*\.[a-z]{2,3}/g.exec(target_url) + img_url;
      };

      // Print
      document.getElementById("cards-here").innerHTML +=
      '<div class="img card"> \
         <img class="img card-img-top" id="newimg" src="'+img_url+'" crossorigin="anonymous" onclick="window.open(this.src)"> \
         <div class="img-text card-body row">  \
            <p class="img-text card-text col">Аноним</p>  \
            <p class="img-text card-text col" style="text-align: end;">№16423301</p> \
         </div> \
      </div>';

      // Compress
      var last_img = document.getElementById("newimg");
      compressImage(last_img, 0.5, 0.1);
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
