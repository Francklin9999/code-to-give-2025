// Translation service with caching and batch processing
const translationCache = new Map();
const pendingTranslations = new Map();
let currentLanguage = 'en'; // Default to English

// Batch translation requests for better performance
class TranslationBatcher {
  constructor(delay = 50) {
    this.delay = delay;
    this.pending = new Map();
    this.timer = null;
  }

  async translate(text, targetLang) {
    const cacheKey = `${targetLang}:${text}`;
    
    // Return from cache if available
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    // Return existing promise if translation is pending
    if (pendingTranslations.has(cacheKey)) {
      return pendingTranslations.get(cacheKey);
    }

    // Create new translation promise
    const promise = new Promise((resolve, reject) => {
      this.pending.set(cacheKey, { text, targetLang, resolve, reject });
      this.scheduleBatch();
    });

    pendingTranslations.set(cacheKey, promise);
    
    try {
      const result = await promise;
      translationCache.set(cacheKey, result);
      return result;
    } finally {
      pendingTranslations.delete(cacheKey);
    }
  }

  scheduleBatch() {
    if (this.timer) return;
    
    this.timer = setTimeout(() => {
      this.processBatch();
      this.timer = null;
    }, this.delay);
  }

  async processBatch() {
    if (this.pending.size === 0) return;

    // Group by target language
    const groups = new Map();
    for (const [key, item] of this.pending) {
      const lang = item.targetLang;
      if (!groups.has(lang)) {
        groups.set(lang, []);
      }
      groups.get(lang).push(item);
    }

    // Process each language group
    for (const [targetLang, items] of groups) {
      try {
        // Batch translate up to 50 texts at once
        const chunks = [];
        for (let i = 0; i < items.length; i += 50) {
          chunks.push(items.slice(i, i + 50));
        }

        for (const chunk of chunks) {
          const texts = chunk.map(item => item.text);
          const results = await batchTranslateTexts(texts, targetLang);
          
          // Resolve promises with results
          chunk.forEach((item, index) => {
            const result = results[index] || item.text;
            item.resolve(result);
          });
        }
      } catch (error) {
        // Reject all promises for this language
        items.forEach(item => {
          item.reject(error);
        });
      }
    }

    this.pending.clear();
  }
}

const translationBatcher = new TranslationBatcher();

// Batch translate multiple texts
async function batchTranslateTexts(texts, targetLang) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/api/translate/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, target_lang: targetLang }),
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.translated_texts || texts;
  } catch (error) {
    console.error('Batch translation failed:', error);
    // Return original texts on failure
    return texts;
  }
}

// Single text translation (uses batcher internally)
export async function translateText(text, targetLang) {
  if (!text || targetLang === 'en') return text;
  return translationBatcher.translate(text, targetLang);
}

// Get all translatable text nodes from DOM
export function getTextNodes(root = document.body) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.parentElement) return NodeFilter.FILTER_REJECT;

        // Skip if parent has notranslate class or translate="no"
        let parent = node.parentElement;
        while (parent) {
          if (parent.classList?.contains('notranslate') || 
              parent.getAttribute('translate') === 'no') {
            return NodeFilter.FILTER_REJECT;
          }
          parent = parent.parentElement;
        }

        const tagName = node.parentElement.tagName;
        if (
          tagName === "SCRIPT" ||
          tagName === "STYLE" ||
          tagName === "NOSCRIPT" ||
          tagName === "CODE" ||
          tagName === "PRE"
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        const text = node.nodeValue || "";
        const trimmed = text.trim();

        // Skip empty, numbers only, or very short text
        if (!trimmed || trimmed.length < 2 || /^\d+$/.test(trimmed) || /^[^\w]+$/.test(trimmed)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  return textNodes;
}

// Get all translatable attributes
export function getTranslatableAttributes(root = document.body) {
  const attributes = [];
  
  // Collect various translatable attributes
  const selectors = [
    '[placeholder]',
    '[title]',
    '[alt]',
    'input[type="button"][value]',
    'input[type="submit"][value]',
    '[aria-label]'
  ];

  selectors.forEach(selector => {
    root.querySelectorAll(selector).forEach(element => {
      // Skip elements with notranslate
      if (element.closest('.notranslate') || element.closest('[translate="no"]')) {
        return;
      }

      if (selector.includes('placeholder') && element.placeholder) {
        attributes.push({ element, attribute: 'placeholder', text: element.placeholder });
      } else if (selector.includes('title') && element.title) {
        attributes.push({ element, attribute: 'title', text: element.title });
      } else if (selector.includes('alt') && element.alt) {
        attributes.push({ element, attribute: 'alt', text: element.alt });
      } else if (selector.includes('value') && element.value) {
        attributes.push({ element, attribute: 'value', text: element.value });
      } else if (selector.includes('aria-label') && element.getAttribute('aria-label')) {
        attributes.push({ element, attribute: 'aria-label', text: element.getAttribute('aria-label') });
      }
    });
  });

  return attributes;
}

// Translate entire page
export async function translatePage(targetLang, progressCallback) {
  if (targetLang === 'en' || currentLanguage === targetLang) return;
  
  currentLanguage = targetLang;
  
  try {
    // Collect all texts to translate
    const textNodes = getTextNodes();
    const attributes = getTranslatableAttributes();
    
    const allTexts = new Set();
    const nodeTextMap = new Map();
    
    // Collect text from nodes
    textNodes.forEach(node => {
      const text = node.nodeValue?.trim();
      if (text) {
        allTexts.add(text);
        if (!nodeTextMap.has(text)) {
          nodeTextMap.set(text, []);
        }
        nodeTextMap.get(text).push(node);
      }
    });
    
    // Collect text from attributes
    attributes.forEach(attr => {
      if (attr.text) {
        allTexts.add(attr.text);
      }
    });
    
    const textsArray = Array.from(allTexts);
    if (textsArray.length === 0) return;
    
    if (progressCallback) progressCallback(0);
    
    // Translate all texts in parallel batches
    const translations = new Map();
    const promises = textsArray.map(async (text, index) => {
      try {
        const translated = await translateText(text, targetLang);
        translations.set(text, translated);
        
        if (progressCallback && index % 10 === 0) {
          progressCallback(Math.round((index / textsArray.length) * 100));
        }
      } catch (err) {
        console.error(`Translation failed for: "${text}"`, err);
        translations.set(text, text);
      }
    });
    
    await Promise.all(promises);
    
    // Apply translations to DOM
    for (const [originalText, nodes] of nodeTextMap.entries()) {
      const translatedText = translations.get(originalText);
      if (translatedText && translatedText !== originalText) {
        nodes.forEach(node => {
          const nodeText = node.nodeValue || "";
          const leading = nodeText.match(/^\s*/)?.[0] ?? "";
          const trailing = nodeText.match(/\s*$/)?.[0] ?? "";
          node.nodeValue = leading + translatedText + trailing;
        });
      }
    }
    
    // Apply translations to attributes
    attributes.forEach(({ element, attribute, text }) => {
      const translatedText = translations.get(text);
      if (translatedText && translatedText !== text) {
        element.setAttribute(attribute, translatedText);
      }
    });
    
    if (progressCallback) progressCallback(100);
    
  } catch (error) {
    console.error('Page translation failed:', error);
    throw error;
  }
}

// Clear cache (useful when changing languages)
export function clearTranslationCache() {
  translationCache.clear();
  pendingTranslations.clear();
}

// Get current language
export function getCurrentLanguage() {
  return currentLanguage;
}

// Set current language
export function setCurrentLanguage(lang) {
  currentLanguage = lang;
}
