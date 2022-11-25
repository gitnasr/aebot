import re
import requests

from bs4 import BeautifulSoup

link = input("Season: ")

page = requests.get(link)

soup = BeautifulSoup(page.content,'html.parser')

name = soup.find(class_="entry-title font-size-28 font-weight-bold text-white mb-0").text

episodes = soup.find_all(href=re.compile("/episode/"),class_="text-white")
short =[]
final = []
downloadLinks =[]
for i,episode in enumerate(episodes):
    try:
        bypassLink = requests.get(episode['href'])
        soup = BeautifulSoup(bypassLink.content,'html.parser')
        link = soup.findAll("a", {"class": "link-btn link-download d-flex align-items-center px-3"})
        print("In Episode {} Phase I".format(i))
        short.append(link[0]['href'])
    except Exception as e:
        print(e)
for i,link in enumerate(short):
    bypassLink = requests.get(link)
    soup = BeautifulSoup(bypassLink.content,'html.parser')
    downloadLink = soup.find("a", {"class": "download-link"})
    final.append(downloadLink['href'])
    print("In Episode {} Phase II".format(i))


for l in enumerate():
      bypassLink = requests.get(l)
      soup = BeautifulSoup(bypassLink.content,'html.parser')

      downloadLink = soup.find("a", {"class": "link btn btn-light"})
      downloadLinks.append(downloadLink['href'])
      print("In Episode {} Phase III".format(i))


with open(name+'.txt', 'w') as f:
    for item in downloadLinks:
        f.write("%s\n" % item)