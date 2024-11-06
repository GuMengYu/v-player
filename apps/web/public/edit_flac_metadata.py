# encoding: utf-8
import argparse
from mutagen import flac, id3

# 解析命令行参数
parser = argparse.ArgumentParser(description='Edit FLAC metadata')
parser.add_argument('filename', type=str, help='the file to edit')
parser.add_argument('--image', type=str, help='the filename of the cover image')
parser.add_argument('--title', type=str, help='the title of the audio file')
parser.add_argument('--artist', type=str, help='the artist of the audio file')
parser.add_argument('--album', type=str, help='the album of the audio file')

args = parser.parse_args()

# 获取 FLAC 文件对象
audio = flac.FLAC(args.filename)

# 修改封面图
if args.image:
    with open(args.image, 'rb') as f:
        image_data = f.read()
    audio.clear_pictures()
    picture = flac.Picture()
    picture.type = id3.PictureType.COVER_FRONT
    picture.data = image_data
    audio.add_picture(picture)

# 修改标题和作者
if args.title:
    audio['title'] = args.title
if args.artist:
    audio['artist'] = args.artist
if args.album:
    audio['album'] = args.album
# 保存修改后的信息
audio.save()