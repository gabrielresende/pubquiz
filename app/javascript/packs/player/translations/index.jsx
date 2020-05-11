import React from 'react';
import { IntlProvider } from 'react-intl';

import translationsEn from './en.json';
import translationsPt from './pt.json';

const translations = { en: translationsEn, pt: translationsPt };

const localeFromNavigator = () => {
  const navigatorLanguage = navigator.language.split('-')[0];

  if (Object.keys(translations).includes(navigatorLanguage)) {
    return navigatorLanguage;
  }
  return 'en';
}

const TranslationRoot = (props) => {
  const locale = localeFromNavigator();

  return (
    <IntlProvider
      locale={locale}
      key={locale}
      messages={translations[locale]}
    >
      {React.cloneElement(React.Children.only(props.children), {...props})}
    </IntlProvider>
  );
}

TranslationRoot.defaultProps = {
  componentProps: {},
  initialLocale: null,
};

export default TranslationRoot;
