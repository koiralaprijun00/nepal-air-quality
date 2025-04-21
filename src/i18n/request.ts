import {getRequestConfig} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';

export default getRequestConfig(async ({locale}) => {
  // Ensure locale is defined and has a valid value
  const validLocale = locale || 'en';
  
  try {
    const messages = (await import(`../messages/${validLocale}.json`)).default;
    return {
      messages,
      locale: validLocale,
      timeZone: 'Asia/Kathmandu'
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${validLocale}`, error);
    // Fallback to English messages if loading fails
    const fallbackMessages = (await import('../messages/en.json')).default;
    return {
      messages: fallbackMessages,
      locale: 'en',
      timeZone: 'Asia/Kathmandu'
    };
  }
}); 