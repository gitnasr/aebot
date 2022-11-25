import time

import requests
from termcolor import cprint
from bs4 import BeautifulSoup
from undetected_chromedriver import Chrome
import chromedriver_autoinstaller


class Arabseed:
    def __init__(self):
        self.url = 'https://arabseed.sbs/selary/%d9%85%d8%b3%d9%84%d8%b3%d9%84-%d8%a7%d9%84%d8%b6%d8%a7%d8%ad%d9%83-%d8%a7%d9%84%d8%a8%d8%a7%d9%83%d9%8a/'

    def Run(self):
        if "selary" not in self.url:
            cprint("[-] Error: URL is not valid", "red")
            exit(1)
        episodes = self.GetEpisodes()
        if len(episodes) == 0:
            cprint("[-] Error: No episodes found", "red")
            exit(1)
        links = self.GetPrimeDownloadLinks(episodes)

        if len(links) == 0:
            cprint("[-] Error: No links found", "red")
            exit(1)
        self.SkipAds(links)

    def GetEpisodes(self):
        episodes_links = []
        res = requests.get(self.url)
        soup = BeautifulSoup(res.text, "html.parser")
        episodes = soup.find("div", {"class": "ContainerEpisodesList"})

        for episode in episodes.find_all("a"):
            episodes_links.append(episode.get("href"))

        return episodes_links

    def GetPrimeDownloadLinks(self, episodes):
        links = []
        for episode in episodes:
            res = requests.get(episode)
            soup = BeautifulSoup(res.text, "html.parser")
            links.append(soup.find("a", {"class": "downloadBTn"}).get("href"))

        return links


    def SkipAds(self, prime_links):
        chromedriver_autoinstaller.install(cwd=True)

        driver = Chrome()

        for link in prime_links:
            driver.get(link, )
            time.sleep(10)
            # res = requests.get(link,headers={"Referer":"https://arabseed.sbs/","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.42"})
            # soup = BeautifulSoup(res.text, "html.parser")
            # print(soup.prettify())
            # print(soup.find("a", {"class": "ArabSeedServer"}).get("href"))


if __name__ == "__main__":
    Arabseed().Run()
