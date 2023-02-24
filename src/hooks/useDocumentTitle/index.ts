import { useLayoutEffect } from 'react';

export const useDocumentTitle = (pageTitle: string) => {

  useLayoutEffect(() => {
    if (pageTitle) {
      document.title = `ЦП Политех | ${pageTitle}`
    }

    return () => {
      document.title = `ЦП Политех`
    }
  }, [pageTitle]);

}