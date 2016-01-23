from googleapiclient.discovery import build

def translate_function():

  api='AIzaSyDGcpNr1_IzF5aEeS5TIF8Sf7NFpBBtjf8'
  
  wordtrans=[]
  translations=[]
  translation=[]
  data={}
  service = build('translate', 'v2', developerKey=api)
  translation=service.translations().list(source='en', target='es', q=ToTranslate).execute()
  translations=[x['translatedText'] for x in translation['translations']]

  wordDict=dict(zip(ToTranslate,translations))
  return wordDict


