import ctypes
import os
import re
import sys

import requests
from PyQt5.QtWidgets import QMainWindow, QApplication, QTableWidgetItem
from PyQt5.uic import loadUiType
from qtpy import QtGui
import pyperclip
from bs4 import BeautifulSoup

import threads
import old_website

# noinspection PyUnresolvedReferences,PyBroadException


def get_correct_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


ui, _ = loadUiType(get_correct_path('gui.ui'))


class Akwam_Scrapper(QMainWindow, ui, threads.AKThreads, old_website.old_akwam):
    def __init__(self, parent=None):
        super(Akwam_Scrapper, self).__init__(parent)
        QMainWindow.__init__(self)
        threads.AKThreads.__init__(self)
        old_website.old_akwam.__init__(self)
        self.setupUi(self)
        self.InitUI()

        self.short_links = []
        self.predownload_links = []
        self.direct_links = []
        self.series_name = "####"

    def InitUI(self):
        # ctypes.windll.user32.MessageBoxW(0, "Your Licence is Expired. Contact The Owner", 'Error', 0)
        self.setFixedSize(800, 295)
        self.setWindowIcon(QtGui.QIcon(get_correct_path('icon.ico')))
        self.assign_buttons()
        self.tableWidget.setColumnCount(3)
        self.tableWidget.setHorizontalHeaderLabels(
            ['Episode Name', "Episode Size", "Status"])

    def assign_buttons(self):
        self.pushButton.setEnabled(False)
        self.pushButton.clicked.connect(self.handle_button)
        self.lineEdit.mousePressEvent = self.handle_clipboard
        self.statusBar().showMessage("Waiting Pasting Link")

    def handle_clipboard(self, _):
        try:
            current_clip = pyperclip.paste()
            url_check = self.check_url(current_clip)
            if url_check == "new" or url_check == "old":
                self.lineEdit.setText(current_clip)
                self.pushButton.setEnabled(True)
        except Exception as e:
            print("I'm From handle_clipboard {}".format(e))

    def check_url(self, url):
        new_website_term = "akwam.co"
        new_website_form = "/series/"
        old_website_term = "akwam.ws"
        if new_website_term and new_website_form in url:
            return "new"
        elif old_website_term in url:
            return "old"
        return False

    def handle_button(self):
        akwam_link = self.lineEdit.text()

        if akwam_link == "" or "https://" not in akwam_link:
            ctypes.windll.user32.MessageBoxW(
                0, "Ugh! You Seems like entered a bad URL?", 'Error', 0)
        else:
            url_type = self.check_url(akwam_link)
            if url_type == "new":
                self.pushButton.setEnabled(False)
                self.fetch_info_thread(akwam_link)
            else:
                self.pushButton.setEnabled(False)
                self.fetch_info_old_thread(akwam_link)

    def closeEvent(self, event):
        if self.driver:
            self.driver.quit()
        event.accept()

    def fetch_info(self, link):
        try:
            self.statusBar().showMessage("Fetching Info...")

            page = requests.get(link)
            soup = BeautifulSoup(page.content, 'html.parser')
            self.series_name = soup.find(
                class_="entry-title font-size-28 font-weight-bold text-white mb-0").text
            episodes = soup.find_all(href=re.compile(
                "/episode/"), class_="text-white")

            self.label.setText(self.series_name)
            self.tableWidget.setRowCount(len(episodes))
            for i, episode in enumerate(episodes):
                self.tableWidget.setItem(
                    i, 0, QTableWidgetItem(str(episode.text)))
                self.tableWidget.setItem(
                    i, 1, QTableWidgetItem(str("0.00 MB")))
                self.tableWidget.setItem(
                    i, 2, QTableWidgetItem(str("Waiting...")))
            self.statusBar().showMessage("Info Done. Starting Phase I...")
            self.phase_I(episodes)

        except Exception as e:
            ctypes.windll.user32.MessageBoxW(
                0, "Bad Url!".format(e), 'Error', 0)

    def phase_I(self, episodes):
        # Gets Short Links and Episode Size
        self.statusBar().showMessage("Started Phase I...")
        for i, episode in enumerate(episodes):
            self.phase_I_logic_thread(episode, i).start()
        self.phase_II(len(episodes))

    def phase_II(self, episodes_count):
        # Go To Each Short Link. Get Predownload Links
        while len(self.short_links) != episodes_count:
            pass
        else:
            print("Spiders Done")
            for i, link in enumerate(self.short_links):
                self.phase_II_logic_thread(link, i)
        self.phase_III(episodes_count)

    def phase_III(self, episodes_count):
        while len(self.predownload_links) != episodes_count:
            pass
        else:
            self.statusBar().showMessage("Last Phase Started")
            for i, l in enumerate(self.predownload_links):
                self.phase_III_logic_thread(l, i)
        self.save_and_clean(episodes_count)

    def save_and_clean(self, episodes_count):
        while len(self.direct_links) != episodes_count:
            pass
        else:
            try:
                with open(self.series_name + '.txt', 'w') as f:
                    for item in self.direct_links:
                        f.write("%s\n" % item)
                ctypes.windll.user32.MessageBoxW(
                    0, "File Saved with Direct Links! ", 'Done', 0)
                self.short_links = []
                self.predownload_links = []
                self.direct_links = []
                self.series_name = "####"
                self.tableWidget.setRowCount(0)
                self.lineEdit.clear()
                self.pushButton.setEnabled(True)
                self.label.setText(self.series_name)
            except Exception as e:
                ctypes.windll.user32.MessageBoxW(
                    0, "Error!! {} ".format(e), 'Error', 0)
            self.statusBar().showMessage("Waiting New Scrape?")

    def phase_III_logic(self, link, i):
        bypassLink = requests.get(link)
        soup = BeautifulSoup(bypassLink.content, 'html.parser')
        downloadLink = soup.find("a", {"class": "link btn btn-light"})
        self.direct_links.append(downloadLink['href'])
        self.tableWidget.setItem(i, 2, QTableWidgetItem(str("Phase III Done")))
        self.statusBar().showMessage("In Episode {} Phase III".format(i + 1))

    def phase_II_logic(self, link, i):
        bypassLink = requests.get(link)
        soup = BeautifulSoup(bypassLink.content, 'html.parser')
        downloadLink = soup.find("a", {"class": "download-link"})
        self.predownload_links.append(downloadLink['href'])
        self.tableWidget.setItem(i, 2, QTableWidgetItem(str("Phase II Done")))
        self.statusBar().showMessage("In Episode {} Phase II".format(i + 1))

    def phase_I_logic(self, episode, i):
        try:
            bypassLink = requests.get(episode['href'])
            soup = BeautifulSoup(bypassLink.content, 'html.parser')
            link = soup.findAll(
                "a", {"class": "link-btn link-download d-flex align-items-center px-3"})
            size = soup.findAll("span", {"class": "font-size-14 mr-auto"})
            self.statusBar().showMessage("In Episode {} Phase I".format(i + 1))
            self.tableWidget.setItem(i, 1, QTableWidgetItem(str(size[0].text)))
            self.tableWidget.setItem(
                i, 2, QTableWidgetItem(str("Phase I Done")))
            self.short_links.append(link[0]['href'])
        except Exception as e:
            print("I'm From phase_I {}".format(e))


def main():
    if QApplication.instance():
        app = QApplication.instance()
    else:
        app = QApplication(sys.argv)

    window = Akwam_Scrapper()

    window.show()
    app.exec_()


if __name__ == '__main__':
    main()
