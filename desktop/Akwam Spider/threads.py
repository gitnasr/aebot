import threading


class AKThreads():
    def fetch_info_thread(self, link):
        threading.Thread(target=self.fetch_info, args=(link,)).start()

    def phase_I_logic_thread(self, episode, i):
        t = threading.Thread(target=self.phase_I_logic, args=(episode, i,), daemon=True)
        return t

    def phase_II_logic_thread(self, link, i):
        t = threading.Thread(target=self.phase_II_logic, args=(link, i,)).start()

    def phase_III_logic_thread(self, link, i):
        t = threading.Thread(target=self.phase_III_logic, args=(link, i,)).start()

    def fetch_info_old_thread(self, i):
        threading.Thread(target=self.fetch_old_info, args=(i,)).start()
