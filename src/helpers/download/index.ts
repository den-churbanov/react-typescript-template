import { http } from '@/api/http';
import { AxiosRequestConfig } from 'axios';

interface DownloadFileOptions<D> {
  url: string,
  method: 'GET' | 'POST',
  data?: D,
  defaultFileName: string,
  config?: AxiosRequestConfig
}


export const downloadFile = async <D>({
                                        url,
                                        method = 'POST',
                                        data,
                                        defaultFileName,
                                        config = {}
                                      }: DownloadFileOptions<D>) => {

  const DISPOSITION_REG = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)$/gi;

  let response;

  if (method === 'POST') {
    response = await http.post<D, string>(url, data, { responseType: 'blob', ...config });
  } else {
    response = await http.get<void, string>(url, { responseType: 'blob', ...config });
  }

  const headers = response.headers;

  const [match] = headers['content-disposition'].match(DISPOSITION_REG);

  const fileName = match ? match.replaceAll(/['"]{2}/g, '|').split('|')[1] : defaultFileName;
  const blob = new Blob([response.data], {
    type: headers['content-type']
  });

  const href = window.URL.createObjectURL(blob);
  let link = document.createElement('a');
  link.href = href;
  link.download = decodeURIComponent(fileName);

  link.click();
  window.URL.revokeObjectURL(href);
}
