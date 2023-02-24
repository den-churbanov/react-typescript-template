import React, { useCallback } from 'react';
// import { Modal } from '@/components/Modal';
import { RoutesMatchingFunction, useRoutingPrompt } from '@/router';

type IRouterProps = {
  when: boolean,
  header?: string,
  text?: string,
  onConfirmText?: string,
  isLoading?: boolean,
  onConfirmNavigation?: () => Promise<any>,
  routeMatchingFunction?: RoutesMatchingFunction,
  cancelPromptOnRoutes?: RoutesMatchingFunction
}
export const RouterPrompt = (props: IRouterProps) => {
  const {
    when,
    header,
    text,
    isLoading,
    onConfirmText,
    onConfirmNavigation,
    routeMatchingFunction,
    cancelPromptOnRoutes
  } = props;

  const {
    showPrompt,
    confirmNavigation,
    cancelNavigation
  } = useRoutingPrompt(when, routeMatchingFunction, cancelPromptOnRoutes);

  const confirmHandler = useCallback(async () => {
    await onConfirmNavigation?.();
    confirmNavigation();
  }, [])

  // return (
  //   <Modal show={showPrompt}
  //          header={header || 'Подтвердите переход'}
  //          hideHandler={cancelNavigation}
  //          isLoading={isLoading}
  //          buttons={
  //            {
  //              submit: {
  //                text: onConfirmText || 'Покинуть страницу',
  //                handler: confirmHandler
  //              },
  //              cancel: {
  //                text: 'Отмена',
  //                handler: cancelNavigation
  //              }
  //            }
  //          }>
  //     {
  //       text || 'Вы действительно хотите покинуть страницу? Несохранённые изменения будут утеряны'
  //     }
  //   </Modal>
  // );
  return <></>;
}
