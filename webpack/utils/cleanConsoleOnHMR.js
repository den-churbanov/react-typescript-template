/**
 * @description очищает браузерную консоль при hot reload
 * */
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
    module.hot.addStatusHandler(status => {
      if (status === 'prepare') console.clear();
    });
  }
}
