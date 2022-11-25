import os
import sys

import requests
from PyQt5.QtWidgets import QTableWidgetItem
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException


def get_correct_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


class old_akwam:
    def __init__(self):
        self.chrome_path = get_correct_path("chromedriver.exe")

        self.predownload_links_old = []
        self.direct_links = []

    def fetch_old_info(self, link):
        self.statusBar().showMessage("Fetching Info...")
        episodes_link = requests.get(link)
        soup = BeautifulSoup(episodes_link.content, 'html.parser')
        links = soup.findAll("a", {"class": "download_btn watch-btn"})
        self.episode_count = len(links)
        names = soup.findAll("h2", {"class": "sub_epsiode_title"})
        s = soup.find("div", {"class": "sub_title"})
        self.series_name = s.find("h2").text.strip()
        self.label.setText(self.series_name)

        for link in links:
            self.predownload_links_old.append(link['href'])
        self.tableWidget.setRowCount(len(links))
        for i, name in enumerate(names):
            self.tableWidget.setItem(
                i, 0, QTableWidgetItem(str(name.text.strip())))
            self.tableWidget.setItem(i, 1, QTableWidgetItem(str("0.00 MB")))
            self.tableWidget.setItem(i, 2, QTableWidgetItem(str("Waiting...")))
        self.statusBar().showMessage("Fetch Info Done. Let's Start the Action...")
        self.phase_I_old()

    def phase_I_old(self):
        opt = webdriver.ChromeOptions()
        opt.add_argument('headless')
        self.driver = webdriver.Chrome(options=opt)
        print(self.predownload_links_old)
        for i, link in enumerate(self.predownload_links_old):
            self.driver.get(link)
            self.statusBar().showMessage("Episode {}...".format(i + 1))
            self.phase_II_old(i)
        self.driver.quit()
        self.save_and_clean(self.episode_count)

    def phase_II_old(self, i):
        while True:
            try:
                direct_link = self.driver.find_element_by_xpath(
                    '//*[@id="timerHolder"]/a').get_attribute('href')
                self.direct_links.append(direct_link)
                self.tableWidget.setItem(i, 2, QTableWidgetItem(str("Done")))
                break
            except:
                continue

    def phase_III_old(self, i):
        while True:
            try:
                pre_direct_link = self.driver.find_element_by_xpath(
                    '//*[@id="anon_history"]/li/div[2]/div/div/a').get_attribute('href')
                self.driver.get(pre_direct_link)
                self.phase_II_old(i)
                break
            except NoSuchElementException:
                continue
