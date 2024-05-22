from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd
import time


cService = webdriver.ChromeService(executable_path='/Users/zuriz/AppData/Local/Programs/Python/chromewebdriver/chromedriver.exe')
driver = webdriver.Chrome(service = cService)
# Create a new instance of the Chrome WebDriver
# driver = webdriver.Chrome("C:/Users/zuriz/AppData/Local/Programs/Python/chromewebdriver/chromedriver.exe")
# Define the URL of the website to scrape
url = 'https://wotd.transparent.com/widget/?lang=mandarin'

# Open the website
driver.get(url)

# Wait for the button to be clickable
wait = WebDriverWait(driver, 10)
button = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@class="prev js-date-prev"]')))
columns = ['word', 'word_pinyin', 'word_eng', 'sentence', 'sentence_pinyin', 'sentence_eng', 'sound', 'sentence_sound']

df = pd.DataFrame(columns=columns)


for i in range(365):  # Adjust the range for the number of clicks
    # Click the button to load more content
    button.click()

    # Wait for the new content to load (adjust the waiting time and conditions as needed)
    time.sleep(0.01)  # Wait for the content to load properly

    soup = BeautifulSoup(driver.page_source, 'html.parser')

    # Extract the data you need
    element = soup.find('span', class_='js-wotd-wordsound-plus')
    
    pinyin_word = soup.find('p', class_='js-wotd-word-transliterated')
    span_pinyin_word = pinyin_word.find('span')

    english_word = soup.find('p', class_='js-wotd-translation')
    span_english_word = english_word.find('span')

    sentence = soup.find('span', class_='js-wotd-phrasesound-plus')

    pinyin_sentence = soup.find('p', class_='js-wotd-phrase-transliterated')
    span_pinyin_sentence = pinyin_sentence.find('span')

    english_sentence = soup.find('p', class_='js-wotd-enphrase')
    span_english_sentence = english_sentence.find('span')
    
    sound = soup.find('a', class_='icon-sound')
    sound = sound.get('data-src')
    
    sentence_sound = soup.find('a', class_='icon-sound js-wotd-phrasesound')
    sentence_sound = sentence_sound.get('data-src')
    
    new_row_data = {
        'word': element.text,
        'word_pinyin': span_pinyin_word.text,
        'word_eng': span_english_word.text,
        'sentence': sentence.text,
        'sentence_pinyin': span_pinyin_sentence.text,
        'sentence_eng': span_english_sentence.text,
        'sound': sound,
        'sentence_sound': sentence_sound
    }
    
    df.loc[i] = new_row_data

    print(i)

# Write the DataFrame to a CSV file
df.to_csv('data.csv', index=False)
# Close the Selenium WebDriver
driver.quit()