import logging
import logging.handlers
import translate
import json
import urllib.parse 

from wsgiref.simple_server import make_server


# Create logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Handler 
LOG_FILE = '/opt/python/log/sample-app.log'
handler = logging.handlers.RotatingFileHandler(LOG_FILE, maxBytes=1048576, backupCount=5)
handler.setLevel(logging.INFO)

# Formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Add Formatter to Handler
handler.setFormatter(formatter)

# add Handler to Logger
logger.addHandler(handler)

welcome = """
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Data Language Acquisition</title>
  <style>
  body {
    color: #ffffff;
    background-color: #E0E0E0;
    font-family: Arial, sans-serif;
    font-size:14px;
    -moz-transition-property: text-shadow;
    -moz-transition-duration: 4s;
    -webkit-transition-property: text-shadow;
    -webkit-transition-duration: 4s;
    text-shadow: none;
  }
  body.blurry {
    -moz-transition-property: text-shadow;
    -moz-transition-duration: 4s;
    -webkit-transition-property: text-shadow;
    -webkit-transition-duration: 4s;
    text-shadow: #fff 0px 0px 25px;
  }
  a {
    color: #0188cc;
  }
  .textColumn, .linksColumn {
    padding: 2em;
  }
  .textColumn {
    position: absolute;
    top: 0px;
    right: 50%;
    bottom: 0px;
    left: 0px;

    text-align: right;
    padding-top: 11em;
    background-color: #1BA86D;
    background-image: -moz-radial-gradient(left top, circle, #6AF9BD 0%, #00B386 60%);
    background-image: -webkit-gradient(radial, 0 0, 1, 0 0, 500, from(#6AF9BD), to(#00B386));
  }
  .textColumn p {
    width: 75%;
    float:right;
  }
  .linksColumn {
    position: absolute;
    top:0px;
    right: 0px;
    bottom: 0px;
    left: 50%;

    background-color: #E0E0E0;
  }

  h1 {
    font-size: 500%;
    font-weight: normal;
    margin-bottom: 0em;
  }
  h2 {
    font-size: 200%;
    font-weight: normal;
    margin-bottom: 0em;
  }
  ul {
    padding-left: 1em;
    margin: 0px;
  }
  li {
    margin: 1em 0em;
  }
  </style>
</head>
<body id="sample">
  <div class="textColumn">
    <h1>Congratulations</h1>
    <p>Translate Online is deployed in AWS Cloud</p>
  </div>
  
  <div class="linksColumn"> 
    <h1>Translation</h1>
    <p>***Translated-Text***</p>
  </div>
</body>
</html>
"""

def application(environ, start_response):
    path    = environ['PATH_INFO']
    method  = environ['REQUEST_METHOD']
    query   = environ['QUERY_STRING']
    if method == 'POST':
        try:
            if path == '/':
                request_body_size = int(environ['CONTENT_LENGTH'])
                request_body = urllib.parse.unquote(environ['wsgi.input'].read(request_body_size).decode())
                logger.info("Received Message: %s" % request_body)
                req_params = urllib.parse.parse_qsl(request_body)
                ToTarget = req_params["target"]
                ToTranslate = req_params["q"].split(",")
                logger.info("To Translate: %s" % str(ToTranslate))
                logger.info("Target Language: %s" % ToTarget)
                translate.ToTranslate = ToTranslate
                translate.translate_function()
                wordDict=translate.translate_function()
                logger.info("Translated Text: %s" % str(wordDict))
                response = json.dumps(wordDict)
            elif path == '/scheduled':
                logger.info("Received task %s scheduled at %s", environ['HTTP_X_AWS_SQSD_TASKNAME'], environ['HTTP_X_AWS_SQSD_SCHEDULED_AT'])
        except (TypeError, ValueError):
            logger.warning('Error retrieving request body for async work.')
        response = ''
    else:
        ToTranslate = ["this","is","sample"]
        translate.ToTranslate = ToTranslate
        translate.translate_function()
        wordDict=translate.translate_function()
        response = welcome.replace("***Translated-Text***",str(wordDict))
        logger.info("Translated Text: %s" % str(wordDict))
        
    status = '200 OK'
    headers = [('Content-type', 'text/html')]
    start_response(status, headers)
    return [response]

if __name__ == '__main__':
    httpd = make_server('', 8000, translate_app)
    print("Serving on port 8000...")
    httpd.serve_forever()
