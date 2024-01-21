<img width="100" src="https://github.com/gitnasr/aebot/assets/42423651/3fce92e9-4d3f-4c75-980c-1980f4c43cc1"/>

# AEBot - Online Scraping Tool

AEBot is an Online Scraping Tool created with Node.js, designed to streamline the process of obtaining direct links to episodes and series on Arabic streaming platforms such as Akoam and Arabseed. These platforms offer streaming and downloading services for various series and movies.

## Overview

- **Problem Statement:**
  Imagine wanting to download a series like Prison Break with 90 episodes spanning 5 seasons. With conventional methods, obtaining download links can be time-consuming, taking around 5 seconds per episode. AEBot aims to address this challenge by significantly reducing the time needed to under 10 seconds.

## Technical Details

- **Technology Stack:**
  - Developed with Node.js and MongoDB for efficient data storage.
  - Utilizes Tailwind CSS for styling.
  - Built on Next.js for a seamless web application experience.

- **Legacy Version:**
  - The initial version of AEBot was developed in Python. The source code for the Python version is included for reference.

## Challenges Faced

- **Handling Asynchronous Scraping:**
  - Node.js being single-threaded posed a challenge in waiting for responses from the algorithm. To overcome this, the job scheduling library Agenda JS was employed. Users receive a unique ID to track and follow up on the job status.

## Note

Please note that AEBot is currently not maintained due to the unavailability of the targeted websites (Akoam and Arabseed). The tool will be updated as soon as these websites come back online.


## Disclaimer

AEBot is a tool created for the purpose of scraping information from Akoam and Arabseed websites. The developer does not own or endorse any of the movies or series offered by these websites. AEBot is intended solely as a tool to facilitate the extraction of links from these specific platforms.

