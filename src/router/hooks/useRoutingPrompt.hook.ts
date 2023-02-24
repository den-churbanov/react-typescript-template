import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, Location } from 'react-router';
import { useBlocker } from './useBlocker';

export type RoutesMatchingFunction = (next: Location, current: Location) => boolean;

const defaultMatchingFunction: RoutesMatchingFunction = (next, current) => next.pathname !== current.pathname;

export const useRoutingPrompt = (
  when: boolean,
  routeMatchingFunction: RoutesMatchingFunction = defaultMatchingFunction,
  cancelPromptOnRoutes: RoutesMatchingFunction = () => false
) => {

  const navigate = useNavigate();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastLocation, setLastLocation] = useState<any>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
  }, []);

  const blockNavigationHandler = useCallback(nextLocation => {
    if (
      !confirmedNavigation &&
      routeMatchingFunction(nextLocation.location, location)
    ) {
      if (cancelPromptOnRoutes(nextLocation.location, location)) {
        setLastLocation(nextLocation);
        setConfirmedNavigation(true);
        return false;
      }
      setShowPrompt(true);
      setLastLocation(nextLocation);
      return false;
    }
    return true;
  }, [confirmedNavigation]);

  const confirmNavigation = useCallback(() => {
    setShowPrompt(false);
    setConfirmedNavigation(true);
  }, []);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.location, { state: lastLocation.location.state });
    }
  }, [confirmedNavigation, lastLocation]);

  useBlocker(blockNavigationHandler, when);

  return { showPrompt, confirmNavigation, cancelNavigation };
}
