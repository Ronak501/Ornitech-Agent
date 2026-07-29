import requests
from bs4 import BeautifulSoup

def crawl_url(url: str) -> dict:
    """Fetches a URL and extracts its text content and title."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.extract()
            
        title = soup.title.string if soup.title else url
        
        # Get text and clean it
        text = soup.get_text(separator=' ')
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        cleaned_text = '\n'.join(chunk for chunk in chunks if chunk)
        
        return {
            "url": url,
            "title": title.strip(),
            "content": cleaned_text
        }
    except Exception as e:
        print(f"Error crawling {url}: {e}")
        return None
