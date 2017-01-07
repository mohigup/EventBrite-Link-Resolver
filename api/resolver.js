var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');



// The API that returns the in-email representation.
module.exports = function(req, res) {
  var url = req.query.url.trim();

  // Eventbrite urls are in the format:
  // https://www.eventbrite.com/e/cambridge-mlk-day-of-service-2017-tickets-20894421778?aff=ehomecard;
  // or
  // https://www.eventbrite.com/e/cambridge-mlk-day-of-service-2017-tickets-20894421778
  var matches = url.match(/\-([0-9]+)(\?+)/);
  if (!matches) {
    matches = url.match(/\-([0-9]+)$/);
    if(!matches){
      res.status(400).send('Invalid URL format');
      return;
    }
  }

  var id = matches[1];

  var response;
  try {
    response = sync.await(request({
      url: 'https://www.eventbriteapi.com/v3/events/'+ encodeURIComponent(id) +'/',
      qs: { token: key }
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }
  var result = JSON.parse(response.body);
  var image = result.logo.original;
  var width = image.width > 600 ? 600 : image.width;
  var eventName = result.name.text;
  var eventUrl = result.url;
  var eventImageUrl = image.url;
  var eventDesc = result.description.text.split(".")[0] + ".....";
  // Mixmax snippet from HTML respone of pre defined link resolver 
   var html   = `<table id="" class="card-v3" cellpadding="0" cellspacing="0" style="border:1px solid #f5ffff; border-radius:4px; width:100%; max-width:578px; mso-border-alt: none;">
        <tbody><tr style="border:1px solid #d5ecff; mso-border-alt:none; display:block; border-radius: 3px;">
          <td style="display:block; padding:8px; border-radius:2px; border:1px solid #99b0e1; font-size:0; vertical-align:top; background-color:white; mso-border-alt:none; position:relative;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" valign="top" style="border-collapse:separate; text-align:left;">
  <tbody><tr class="">
    <td class="palm-one-whole" rowspan="2" valign="top" style=" width:134px;">
  <table width="100%" class="inner" border="0" cellpadding="0" cellspacing="0" valign="top" style="border-collapse:separate; ">
    <tbody><tr>
      <td valign="top" style="padding: ">
                <a href="` + eventUrl + `" target="_blank" style="display:block;"><img src="` + eventImageUrl + `" class="palm-one-whole" width="120" style="display:block; width:120px; vertical-align:top;" alt="Preview image"></a>
        <script>
        var imgs = [].slice.call(document.querySelectorAll('img'));
        var lastImg = imgs[imgs.length - 1];
        lastImg.src = '` + eventImageUrl + `';
        </script>

      </td>
    </tr>
  </tbody></table>
</td>

<td class="palm-one-whole" rowspan="" valign="top" style="font-size:13px; width:px;">
  <table width="100%" class="inner" border="0" cellpadding="0" cellspacing="0" valign="top" style="border-collapse:separate; font-size:13px;">
    <tbody><tr>
      <td valign="top" style="padding: ">
              <table cellpadding="0" cellspacing="0" valign="top" style="border-collapse:collapse">
        <tbody><tr>
          <td colspan="2" valign="top" style="min-width:100%;  padding-bottom: 2px; font-size:16px; line-height:22px;  font-weight:600;  font-family: 'Avenir Next', 'Segoe UI', 'Calibri', Arial, sans-serif;
      ">
      <a href="` + eventUrl + `" target="_blank" style="text-decoration:none;  display:block;  color:#333;  border:none;">
                `+ eventName +` | EventBrite  
      
      </a>
          </td>
        </tr>
      
          <tr>
            <td colspan="2" valign="top" style="min-width:100%;  padding-bottom: 4px;  font-size:13px; line-height:17px;  font-family:'Segoe UI', 'Helvetica Neue', Helvetica, 'Calibri', Arial, sans-serif;
      ">
      <a href="` + eventUrl + `" target="_blank" style="text-decoration:none;  display:block;  color:#333;  border:none;">
                  ` + eventDesc + `
      
      </a>
            </td>
          </tr>
      </tbody></table>

      </td>
    </tr>
  </tbody></table>
</td>

    </tr><tr>
      <td valign="bottom">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" valign="top" style="border-collapse:separate; ">
          <tbody><tr>
            <td valign="bottom" style="line-height:11px; font-family: 'Avenir Next', 'Segoe UI', 'Calibri', Arial, sans-serif;
" class="hostname">
              <a style="color:#aab; display:block;  font-size:11px;  margin:0;  letter-spacing:1px;  padding-left: 1px; text-decoration:none;  text-transform:uppercase;" href="` + eventUrl + `" target="_blank">eventbrite.com</a>
            </td>
            <td align="right" valign="bottom">
                <a href="https://mixmax.com/r/fLwGxS8e6moW3jm5C" style="display:block;  vertical-align:top;  font-size:0;" target="_blank">
                  <img src="https://emailapps.mixmax.com/img/badge_mixmax.png" align="top" height="20" style="display:block;" alt="Mixmax" border="0">
                </a>
              
              
            </td>
          </tr>
        </tbody></table>
      </td>
    </tr>

  
</tbody></table>

         </td>
        </tr>
      </tbody></table>`;
  res.json({
    body: html
    // Add raw:true if you're returning content that you want the user to be able to edit
  });
};