import os
import json
from moviepy.editor import VideoFileClip
from moviepy.tools import subprocess_call
from moviepy.config import get_setting
from PIL import Image, ImageFont, ImageDraw
import textwrap
 
def videoCorteDef(filename, t1, t2, targetname=None):
    try:
        name, ext = os.path.splitext(filename)
        targetname = f'videos/{targetname}.mp4'
        if not targetname:
            T1, T2 = [int(1000*t) for t in [t1, t2]]
            targetname = "%sSUB%d_%d.%s" % (name, T1, T2, ext)

        cmd = [get_setting("FFMPEG_BINARY"),"-y",
               "-ss", "%0.2f"%t1,
               "-i", filename,
               "-t", "%0.2f"%(t2-t1),
               "-vcodec", "copy", "-acodec", "copy", targetname]

        subprocess_call(cmd)
        print(' ... corte realizado ... ')
        return(True)
    except:
        return(False)

def captureVideoImageDef(pointT, id):
    try:
        video = VideoFileClip(f'video/{videoID}')
        imagepath = os.path.join(f'data/{id}.jpg')
        video.save_frame(imagepath, pointT)
        return(True)
    except:
        return(False)

def editImage(message, id):
    try:
        lines = textwrap.wrap(message, width=13)
        imagem = Image.open(r'src/pre-image.png')
        font = r"C:\Windows\Fonts\GOTHIC.TTF"
        font = ImageFont.truetype(font, 80)
        rgb = 'white'
        yText = 100
        for line in lines[0:5]:
            desenho = ImageDraw.Draw(imagem)
            desenho.multiline_text(xy=(500,yText), text=str(line), font=font, fill=rgb, stroke_width=2, align='left')
            background = Image.open(f"data/{id}.jpg")
            background.paste(background, (-450, 0))
            background.paste(imagem, (0, 0), imagem)
            yText += 100
            
        print(' ... image editada ... ')
        background.save(f'thumbs/{id}.png')
        return(True)
    except:
        return(False)

logCortesDir = str(os.getcwd())
videoID = False

try:
    videoID = str(os.listdir('./video')[0])
except:
    False

def play():
    if(videoID == False):
      return (False)

    file = open('cortes.json','r', encoding='utf-8')
    databaseJson = json.load(file)
    lenJson = len(databaseJson['data'])
    i = 0
    while(i < lenJson):
        id = databaseJson['data'][i]['id']
        pointA = databaseJson['data'][i]['pointA']
        pointB = databaseJson['data'][i]['pointB']
        pointT = databaseJson['data'][i]['pointT']
        title = databaseJson['data'][i]['title']
        message = databaseJson['data'][i]['message']
        print(id, pointA, pointB, pointT, title, message)
        i += 1

        videoCorte =  videoCorteDef(f'{logCortesDir}/video/{videoID}', pointA, pointB, id)
        if videoCorte == False: 
           return (' ! Error... não foi possível realizar o corte no video ! ')

        captureVideoImage =  captureVideoImageDef(pointT, id)
        if captureVideoImage == False: 
          return (' ! Error... não foi possível capturar um frame para thumbnail ! ')
       
        thumImage = editImage(str(message).upper(), id) 
        if thumImage == False:
          return (' ! Error... não foi possível editar a thumbnail ! ')
    return (' ! finalizado ! ')
    
play()